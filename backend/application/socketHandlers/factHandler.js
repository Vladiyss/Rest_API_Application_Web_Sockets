const factsController = require('../controller/factsController')
const {requireToken} = require('../controller/authController') 

module.exports = (io, socket) => {

    socket.on('facts', (userData) => {
        /*requireToken(socket, userData, () => {
            console.log('Give all facts');
            factsController.getAllFacts(socket);
        })*/
        console.log('Give all facts');
        factsController.getAllFacts(userData.order, socket);
    })

    socket.on('fact:update', (userData) => {
        requireToken(socket, userData, () =>{
            console.log('Update fact');
            factsController.update(userData, socket);
        })
    })

    socket.on('fact:getById', (userData) => {
        requireToken(socket, userData, () => {
            console.log('Get fact by id');
            factsController.getById(userData, socket);
        })
    })

    socket.on('fact:delete', (userData) => {
        requireToken(socket, userData, () => {
            console.log('Delete fact');
            factsController.delete(userData, socket);
        })
    })

    socket.on('fact:newFact', (userData) => {
        requireToken(socket, userData, () => {
            console.log('Create fact');
            factsController.new(userData, socket);
        })
    })
}