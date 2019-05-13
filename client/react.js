import React from 'react';
import ReactDOM from 'react-dom';
import './css/main.css';

import LoginHelper from './components/LoginHelper.jsx';

const feathers = require('@feathersjs/feathers');
const socketio = require('@feathersjs/socketio-client');
const io = require('socket.io-client');
const auth = require('@feathersjs/authentication-client');

// Establish a Socket.io connection
const socket = io('http://localhost:3030');

// Initialize our Feathers client application through Socket.io
// with hooks and authentication.
const client = feathers();

client.configure(socketio(socket));
// Use localStorage to store our login token
client.configure(auth({
  header: 'Authorization', // the default authorization header for REST
  prefix: '', // if set will add a prefix to the header value. for example if prefix was 'JWT' then the header would be 'Authorization: JWT eyJ0eXAiOiJKV1QiLCJhbGciOi...'
  path: '/authentication', // the server-side authentication service path
  jwtStrategy: 'jwt', // the name of the JWT authentication strategy 
  entity: 'user', // the entity you are authenticating (ie. a users)
  service: 'people', // the service to look up the entity
  cookie: 'feathers-jwt', // the name of the cookie to parse the JWT from when cookies are enabled server side
  storageKey: 'feathers-jwt', // the key to store the accessToken in localstorage or AsyncStorage on React Native
  storage: window.localStorage
}));

ReactDOM.render(
  <LoginHelper client={client} />,
  document.getElementById('react-root')
)