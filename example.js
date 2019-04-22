var epeg = require('epeg')
var fs = require('fs')

// Open jpg from file. Alternatively use epeg.memory_open(buf, size)
img = epeg.file_open('orange.jpg')
//fs.readFile('orange.jpg')

// Get size of the image
size = epeg.size_get(img)
// Decode and resize to a 10th of the size
epeg.decode_size_set(img, size.x/10, size.y/10)

// Re-encode and write out
epeg.quality_set(img, 85)
buf = epeg.encode(img)
fs.open('./orange-small.jpg', 'w', function (err, fd) {
  fs.writeSync(fd, buf)
})
