module.exports = {
  ensureAuthenticated: function(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    req.flash('error_msg', 'Please log in to view that resource');
    res.redirect('/');
  },
  forwardAuthenticated: function(req, res, next,tmp) {
    if (!req.isAuthenticated()) {
      return next();
    }
    res.redirect('/dashboard/');      
  }
};
