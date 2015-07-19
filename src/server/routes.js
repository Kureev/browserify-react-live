module.exports = function(app) {
  app.get('/favicon.ico', function getFavico(req, res) {
    res.status(404).end();
  });

  app.get('/dev.bundle.js', function defaultBundle(req, res) {
    res.send(file);
  });
};
