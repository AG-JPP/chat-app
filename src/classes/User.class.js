export default class User {

    

    constructor(id, email, firstname, lastname, username) {
        this.id = id;
        this.email = email;
        this.firstname = firstname;
        this.lastname = lastname;
        this.username = username;
    }

    getId() {
        return this.id
    }

    setId(id) {
        this.id = id
    }

    getEmail() {
        return this.email
    }

    setEmail(email) {
        this.email = email
    }

    getFirstname() {
        return this.firstname
    }

    setFirstname(firstname) {
        this.firstname = firstname
    }

    getLastname() {
        return this.lastname
    }

    getUsername() {
        return this.username
    }

    setUsername(username) {
        this.username = username
    }
}