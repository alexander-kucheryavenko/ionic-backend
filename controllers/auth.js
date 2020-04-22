const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const keys = require('../config/keys');
const errorHandler = require('../routes/utils/errorHandler');
const MailService = require('../services/mail.service');
const saltWork = 10;

module.exports.login = async (req, res) => {
  const candidate = await User.findOne({
    email: req.body.user.email
  });
  if (candidate) {
    //check password
    const passwordResult = bcrypt.compareSync(req.body.user.password, candidate.password);
    if (passwordResult) {
      // generation token
      const token = jwt.sign({
        email: candidate.email,
        userId: candidate._id
      }, keys.jwt, {
        expiresIn: 60 * 60
      });
      res.status(201).json({
        token,
      })
    } else {
      res.status(401).json({
        message: 'User un authorize.'
      })
    }
  } else {
    // user not found, alert
    res.status(404).json({
      message: 'user not found'
    })
  }
};

module.exports.register = async (req, res) => {
  //email password
  const candidate = await User.findOne({
    email: req.body.user.email
  });
  if (candidate) {
    //user use again
    res.status(409).json({
      message: 'such an email is already taken'
    })
  } else {
    // created user
    const user = new User({
      firstName: req.body.user.firstName,
      lastName: req.body.user.lastName,
      email: req.body.user.email,
      password: req.body.user.password,
      wantBeAdmin: !!req.body.user.wantBeAdmin,
      role: 0
    });
    try {
      await user.save();
      const token = jwt.sign({
        email: user.email,
        userId: user._id
      }, keys.jwt, {
        expiresIn: 60 * 60
      });
      const text = `<div><h4>You are registered on our service. Congratulations!</h4><p>Use your email in order to login ${user.email}</p></div>`
      await MailService.sendSubscribeEmail(user.email, text)
      res.status(201).json({
        token,
      })
    } catch (e) {
      errorHandler(res, e)
    }
  }
};

module.exports.verify = async (req, res) => {
  try {
    const decoded = await jwt.verify(req.body.token, keys.jwt);
    const candidate = await User.findOne({
      email: decoded.email
    });
    if (candidate) {
      res.status(201).json({
        candidate,
      })
    } else {
      res.status(404).json({
        message: 'user not found'
      })
    }
  } catch (err) {
    res.status(401).json({
      message: 'User un authorize.'
    })
  }
};

module.exports.requestUpdatePassword = async (req, res) => {
  try {
    const candidate = await User.findOne({
      email: req.body.email
    });
    if (candidate) {
      const token = jwt.sign({
        email: candidate.email,
        date: new Date()
      }, keys.jwt, {
        expiresIn: 60 * 60
      });
      const updated = {
        token
      };
      await User.findOneAndUpdate({
        email: candidate.email,
      }, {
        $set: updated
      });
      const text = `<div>
<h4>Do you want to update your password?</h4>
<p>when you click on this 
<a href="localhost:3000/updatePassword/token=${token}">link</a>
 in your account will be reset password ${candidate.email}</p>
 </div>
`
      await MailService.sendSubscribeEmail(candidate.email, text)
      res.status(201).json({
        message: 'Message sent'
      })
    } else {
      res.status(404).json({
        message: 'user not found'
      })
    }
  } catch (err) {
    res.status(401).json({
      message: 'User un authorize.'
    })
  }
};

module.exports.changePassword = async (req, res) => {
  try {
    const salt = bcrypt.genSaltSync(saltWork);
    const hash = bcrypt.hashSync(req.body.password, salt);
    const updated = {
      password: hash,
      token:''
    }
    await User.findOneAndUpdate({
      token: req.body.token,
    }, {
      $set: updated
    });
    res.status(200).json({
      message: 'password updated successfully'
    })
  } catch (e) {
    errorHandler(res, e)
  }
};
