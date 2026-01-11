import { r as registerInstance, h, d as getElement } from './index-DiXnqvCp.js';

const scTextareaCss = () => `:host{display:inline-block;position:relative;width:300px;font-size:14px;font-family:sans-serif}.sc-textarea-container{position:relative;width:100%}.sc-textarea-input{width:100%;height:100px;box-sizing:border-box;padding:5px;border:1px solid #ccc;border-radius:4px;font:inherit}.sc-textarea-mirror{position:absolute;visibility:hidden;white-space:pre-wrap;word-wrap:break-word;overflow-wrap:break-word;top:0;left:0;z-index:-9999;font:inherit;line-height:normal;width:100%;padding:5px;border:1px solid transparent;box-sizing:border-box}.sc-textarea-suggestions{background:#fff;border:1px solid #ccc;border-radius:4px;margin:0;padding:0;list-style:none;max-height:200px;overflow-y:auto;z-index:999}.sc-textarea-suggestion-item{padding:5px 8px;cursor:pointer;font-size:14px;font-family:sans-serif}.sc-textarea-suggestion-item:hover,.sc-textarea-suggestion-item.highlighted{background-color:#eee}`;

const ScTextarea = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
        this.suggestions = [];
        this.filteredSuggestions = [];
        this.showSuggestions = false;
        this.currentInputValue = '';
        this.mentionStartIndex = -1;
        this.highlightIndex = 0;
        this.caretCoords = { top: 0, left: 0 };
    }
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
    handleKeyDown(ev) {
        if (!this.showSuggestions)
            return;
        if (ev.key === 'ArrowDown') {
            ev.preventDefault();
            this.highlightIndex = (this.highlightIndex + 1) % this.filteredSuggestions.length;
        }
        else if (ev.key === 'ArrowUp') {
            ev.preventDefault();
            this.highlightIndex = (this.highlightIndex - 1 + this.filteredSuggestions.length) % this.filteredSuggestions.length;
        }
        else if (ev.key === 'Enter') {
            ev.preventDefault();
            this.selectSuggestion(this.filteredSuggestions[this.highlightIndex]);
        }
        else if (ev.key === 'Escape') {
            this.showSuggestions = false;
        }
    }
    handleInput(e) {
        const target = e.target;
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
        }
        else {
            this.showSuggestions = false;
        }
        // Update mirror for caret positioning
        this.updateMirror();
    }
    updateMirror() {
        if (!this.mirrorDiv || !this.textareaEl)
            return;
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
        const marker = this.mirrorDiv.querySelector('#caret-marker');
        if (marker) {
            const markerRect = marker.getBoundingClientRect();
            const containerRect = this.el.shadowRoot.host.getBoundingClientRect();
            this.caretCoords = {
                top: markerRect.top - containerRect.top,
                left: markerRect.left - containerRect.left
            };
        }
    }
    selectSuggestion(suggestion) {
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
        return (h("div", { key: 'b4619cca189b2e3e2fe91ea351235730c17dc9ee', class: "sc-textarea-container" }, h("textarea", { key: '5884b3422df45bacf9b3af1696a744e16e901114', ref: el => this.textareaEl = el, value: this.currentInputValue, onInput: (e) => this.handleInput(e), class: `sc-textarea-input ${this.textareaClass}` }), h("div", { key: '4cda706eeee1c217a0deed54ff3f64348704bfbb', class: "sc-textarea-mirror", ref: el => this.mirrorDiv = el }), this.showSuggestions && this.filteredSuggestions.length > 0 && (h("ul", { key: '7eb98c878d5256375d20158a1e597ea201ee2bf5', class: "sc-textarea-suggestions", style: {
                position: 'absolute',
                top: `${top + 20}px`, // Slight offset below the cursor
                left: `${left}px`
            }, role: "listbox" }, this.filteredSuggestions.map((item, index) => (h("li", { class: {
                'sc-textarea-suggestion-item': true,
                'highlighted': index === this.highlightIndex
            }, role: "option", onClick: () => this.selectSuggestion(item), onMouseOver: () => this.highlightIndex = index }, item)))))));
    }
    get el() { return getElement(this); }
};
ScTextarea.style = scTextareaCss();

export { ScTextarea as sc_textarea };
