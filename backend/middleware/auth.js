const authMiddleware = {
    isAuthenticated: (req, res, next) => {
      if (req.session && req.session.userId) {
        return next();
      }
      return res.status(401).json({ message: 'Unauthorized: Please login' });
    },
    
    isAdmin: (req, res, next) => {
      if (req.session && req.session.role === 'admin') {
        return next();
      }
      return res.status(403).json({ message: 'Forbidden: Admin access required' });
    },
    
    isMember: (req, res, next) => {
      if (req.session && req.session.role === 'member') {
        return next();
      }
      return res.status(403).json({ message: 'Forbidden: Member access required' });
    }
  };
  
  module.exports = authMiddleware;