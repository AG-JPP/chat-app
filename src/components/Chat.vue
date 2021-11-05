<template>
    <div class="card mt-3">
        <div class="card-body">
            <div class="card-title">
                <h3>Chat group</h3>
                <hr>
                <h3 v-if="this.connectedUser.getId() != 0">Welcome {{this.connectedUser.getFirstname()}}</h3>
            </div>

            <div class="card-body">
                <div class="messages">
                    <div v-if="this.messages.length == 0" class="spinner-border" role="status">
                        <span class="visually-hidden">Loading...</span>
                    </div>
                    <div v-else class="message" v-for="(msg, index) in  this.messages" :key="index">
                        <p class="text-start">
                            <span  class="fw-bold fs-5">{{msg.getUser().getUsername()}} </span> <span class="fs-6 fst-italic">{{msg.formateDate()}}</span>
                        </p>
                        <p class="text-start">
                            {{msg.getMessage()}} 
                        </p>
                    </div>
                </div>
            </div>
        </div>

        <div class="card-footer" v-if="this.connectedUser.id != 0">
            <form @submit.prevent="sendMessage">
                <div class="gorm-group pb-3">
                    <label for="message">Message:</label>
                    <input type="text" v-model="newMessage" class="form-control">
                </div>
                <button type="submit" class="btn btn-success">Send</button>
            </form>
        </div>
    </div>
</template>

<script>
    import io from 'socket.io-client';
    import axios from 'axios';
    import Message from '../classes/Message.class';
    import User from '../classes/User.class';

    export default {
        data() {
            return {
                connectedUser: false,
                socket : io('localhost:3001'),
                newMessage: '',
                messages: []
            }
        },
        methods: {
            getUserConnection() {
                const savedConnection = this.$store.getters.getConnectedUser
                if (savedConnection) {
                    this.connectedUser = savedConnection
                } else {
                    this.$router.push('/')
                }
            },
            sendMessage(e) {
                e.preventDefault();

                this.socket.emit('send_message', {
                    userId: this.connectedUser.getId(),
                    message: this.newMessage
                });
                this.newMessage = ''
            },
            fetchAllMessages() {
                let loadedMessages = [];
                axios.get('http://localhost:3001/user/messages')
                .then(function (response) {
                    response.data.messages.forEach(msg => {
                        const userMessage = new User(msg.userId, msg.email, msg.firstname, msg.lastname, msg.username, msg.userDate)
                        let message = new Message(msg.messageId, msg.message, msg.messageDate)
                        message.setUser(userMessage)
                        loadedMessages.push(message)
                    });
                })
                .catch(function (error) {
                    console.log(error)
                })
                this.messages = loadedMessages
            }
        },
        mounted() {
            this.socket.on('message', (data) => {
                console.log(data)
                //this.messages = [...this.newMessage, data];
            }),
            this.socket.on('newMessage', (msg) => {
                let newMessage = new Message(msg.id, msg.message, msg.dateCreation);
                const userMessage = new User(msg.user.id, msg.user.email, msg.user.firstname, msg.user.lastname, msg.user.username, msg.user.creationDate)
                console.log(userMessage)
                newMessage.setUser(userMessage)
                this.messages.push(newMessage)           
            }),
            this.fetchAllMessages()
        },
        created() {
            this.getUserConnection()
        }
    }
</script>