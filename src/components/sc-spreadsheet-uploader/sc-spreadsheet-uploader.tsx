import { Component, Prop, State, h } from '@stencil/core';

export interface ApiConfig {
  url: string;
  method: string;
  headers?: Record<string, string>;
}

export interface DataRow {
  id: string;
  data: any;
  status: 'pending' | 'success' | 'error';
  errorMessage?: string;
  reference?: string; // Added reference field
}

@Component({
  tag: 'sc-spreadsheet-uploader',
  styleUrl: 'sc-spreadsheet-uploader.css',
  shadow: true,
})
export class ScSpreadsheetUploader {
  @Prop() storageKey: string = 'spreadsheet-data';

  // API Properties
  @Prop() apiUrl: string = '';
  @Prop() apiMethod: string = 'POST';
  @Prop() apiHeaders: string = '{}';

  @State() parsedData: DataRow[] = [];
  @State() isProcessing: boolean = false;
  private textArea!: HTMLTextAreaElement;

  private getHeaders(): Record<string, string> {
    try {
      return {
        'Content-Type': 'application/json',
        ...JSON.parse(this.apiHeaders),
      };
    } catch (e) {
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

  private parseInput = () => {
    const input = this.textArea.value;
    const rows = input.trim().split('\n');
    const headers = rows[0].split('\t');

    const newData: DataRow[] = rows.slice(1).map((row, index) => {
      const values = row.split('\t');
      const rowData = {};
      headers.forEach((header, i) => {
        rowData[header.trim()] = values[i]?.trim() || '';
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

  private saveToLocalStorage = () => {
    localStorage.setItem(this.storageKey, JSON.stringify(this.parsedData));
  };

  private async processData() {
    if (!this.apiUrl) {
      throw new Error('API URL ist nicht konfiguriert');
    }

    this.isProcessing = true;

    for (const row of this.parsedData) {
      if (row.status === 'success') continue;

      try {
        const response = await this.sendToAPI(row.data);
        row.status = 'success';
        row.errorMessage = undefined;
        // Store reference if it exists in the response
        if (response && response.reference) {
          row.reference = response.reference;
        }
      } catch (error) {
        row.status = 'error';
        row.errorMessage = error.message;
      }

      this.parsedData = [...this.parsedData];
      this.saveToLocalStorage();
    }

    this.isProcessing = false;
  }

  private async sendToAPI(data: any) {
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
    } catch (error) {
      throw new Error(`API-Fehler: ${error.message}`);
    }
  }

  private clearData = () => {
    this.parsedData = [];
    localStorage.removeItem(this.storageKey);
    this.textArea.value = '';
  };

  render() {
    return (
      <div class="container">
        <div class="input-section">
          <textarea ref={el => (this.textArea = el as HTMLTextAreaElement)} placeholder="Füge hier deine Tabellendaten ein..." rows={10} />
          <div class="button-group">
            <button onClick={this.parseInput} disabled={this.isProcessing}>
              Daten einlesen
            </button>
            <button onClick={this.clearData} disabled={this.isProcessing}>
              Zurücksetzen
            </button>
          </div>
        </div>

        {this.parsedData.length > 0 && (
          <div class="data-section">
            <button onClick={() => this.processData()} disabled={this.isProcessing || !this.apiUrl}>
              {this.isProcessing ? 'Verarbeite...' : 'An API senden'}
            </button>

            <div class="data-grid">
              {this.parsedData.map(row => (
                <div class={`row ${row.status}`} key={row.id}>
                  <div class="status-indicator"></div>
                  <div class="row-data">
                    {Object.entries(row.data).map(([key, value]) => (
                      <span key={key}>
                        {key}: {value}
                      </span>
                    ))}
                    {row.reference && (
                      <span class="reference">
                        Referenz: {row.reference}
                      </span>
                    )}
                  </div>
                  {row.errorMessage && <div class="error-message">{row.errorMessage}</div>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }
}