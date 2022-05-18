### Available methods

### 1. `getTableColumnWidth()`

Retrieve the column width of the table in the Google Document. For example, when a new table, which has 1 row and 2 columns, is manually inserted to the Document body as the default format, the table width and column width retrieved by `getColumnWidth()` return `null`. By this, in the current stage, the table width and column width cannot be retrieved. This method achieves this.

#### Sample script

```javascript
const documentId = "###"; // Google Document ID
const res = DocsServiceApp.openByDocumentId(documentId).getTableColumnWidth();
console.log(res);
```

#### Result

```json
[
  {
    "tableIndex": 0, // 0 means the 1st table in Google Document.
    "unit": "pt",
    "tableWidth": 451.3, // Table width
    "tebleColumnWidth": [225.65, 225.65] // Column width of each column. Array index is the column index.
  },
  ,
  ,
  ,
]
```

- For example, when the table which has the columns "A" and "B" of 100 pt and 200 pt are checked by above script, the same values of 100 and 200 for the columns "A" and "B" could be confirmed. So from this result, it is found that the column width of DOCX data and Google Document is the same.