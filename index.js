/*
 * Copyright 2014-2019 Clemens Fruhwirth <clemens@endorphin.org>
 */

var ffi = require('ffi');
var ref = require('ref');
var EpegImage = ref.refType(ref.types.void)
var stringPtr = ref.refType(ref.types.CString)
var intPtr = ref.refType(ref.types.int)
var dataPtr = ref.refType(ref.refType(ref.types.uchar))
/*
   EAPI void          epeg_colorspace_get            (Epeg_Image *im, int *space);
   EAPI void          epeg_decode_colorspace_set     (Epeg_Image *im, Epeg_Colorspace colorspace);
   EAPI const void   *epeg_pixels_get                (Epeg_Image *im, int x, int y, int w, int h);
   EAPI void          epeg_pixels_free               (Epeg_Image *im, const void *data);
   EAPI void          epeg_thumbnail_comments_get    (Epeg_Image *im, Epeg_Thumbnail_Info *info);
   EAPI void          epeg_quality_set               (Epeg_Image *im, int quality);
   EAPI void          epeg_thumbnail_comments_enable (Epeg_Image *im, int onoff);
   EAPI int           epeg_trim                      (Epeg_Image *im);
*/
var epeg = ffi.Library('libepeg', {

   //   EAPI Epeg_Image   *epeg_file_open                 (const char *file);
  'epeg_file_open': [ EpegImage, [ 'string' ] ],

   //   EAPI Epeg_Image   *epeg_memory_open               (unsigned char *data, int size);
  'epeg_memory_open': [ EpegImage, [ ref.refType(ref.types.uchar), 'int' ] ],

   // EAPI void          epeg_size_get                  (Epeg_Image *im, int *w, int *h);
  'epeg_size_get': [ 'void', [ EpegImage, 'int *', 'int *' ] ],

  // EAPI void          epeg_decode_size_set           (Epeg_Image *im, int w, int h);
  'epeg_decode_size_set': [ 'void', [ EpegImage, 'int', 'int' ] ],
  'epeg_quality_set': [ 'void', [ EpegImage, 'int' ] ],
  'epeg_thumbnail_comments_enable': [ 'void', [ EpegImage, 'int' ] ],

  // EAPI const char   *epeg_comment_get               (Epeg_Image *im);
  'epeg_comment_get': [ 'string', [ EpegImage ] ],

  // EAPI void          epeg_comment_set               (Epeg_Image *im, const char *comment);
  'epeg_comment_set': [ 'void', [ EpegImage, 'string' ] ],

  // EAPI void          epeg_file_output_set           (Epeg_Image *im, const char *file);
  'epeg_file_output_set': [ 'void', [ EpegImage, 'string' ] ],

  // EAPI int           epeg_encode                    (Epeg_Image *im);
  'epeg_encode': [ 'void', [ EpegImage ] ],

  // EAPI void          epeg_memory_output_set         (Epeg_Image *im, unsigned char **data, int *size);
  'epeg_memory_output_set': [ 'void', [ EpegImage, dataPtr, intPtr ] ],

  // EAPI void          epeg_close                     (Epeg_Image *im);
  'epeg_close': [ 'void', [ EpegImage ] ]
  })

exports.epeg = epeg
exports.file_open = epeg.epeg_file_open
exports.memory_open = epeg.epeg_memory_open
exports.decode_size_set = epeg.epeg_decode_size_set
exports.quality_set = epeg.epeg_quality_set
exports.size_get = function(img) {
    xp = ref.alloc(ref.derefType(intPtr))
    yp = ref.alloc(ref.derefType(intPtr))
    epeg.epeg_size_get(img, xp, yp)
    return {x: xp.deref(), y: yp.deref()}
}

exports.encode = function(img) {
  dataP = ref.alloc(ref.derefType(dataPtr))
  intP = ref.alloc(ref.derefType(intPtr))
  epeg.epeg_memory_output_set(img, dataP, intP)
  epeg.epeg_encode(img)
  return ref.reinterpret(dataP.deref(), intP.deref())
}
