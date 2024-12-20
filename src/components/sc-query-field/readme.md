# sc-query-field



<!-- Auto Generated Below -->


## Properties

| Property | Attribute | Description                                                                   | Type                          | Default |
| -------- | --------- | ----------------------------------------------------------------------------- | ----------------------------- | ------- |
| `fields` | `fields`  | Fields can be passed as a JSON string or a parsed array of field definitions. | `FieldDefinition[] \| string` | `[]`    |


## Events

| Event         | Description                                                                                                                      | Type                  |
| ------------- | -------------------------------------------------------------------------------------------------------------------------------- | --------------------- |
| `queryChange` | Emitted whenever the query changes. The detail contains the current query string.                                                | `CustomEvent<string>` |
| `querySubmit` | Emitted when the user submits the query (e.g., pressing Enter on a complete filter). The detail contains the final query string. | `CustomEvent<string>` |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
