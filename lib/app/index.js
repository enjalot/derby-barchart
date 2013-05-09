var derby = require('derby')
derby.use(require('../../ui'))

var d3 = require('d3');

var app = derby.createApp(module)
  , get = app.get
  , view = app.view
  , ready = app.ready
  , start = +new Date()




// ROUTES //

// Derby routes can be rendered on the client and the server
get('/:roomName?', function(page, model, params) {
  var roomName = params.roomName || 'home'

  // Subscribes the model to any updates on this room's object. Calls back
  // with a scoped model equivalent to:
  //   room = model.at('rooms.' + roomName)
  model.subscribe('rooms.' + roomName, function(err, room) {
    model.ref('_room', room)
    room.set('name', roomName)

    // setNull will set a value if the object is currently null or undefined
    room.setNull('welcome', 'Welcome to ' + roomName + '!')
    room.incr('visits')
    
    room.set('width', 400)
    room.set('height', 400)
    room.setNull('data', [
      {x:0, y:10}, 
      {x:1, y:10}, 
      {x:2, y:10}, 
      {x:3, y:10}, 
      {x:4, y:10}
    ]);
  
    model.fn('_total', '_room.data', function(data) {
      console.log("yea!")
      var total = 0;
      for(var i = data.length; i--; ) { 
        total += data[i].y
      }
      return total;
      //return d3.sum(data, function(d) { return d.y})
    })

     // Render will use the model data as well as an optional context object
    page.render({
      roomName: roomName
    , randomUrl: parseInt(Math.random() * 1e9).toString(36)
    })
  })
})


// CONTROLLER FUNCTIONS //

ready(function(model) {
})

app.fn('up', function(e, el) {
  var model = e.at()
  model.incr('y', 1)
})
app.fn('down', function(e, el) {
  var model = e.at()
  model.incr('y', -1)
})
