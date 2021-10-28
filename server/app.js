const express = require('express');

const app = express();
const sql = require('mysql');
const cors = require('cors');

/* app.use(cors({
    methods: ['GET','POST','DELETE','UPDATE','PUT','PATCH'],
    origin: '*'
})) */

app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

const sqlConfig = {
    user: 'root',
    password: '',
    database: 'chat-app',
    server: 'localhost',
    port: 3308
}

const connection = sql.createConnection(sqlConfig);


const server = app.listen(3001, function() {
    console.log('server running on port 3001');
});

const io = require('socket.io')(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

io.on('connection', function(socket) {
    console.log(socket.id)

    socket.on('send_message', function(data) {
        console.log(Date.now())
        connection.query('INSERT INTO messages (message, creationDate) VALUES (?, ?)', [data.message, Date.now() / 1000], function (err, rows, fields) {
            if (err) {
                console.log(err)
                socket.emit('error', err.code)
            } else {
                const messageId = rows.insertId;
                newMessage = {
                    id: messageId,
                    message: data.message,
                    dateCreation: Date.now()
                }
                socket.emit('Message insert')
                connection.query('INSERT INTO r_users_message VALUES (?, ?)', [data.userId, messageId], function (err, rows, fields) {
                    if (err) {
                        console.log(err)
                        socket.emit('error', err.code)
                    } else {
                        socket.emit('newMessage', newMessage)
                    }
                } )
            }
            
        })
    });

    let me = false;
 
    socket.on('login', function (data) {
        console.log(data)
        
        connection.query('SELECT * FROM users WHERE email = ?', [data.email], function (err, rows, fields) {
            if (err) {
                socket.emit('error', err.code)
                console.log(`Error ${err.message}`)
            } else if (rows.length == 1) { 
                me = {
                    username: rows[0].username,
                    id: rows[0].id,
                    email: rows[0].email,
                    lastname: rows[0].lastname,
                    firstname: rows[0].firstname
                };
                socket.emit('logged')
                socket.emit('newusr', me);
            } else { 
                console.log(`Aucun utilisateur trouvé pour l'adresse ${email}`)
                socket.emit('error', 'Aucun utilisateur ne correspond')
            }
        })
    })
});

app.get('/messages', (req, res) => {
    const messages = [];
    connection.query('SELECT M.*, RUM.user_id FROM messages M JOIN r_users_message RUM ON M.id = RUM.message_id ', function (err, rows, fields) {
        let result  = {
            message: 'Internal error',
        }
        if (err) {
            console.log(err)
            res.status(500).json(result)
        } else if (rows.length > 0) {
            rows.forEach(msg => {
                messages.push({
                    id: msg.id,
                    message: msg.message,
                    date: msg.creationDate,
                    userId: msg.user_id
                })
            });
            res.status(200).json(messages)
        } else {
            result.message = 'No message found'
            res.status(404).json(result)
        }
    })
})