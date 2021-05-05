const User = require('../model/userModel');
const md5 = require('md5');
const jwt = require('jsonwebtoken');
const authentication = require('../config/authentication');

function authorize(socket, user, message) {
	let token = jwt.sign({userId: user._id}, authentication.secretKey);
	socket.emit(message, {token: token, userId: user._id})
}

exports.registration = (userData, socket) => {
    
    User.findOne({email: userData.email}, function(err, user) {
        if (err) {
            console.log(err);
            return;
        }
        
        if (user) {
            socket.emit('auth:registrate', {err: 'User with this email already exists!'});
            return;
        }
        
        let newUser = new User();
        newUser.name = userData.name;
        newUser.surname = userData.surname;
        newUser.email = userData.email;
        newUser.password = getPasswordHash(userData.password);
        
        newUser.save(function(err) {
            if (err) {
                console.log(err);
            } else {
                authorize(socket, user, 'auth:registrate');
            }
        });
    }); 
};

exports.login = (userData, socket) => {
    User.findOne({email: userData.email, password: getPasswordHash(userData.password)}, (err, user) => {
        if (err || !user) {
            console.log('User was not found!');
            socket.emit('auth:login', {err: 'User was not found!'});
        } else {
            authorize(socket, user, 'auth:login');
        }
        
    });
};

let getPasswordHash = (password) => {
    return md5(password);
};

exports.requireToken = (socket, userData, next) => {
    let token = userData?.token;
    if (token) {
        jwt.verify(token, authentication.secretKey, (err, payload) => {
            if (err) {
                console.log(err);
                socket.emit('error : 401');
                return;
            }
  
            socket.userId = payload.userId;
            console.log(socket.userId)
            next();
        })
    } else {
      socket.emit('error : 401');
    } 
  }

exports.signout = (socket, clientsOnline) => {
    console.log('Signed out');
    if (clientsOnline.has(socket.id)) {
      //console.log('Emit signed out');
      //socket.broadcast.emit('user:update', {userId: clientsOnline.get(socket.id), online: false})
      clientsOnline.delete(socket.id);
    }  
}