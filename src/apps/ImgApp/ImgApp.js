class ImgAppp {
  /**
   * var blob = DriveApp.getFileById(fileId).getBlob(); // Please retrieve file blob like this.<br>
   * var res = ImgApp.getSize(blob);<br>
   * @param {Object} blob File blob: png, jpg, gif and bmp
   * @return {Object} JSON object {identification: [png, jpg, gif and bmp], width: [pixel], height: [pixel], filesize: [bytes]}
   */
  static getSize(blob) {
    return new ImgApp().GetSize(blob);
  }
  /**
   * Resize image from inputted width. When the source file is Google Docs (spreadsheet, document and slide),<br>
   * its thumbnail is created and it is resized.<br>
   * In order to use this method, please enable Drive API at Google API console.<br>
   *<br>
   * <h3>usage</h3>
   * var res = ImgApp.doResize(fileId, width);<br>
   * DriveApp.createFile(res.blob.setName("filename")); // If you want to save as a file, please use this.<br>
   *<br>
   * @param {string} fileId File ID on Google Drive
   * @param {integer} width Resized width you want
   * @return {Object} JSON object {blob: [blob], originalwidth: ###, originalheight: ###, resizedwidth: ###, resizedheight: ###}
   */
  static doResize(fileId, width) {
    return new ImgApp().DoResize(fileId, width);
  }

  /**
   * Update a thumbnail of a file using an image.<br>
   * There are some limitations for updating thumbnail.<br>
   * Please confirm the detail information at https://developers.google.com/drive/v3/web/file#uploading_thumbnails.<br>
   *   - If Drive can generate a thumbnail from the file, then it will use the generated one and ignore any you may have uploaded.<br>
   *   - If it cannot generate a thumbnail, it will always use yours if you provided one.<br>
   *<br>
   * <h3>usage</h3>
   * ImgApp.updateThumbnail(imgFileId, srcFileId);<br>
   *<br>
   * @param {string} imgFileId File ID of new thumbnail image on Google Drive
   * @param {string} srcFileId File ID of file, which is updated thumbnail, on Google Drive
   * @return {Object} JSON object id,mimeType,name,thumbnailVersion,thumbnailLink
   */
  static updateThumbnail(imgFileId, srcFileId) {
    return new ImgApp().UpdateThumbnail(imgFileId, srcFileId);
  }

  /**
   * This method is for editing images. In the current stage, the image can be cropped. And several images can be merged as an image.<br>
   * <br>
   * <h3>usage</h3>
   * ImgApp.editImage(object);<br>
   * <br>
   * @param {Object} object Object for using this method.
   * @return {Object} Blob of result image.
   */
  static editImage(object) {
    return new ImgApp().EditImage(object);
  }
}

(function (r) {
  var ImgApp;
  ImgApp = (function () {
    var GetImage,
      GetResizedSize,
      byte2hex,
      byte2hexNum,
      byte2num,
      cropImage,
      fetch,
      getFormat,
      getImageFromSlide,
      getInfBMP,
      getInfGIF,
      getInfJPG,
      getInfPNG,
      hex2num,
      mergeImages,
      pixelToEmu,
      pixelToPt,
      ptToEmu,
      ptToPixel;

    ImgApp.name = "ImgApp";

    function ImgApp(blob) {
      this.bytear = [];
    }

    ImgApp.prototype.EditImage = function (obj_) {
      if (
        obj_.hasOwnProperty("blob") &&
        obj_.hasOwnProperty("crop") &&
        obj_.blob.toString() === "Blob" &&
        typeof obj_.crop === "object"
      ) {
        return cropImage.call(this, obj_);
      } else if (
        obj_.hasOwnProperty("merge") &&
        Array.isArray(obj_.merge) &&
        Array.isArray(obj_.merge[0])
      ) {
        return mergeImages.call(this, obj_);
      } else {
        throw new Error("Wrong object. Please confirm it again.");
      }
    };

    mergeImages = function (obj_) {
      var canvas, croppedBlob, object, presentationId, rs, slide, slides;
      canvas = obj_.merge.reduce(
        (function (_this) {
          return function (o, r) {
            var ar, mHeight, mWidth;
            mWidth = 0;
            mHeight = 0;
            ar = [];
            r.forEach(function (c) {
              var temp;
              if (c && c.toString() === "Blob") {
                temp = _this.GetSize(c);
                if (temp.width * temp.height > 25000000) {
                  throw new Error(
                    "The image size is too large. Please check https://gist.github.com/tanaikech/9414d22de2ff30216269ca7be4bce462"
                  );
                }
                ar.push({
                  blob: c,
                  left: mWidth,
                  top: o.maxHeight,
                  width: temp.width,
                  height: temp.height,
                });
                mWidth += temp.width;
                if (mHeight < temp.height) {
                  return (mHeight = temp.height);
                }
              } else {
                return ar.push(null);
              }
            });
            o.images.push(ar);
            if (o.maxWidth < mWidth) {
              o.maxWidth = mWidth;
            }
            o.maxHeight += mHeight;
            return o;
          };
        })(this),
        {
          maxWidth: 0,
          maxHeight: 0,
          images: [],
        }
      );
      object = {
        title: "tempForImaApp",
        width: {
          unit: "pixel",
          size: canvas.maxWidth,
        },
        height: {
          unit: "pixel",
          size: canvas.maxHeight,
        },
      };
      presentationId = new SlidesAppp("create").createNewSlidesWithPageSize(
        object
      );
      slides = SlidesApp.openById(presentationId);
      slide = slides.getSlides()[0];
      canvas.images.forEach(function (r) {
        r.forEach(function (c) {
          if (c) {
            slide.insertImage(
              c.blob,
              pixelToPt.call(this, c.left),
              pixelToPt.call(this, c.top),
              pixelToPt.call(this, c.width),
              pixelToPt.call(this, c.height)
            );
          }
        });
      });
      slides.saveAndClose();
      rs = canvas.maxWidth > 1600 ? 1600 : canvas.maxWidth;
      if (
        obj_.hasOwnProperty("outputWidth") &&
        obj_.outputWidth > 0 &&
        obj_.outputWidth <= 1600
      ) {
        rs = obj_.outputWidth;
      }
      croppedBlob = getImageFromSlide.call(
        this,
        presentationId,
        slide.getObjectId(),
        rs,
        obj_.outputFilename
      );
      DriveApp.getFileById(presentationId).setTrashed(true);
      return croppedBlob;
    };

    cropImage = function (obj_) {
      var _,
        b,
        croppedBlob,
        height,
        l,
        object,
        presentationId,
        ref,
        rs,
        setHeight,
        setL,
        setT,
        setWidth,
        size,
        slide,
        slides,
        t,
        unit,
        width;
      unit =
        obj_.hasOwnProperty("unit") && typeof obj_.unit === "string"
          ? obj_.unit
          : "pixel";
      size = this.GetSize(obj_.blob);
      if (size.width * size.height > 25000000) {
        throw new Error(
          "The image size is too large. Please check https://gist.github.com/tanaikech/9414d22de2ff30216269ca7be4bce462"
        );
      }
      width =
        obj_.unit === "point" ? pixelToPt.call(this, size.width) : size.width;
      height =
        obj_.unit === "point" ? pixelToPt.call(this, size.height) : size.height;
      (ref = ["t", "b", "l", "r"].map(function (k) {
        if (obj_.crop.hasOwnProperty(k)) {
          return Number(obj_.crop[k]);
        } else {
          return 0;
        }
      })),
        (t = ref[0]),
        (b = ref[1]),
        (l = ref[2]),
        (r = ref[3]);
      object = {
        title: "tempForImaApp",
        width: {
          unit: obj_.unit,
          size: width - r - l,
        },
        height: {
          unit: obj_.unit,
          size: height - b - t,
        },
      };
      presentationId = new SlidesAppp("create").createNewSlidesWithPageSize(
        object
      );
      slides = SlidesApp.openById(presentationId);
      slide = slides.getSlides()[0];
      setWidth = obj_.unit === "pixel" ? pixelToPt.call(this, width) : width;
      setHeight = obj_.unit === "pixel" ? pixelToPt.call(this, height) : height;
      setL = obj_.unit === "pixel" ? pixelToPt.call(this, l) : l;
      setT = obj_.unit === "pixel" ? pixelToPt.call(this, t) : t;
      _ = slide.insertImage(obj_.blob, -setL, -setT, setWidth, setHeight);
      slides.saveAndClose();
      rs =
        size.width -
        (obj_.unit === "point" ? ptToPixel.call(this, l) : l) -
        (obj_.unit === "point" ? ptToPixel.call(this, r) : r);
      if (
        obj_.hasOwnProperty("outputWidth") &&
        obj_.outputWidth > 0 &&
        obj_.outputWidth <= 1600
      ) {
        rs =
          obj_.unit === "point"
            ? ptToPixel.call(this, obj_.outputWidth)
            : obj_.outputWidth;
      }
      croppedBlob = getImageFromSlide.call(
        this,
        presentationId,
        slide.getObjectId(),
        rs,
        obj_.blob.getName()
      );
      DriveApp.getFileById(presentationId).setTrashed(true);
      return croppedBlob;
    };

    ptToPixel = function (pt_) {
      return pt_ * 1.33333;
    };

    ptToEmu = function (pt_) {
      return pt_ * 12700;
    };

    pixelToPt = function (pixel_) {
      return pixel_ * 0.75;
    };

    pixelToEmu = function (pixel_) {
      return pixel_ * 0.75 * 12700;
    };

    getImageFromSlide = function (presentationId, slideId, rs, filename) {
      var croppedBlob, e, er, resObj, url;
      croppedBlob = null;
      try {
        resObj = Slides.Presentations.Pages.getThumbnail(
          presentationId,
          slideId,
          {
            "thumbnailProperties.thumbnailSize": "LARGE",
            "thumbnailProperties.mimeType": "PNG",
          }
        );
        try {
          url = resObj.contentUrl.replace(/=s\d+/, "=s" + Math.ceil(rs));
          croppedBlob = UrlFetchApp.fetch(url).getBlob();
        } catch (error) {
          er = error;
          throw new Error(er.message);
        }
        croppedBlob = croppedBlob.setName(
          filename || "outputImageFromImgApp.png"
        );
      } catch (error) {
        e = error;
        if (e.message === "Slides is not defined") {
          throw new Error(
            "Please enable Slides API at Advanced Google services, and try again."
          );
        } else {
          throw new Error(e.message);
        }
      }
      return croppedBlob;
    };

    ImgApp.prototype.UpdateThumbnail = function (imgFileId_, srcFileId_) {
      var boundary,
        data,
        fields,
        headers,
        img4thumb,
        metadata,
        method,
        mime,
        payload,
        url;
      if (imgFileId_ == null) {
        throw new Error("No image file ID.");
      }
      if (srcFileId_ == null) {
        throw new Error("No source file ID.");
      }
      img4thumb = DriveApp.getFileById(imgFileId_);
      mime = img4thumb.getMimeType();
      if (
        mime !== "image/png" &&
        mime !== "image/gif" &&
        mime !== "image/hpeg"
      ) {
        throw new Error(
          "The image format (" + mime + ") cannot be used for thumbnail."
        );
      }
      metadata = {
        contentHints: {
          thumbnail: {
            image: Utilities.base64EncodeWebSafe(
              img4thumb.getBlob().getBytes()
            ),
            mimeType: mime,
          },
        },
      };
      fields = "id,mimeType,name,thumbnailVersion,thumbnailLink";
      url =
        "https://www.googleapis.com/upload/drive/v3/files/" +
        srcFileId_ +
        "?uploadType=multipart&fields=" +
        encodeURIComponent(fields);
      boundary = "xxxxxxxxxx";
      data = "--" + boundary + "\r\n";
      data += 'Content-Disposition: form-data; name="metadata"\r\n';
      data += "Content-Type: application/json; charset=UTF-8\r\n\r\n";
      data += JSON.stringify(metadata) + "\r\n";
      data += "--" + boundary + "--\r\n";
      payload = Utilities.newBlob(data).getBytes();
      headers = {
        Authorization: "Bearer " + ScriptApp.getOAuthToken(),
        "Content-Type": "multipart/related; boundary=" + boundary,
      };
      method = "patch";
      return fetch.call(this, url, method, payload, headers);
    };

    ImgApp.prototype.DoResize = function (fileId, width) {
      var blob,
        e,
        headers,
        method,
        mimetype,
        n,
        res,
        resized,
        rs,
        thumbUrl,
        turl,
        url;
      try {
        url =
          "https://www.googleapis.com/drive/v3/files/" +
          fileId +
          "?fields=thumbnailLink%2CmimeType";
        method = "get";
        headers = {
          Authorization: "Bearer " + ScriptApp.getOAuthToken(),
        };
        res = fetch.call(this, url, method, null, headers);
        thumbUrl = res.thumbnailLink;
        mimetype = res.mimeType;
        r = thumbUrl.split("=");
      } catch (error) {
        e = error;
        throw new Error(
          "'" +
            fileId +
            "' is not compatible file. Error message is " +
            JSON.stringify(e)
        );
      }
      width = width > 0 ? width : 100;
      n = false;
      rs = {};
      if (~mimetype.indexOf("google-apps") || ~mimetype.indexOf("pdf")) {
        n = true;
        turl = thumbUrl.replace(r[r.length - 1], "s10000");
        rs = GetResizedSize.call(this, GetImage.call(this, turl, "png"), width);
      } else if (~mimetype.indexOf("image")) {
        rs = GetResizedSize.call(
          this,
          DriveApp.getFileById(fileId).getBlob(),
          width
        );
      } else {
        turl = thumbUrl.replace(r[r.length - 1], "s10000");
        rs = GetResizedSize.call(this, GetImage.call(this, turl, "png"), width);
      }
      blob = GetImage.call(
        this,
        thumbUrl.replace(r[r.length - 1], "s" + (n ? rs.reheight : rs.rewidth))
      );
      resized = this.GetSize(blob);
      return {
        blob: blob,
        identification: resized.identification,
        originalwidth: rs.orgwidth,
        originalheight: rs.orgheight,
        resizedwidth: resized.width,
        resizedheight: resized.height,
      };
    };

    GetImage = function (turl) {
      return UrlFetchApp.fetch(turl, {
        headers: {
          Authorization: "Bearer " + ScriptApp.getOAuthToken(),
        },
      }).getBlob();
    };

    GetResizedSize = function (blob, width) {
      var oh, ow, rh, rw, size;
      size = this.GetSize(blob);
      ow = size.width;
      oh = size.height;
      if (width > ow) {
        rw = ow;
        rh = oh;
      } else {
        rw = width;
        rh = Math.ceil((width * oh) / ow);
      }
      return {
        orgwidth: ow,
        orgheight: oh,
        rewidth: rw,
        reheight: rh,
      };
    };

    ImgApp.prototype.GetSize = function (blob) {
      var res;
      this.bytear = (function (blob) {
        var e;
        try {
          return blob.getBytes();
        } catch (error) {
          e = error;
          throw new Error("Cannot retrieve file blob.");
        }
      })(blob);
      getFormat.call(this);
      switch (this.format) {
        case "bmp":
          res = getInfBMP.call(this);
          break;
        case "gif":
          res = getInfGIF.call(this);
          break;
        case "png":
          res = getInfPNG.call(this);
          break;
        case "jpg":
          res = getInfJPG.call(this);
          break;
        default:
          res = {
            Error: this.format,
          };
      }
      return res;
    };

    getInfBMP = function () {
      return {
        identification: "BMP",
        width: byte2num(this.bytear.slice(18, 22), true),
        height: byte2num(this.bytear.slice(22, 26), true),
        filesize: this.bytear.length,
      };
    };

    getInfGIF = function () {
      return {
        identification: "GIF",
        width: byte2num(this.bytear.slice(6, 8), true),
        height: byte2num(this.bytear.slice(8, 10), true),
        filesize: this.bytear.length,
      };
    };

    getInfPNG = function () {
      return {
        identification: "PNG",
        width: byte2num(this.bytear.slice(16, 20), false),
        height: byte2num(this.bytear.slice(20, 24), false),
        filesize: this.bytear.length,
      };
    };

    getInfJPG = function () {
      var i, ma;
      i = 0;
      while (i < this.bytear.length) {
        i += 1;
        if (byte2hexNum.call(this, this.bytear[i]) === "ff") {
          i += 1;
          ma = byte2hexNum.call(this, this.bytear[i]);
          if (ma === "c0" || ma === "c1" || ma === "c2") {
            break;
          } else {
            i += hex2num.call(
              this,
              byte2hex.call(this, this.bytear.slice(i + 1, i + 3))
            );
          }
        }
      }
      return {
        identification: "JPG",
        width: hex2num.call(
          this,
          byte2hex.call(this, this.bytear.slice(i + 6, i + 8))
        ),
        height: hex2num.call(
          this,
          byte2hex.call(this, this.bytear.slice(i + 4, i + 6))
        ),
        filesize: this.bytear.length,
      };
    };

    getFormat = function () {
      var f;
      f = byte2hex.call(this, this.bytear.slice(0, 8)).join("");
      this.format =
        f.slice(0, 16) === "89504e470d0a1a0a"
          ? "png"
          : f.slice(0, 4) === "ffd8"
          ? "jpg"
          : f.slice(0, 6) === "474946"
          ? "gif"
          : f.slice(0, 4) === "424d"
          ? "bmp"
          : "Cannot retrieve image size. Now, it can retrive image size from png, jpg, gif and bmp.";
    };

    byte2hexNum = function (data) {
      var conv;
      conv = (data < 0 ? data + 256 : data).toString(16);
      return conv.length === 1 ? "0" + conv : conv;
    };

    byte2hex = function (data) {
      return data
        .map(function (e) {
          return (e < 0 ? e + 256 : e).toString(16);
        })
        .map(function (e) {
          return e.length === 1 ? "0" + e : e;
        });
    };

    byte2num = function (data, byteorder) {
      var conv;
      if (byteorder) {
        conv = data.reduceRight(function (ar, e) {
          var temp;
          temp = (e < 0 ? e + 256 : e).toString(16);
          if (temp.length === 1) {
            temp = "0" + temp;
          }
          ar.push(temp);
          return ar;
        }, []);
      } else {
        conv = byte2hex.call(this, data);
      }
      return hex2num.call(this, conv);
    };

    hex2num = function (data) {
      return parseInt(data.join(""), 16);
    };

    fetch = function (url, method, payload, headers) {
      var e, res;
      try {
        res = UrlFetchApp.fetch(url, {
          method: method,
          payload: payload,
          headers: headers,
          muteHttpExceptions: true,
        });
      } catch (error) {
        e = error;
        throw new Error(e);
      }
      try {
        r = JSON.parse(res.getContentText());
      } catch (error) {
        e = error;
        r = res.getContentText();
      }
      return r;
    };

    return ImgApp;
  })();
  return (r.ImgApp = ImgApp);
})(this);
