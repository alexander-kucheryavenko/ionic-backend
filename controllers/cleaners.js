const jwt = require('jsonwebtoken');
const path = require('path');

const User = require('../models/user');
const Cleaner = require('../models/cleaners')
const keys = require('../config/keys');
const errorHandler = require('../routes/utils/errorHandler');

module.exports.create = async (req, res) => {
  try {
    const {token, cleaner} = req.body
    const decoded = await jwt.verify(token, keys.jwt);
    //check user
    const candidate = await User.findOne({
      email: decoded.email
    });
    if (candidate.role === 1) {
      //create new cleaner
      let cleanerObject = new Cleaner({
        name: cleaner.name,
        description: cleaner.description,
        createdBy: candidate.email,
        gallery: cleaner.gallery,
        services: cleaner.services
      });
      try {
        await cleanerObject.save();
        res.status(201).json({
          cleaner: cleanerObject
        })
      } catch (e) {
        errorHandler(res, e)
      }
    } else {
      res.status(403).json({
        message: 'permission denied'
      })
    }
  } catch (err) {
    errorHandler(res, err)
  }
};

module.exports.gallery = async (req, res) => {
  let sampleFile;
  let uploadPath;
  let type;
  let fileName
  //check files
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded.');
  }
  try {
    sampleFile = req.files.file;
    //quick fix for type file
    type = sampleFile.mimetype.substr(6, 5)
    //check file type
    if (type === 'jpg' || type === 'jpeg' || type === 'png') {
      //created filename on date now & default name file
      fileName = `${Date.now()}_${sampleFile.name}.${type}`
      uploadPath = `${process.cwd()}/static/images/${fileName}`;
      //async mounted file
      await sampleFile.mv(path.resolve(uploadPath), function (error) {
        if (error) {
          res.status(500).json({
            message: 'something went wrong'
          })
        }
      })
      res.status(200).json({
        message: 'successfully',
        path: uploadPath
      })
    } else {
      res.status(500).json({
        message: 'something went wrong'
      })
    }
  } catch (e) {
    errorHandler(res, e)
  }
};
