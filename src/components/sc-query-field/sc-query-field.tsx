import { Component, h, State, Prop, Event, EventEmitter, Element } from '@stencil/core';

@Component({
  tag: 'sc-query-field',
  styleUrl: 'sc-query-field.css',
  shadow: true,
})
export class ScQueryField {
  @State() filters: string[] = [];
  @State() inputValue: string = '';
  @State() suggestions: string[] = [];
  @State() currentStep: 'field' | 'operator' | 'value' = 'field';
  @State() contextMenuVisible: boolean = false;

  /**
   * Fields can be passed as a JSON string or a parsed array of field definitions.
   */
  @Prop() fields: string | FieldDefinition[] = [];

  /**
   * Emitted whenever the query changes. The detail contains the current query string.
   */
  @Event() queryChange: EventEmitter<string>;

  /**
   * Emitted when the user submits the query (e.g., pressing Enter on a complete filter).
   * The detail contains the final query string.
   */
  @Event() querySubmit: EventEmitter<string>;

  @Element() hostElement: HTMLElement;
  hiddenInput!: HTMLInputElement;
  inputRef!: HTMLInputElement;

  componentWillLoad() {
    // Parse fields if it's a JSON string
    if (typeof this.fields === 'string') {
      try {
        const parsed = JSON.parse(this.fields);
        if (Array.isArray(parsed)) {
          this.fields = parsed;
        } else {
          console.warn('Invalid fields prop: expected an array.');
          this.fields = [];
        }
      } catch (error) {
        console.error('Error parsing fields prop:', error);
        this.fields = [];
      }
    }
  }

  componentDidLoad() {
    // Create a hidden input to integrate with form submissions
    this.hiddenInput = document.createElement('input');
    this.hiddenInput.type = 'hidden';
    this.hiddenInput.name = 'query';
    this.hostElement.appendChild(this.hiddenInput);

    // Close context menu on outside click
    document.addEventListener('click', this.handleOutsideClick);
    // Close context menu on ESC
    document.addEventListener('keydown', this.handleKeyDownEscape);
  }

  disconnectedCallback() {
    document.removeEventListener('click', this.handleOutsideClick);
    document.removeEventListener('keydown', this.handleKeyDownEscape);
  }

  handleOutsideClick = (event: MouseEvent) => {
    if (!this.hostElement.contains(event.target as Node)) {
      this.contextMenuVisible = false;
    }
  };

  handleKeyDownEscape = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      this.contextMenuVisible = false;
    }
  };

  handleInputFocus() {
    this.updateSuggestions();
    this.contextMenuVisible = true;
  }

  handleInputChange(event: Event) {
    this.inputValue = (event.target as HTMLInputElement).value;
    this.updateSuggestions();
  }

  handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter' && this.inputValue.trim() !== '') {
      const valid = this.validateInput(this.inputValue.trim());
      if (valid) {
        // Add the filter; if it's a string field, the value will be quoted inside addFilter().
        this.addFilter(this.inputValue.trim());
        this.inputValue = '';
        this.contextMenuVisible = false;
        // Emit querySubmit when a valid filter is added via Enter
        this.querySubmit.emit(this.getQueryValue());
      } else {
        alert('Invalid filter. Use format: field:operator:value');
      }
    }
  }

  handleSuggestionClick(suggestion: string) {
    const parts = this.inputValue.split(':');
    if (this.currentStep === 'field') {
      this.inputValue = `${suggestion}:`;
    } else if (this.currentStep === 'operator') {
      this.inputValue = `${parts[0]}:${suggestion}:`;
    } else if (this.currentStep === 'value') {
      this.inputValue = `${parts[0]}:${parts[1]}:${suggestion}`;
    }
    this.updateSuggestions();
    this.inputRef.focus();
  }

  addFilter(filter: string) {
    // If the field is string type, wrap the value in quotes
    const parts = filter.split(':');
    if (parts.length === 3) {
      const [fieldName, operator, value] = parts;
      const fieldArray = this.fields as FieldDefinition[];
      const field = fieldArray.find(f => f.name === fieldName);

      if (field && field.type === 'string') {
        // Ensure the value is quoted
        // Remove existing quotes if any, then add single quotes
        const quotedValue = `'${value.replace(/^'|'$/g, '')}'`;
        filter = `${fieldName}:${operator}:${quotedValue}`;
      }
    }

    this.filters = [...this.filters, filter];
    this.emitQueryChange();
  }

  removeFilter(index: number) {
    this.filters = this.filters.filter((_, i) => i !== index);
    this.emitQueryChange();
  }

  emitQueryChange() {
    const query = this.getQueryValue();
    this.queryChange.emit(query);
    if (this.hiddenInput) {
      this.hiddenInput.value = query;
    }
  }

  getQueryValue(): string {
    return this.filters.join(' ');
  }

  updateSuggestions() {
    const parts = this.inputValue.split(':');
    const fieldArray = this.fields as FieldDefinition[];

    if (parts.length === 1) {
      // Step: Selecting Field
      this.currentStep = 'field';
      const prefix = parts[0].toLowerCase();
      this.suggestions = fieldArray.map(f => f.name).filter(name => prefix === '' || name.toLowerCase().startsWith(prefix));
    } else if (parts.length === 2) {
      // Step: Selecting Operator
      this.currentStep = 'operator';
      const field = fieldArray.find(f => f.name === parts[0]);
      if (field) {
        this.suggestions = this.getOperatorsForType(field.type);
      } else {
        this.suggestions = [];
      }
    } else if (parts.length === 3) {
      // Step: Selecting Value
      this.currentStep = 'value';
      const field = fieldArray.find(f => f.name === parts[0]);
      if (field) {
        this.suggestions = this.getValuesForType(field.type);
      } else {
        this.suggestions = [];
      }
    } else {
      this.suggestions = [];
    }

    this.contextMenuVisible = this.suggestions.length > 0;
  }

  validateInput(input: string): boolean {
    const parts = input.split(':');
    if (parts.length === 3) {
      const [fieldName, operator, value] = parts;
      const fieldArray = this.fields as FieldDefinition[];
      const field = fieldArray.find(f => f.name === fieldName);
      if (!field) return false;

      if (!this.getOperatorsForType(field.type).includes(operator)) return false;

      return this.validateValueForType(value, field.type);
    }
    return false;
  }

  getOperatorsForType(type: FieldType): string[] {
    switch (type) {
      case 'string':
        return ['LIKE', '='];
      case 'bool':
        return ['='];
      case 'number':
        return ['>', '<', '>=', '<=', '='];
      default:
        return [];
    }
  }

  getValuesForType(type: FieldType): string[] {
    // Example static suggestions. In a real-world scenario, you might fetch these dynamically.
    switch (type) {
      case 'string':
        return ['test', 'example'];
      case 'bool':
        return ['true', 'false'];
      case 'number':
        return ['0', '100', '200'];
      default:
        return [];
    }
  }

  validateValueForType(value: string, type: FieldType): boolean {
    // The user enters value without quotes initially
    switch (type) {
      case 'string':
        // Just ensure it's a string (non-empty)
        return typeof value === 'string' && value.trim() !== '';
      case 'bool':
        return value === 'true' || value === 'false';
      case 'number':
        return !isNaN(Number(value));
      default:
        return false;
    }
  }

  render() {
    return (
      <div class="query-field">
        <div class="input-wrapper">
          <input
            type="text"
            ref={el => (this.inputRef = el as HTMLInputElement)}
            class="query-input"
            value={this.inputValue}
            onFocus={() => this.handleInputFocus()}
            onInput={event => this.handleInputChange(event)}
            onKeyDown={event => this.handleKeyDown(event)}
            placeholder="Add filters (field:operator:value)"
          />
          <div class={`context-menu ${this.contextMenuVisible ? 'visible' : ''}`}>
            {this.suggestions.map(suggestion => (
              <div class="suggestion" onClick={() => this.handleSuggestionClick(suggestion)}>
                {suggestion}
              </div>
            ))}
          </div>
        </div>
        <div class="tags">
          {this.filters.map((filter, index) => (
            <span class="tag">
              {filter}
              <button type="button" class="remove-button" onClick={() => this.removeFilter(index)}>
                &times;
              </button>
            </span>
          ))}
        </div>
      </div>
    );
  }
}
