import { r as registerInstance, h } from './index-DiXnqvCp.js';

const scSpreadsheetUploaderCss = () => `:host{--background-color:#ffffff;--text-color:#333333;--border-color:#cccccc;--input-background:#ffffff;--row-border:#eeeeee;--button-background:#007bff;--button-color:#ffffff;--button-disabled-background:#cccccc;--button-disabled-color:#666666;--error-color:#dc3545;--success-color:#28a745;--pending-color:#ffd700;--reference-background:#f8f9fa;--reference-color:#495057}@media (prefers-color-scheme: dark){:host{--background-color:#1a1a1a;--text-color:#e0e0e0;--border-color:#404040;--input-background:#2d2d2d;--row-border:#333333;--button-background:#0056b3;--button-color:#ffffff;--button-disabled-background:#404040;--button-disabled-color:#808080;--error-color:#ff4d4d;--success-color:#2fb344;--pending-color:#ffd700;--reference-background:#2d2d2d;--reference-color:#b8b8b8}}.container{padding:20px;font-family:system-ui, -apple-system, sans-serif;background-color:var(--background-color);color:var(--text-color)}.input-section{margin-bottom:20px}.button-group{display:flex;gap:10px}textarea{width:100%;margin-bottom:10px;padding:10px;border:1px solid var(--border-color);border-radius:4px;background-color:var(--input-background);color:var(--text-color)}textarea:focus{outline:none;border-color:var(--button-background);box-shadow:0 0 0 2px rgba(0, 123, 255, 0.25)}button{padding:10px 20px;background-color:var(--button-background);color:var(--button-color);border:none;border-radius:4px;cursor:pointer;transition:background-color 0.2s ease}button:hover:not(:disabled){background-color:color-mix(in srgb, var(--button-background) 85%, black)}button:disabled{background-color:var(--button-disabled-background);color:var(--button-disabled-color);cursor:not-allowed}.data-grid{margin-top:20px}.row{display:flex;align-items:center;padding:10px;border:1px solid var(--row-border);margin-bottom:5px;border-radius:4px;transition:background-color 0.2s ease}.row:hover{background-color:color-mix(in srgb, var(--background-color) 95%, var(--text-color))}.status-indicator{width:10px;height:10px;border-radius:50%;margin-right:10px;flex-shrink:0}.row.pending .status-indicator{background-color:var(--pending-color)}.row.success .status-indicator{background-color:var(--success-color)}.row.error .status-indicator{background-color:var(--error-color)}.row-data{flex:1;display:flex;flex-wrap:wrap;gap:10px}.row-data span{padding:2px 6px;border-radius:3px;background-color:color-mix(in srgb, var(--background-color) 97%, var(--text-color))}span.reference{background-color:var(--reference-background);color:var(--reference-color);padding:2px 8px;border-radius:4px;border:1px solid var(--border-color);font-weight:500}.error-message{color:var(--error-color);margin-left:10px;font-size:0.9em;flex-basis:100%;margin-top:5px}`;

const ScSpreadsheetUploader = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
        this.storageKey = 'spreadsheet-data';
        // API Properties
        this.apiUrl = '';
        this.apiMethod = 'POST';
        this.apiHeaders = '{}';
        this.parsedData = [];
        this.isProcessing = false;
        this.parseInput = () => {
            const input = this.textArea.value;
            const rows = input.trim().split('\n');
            const headers = rows[0].split('\t');
            const newData = rows.slice(1).map((row, index) => {
                const values = row.split('\t');
                const rowData = {};
                headers.forEach((header, i) => {
                    var _a;
                    rowData[header.trim()] = ((_a = values[i]) === null || _a === void 0 ? void 0 : _a.trim()) || '';
                });
                return {
                    id: `row-${index}`,
                    data: rowData,
                    status: 'pending',
                };
            });
            this.parsedData = newData;
            this.saveToLocalStorage();
        };
        this.saveToLocalStorage = () => {
            localStorage.setItem(this.storageKey, JSON.stringify(this.parsedData));
        };
        this.clearData = () => {
            this.parsedData = [];
            localStorage.removeItem(this.storageKey);
            this.textArea.value = '';
        };
    }
    getHeaders() {
        try {
            return Object.assign({ 'Content-Type': 'application/json' }, JSON.parse(this.apiHeaders));
        }
        catch (e) {
            console.warn('Invalid apiHeaders format, using default headers');
            return { 'Content-Type': 'application/json' };
        }
    }
    componentWillLoad() {
        const savedData = localStorage.getItem(this.storageKey);
        if (savedData) {
            this.parsedData = JSON.parse(savedData);
        }
    }
    async processData() {
        if (!this.apiUrl) {
            throw new Error('API URL ist nicht konfiguriert');
        }
        this.isProcessing = true;
        for (const row of this.parsedData) {
            if (row.status === 'success')
                continue;
            try {
                const response = await this.sendToAPI(row.data);
                row.status = 'success';
                row.errorMessage = undefined;
                // Store reference if it exists in the response
                if (response && response.reference) {
                    row.reference = response.reference;
                }
            }
            catch (error) {
                row.status = 'error';
                row.errorMessage = error.message;
            }
            this.parsedData = [...this.parsedData];
            this.saveToLocalStorage();
        }
        this.isProcessing = false;
    }
    async sendToAPI(data) {
        try {
            const response = await fetch(this.apiUrl, {
                method: this.apiMethod,
                headers: this.getHeaders(),
                body: JSON.stringify(data),
            });
            if (response.status !== 200 && response.status !== 201) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const responseText = await response.text();
            if (!responseText) {
                return {}; // Return empty object for empty response
            }
            return JSON.parse(responseText);
        }
        catch (error) {
            throw new Error(`API-Fehler: ${error.message}`);
        }
    }
    render() {
        return (h("div", { key: 'ef2ffc23c7174b3fad4ab73262ece9663d0a2536', class: "container" }, h("div", { key: '2c0abbe9dcaf26b9501291e97359d88ca373d68e', class: "input-section" }, h("textarea", { key: 'b7bb8a74d3663a482f6f4271312b3b16471233fc', ref: el => (this.textArea = el), placeholder: "F\u00FCge hier deine Tabellendaten ein...", rows: 10 }), h("div", { key: '754fc0514298256708a359f1f91ae7686e64f7d4', class: "button-group" }, h("button", { key: 'e794825c20386410897476c441059c9f3b638015', onClick: this.parseInput, disabled: this.isProcessing }, "Daten einlesen"), h("button", { key: 'e276f13e795f845e191cbf203eecfa0ebb9a3ef0', onClick: this.clearData, disabled: this.isProcessing }, "Zur\u00FCcksetzen"))), this.parsedData.length > 0 && (h("div", { key: 'de69162c9cf39f8950ff480a9008d33b2620169d', class: "data-section" }, h("button", { key: '662d0e94bd0990d237dce6933903adde03b944c6', onClick: () => this.processData(), disabled: this.isProcessing || !this.apiUrl }, this.isProcessing ? 'Verarbeite...' : 'An API senden'), h("div", { key: '593df1ffc1bf6061458b0524fe7ca222c1ec52b8', class: "data-grid" }, this.parsedData.map(row => (h("div", { class: `row ${row.status}`, key: row.id }, h("div", { class: "status-indicator" }), h("div", { class: "row-data" }, Object.entries(row.data).map(([key, value]) => (h("span", { key: key }, key, ": ", value))), row.reference && (h("span", { class: "reference" }, "Referenz: ", row.reference))), row.errorMessage && h("div", { class: "error-message" }, row.errorMessage)))))))));
    }
};
ScSpreadsheetUploader.style = scSpreadsheetUploaderCss();

export { ScSpreadsheetUploader as sc_spreadsheet_uploader };
