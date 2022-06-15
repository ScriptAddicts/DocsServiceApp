class DocsServiceApp {
  /**
   * @param {String} id Spreasheet ID.
   * @return {DocsServiceApp}
   */
  static openBySpreadsheetId(id) {
    return new SpreadsheetAppp(id);
  }
  /**
   * @param {Object} blob Blob of Excel file (XLSX file).
   * @return {DocsServiceApp}
   */
  static openByExcelFileBlob(blob) {
    return new ExcelApp(blob);
  }

  /**
   * @param {String} id Document ID.
   * @return {DocsServiceApp}
   */
  static openByDocumentId(id) {
    return new DocumentAppp(id);
  }

  /**
   * @param {Object} blob Blob of Word file (DOCX file).
   * @return {DocsServiceApp}
   */
  static openByWordFileBlob(blob) {
    return new WordApp(blob);
  }

  /**
   * @param {object} object Object including parameter for createing new Google Spreadsheet.
   * @return {string} Presentation ID of cerated Google Slides.
   */
  static createNewSpreadsheetWithCustomHeaderFooter(object) {
    return new SpreadsheetAppp(
      "create"
    ).createNewSpreadsheetWithCustomHeaderFooter(object);
  }

  /**
   * @param {object} object Object including parameter for createing new Google Slides.
   * @return {string} Presentation ID of cerated Google Slides.
   */
  static createNewSlidesWithPageSize(object) {
    return new SlidesAppp("create").createNewSlidesWithPageSize(object);
  }
}
