const jwt = require('jsonwebtoken');

const User = require('../models/user');
const Order = require('../models/orders')
const keys = require('../config/keys');
const errorHandler = require('../routes/utils/errorHandler');

module.exports.create = async (req, res) => {
  try {
    const {token, order} = req.body
    const decoded = await jwt.verify(token, keys.jwt);
    //check user
    const candidate = await User.findOne({
      email: decoded.email
    });
    console.log('----->order', order)
    if (candidate) {
      //create new cleaner
      let orderObject = new Order({
        name: order.name,
        price: order.price,
        cleaner: {
          id: order.cleaner.id,
          name: order.cleaner.name,
        },
        createdBy: candidate.email,
        createdDate: new Date(),
        status: 'created',
        lastChange: {
          howChange: candidate.email,
          date: new Date(),
          whatToChange: 'created',
        }
      });
      try {
        await orderObject.save();
        res.status(201).json({
          order: orderObject
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

module.exports.update = async (req, res) => {
  try {
    const {token, order} = req.body
    const decoded = await jwt.verify(token, keys.jwt);
    //check user
    const candidate = await User.findOne({
      email: decoded.email
    });
    if (candidate.role === 1) {
      //create update object
      let updated = {
        name: order.name,
        price: order.price,
        status: order.status,
        lastChange: {
          howChange: candidate.email,
          date: new Date(),
          whatToChange: order.status,
        }
      };
      try {
        await Order.findOneAndUpdate(
            {
              _id: order._id,
            },
            {
              $set: updated
            },
            async function (err, doc) {
              if (err) {
                errorHandler(res, err)
              } else {
                res.status(200).json(doc)
              }
            });
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

module.exports.get = async (req, res) => {
  try {
    const {token, id} = req.body
    const decoded = await jwt.verify(token, keys.jwt);
    //check user
    const candidate = await User.findOne({
      email: decoded.email
    });
    if (candidate) {
      const order = await Order.find({
        _id: id
      });
      if (order) {
        res.status(201).json(order)
      } else {
        res.status(404).json({
          message: 'not found'
        })
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

module.exports.getAll = async (req, res) => {
  try {
    const {token} = req.body
    const decoded = await jwt.verify(token, keys.jwt);
    //check user
    const candidate = await User.findOne({
      email: decoded.email
    });
    if (candidate) {
      const orders = await Order.find();
      if (orders) {
        res.status(201).json(orders)
      } else {
        res.status(404).json({
          message: 'not found'
        })
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
