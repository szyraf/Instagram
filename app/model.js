class Photo {
    id
    album
    originalName
    url
    lastChange
    history

    constructor(id, filename) {
        this.id = id
        this.filename = filename
    }
}

let photosArray = []

module.exports = { Animal, photosArray }
