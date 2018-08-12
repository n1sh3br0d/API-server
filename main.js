const http = require('http');
const app = require('./server');
const jwt = require('jsonwebtoken');
const secret_key = require('./config.json').secret_key; //secret_key for jsonwebtoken from config file


const server = http.createServer(app);
const socket = require('socket.io')(server);


socket.on('connection', client => {
  if (client.handshake.query.token !== 'null') {
    const token = client.handshake.query.token;
    jwt.verify(token, secret_key,(error, decode) => {
      if (error) {
        client.emit('alert',JSON.stringify({
          msg:'Something wrong, reload page'
        }));
      }
      if (decode) {
        client.uuid = decode.id;
        client.name = decode.name;
        client.level = decode.level;
        client.email = decode.email;
        if ( client.level > 1) {
          client.join('moders',(error) => {
            if (error) {
              console.log(error);
              client.emit('alert',JSON.stringify({
                msg:'Something wrong, reload page'
              }));
            }
          });
        } else {
          client.join('logged',(error) => {
            if (error) {
              console.log(error);
              client.emit('alert',JSON.stringify({
                msg:'Something wrong, reload page'
              }));
            }
          });
        }
      } else {
        client.emit('alert', JSON.stringify({
          msg: 'token expired, please relogin'
        }));
      }
    });
  } client.join('guests',(error) => {
    if (error) {
      console.log(error);
      client.emit('alert',JSON.stringify({
        msg:'Something wrong, reload page'
      }));
    }
  });

  client.on('message', message =>{
    message = JSON.parse(message);
    data = {msg: message.msg, from: client.id}
    if (client.rooms.logged) {
      data.channel = 'Logged';
      data.email = client.email;
      data.uuid = client.uuid;
      data.name = client.name;
    } else if (client.rooms.guests) {
      data.channel = 'Guests';
    } else if (client.rooms.moders) {
      data.name = client.name;
    }

    if (message.to) {
      if (data.channel) {
      socket.sockets.sockets[message.to].leave(data.channel);
      delete data.channel;
      }
      client.to(message.to).emit('message', JSON.stringify(data));
    } else { 
      socket.to('moders').emit('message', JSON.stringify(data));
    }
    
    console.log(data);   
  });
  
  setTimeout(() => client.emit('message', JSON.stringify({from: 'Server', msg: 'Any questions?'})),5000);

});

server.listen(3001,() => {
  console.log('Listenning on 3001 port');
});