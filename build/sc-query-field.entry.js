import { r as registerInstance, a as createEvent, h, d as getElement } from './index-DiXnqvCp.js';

const scQueryFieldCss = () => `.query-field{display:flex;flex-direction:column;gap:0.5rem;font-family:sans-serif}.tags{display:flex;flex-wrap:wrap;gap:0.5rem}.tag{background-color:#1f4acd;color:white;padding:0.25rem 0.5rem;border-radius:1rem;display:inline-flex;align-items:center;gap:0.25rem;font-size:0.875rem}.remove-button{background:none;border:none;color:white;font-size:1rem;cursor:pointer}.input-wrapper{position:relative}.query-input{width:100%;padding:0.5rem;border:1px solid #ccc;border-radius:0.375rem;font-size:1rem;outline:none}.query-input:focus{border-color:#1f4acd}.context-menu{position:absolute;top:100%;left:0;background:#fff;border:1px solid #ccc;border-radius:0.375rem;box-shadow:0 2px 4px rgba(0, 0, 0, 0.1);width:100%;z-index:100;display:none;margin-top:0.25rem}.context-menu.visible{display:block}.suggestion{padding:0.5rem;cursor:pointer;font-size:0.9rem}.suggestion:hover{background-color:#f3f4f6}`;

const ScQueryField = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
        this.queryChange = createEvent(this, "queryChange", 7);
        this.querySubmit = createEvent(this, "querySubmit", 7);
        this.filters = [];
        this.inputValue = '';
        this.suggestions = [];
        this.currentStep = 'field';
        this.contextMenuVisible = false;
        /**
         * Fields can be passed as a JSON string or a parsed array of field definitions.
         */
        this.fields = [];
        this.handleOutsideClick = (event) => {
            if (!this.hostElement.contains(event.target)) {
                this.contextMenuVisible = false;
            }
        };
        this.handleKeyDownEscape = (event) => {
            if (event.key === 'Escape') {
                this.contextMenuVisible = false;
            }
        };
    }
    componentWillLoad() {
        // Parse fields if it's a JSON string
        if (typeof this.fields === 'string') {
            try {
                const parsed = JSON.parse(this.fields);
                if (Array.isArray(parsed)) {
                    this.fields = parsed;
                }
                else {
                    console.warn('Invalid fields prop: expected an array.');
                    this.fields = [];
                }
            }
            catch (error) {
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
    handleInputFocus() {
        this.updateSuggestions();
        this.contextMenuVisible = true;
    }
    handleInputChange(event) {
        this.inputValue = event.target.value;
        this.updateSuggestions();
    }
    handleKeyDown(event) {
        if (event.key === 'Enter' && this.inputValue.trim() !== '') {
            const valid = this.validateInput(this.inputValue.trim());
            if (valid) {
                // Add the filter; if it's a string field, the value will be quoted inside addFilter().
                this.addFilter(this.inputValue.trim());
                this.inputValue = '';
                this.contextMenuVisible = false;
                // Emit querySubmit when a valid filter is added via Enter
                this.querySubmit.emit(this.getQueryValue());
            }
            else {
                alert('Invalid filter. Use format: field:operator:value');
            }
        }
    }
    handleSuggestionClick(suggestion) {
        const parts = this.inputValue.split(':');
        if (this.currentStep === 'field') {
            this.inputValue = `${suggestion}:`;
        }
        else if (this.currentStep === 'operator') {
            this.inputValue = `${parts[0]}:${suggestion}:`;
        }
        else if (this.currentStep === 'value') {
            this.inputValue = `${parts[0]}:${parts[1]}:${suggestion}`;
        }
        this.updateSuggestions();
        this.inputRef.focus();
    }
    addFilter(filter) {
        // If the field is string type, wrap the value in quotes
        const parts = filter.split(':');
        if (parts.length === 3) {
            const [fieldName, operator, value] = parts;
            const fieldArray = this.fields;
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
    removeFilter(index) {
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
    getQueryValue() {
        return this.filters.join(' ');
    }
    updateSuggestions() {
        const parts = this.inputValue.split(':');
        const fieldArray = this.fields;
        if (parts.length === 1) {
            // Step: Selecting Field
            this.currentStep = 'field';
            const prefix = parts[0].toLowerCase();
            this.suggestions = fieldArray.map(f => f.name).filter(name => prefix === '' || name.toLowerCase().startsWith(prefix));
        }
        else if (parts.length === 2) {
            // Step: Selecting Operator
            this.currentStep = 'operator';
            const field = fieldArray.find(f => f.name === parts[0]);
            if (field) {
                this.suggestions = this.getOperatorsForType(field.type);
            }
            else {
                this.suggestions = [];
            }
        }
        else if (parts.length === 3) {
            // Step: Selecting Value
            this.currentStep = 'value';
            const field = fieldArray.find(f => f.name === parts[0]);
            if (field) {
                this.suggestions = this.getValuesForType(field.type);
            }
            else {
                this.suggestions = [];
            }
        }
        else {
            this.suggestions = [];
        }
        this.contextMenuVisible = this.suggestions.length > 0;
    }
    validateInput(input) {
        const parts = input.split(':');
        if (parts.length === 3) {
            const [fieldName, operator, value] = parts;
            const fieldArray = this.fields;
            const field = fieldArray.find(f => f.name === fieldName);
            if (!field)
                return false;
            if (!this.getOperatorsForType(field.type).includes(operator))
                return false;
            return this.validateValueForType(value, field.type);
        }
        return false;
    }
    getOperatorsForType(type) {
        switch (type) {
            case 'string':
                return ['LIKE', '=', '!=', 'null', 'notnull'];
            case 'bool':
                return ['=', 'null', 'notnull'];
            case 'number':
                return ['>', '<', '>=', '<=', '='];
            default:
                return [];
        }
    }
    getValuesForType(type) {
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
    validateValueForType(value, type) {
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
        return (h("div", { key: '744f9a2a56c8032f26b72b36037eea87c7662a5e', class: "query-field" }, h("div", { key: 'e4a9abcc7ed45db06bb51064a6e1a0cbf65b632c', class: "input-wrapper" }, h("input", { key: '1f444207beed1370880b9f60292ac7a3cca28a6a', type: "text", ref: el => (this.inputRef = el), class: `query-input ${this.inputClass}`, value: this.inputValue, onFocus: () => this.handleInputFocus(), onInput: event => this.handleInputChange(event), onKeyDown: event => this.handleKeyDown(event), placeholder: "Add filters (field:operator:value)" }), h("div", { key: 'df25a92c460309f58c6c60016df749b2dd537f48', class: `context-menu ${this.contextMenuVisible ? 'visible' : ''}` }, this.suggestions.map(suggestion => (h("div", { class: "suggestion", onClick: () => this.handleSuggestionClick(suggestion) }, suggestion))))), h("div", { key: '8f442f109894d41bd1f7ee99b45b4feef200c0d6', class: "tags" }, this.filters.map((filter, index) => (h("span", { class: "tag" }, filter, h("button", { type: "button", class: "remove-button", onClick: () => this.removeFilter(index) }, "\u00D7")))))));
    }
    get hostElement() { return getElement(this); }
};
ScQueryField.style = scQueryFieldCss();

export { ScQueryField as sc_query_field };
