class Photo {
    #id
    #album
    #originalName
    #url
    #lastChange
    #history

    constructor(id, album, originalName, url, lastChange, history) {
        this.id = id
        this.album = album
        this.originalName = originalName
        this.url = url
        this.lastChange = lastChange
        this.history = history
    }
}

let photosArray = []

module.exports = { Photo, photosArray }
