import { Component, h, State, Prop, Listen, Element } from '@stencil/core';

@Component({
  tag: 'sc-textarea',
  styleUrl: 'sc-textarea.css',
  shadow: true
})
export class ScTextarea {
  @Prop() suggestionUrl: string;
  @Prop() textareaClass: string; // Optional class for textarea

  @State() suggestions: { original: string; lower: string }[] = [];
  @State() filteredSuggestions: string[] = [];
  @State() showSuggestions: boolean = false;
  @State() currentInputValue: string = '';
  @State() mentionStartIndex: number = -1;
  @State() highlightIndex: number = 0;
  @State() caretCoords: { top: number; left: number } = { top: 0, left: 0 };

  @Element() el: HTMLElement;

  private textareaEl: HTMLTextAreaElement;
  private mirrorDiv: HTMLDivElement;

  async componentWillLoad() {
    const response = await fetch(this.suggestionUrl);
    const text = await response.text();
    const lines = text
      .split('\n')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    // Pre-store lowercase versions for faster filtering
    this.suggestions = lines.map(s => ({ original: s, lower: s.toLowerCase() }));
  }

  @Listen('keydown', { target: 'window' })
  handleKeyDown(ev: KeyboardEvent) {
    if (!this.showSuggestions) return;
    if (ev.key === 'ArrowDown') {
      ev.preventDefault();
      this.highlightIndex = (this.highlightIndex + 1) % this.filteredSuggestions.length;
    } else if (ev.key === 'ArrowUp') {
      ev.preventDefault();
      this.highlightIndex = (this.highlightIndex - 1 + this.filteredSuggestions.length) % this.filteredSuggestions.length;
    } else if (ev.key === 'Enter') {
      ev.preventDefault();
      this.selectSuggestion(this.filteredSuggestions[this.highlightIndex]);
    } else if (ev.key === 'Escape') {
      this.showSuggestions = false;
    }
  }

  handleInput(e: Event) {
    const target = e.target as HTMLTextAreaElement;
    this.currentInputValue = target.value;

    const caretPos = target.selectionStart;
    const valueUpToCaret = target.value.substring(0, caretPos);
    const lastAt = valueUpToCaret.lastIndexOf('@');

    if (lastAt > -1) {
      const query = valueUpToCaret.substring(lastAt + 1).toLowerCase();
      // Filter suggestions (limit to top 10 for performance)
      const filtered = this.suggestions
        .filter(s => s.lower.startsWith(query))
        .slice(0, 10)
        .map(s => s.original);

      this.filteredSuggestions = filtered;
      this.showSuggestions = filtered.length > 0;
      this.mentionStartIndex = lastAt;
      this.highlightIndex = 0;
    } else {
      this.showSuggestions = false;
    }

    // Update mirror for caret positioning
    this.updateMirror();
  }

  updateMirror() {
    if (!this.mirrorDiv || !this.textareaEl) return;

    const value = this.currentInputValue;
    const caretPos = this.textareaEl.selectionStart;
    const valueUpToCaret = value.substring(0, caretPos);
    const valueAfterCaret = value.substring(caretPos);

    // We insert a caret marker span at the caret position in the mirrored text
    const escapedValueUpToCaret = valueUpToCaret
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/\n/g, '<br/> ');

    // Use a marker to indicate caret position
    const mirrorContent = escapedValueUpToCaret + '<span id="caret-marker">&#8203;</span>' +
      valueAfterCaret
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/\n/g, '<br/> ');

    this.mirrorDiv.innerHTML = mirrorContent;

    // Now measure the caret position
    const marker = this.mirrorDiv.querySelector('#caret-marker') as HTMLElement;
    if (marker) {
      const markerRect = marker.getBoundingClientRect();
      const containerRect = this.el.shadowRoot.host.getBoundingClientRect();
      this.caretCoords = {
        top: markerRect.top - containerRect.top,
        left: markerRect.left - containerRect.left
      };
    }
  }

  selectSuggestion(suggestion: string) {
    const value = this.currentInputValue;
    const beforeMention = value.substring(0, this.mentionStartIndex);
    const caretPos = this.textareaEl.selectionStart;
    const afterCaret = value.substring(caretPos);
    const newValue = beforeMention + '@' + suggestion + ' ' + afterCaret;
    this.currentInputValue = newValue;
    this.showSuggestions = false;

    const newCaretPos = (beforeMention + '@' + suggestion + ' ').length;
    this.textareaEl.value = newValue;
    this.textareaEl.setSelectionRange(newCaretPos, newCaretPos);
    this.textareaEl.focus();
    this.updateMirror();
  }

  componentDidLoad() {
    // Initialize mirror once component is loaded
    this.updateMirror();
  }

  render() {
    const { top, left } = this.caretCoords;
    return (
      <div class="sc-textarea-container">
        <textarea
          ref={el => this.textareaEl = el}
          value={this.currentInputValue}
          onInput={(e) => this.handleInput(e)}
          class={`sc-textarea-input ${this.textareaClass}`}
        ></textarea>

        <div class="sc-textarea-mirror" ref={el => this.mirrorDiv = el}></div>

        { this.showSuggestions && this.filteredSuggestions.length > 0 && (
          <ul 
            class="sc-textarea-suggestions"
            style={{
              position: 'absolute',
              top: `${top + 20}px`, // Slight offset below the cursor
              left: `${left}px`
            }} 
            role="listbox"
          >
            {this.filteredSuggestions.map((item, index) => (
              <li 
                class={{
                  'sc-textarea-suggestion-item': true,
                  'highlighted': index === this.highlightIndex
                }}
                role="option"
                onClick={() => this.selectSuggestion(item)}
                onMouseOver={() => this.highlightIndex = index}
              >
                {item}
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }
}