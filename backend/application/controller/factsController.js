const Fact = require('../model/factsModel');
const ObjectId = require('mongoose').Types.ObjectId;

const OPEN_MODE = 0o666;
const fs = require('fs')
const crypto = require('crypto')

exports.getAllFacts = (order, socket) => {
    console.log('Try to get facts');
    
    Fact.find().sort({[likes]: order}).exec((err, facts) => {
        
        if (err) {
            console.log(err);
	        socket.emit('facts', {err: 'Error occured during facts retrieving!'});
        }
        else {
            let factsToSend = facts.map( fact => {
                return {
                    factId: fact._id,
                    title: fact.title,
                    content: fact.content,
                    photo: 'images/' + fact.image,
                    likes: fact.likes.length,
                  }
            })
            console.log(factsToSend);
            socket.emit('facts', {payload: factsToSend, order: order});
        }
    })
};

exports.new = (userData, socket) => {
    {
        console.log('Try to create fact');
        let userId = socket.userId;
        userData.filename = crypto.createHash('sha256').update(userData.filename).digest('hex');

        let fact = new Fact( {
            title: userData.title,
            content: userData.content,
            image: userData.filename
        })

        let filename = __dirname + '/../public/images/' + userData.filename;
        fs.open(filename, 'w', OPEN_MODE, (err, fd) => {
	        if (err) {
		        console.log(err);
		        return;
	        }

	        fs.writeFile(fd, userData.filedata, () => {
	            fs.close(fd, () => {console.log('Success')});
	        })
        })

        fact.save(function(err) {
            if (err) {
                console.log(err);
            } else {
                let factToSend = {
                    
                    factId: fact._id,
                    title: fact.title,
                    content: fact.content,
                    photo: 'images/' + fact.image,
                    likes: fact.likes.length,
                }
                
                console.log(factToSend);
                socket.emit('fact:newFact', {payload: factToSend});
            }
        });
    }
};

exports.getById = (userData, socket) => {
    console.log('Try to get fact by id');
    let userId = socket.userId;
    if (!userId) {
        socket.emit('fact:getById', {err: "Need to log in"});
	    return;
    } 
    
    let id = userData.fact_id;
    if (!ObjectId.isValid(id)) {
        socket.emit('fact:getById', {err: "Bad id!"});
        return;
    }
    Fact.findById(id, (err, fact) => {
        if (err) {
            console.log(err);
	        socket.emit('fact:getById', {err: "Error occur during getting fact by id!"});
        } else {
            let factToSend = {
                factId: fact._id,
                title: fact.title,
                content: fact.content,
                photo: 'images/' + fact.image,
                likes: fact.likes.length,
            }
            
            console.log(factToSend);
            socket.emit('fact:getById', {payload: factToSend});
        }
    });
};

exports.update = (userData, socket) => {
    console.log('Try to update fact');
    
    let userId = socket.userId;

    if (!userId) {
        socket.emit('fact:update', {err: "Need to log in"});
	    return;
    } 
  
    let factId = userData.fact_id;

    console.log(userId, factId);
    
    if (!ObjectId.isValid(id)) {
        socket.emit('fact:update', {err: "Bad id!"});
        return;
    }

    Fact.findById(factId, (err, fact) => {
        if (err || !fact) {
            console.log(err);
	        socket.emit('fact:update', {err: 'Error occur during getting fact by id for update!'});
        }
        fact.title = userData.title ? userData.title : fact.title;
        fact.content = userData.content ? userData.content : fact.content;

        let popFlag = false;
	    for (let i = 0; i < fact.likes.length; i++) {
            if (fact.likes[i] == userId) {
	            fact.likes.pop(userId);
		        popFlag = true;
	        }
	    }
	
	    if (!popFlag) {
	        fact.likes.push(userId);
	    }
	    console.log(fact.likes.length);

        fact.save((err) => {
            if (err) {
                console.log(err);
	            socket.emit('fact:update', {err: "Error occur during saving updated fact!"});
                return;
            }
            
            console.log(fact);

            let factToSend = {
                factId: fact._id,
                title: fact.title,
                content: fact.content,
                photo: 'images/' + fact.image,
                likes: fact.likes.length,
            }
            
            console.log(factToSend);
            socket.emit('fact:update', {payload: factToSend});

        });
    });
};


exports.delete = function (userData, socket) {
  
    let userId = socket.userId;
    let factId = userData.factId;

    if (!userId) {
        socket.emit('fact:delete', {err: "Need to log in"});
	    return;
    } 

    console.log(userId, factId);
    
    
    if (!ObjectId.isValid(id)) {
        socket.emit('fact:delete', {err: "Bad id!"});
        return;
    }

    Fact.deleteOne({_id: factId}, (err, fact) => {
        if (err) {
            console.log(err);
			return;
        }
            
        console.log(fact);
        socket.broadcast.emit('fact:delete', {factId: factId});
    });
};
