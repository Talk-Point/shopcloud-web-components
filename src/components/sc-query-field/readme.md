# SC-Query-Field

## Properties

| Property | Attribute | Description                                                                   | Type                          | Default |
| -------- | --------- | ----------------------------------------------------------------------------- | ----------------------------- | ------- |
| `fields` | `fields`  | Fields can be passed as a JSON string or a parsed array of field definitions. | `FieldDefinition[] \| string` | `[]`    |


## Events

| Event         | Description                                                                                                                      | Type                  |
| ------------- | -------------------------------------------------------------------------------------------------------------------------------- | --------------------- |
| `queryChange` | Emitted whenever the query changes. The detail contains the current query string.                                                | `CustomEvent<string>` |
| `querySubmit` | Emitted when the user submits the query (e.g., pressing Enter on a complete filter). The detail contains the final query string. | `CustomEvent<string>` |


```html
<form id="query-form">
    <sc-query-field
    fields='[
        {"name":"lagerbestand","type":"number"},
        {"name":"title","type":"string"},
        {"name":"available","type":"bool"}
    ]'
    ></sc-query-field>
    <input type="submit" value="Submit" />
</form>
<script>
    const form = document.getElementById('query-form');
    const queryField = document.querySelector('query-field');

    // Prevent form submission
    form.addEventListener('submit', event => {
    event.preventDefault(); // Stops the form from submitting
    console.log('Form submission prevented.');
    // Access the query value directly:
    const query = new FormData(form).get('query');
    console.log('Query from hidden input:', query);
    });

    // Listen for queryChange
    queryField.addEventListener('queryChange', event => {
    console.log('Current query:', event.detail);
    });

    // Listen for querySubmit
    queryField.addEventListener('querySubmit', event => {
    console.log('Final submitted query:', event.detail);
    });
</script>
```