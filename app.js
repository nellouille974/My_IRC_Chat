var express = require('express'),
	app = express();

/**
 * Liste des utilisateurs connectés
 */
var users = [];

/**
 * Gestion des requêtes HTTP des utilisateurs en leur renvoyant les fichiers du dossier 'public'
 */
app.use('/', express.static(__dirname + '/public'));

var server = app.listen(3000);
console.log('Server listen on http://localhost:3000/');

// Use Socket.io
var io = require('socket.io').listen(server);

//Définis le nombre de mes chambres
var rooms = ['chatHommesFemmes', 'chatHommes', 'chatFemmes', 'chatAnimaux'];




//Message qui va s'afficher tout en en arrivant sur la chambre
var sentences = {
	chatHommesFemmes: 'Bienvenue sur la chambre hommes/femmes',
	chatHommes: 'Bienvenue à tous les hommes !',
	chatFemmes: 'Bienvenue à toutes les femmes !',
	chatAnimaux: 'Mia Miaou Miou !!!',
};


var messages = {};

//socket.emit('ListRooms', {title: sentences[room]});

// On boucle pour chaque chambre...
rooms.forEach(function (room) {

	// On créé la liste des messages
	messages[room] = [];
	// On créé la chambre et pour chaque connection...
	io.of('/'+room).on('connection', function (socket) {
		//Place les login dans un tableau : 
		users.push(username);
		//Pour afficher la list des rooms avec /list
		socket.on('listRooms', function (filter) {
			//console.log("envoi de la liste des rooms");
			socket.emit('onListRooms', rooms);
		});

		//Pour afficher la liste des users avec /users
		socket.on('listUsers',function (filter) {
			socket.emit('onListUsers', users);
		});

		// on envoie le titre du chat + la liste des messages
		socket.emit('connected', { title: sentences[room], messages: messages[room] });
		// À chaque nouveau message
		socket.on('message', function (hash) {
			var message = {
				username: hash.username || 'Inconnu',
				text: hash.text || ''
			};

			console.log(message);
			

			//On l'ajoute à la liste
			messages[room].push(message);
			//On l'envoie à tous les clients connectés à cette chambre
			socket.broadcast.emit('newMessage', message);
			
		});
	});
});