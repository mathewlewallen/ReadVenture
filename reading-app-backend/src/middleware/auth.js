const jwt = require('jsonwebtoken');

// Middleware to authenticate requests
exports.authenticate = (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', ''); 

    if (!token) {
      return res.status(401).json({ message: 'Authorization denied' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; 
    next();
  } catch (error) {
    res.status(401).json({ message: 'Authorization denied' });
  }
};