export default class User {

    

    constructor(id, email, firstname, lastname, username, creationDate) {
        this.id = id;
        this.email = email;
        this.firstname = firstname;
        this.lastname = lastname;
        this.username = username;
        this.creationDate = creationDate;
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

    getCreationDate() {
        return this.creationDate;
    }

    setCreationDate(date) {
        this.creationDate = date
    }

    toJson() {
        return {
            id: this.getId(),
            email: this.getEmail(),
            firstname: this.getFirstname(),
            lastname: this.getLastname(),
            username: this.getUsername(),
            creationDate: this.getCreationDate()
        }
    }
}