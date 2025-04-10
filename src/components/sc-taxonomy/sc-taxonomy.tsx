import { Component, h, State, Prop, Element, Event, EventEmitter } from '@stencil/core';

@Component({
  tag: 'sc-taxonomy',
  styleUrl: 'sc-taxonomy.css',
  shadow: true,
})
export class ScTaxonomy {
  @Prop() url: string;
  @Prop() name: string;
  @Prop() value: string; // Add this line

  @State() inputValue: string = '';
  @State() suggestions: string[] = [];
  @State() allData: string[] = [];
  @State() contextMenuVisible: boolean = false;

  @Element() hostElement: HTMLElement;
  inputRef!: HTMLInputElement;

  @Event() valueChange: EventEmitter<string>;

  handleValueChange(newValue: string) {
    this.valueChange.emit(newValue);
  }

  private debounceTimer: number;

  async componentWillLoad() {
    if (this.url) {
      await this.fetchData();
    }
    if (this.value) {
      this.inputValue = this.value; // Set the initial value
    }
  }

  componentDidLoad() {
    document.addEventListener('click', this.handleOutsideClick);
    document.addEventListener('keydown', this.handleEscapeKey);
  }

  disconnectedCallback() {
    document.removeEventListener('click', this.handleOutsideClick);
    document.removeEventListener('keydown', this.handleEscapeKey);
  }

  private handleOutsideClick = (event: MouseEvent) => {
    const root = this.hostElement.shadowRoot;
    if (root && !root.contains(event.target as Node)) {
      this.contextMenuVisible = false;
    }
  };

  private handleEscapeKey = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      this.contextMenuVisible = false;
    }
  };

  async fetchData() {
    try {
      const response = await fetch(this.url);
      const text = await response.text();
      this.allData = text
        .split('\n')
        .map(line => line.trim())
        .filter(line => line !== '');
    } catch (error) {
      console.error('Error fetching data:', error);
      this.allData = [];
    }
  }

  handleInputFocus() {
    // On focus, don't show suggestions if empty. Wait until user types.
    if (this.inputValue.length > 0) {
      this.updateSuggestions(this.inputValue);
    }
  }

  handleInputChange(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.inputValue = value;

    clearTimeout(this.debounceTimer);
    this.debounceTimer = window.setTimeout(() => {
      this.updateSuggestions(value);
    }, 100);
  }

  handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      // Close the menu on Enter if you wish:
      // this.contextMenuVisible = false;
    }
  }

  handleSuggestionClick(suggestion: string) {
    this.inputValue = suggestion;
    this.handleValueChange(suggestion);
    this.inputRef.value = suggestion;
    this.inputRef.focus();
  }

  updateSuggestions(term: string) {
    if (term.trim().length === 0) {
      // If no input, no suggestions
      this.suggestions = [];
      this.contextMenuVisible = false;
    } else {
      const lowerTerm = term.toLowerCase();
      const filtered = this.allData.filter(line => line.toLowerCase().includes(lowerTerm));
      // Limit the number of suggestions for performance if needed:
      this.suggestions = filtered.slice(0, 100);
      this.contextMenuVisible = this.suggestions.length > 0;
    }
  }

  render() {
    return (
      <div class="taxonomy-container">
        <div class="input-wrapper">
          <input
            type="text"
            ref={el => (this.inputRef = el as HTMLInputElement)}
            class="taxonomy-input"
            name={this.name}
            value={this.inputValue}
            onFocus={() => this.handleInputFocus()}
            onInput={event => this.handleInputChange(event)}
            onKeyDown={event => this.handleKeyDown(event)}
            placeholder="Type to search..."
          />
          <div class={`context-menu ${this.contextMenuVisible ? 'visible' : ''}`}>
            {this.suggestions.map(suggestion => (
              <div class="suggestion" onClick={() => this.handleSuggestionClick(suggestion)}>
                {suggestion}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
}
