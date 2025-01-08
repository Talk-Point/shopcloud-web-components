/* eslint-disable */
/* tslint:disable */
/**
 * This is an autogenerated file created by the Stencil compiler.
 * It contains typing information for all components that exist in this project.
 */
import { HTMLStencilElement, JSXBase } from "@stencil/core/internal";
export namespace Components {
    interface ScQueryField {
        /**
          * Fields can be passed as a JSON string or a parsed array of field definitions.
         */
        "fields": string | FieldDefinition[];
        /**
          * Optional class for the input field.
         */
        "inputClass": string;
    }
    interface ScSpreadsheetUploader {
        "apiHeaders": string;
        "apiMethod": string;
        "apiUrl": string;
        "storageKey": string;
    }
    interface ScTaxonomy {
        "name": string;
        "url": string;
        "value": string;
    }
    interface ScTextarea {
        "suggestionUrl": string;
        "textareaClass": string;
    }
}
export interface ScQueryFieldCustomEvent<T> extends CustomEvent<T> {
    detail: T;
    target: HTMLScQueryFieldElement;
}
export interface ScTaxonomyCustomEvent<T> extends CustomEvent<T> {
    detail: T;
    target: HTMLScTaxonomyElement;
}
declare global {
    interface HTMLScQueryFieldElementEventMap {
        "queryChange": string;
        "querySubmit": string;
    }
    interface HTMLScQueryFieldElement extends Components.ScQueryField, HTMLStencilElement {
        addEventListener<K extends keyof HTMLScQueryFieldElementEventMap>(type: K, listener: (this: HTMLScQueryFieldElement, ev: ScQueryFieldCustomEvent<HTMLScQueryFieldElementEventMap[K]>) => any, options?: boolean | AddEventListenerOptions): void;
        addEventListener<K extends keyof DocumentEventMap>(type: K, listener: (this: Document, ev: DocumentEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void;
        addEventListener<K extends keyof HTMLElementEventMap>(type: K, listener: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void;
        addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void;
        removeEventListener<K extends keyof HTMLScQueryFieldElementEventMap>(type: K, listener: (this: HTMLScQueryFieldElement, ev: ScQueryFieldCustomEvent<HTMLScQueryFieldElementEventMap[K]>) => any, options?: boolean | EventListenerOptions): void;
        removeEventListener<K extends keyof DocumentEventMap>(type: K, listener: (this: Document, ev: DocumentEventMap[K]) => any, options?: boolean | EventListenerOptions): void;
        removeEventListener<K extends keyof HTMLElementEventMap>(type: K, listener: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any, options?: boolean | EventListenerOptions): void;
        removeEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions): void;
    }
    var HTMLScQueryFieldElement: {
        prototype: HTMLScQueryFieldElement;
        new (): HTMLScQueryFieldElement;
    };
    interface HTMLScSpreadsheetUploaderElement extends Components.ScSpreadsheetUploader, HTMLStencilElement {
    }
    var HTMLScSpreadsheetUploaderElement: {
        prototype: HTMLScSpreadsheetUploaderElement;
        new (): HTMLScSpreadsheetUploaderElement;
    };
    interface HTMLScTaxonomyElementEventMap {
        "valueChange": string;
    }
    interface HTMLScTaxonomyElement extends Components.ScTaxonomy, HTMLStencilElement {
        addEventListener<K extends keyof HTMLScTaxonomyElementEventMap>(type: K, listener: (this: HTMLScTaxonomyElement, ev: ScTaxonomyCustomEvent<HTMLScTaxonomyElementEventMap[K]>) => any, options?: boolean | AddEventListenerOptions): void;
        addEventListener<K extends keyof DocumentEventMap>(type: K, listener: (this: Document, ev: DocumentEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void;
        addEventListener<K extends keyof HTMLElementEventMap>(type: K, listener: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void;
        addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void;
        removeEventListener<K extends keyof HTMLScTaxonomyElementEventMap>(type: K, listener: (this: HTMLScTaxonomyElement, ev: ScTaxonomyCustomEvent<HTMLScTaxonomyElementEventMap[K]>) => any, options?: boolean | EventListenerOptions): void;
        removeEventListener<K extends keyof DocumentEventMap>(type: K, listener: (this: Document, ev: DocumentEventMap[K]) => any, options?: boolean | EventListenerOptions): void;
        removeEventListener<K extends keyof HTMLElementEventMap>(type: K, listener: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any, options?: boolean | EventListenerOptions): void;
        removeEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions): void;
    }
    var HTMLScTaxonomyElement: {
        prototype: HTMLScTaxonomyElement;
        new (): HTMLScTaxonomyElement;
    };
    interface HTMLScTextareaElement extends Components.ScTextarea, HTMLStencilElement {
    }
    var HTMLScTextareaElement: {
        prototype: HTMLScTextareaElement;
        new (): HTMLScTextareaElement;
    };
    interface HTMLElementTagNameMap {
        "sc-query-field": HTMLScQueryFieldElement;
        "sc-spreadsheet-uploader": HTMLScSpreadsheetUploaderElement;
        "sc-taxonomy": HTMLScTaxonomyElement;
        "sc-textarea": HTMLScTextareaElement;
    }
}
declare namespace LocalJSX {
    interface ScQueryField {
        /**
          * Fields can be passed as a JSON string or a parsed array of field definitions.
         */
        "fields"?: string | FieldDefinition[];
        /**
          * Optional class for the input field.
         */
        "inputClass"?: string;
        /**
          * Emitted whenever the query changes. The detail contains the current query string.
         */
        "onQueryChange"?: (event: ScQueryFieldCustomEvent<string>) => void;
        /**
          * Emitted when the user submits the query (e.g., pressing Enter on a complete filter). The detail contains the final query string.
         */
        "onQuerySubmit"?: (event: ScQueryFieldCustomEvent<string>) => void;
    }
    interface ScSpreadsheetUploader {
        "apiHeaders"?: string;
        "apiMethod"?: string;
        "apiUrl"?: string;
        "storageKey"?: string;
    }
    interface ScTaxonomy {
        "name"?: string;
        "onValueChange"?: (event: ScTaxonomyCustomEvent<string>) => void;
        "url"?: string;
        "value"?: string;
    }
    interface ScTextarea {
        "suggestionUrl"?: string;
        "textareaClass"?: string;
    }
    interface IntrinsicElements {
        "sc-query-field": ScQueryField;
        "sc-spreadsheet-uploader": ScSpreadsheetUploader;
        "sc-taxonomy": ScTaxonomy;
        "sc-textarea": ScTextarea;
    }
}
export { LocalJSX as JSX };
declare module "@stencil/core" {
    export namespace JSX {
        interface IntrinsicElements {
            "sc-query-field": LocalJSX.ScQueryField & JSXBase.HTMLAttributes<HTMLScQueryFieldElement>;
            "sc-spreadsheet-uploader": LocalJSX.ScSpreadsheetUploader & JSXBase.HTMLAttributes<HTMLScSpreadsheetUploaderElement>;
            "sc-taxonomy": LocalJSX.ScTaxonomy & JSXBase.HTMLAttributes<HTMLScTaxonomyElement>;
            "sc-textarea": LocalJSX.ScTextarea & JSXBase.HTMLAttributes<HTMLScTextareaElement>;
        }
    }
}
