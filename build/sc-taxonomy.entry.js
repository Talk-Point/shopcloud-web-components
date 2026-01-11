import { r as registerInstance, a as createEvent, h, d as getElement } from './index-DiXnqvCp.js';

const scTaxonomyCss = () => `.taxonomy-container{position:relative;display:inline-block;width:100%}.input-wrapper{position:relative}.taxonomy-input{width:100%;box-sizing:border-box;padding:8px;border:1px solid #ccc;border-radius:4px}.context-menu{position:absolute;top:100%;left:0;width:100%;box-sizing:border-box;border:1px solid #ccc;background:#fff;z-index:999;max-height:400px;overflow-y:auto;display:none}.context-menu.visible{display:block}.suggestion{padding:8px;cursor:pointer}.suggestion:hover{background:#eee}`;

const ScTaxonomy = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
        this.valueChange = createEvent(this, "valueChange", 7);
        this.inputValue = '';
        this.suggestions = [];
        this.allData = [];
        this.contextMenuVisible = false;
        this.handleOutsideClick = (event) => {
            const root = this.hostElement.shadowRoot;
            if (root && !root.contains(event.target)) {
                this.contextMenuVisible = false;
            }
        };
        this.handleEscapeKey = (event) => {
            if (event.key === 'Escape') {
                this.contextMenuVisible = false;
            }
        };
    }
    handleValueChange(newValue) {
        this.valueChange.emit(newValue);
    }
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
    async fetchData() {
        try {
            const response = await fetch(this.url);
            const text = await response.text();
            this.allData = text
                .split('\n')
                .map(line => line.trim())
                .filter(line => line !== '');
        }
        catch (error) {
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
    handleInputChange(event) {
        const value = event.target.value;
        this.inputValue = value;
        clearTimeout(this.debounceTimer);
        this.debounceTimer = window.setTimeout(() => {
            this.updateSuggestions(value);
        }, 100);
    }
    handleKeyDown(event) {
        if (event.key === 'Enter') {
            // Close the menu on Enter if you wish:
            // this.contextMenuVisible = false;
        }
    }
    handleSuggestionClick(suggestion) {
        this.inputValue = suggestion;
        this.handleValueChange(suggestion);
        this.inputRef.value = suggestion;
        this.inputRef.focus();
    }
    updateSuggestions(term) {
        if (term.trim().length === 0) {
            // If no input, no suggestions
            this.suggestions = [];
            this.contextMenuVisible = false;
        }
        else {
            const lowerTerm = term.toLowerCase();
            const filtered = this.allData.filter(line => line.toLowerCase().includes(lowerTerm));
            // Limit the number of suggestions for performance if needed:
            this.suggestions = filtered.slice(0, 100);
            this.contextMenuVisible = this.suggestions.length > 0;
        }
    }
    render() {
        return (h("div", { key: 'd12a2c41383c8a99fd50826477da03079b66876f', class: "taxonomy-container" }, h("div", { key: '73ecb465a2ef793490d218b519066ef38f7fe21c', class: "input-wrapper" }, h("input", { key: 'a5ff63c6a54b432ce7c12ba09fcf7c43bd35ee98', type: "text", ref: el => (this.inputRef = el), class: "taxonomy-input", name: this.name, value: this.inputValue, onFocus: () => this.handleInputFocus(), onInput: event => this.handleInputChange(event), onKeyDown: event => this.handleKeyDown(event), placeholder: "Type to search..." }), h("div", { key: 'fcf750dfdbdfa37efc55faac9346550cbee2385e', class: `context-menu ${this.contextMenuVisible ? 'visible' : ''}` }, this.suggestions.map(suggestion => (h("div", { class: "suggestion", onClick: () => this.handleSuggestionClick(suggestion) }, suggestion)))))));
    }
    get hostElement() { return getElement(this); }
};
ScTaxonomy.style = scTaxonomyCss();

export { ScTaxonomy as sc_taxonomy };
