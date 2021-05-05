const auth = require('../controller/authController')

module.exports = (io, socket, clients) => {

  socket.on('auth:login', (userData) => {
    console.log('Login');
    console.log(userData);
    auth.login(userData, socket);
  })

  socket.on('auth:registrate', (userData) => {
      console.log('Registration');
      auth.registration(userData, socket);
  })

  socket.on('auth:signout', () => {
      console.log('Sign out');
      auth.signout(socket, clients);
  })

}