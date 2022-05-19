# DocsServiceApp

<a name="top"></a>

[![MIT License](http://img.shields.io/badge/license-MIT-blue.svg?style=flat)](LICENCE)

<a name="overview"></a>

# Overview

**This is a Google Apps Script library for supporting Document service, Docs API, Spreadsheet service, Sheets API, Slides service and Slides API.** The aim of this library is to compensate the processes that they services cannot achieve.

![](images/demo1.png)

<a name="description"></a>

# Description

The Google services, which are Document service, Docs API, Spreadsheet service, Sheets API, Slides service and Slides API, are growing now. But, unfortunately, there are still the processes that they cannot done. I created this GAS library for supporting the Google services.

The basic method of DocsServiceApp is to directly create and edit the data of Microsoft Docs (Word, Excel and Powerpoint). The created data of Microsoft Docs can be reflected to Google Docs (Document, Spreadsheet and Slides) by converting and copying the values. By this, the processes which cannot be achieved by Google services are achieved. So it can be considered that this DocsServiceApp is used as the wrapper for supporting Google service. I believe that this method will be able to be also applied for various scenes as the methodology. So I would like to grow this library.

# Feature

## For Google Docs

### [Google Document](#googledocument)

- Retrieve table width and column width from the table. The tables inserted with the default width are included.

### [Google Spreadsheet](#googlespreadsheet)

- Retrieve all images in Google Spreadsheet as an object including the cell range and image blob.
- Retrieve all comments in Google Spreadsheet as an object including the cell range and comments.
- Insert images in cells of Google Spreadsheet using the image blob.
- Create new Google Spreadsheet by setting the custom header and footer.

### [Google Slides](#googleslides)

- Create new Google Slides by setting the page size.

## For Microsoft Docs

In the current stage, there are not methods for directly parsing Microsoft Docs files. This library can achieve this.

### [Microsoft Word](#microsoftword)

- Retrieve table width and column width.

### [Microsoft Excel](#microsoftexcel)

- Retrieve all values and formulas of the cells.
- Retrieve all sheet names.
- Retrieve all images as an object including the cell range and image blob.
- Retrieve all comments as an object including the cell range and comments.

### [Microsoft Powerpoint](#microsoftpowerpoint)

There are no methods yet.

# How to install

## Install this library

TODO: STEPS TO INSTALL THE LIBRARY FROM NPM

## About Google APIs

This library uses the following Google APIs. So when you want to use the library, please enable the following APIs at Advanced Google services. [Ref](https://developers.google.com/apps-script/guides/services/advanced#enabling_advanced_services)

- Drive API: This is used for all methods.
- Sheets API: This is used for Google Spreadsheet.

## About scopes

This library uses the following scope. This is installed in the library, and nothing further is required from the user. But if you want to manually control the scopes, please set the required scopes to the manifest file (`appsscript.json`) in your client Google Apps Script project.

- `https://www.googleapis.com/auth/drive`
  - This is used for all methods.
- `https://www.googleapis.com/auth/script.external_request`
  - This is used for all methods.
- `https://www.googleapis.com/auth/documents`
  - This is used for Google Document.
- `https://www.googleapis.com/auth/spreadsheets`
  - This is used for Google Spreadsheet.
- `https://www.googleapis.com/auth/presentations`
  - This is used for Google Slides.

## About including GAS libraries

This library uses the following Google Apps Script library.

- [ImgApp](https://github.com/tanaikech/ImgApp)

<a name="methods"></a>

# Methods

- [DocumentApp](src/apps/DocumentApp/README.md)
- [SpreadsheetApp](src/apps/DocumentApp/README.md)
- [SlidesApp](src/apps/SlidesApp/README.md)
- [ExcelApp](src/apps/ExcelApp/README.md)
- [WordApp](src/apps/WordApp/README.md)
- PowerPointApp (does not exist yet)

<a name="licence"></a>

# Licence

[MIT](LICENCE)

<a name="author"></a>

# Author

[Tanaike](https://tanaikech.github.io/about/)

<a name="updatehistory"></a>

# Update History

- v1.0.0 (September 24, 2020)

  1. Initial release.

[TOP](#top)
