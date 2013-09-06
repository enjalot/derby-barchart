var config = {
  filename: __filename
, styles: '../styles/ui'
, scripts: {
    barchart: require('./barchart')
  }
};

module.exports = function(app, options) {
  app.createLibrary(config, options)
}
