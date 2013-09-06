var derby = require('derby')
var d3 = require('d3');

var app = derby.createApp(module)
  .use(require('../../ui'))

app.on("model", function(model) {
  model.fn('calculateTotal', function(data) {
    return d3.sum(data, function(d) { return d.y})
  })

});
// ROUTES //
// Derby routes can be rendered on the client and the server
app.get('/:roomName?', function(page, model, params) {
  var roomName = params.roomName || 'home'

  // Subscribes the model to any updates on this room's object. Calls back
  // with a scoped model equivalent to:
  //   room = model.at('rooms.' + roomName)
  model.subscribe('rooms.' + roomName, function(err) {
    var room = model.at('rooms.' + roomName);
    model.ref('_page.room', room)
    room.set('name', roomName)

    // setNull will set a value if the object is currently null or undefined
    room.setNull('welcome', 'Welcome to ' + roomName + '!')
    room.increment('visits')

    room.set('width', 400)
    room.set('height', 400)
    room.setNull('data', d3.range(5).map(function(d,i) { return {x: i, y: (Math.random()*10) | 0}}) );

    model.start('calculateTotal', '_page.total', '_page.room.data');

     // Render will use the model data as well as an optional context object
    page.render({
      roomName: roomName
    , randomUrl: parseInt(Math.random() * 1e9).toString(36)
    })
  })
})


// CONTROLLER FUNCTIONS //
app.fn('up', function(e, el) {
  var model = e.at(':datum')
  model.increment('y', 1)
})
app.fn('down', function(e, el) {
  var model = e.at(':datum')
  model.increment('y', -1)
})
