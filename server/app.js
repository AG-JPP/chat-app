const express = require('express');
const { MSSQLError } = require('mssql');

const app = express();
const sql = require('mysql');

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
        origin: "http://localhost:8080",
        methods: ["GET", "POST"]
    }
});

io.on('connection', function(socket) {
    console.log(socket.id)

    socket.on('send_message', function(data) {
        io.emit('message', data)
        connection.query('INSERT INTO messages (message) VALUES (?)', [data.message], function (err, rows, fields) {
            if (err) {
                console.log(err)
                socket.emit('error', err.code)
            } else {
                const messageId = rows.insertId;
                socket.emit('Message insert')
                connection.query('INSERT INTO r_users_message VALUES (?, ?)', [data.userId, messageId], function (err, rows, fields) {
                    if (err) {
                        console.log(err)
                        socket.emit('error', err.code)
                    } else {
                        console.log(rows)
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

    socket.on('loadAllUsersMessage', function (data) {
        const userMessages = []
        connection.query(`SELECT M.* FROM messages M JOIN r_users_message RUM ON M.id = RUM.message_id JOIN users U ON U.id = RUM.user_id WHERE U.id = ?`, 
            [data.userId], 
            function (err, rows, fields) {
                if (err) {
                    console.log(err)
                    socket.emit('error', err.code)
                } else if (rows.length > 0) {
                    rows.forEach(msg => {
                        console.log(msg)
                        userMessages.push({
                            id: msg.id,
                            message: msg.message,
                            date:  msg.creationDate
                        })
                    });
                    console.log(userMessages);
                    socket.emit('displayAllUserMessage', userMessages)
                } else {
                    socket.emit('error', 'Aucun message')
                }
        })
    })
});