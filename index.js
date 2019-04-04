const express = require('express');
const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');

aws.config.update({
  accessKeyId: "KEY_ID_GOES_HERE",
  secretAccessKey: "SECRET_KEY_GOES_HERE",
  region: 'us-west-2'
});

const s3 = new aws.S3();
const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: 'djholt-upload',
    acl: 'public-read',
    metadata: function (req, file, cb) {
      cb(null, {
        fieldName: file.fieldname,
        fileName: file.originalname
      });
    },
    key: function (req, file, cb) {
      let path = `images/${Date.now()}-${file.originalname}`;
      cb(null, path);
    }
  })
});
const singleUpload = upload.single('image');

var app = express();
app.set('port', (process.env.PORT || 8080));
app.use(express.static('public'));

app.post('/posts', function (req, res) {
  singleUpload(req, res, function (err) {
    if (err) {
      console.error('Error occurred:', err);
      return res.sendStatus(422);
    }

    console.log('Save to DB:', {
      name: req.body.name,
      fileName: req.file.originalname,
      imageUrl: req.file.location
    });

    return res.sendStatus(201);
  });
});

app.listen(app.get('port'), function () {
  console.log('Server is ready and listening.');
});
