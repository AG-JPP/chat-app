export default class Message {


    constructor(id, message, dateCreation) {
        this.id = id;
        this.message = message;
        this.dateCreation = dateCreation;
    }

    getId() {
        return this.id
    }

    setId(id) {
        this.id = id
    }

    getMessage() {
        return this.message
    }

    setMessage(message) {
        this.message = message
    }

    getDateCreation() {
        return this.dateCreation
    }

    setDateCreation(date) {
        this.dateCreation = date
    }

    getUser() {
        return this.user
    }

    setUser(user) {
        this.user = user
    }

    /**
     * Formate la date de création dans un format lisible par l'humain
     */
    formateDate() {
        const date = new Date(this.getDateCreation() * 1000)
        return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`
    }
}