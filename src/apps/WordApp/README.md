
## For Microsoft Word

### 1. `getTableColumnWidth()`

Retrieve the column width of the table in the Microsoft Word. In this case, the column width of the table are directly retrieved from Microsoft Word.

#### Sample script

```javascript
const blob = "BLOB"; // Blob of Microsoft Word file.
const res = DocsServiceApp.openByWordFileBlob(blob).getTableColumnWidth();
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