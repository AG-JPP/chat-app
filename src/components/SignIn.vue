<template>
    <div>
        <div class="card mt-3">
            <div class="card-body">
                <div class="card-title">
                    <h3>Sign In</h3>
                    <hr>
                </div>
            </div>
            
            <div class="card-footer">
                <form @submit.prevent="signin">
                    <div class="gorm-group pb-3">
                        <label for="email">Email address</label>
                        <input type="email" v-model="email" class="form-control">
                        <label for="lastname">Lastname</label>
                        <input type="text" v-model="lastname" class="form-control">
                        <label for="firstname">Firstname</label>
                        <input type="text" v-model="firstname" class="form-control">
                        <label for="username">Username</label>
                        <input type="text" v-model="username" class="form-control">
                    </div>
                    <button type="submit" class="btn btn-success">Sign in</button>
                </form>
            </div>  
        </div>
    </div>
</template>

<script>
    import io from 'socket.io-client';
    import User from '../classes/User.class';
    
    export default {
        
        data() {
            return {
                email: '',
                lastname: '',
                firstname: '',
                username: '',
                socket: io('localhost:3001')
            }
        },
        methods: {
            signin (e) {
                e.preventDefault()
                this.socket.emit('signin', {
                    email: this.email,
                    lastname: this.lastname,
                    firstname: this.firstname,
                    username: this.username
                })
            }
        },
        mounted() {
            this.socket.on('newUser', (data) => {
                const newUser = new User(
                    data.id, 
                    data.email, 
                    data.firstname, 
                    data.lastname, 
                    data.username, 
                    data.creationDate
                );
                this.$router.push({
                    name: 'chat',
                    params: {
                        user: newUser
                    }
                })
            })
        }
    }
</script>