import Vue from 'vue'
import Vuex from 'vuex'
import User from '../classes/User.class'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        connectedUser: false
    },
    getters: {
        getConnectedUser: state => {
            return state.connectedUser
        }
    },
    mutations: {
        addUser (state, payload) {
            localStorage.setItem('user', JSON.stringify(payload.user.toJson()))
            state.connectedUser = payload.user;
        },
        removeUser (state) {
            state.connectedUser = false
            localStorage.removeItem('user')
        },
        checkConnectedUser (state) {
            if (localStorage.getItem('user')) {
                const storageUser = JSON.parse(localStorage.getItem('user'))
                state.connectedUser = new User(
                    storageUser.id,
                    storageUser.email,
                    storageUser.firstname,
                    storageUser.lastname,
                    storageUser.username,
                    storageUser.creationDate
                )
            }
        }
    }
})