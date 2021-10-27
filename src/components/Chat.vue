<template>
    <div class="card mt-3">
        <div class="card-body">
            <div class="card-title">
                <h3>Chat group</h3>
                <hr>
                <h3 v-if="this.user.id != 0">Welcome {{this.user.firstname}}</h3>
            </div>

            <div class="card-body">
                <div class="messages">
                    <div class="messages" v-for="(msg, index) in  this.user.messages" :key="index">
                        <p>
                            <span class="fw-bold">{{user.username}}: </span> {{msg.message}}
                        </p>
                    </div>
                </div>
            </div>
        </div>

        <div class="card-footer" v-if="this.user.id != 0">
            <form @submit.prevent="sendMessage">
                <div class="gorm-group pb-3">
                    <label for="message">Message:</label>
                    <input type="text" v-model="user.message" class="form-control">
                </div>
                <button type="submit" class="btn btn-success">Send</button>
            </form>
        </div>
    </div>
</template>

<script>
    import io from 'socket.io-client';

    export default {
        props: ['user'],
        data() {
            return {
                messages: [],
                socket : io('localhost:3001')
            }
        },
        methods: {
            sendMessage(e) {
                e.preventDefault();

                this.socket.emit('send_message', {
                    userId: this.user.id,
                    message: this.user.message
                });
                this.message = ''
            },
            retrieveUser(userData) {
                this.user.id = userData.id;
                this.user.email = userData.email;
                this.user.username = userData.username
                this.user.lastname = userData.lastname,
                this.user.firstname = userData.firstname
            },
            loadAllUsersMessage() {
                this.socket.emit('loadAllUsersMessage', {
                    userId: this.user.id
                })
            },
            displayAllUserMessage(data) {
                this.user.messages = data
            }
        },
        mounted() {
            this.socket.on('message', (data) => {
                this.messages = [...this.message, data];
            }),
            this.socket.on('connect', () => {
                console.log(this.socket.connected);
            }),
            this.socket.on('logged', (data) => {
                this.user.username = data.username;
            })
            this.socket.on('newusr', (data) => {
                this.retrieveUser(data)
                this.loadAllUsersMessage()
            }),
            this.socket.on('displayAllUserMessage', (data) => {
                this.displayAllUserMessage(data)
            })
        }
    }
</script>