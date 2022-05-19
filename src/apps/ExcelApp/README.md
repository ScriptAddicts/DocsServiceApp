
## For Microsoft Excel

![](images/fig3.png)

> IMPORTANT: About `getValues()` and `getFormulas()` methods, in the current stage, the process costs of them is much higher than those of Google Spreadsheet service. So when you want to retrieve the values and formulas from XLSX data, I would like to recommend to use Google Spreadsheet service by converting XSLX data to Google Spreadsheet.

### 1. `getImages()`

Retrieve images in and over the cell from Microsoft Excel as blob. In this case, the images are directly retrieved from Microsoft Excel.

#### Sample script

```javascript
const blob = "BLOB"; // Blob of Microsoft Excel file.
const res = DocsServiceApp.openByExcelFileBlob(blob)
  .getSheetByName("Sheet1")
  .getImages();
console.log(res);
```

In this script, the images are retrieved from "Sheet1" of `spreadsheetId`.

And

```javascript
const blob = "BLOB"; // Blob of Microsoft Excel file.
const res = DocsServiceApp.openByExcelFileBlob(blob).getImages();
console.log(res);
```

In this script, the images are retrieved from all sheets of `spreadsheetId`.

- **`blob`** : Blob of XLSX file.
- **`sheetName`** : Sheet name in XLSX file. The formulas are retrieved from the sheet.

#### Result

```json
[
  {
    "range": { "col": 3, "row": 8, "a1Notation": "C8" },
    "image": {
      "description": "sample description",
      "title": "sample title",
      "blob": BLOB,
      "innerCell": false // "false" means that the image is over a cell.
    }
  },
  {
    "range": { "col": 2, "row": 2, "a1Notation": "B2" },
    "image": {
      "description": "sample description",
      "title": "sample title",
      "blob": BLOB,
      "innerCell": true // "true" means that the image is in a cell.
    }
  },
  ,
  ,
  ,
]
```

- When `getSheetByName()` is not used, above array is put in each sheet as follows.

  ```json
  [
    { "sheetName": "Sheet1", "images": [[Object], [Object], [Object]] },
    { "sheetName": "Sheet2", "images": [] },
    { "sheetName": "Sheet3", "images": [[Object], [Object]] }
  ]
  ```

#### Limitation

- When the images are retrieved from XLSX data, it seems that the image is a bit different from the original one. The image format is the same. But the data size is smaller than that of the original. When the image size is more than 2048 pixels and 72 dpi, the image is modified to 2048 pixels and 72 dpi. Even when the image size is less than 2048 pixels and 72 dpi, the file size becomes smaller than that of original one. So I think that the image might be compressed. Please be careful this.
- In the current stage, the drawings cannot be retrieved yet. I apologize for this.

### 2. `getComments()`

Retrieve comments in Microsoft Excel. In this case, the comments are directly retrieved from Microsoft Excel.

#### Sample script

```javascript
const blob = "BLOB"; // Blob of Microsoft Excel file.
const res = DocsServiceApp.openByExcelFileBlob(blob)
  .getSheetByName("Sheet1")
  .getComments();
console.log(res);
```

In this script, the comments are retrieved from "Sheet1" of Blob of Microsoft Excel file.

- **`blob`** : Blob of XLSX file.
- **`sheetName`** : Sheet name in XLSX file. The formulas are retrieved from the sheet.

#### Result

```json
[
  {
    "range": {
      "col": 2,
      "row": 11,
      "a1Notation": "B11"
    },
    "comment": [
      {
        "user": "user name",
        "comment": "comment"
      },
      ,
      ,
      ,
    ]
  },
  ,
  ,
  ,
]
```

### 3. `getAll()`

This method is used for retrieving all values (in the current stage, those are values, formulas, images and comments.) from all sheets of XLSX data. The returned value is JSON object.

#### Sample script

```javascript
function myFunction() {
  const fileId = "###"; // Please set the file ID of XLSX file.
  const blob = DriveApp.getFileById(fileId).getBlob();

  const res = DocsServiceApp.openByExcelFileBlob(blob).getAll();
  console.log(res);
}
```

- **`blob`** : Blob of XLSX file.
- The values are returned as JSON object. The returned values include the values, formulas, images and comments of all sheets in the XLSX data.

### 4. `getSheets()`

This method is used for retrieving the sheet list from XLSX data.

#### Sample script

```javascript
function myFunction() {
  const fileId = "###"; // Please set the file ID of XLSX file.
  const blob = DriveApp.getFileById(fileId).getBlob();

  const res = DocsServiceApp.openByExcelFileBlob(blob).getSheets();
  console.log(res);
}
```

- **`blob`** : Blob of XLSX file.

### 5. `getValues()`

This method is used for updating the values from a sheet of XLSX data.

#### Sample script

```javascript
function myFunction() {
  const fileId = "###"; // Please set the file ID of XLSX file.
  const sheetName = "###"; // Please set the sheet name.
  const blob = DriveApp.getFileById(fileId).getBlob();

  const res = DocsServiceApp.openByExcelFileBlob(blob)
    .getSheetByName(sheetName)
    .getValues();
  console.log(res);
}
```

- **`blob`** : Blob of XLSX file.
- **`sheetName`** : Sheet name in XLSX file. The values are retrieved from the sheet.

Sample result value is as follows. The values are returned as 2 dimensional array.

```json
[
  ["a1", "b1", "c1"],
  ["", "b2", "c2"],
  ["a3", "b3", "c3"],
  ["a4", "b4", "c4"],
  ["a5", "b5", "c5"]
]
```

<a name="getformulas"></a>

### 6. `getFormulas()`

This method is used for updating the formulas from a sheet of XLSX data.

### Sample script

```javascript
function myFunction() {
  const fileId = "###"; // Please set the file ID of XLSX file.
  const sheetName = "###"; // Please set the sheet name.
  const blob = DriveApp.getFileById(fileId).getBlob();

  const res = DocsServiceApp.openByExcelFileBlob(blob)
    .getSheetByName(sheetName)
    .getFormulas();
  console.log(res);
}
```

- **`blob`** : Blob of XLSX file.
- **`sheetName`** : Sheet name in XLSX file. The formulas are retrieved from the sheet.
- The values are returned as 2 dimensional array.
