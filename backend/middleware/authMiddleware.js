const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const Architect = require('../models/Architect');
const Client = require('../models/Client');

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Try finding user in all collections
      req.user = await Admin.findById(decoded.id).select('-password') ||
                 await Architect.findById(decoded.id).select('-password') ||
                 await Client.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({ message: 'Not authorized, user not found' });
      }

      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

const admin = (req, res, next) => {
  if (req.user && req.user.role === 'ADMIN') {
    next();
  } else {
    res.status(401).json({ message: 'Not authorized as an admin' });
  }
};

const architect = (req, res, next) => {
  if (req.user && req.user.role === 'ARCHITECT') {
    next();
  } else {
    res.status(401).json({ message: 'Not authorized as an architect' });
  }
};

const client = (req, res, next) => {
  if (req.user && req.user.role === 'CLIENT') {
    next();
  } else {
    res.status(401).json({ message: 'Not authorized as a client' });
  }
};

module.exports = { protect, admin, architect, client };
