### Slides App
### 1. `createNewSlidesWithPageSize()`

Create new Google Slides by setting the page size. In the current stage, there are no methods for setting the page size for Google Slides in the existing Google Slides service and Slides API, although Slides API has the method of "presentations.create". This method achieves this.

#### Sample script

```javascript
const object = {
  title: "sample title", // Title of created Slides.
  parent: "###", // folder ID
  width: { unit: "pixel", size: 200 },
  height: { unit: "pixel", size: 300 },
};
const res = DocsServiceApp.createNewSlidesWithPageSize(object);
console.log(res);
```

- In this method, the presentation ID of created Slides is returned.
- "pixel" and "point" can be used for `unit` in above object.

#### Sample situations

When this method is used, the following application can be created.

1. [Inserting Text on Image using Google Apps Script](https://gist.github.com/tanaikech/835642df109731a559e52d831bd3342d) : This is a sample script for inserting a text on an image using Google Apps Script.