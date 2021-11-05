const { query, json } = require('express');
const express = require('express');
const { connect } = require('mssql');

const app = express();
const sql = require('mysql');
const { RESERVED_EVENTS } = require('socket.io/dist/socket');

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
                    firstname: rows[0].firstname,
                    creationDate: rows[0].creationDate
                };
                socket.emit('logged')
                socket.emit('newusr', me);
            } else { 
                console.log(`Aucun utilisateur trouvé pour l'adresse ${email}`)
                socket.emit('error', 'Aucun utilisateur ne correspond')
            }
        })
    })

    socket.on('signin', function (data) {
        connection.query('INSERT INTO users (username, email, lastname, firstname, creationDate) VALUES (?, ?, ?, ?, ?)', [data.username, data.email, data.lastname, data.firstname, Date.now() / 1000], function (err, rows, fields) {
            if (err) {
                console.log(err)
                socket.emit('error', err.code)
            } else {
                const userId = rows.insertId;
                newUser = {
                    id: userId,
                    email: data.email,
                    lastname: data.lastname,
                    firstname: data.firstname,
                    username: data.username,
                    creationDate: Date.now() / 1000
                }
                socket.emit('newUser', newUser)
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

app.get('/user/:id?/messages', (req, res) => {
    let result = {
        
    }
    try {
        const userId = req.params.id;
        let users = []
        let query = 'SELECT M.*, M.id AS messageId, M.creationDate AS messageDate, U.*, U.id AS userId, U.creationDate AS userDate from messages M JOIN r_users_message RUM ON M.id = RUM.message_id JOIN users U ON RUM.user_id = U.id '
        if (!! userId) {
            query += 'WHERE U.id = ?'
        }
        
        connection.query(query, [userId], function (err, rows, fields) {
            if (err) {
                console.log(err)
                res.status(500).send('Internal error')
            } else if (rows.length > 0) {
                console.log(rows)
                rows.forEach(element => {
                    users.push({
                        messageId: element.messageId,
                        message: element.message,
                        messageDate: element.messageDate,
                        userId: element.userId,
                        email: element.email,
                        firstname: element.firstname,
                        lastname: element.lastname,
                        username: element.username,
                        userDate: element.userDate
                    })
                });
                result.count = rows.length
                result.messages = users
                res.status(200).json(result)
            } else {
                result.message = 'No messages found'
                res.status(404).send('No messages found')
            }
        })
    } catch (err) {
        console.log(err)
        res.status(500).send('Internal error')
    }
})

app.get('/ping', (req, res) => {
    console.log('pong')
    res.send(200)
})