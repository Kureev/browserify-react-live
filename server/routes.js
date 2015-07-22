module.exports = function applyRoutes(file, app) {
  app.get('/favicon.ico', function getFavico(req, res) {
    res.status(404).end();
  });

  app.get('/dev.bundle.js', function defaultBundle(req, res) {
    // Disable caching for content files
    res.header('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.header('Pragma', 'no-cache');
    res.header('Expires', 0);

    res.send(file);
  });
};
