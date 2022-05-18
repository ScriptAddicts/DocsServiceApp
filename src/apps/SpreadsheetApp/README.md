## Google Spreadsheet

### 1. `getImages()`

Retrieve images in and over the cell from Google Spreadsheet as blob. In the current stage, there are no methods for retrieving the images over the cells and inner the cells in the existing Google Spreadsheet service and Sheets API. This method achieves this.

#### Sample script

```javascript
const spreadsheetId = "###"; // Google Spreadsheet ID
const res = DocsServiceApp.openBySpreadsheetId(spreadsheetId)
  .getSheetByName("Sheet1")
  .getImages();
console.log(res);
```

In this script, the images are retrieved from "Sheet1" of `spreadsheetId`.

And

```javascript
const spreadsheetId = "###"; // Google Spreadsheet ID
const res = DocsServiceApp.openBySpreadsheetId(spreadsheetId).getImages();
console.log(res);
```

In this script, the images are retrieved from all sheets of `spreadsheetId`.

When you want to save all images in the Spreadsheet as the files, you can use the following script.

```javascript
const spreadsheetId = "###"; // Google Spreadsheet ID
const res = DocsServiceApp.openBySpreadsheetId(spreadsheetId).getImages();
const folder = DriveApp.getFolderById("### folderId ###");
res.forEach(({ images }) =>
  images.forEach((e) => {
    if (e.image) folder.createFile(e.image.blob);
  })
);
```

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

- You can create the image file from `BLOB`.

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

Retrieve comments in Google Spreadsheet. In the current stage, there are no methods for retrieving the comments with the cell coordinate in the existing Google Spreadsheet service and Sheets API. This method achieves this.

#### Sample script

```javascript
const spreadsheetId = "###"; // Google Spreadsheet ID
const res = DocsServiceApp.openBySpreadsheetId(spreadsheetId)
  .getSheetByName("Sheet1")
  .getComments();
console.log(res);
```

In this script, the images are retrieved from "Sheet1" of `spreadsheetId`.

And

```javascript
const spreadsheetId = "###"; // Google Spreadsheet ID
const res = DocsServiceApp.openBySpreadsheetId(spreadsheetId).getComments();
console.log(res);
```

In this script, the images are retrieved from all sheets of `spreadsheetId`.

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

- When `getSheetByName()` is not used, above array is put in each sheet as follows.

  ```json
  [
    { "sheetName": "Sheet1", "images": [[Object], [Object], [Object]] },
    { "sheetName": "Sheet2", "images": [] },
    { "sheetName": "Sheet3", "images": [[Object], [Object]] }
  ]
  ```

### 3. `insertImage()`

Insert images in and over the cell from Google Spreadsheet from the image blob. In the current stage, there are no methods for directly inserting an image in a cell in the existing Google Spreadsheet service and Sheets API. For example, when the user wants to insert an image on own Google Drive in a cell, the image is required to be publicly shared for using `=IMAGE(URL)`. In this method, the image can be put without publicly sharing the image and using `=IMAGE(URL)`.

#### Sample script

```javascript
const spreadsheetId = "###"; // Google Spreadsheet ID
const blob1 = DriveApp.getFileById("###fileId###").getBlob();
const blob2 = UrlFetchApp.fetch("###URL###").getBlob();
const object = [
  { blob: blob1, range: { row: 1, column: 1 } }, // Image is inserted in a cell "A1".
  { blob: blob2, range: { row: 5, column: 2 } }, // Image is inserted in a cell "B5".
];
DocsServiceApp.openBySpreadsheetId(spreadsheetId)
  .getSheetByName("Sheet1")
  .insertImage(object);
```

- **In this method, no values are returned.**
- In above sample script, 2 images are inserted into the cells "A1" and "B5" in "Sheet1", respectively.

#### Result

![](images/fig1.png)

- The sample image of cell "A1" is from [https://www.deviantart.com/k3-studio/art/Rainbow-painting-281090729](https://www.deviantart.com/k3-studio/art/Rainbow-painting-281090729)
- The sample image of cell "B5" is from [https://www.deviantart.com/k3-studio/art/Chromatic-lituus-415318548](https://www.deviantart.com/k3-studio/art/Chromatic-lituus-415318548)

#### Limitation

- When the images are retrieved from XLSX data, it seems that the image is a bit different from the original one. The image format is the same. But the data size is smaller than that of the original. When the image size is more than 2048 pixels and 72 dpi, the image is modified to 2048 pixels and 72 dpi. Even when the image size is less than 2048 pixels and 72 dpi, the file size becomes smaller than that of original one. So I think that the image might be compressed. Please be careful this.
- In the current stage, the drawings cannot be retrieved yet. I apologize for this.

### 4. `createNewSpreadsheetWithCustomHeaderFooter()`

Create new Google Spreadsheet by setting the header and footer. In the current stage, there are no methods for setting the header and footer for Google Spreadsheet in the existing Google Spreadsheet service and Sheets API. This method achieves this.

#### Sample script

```javascript
const object = {
  title: "sample title", // Title of created Spreadsheet.
  parent: "###", // folder ID
  header: { l: "left header", c: "center header", r: "right header" },
  footer: { l: "left footer", c: "center footer", r: "right footer" },
};
const res = DocsServiceApp.createNewSpreadsheetWithCustomHeaderFooter(object);
console.log(res);
```

- In this method, the spreadsheet ID of created Spreadsheet is returned.