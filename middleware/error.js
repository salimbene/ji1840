module.exports = function(err, req, res, next) {
  //log
  res.status(500).send('Something failed');
};
