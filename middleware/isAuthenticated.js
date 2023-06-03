const jwt = require('jsonwebtoken');
const jwtsalt = 'privatekey'; // Make sure to use the same secret key as in your authController

module.exports = (req, res, next) => {
  // Check if the "Authorization" header exists
  if (!req.headers.authorization) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }
 
  // Get the token from the "Authorization" header
  const token = req.headers.authorization.split(' ')[1];
  
 console.log(token);
  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, jwtsalt);
    req.user = decoded;
    next();
  } catch (err) {
    console.log(err);
    res.status(400).json({ error: 'Invalid token' });
  }
};
