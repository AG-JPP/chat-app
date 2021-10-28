<template>
    <div>
        <div class="card mt-3">
            <div class="card-body">
                <div class="card-title">
                    <h3>Login</h3>
                    <hr>
                </div>
            </div>
            
            <div class="card-footer">
                <form @submit.prevent="login">
                    <div class="gorm-group pb-3">
                        <label for="email">Adresse email</label>
                        <input type="email" v-model="email" class="form-control">
                    </div>
                    <button type="submit" class="btn btn-success">Log in</button>
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
                socket : io('localhost:3001')
            }
        },
        methods: {
            login(e) {
                e.preventDefault();
                this.socket.emit('login', {
                    email: this.email
                })
            },
        },
        mounted() {
            this.socket.on('newusr', (data) => {
                let connectedUser = new User(
                    data.id,
                    data.email,
                    data.firstname,
                    data.lastname,
                    data.username
                )
                console.log(data)
                this.$router.push({
                    name: 'chat',
                    params: {
                        user: connectedUser
                    }
                })
            })
        }
    }
</script>