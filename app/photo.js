class Photo {
    constructor(id, album, originalName, url, lastChange, history) {
        this.id = id
        this.album = album
        this.originalName = originalName
        this.url = url
        this.lastChange = lastChange
        this.history = history
        this.tags = []
    }

    getJSON() {
        return {
            id: this.id,
            album: this.album,
            originalName: this.originalName,
            url: this.url,
            lastChange: this.lastChange,
            history: this.history,
            tags: this.tags,
        }
    }
}

let photosArray = []

module.exports = { Photo, photosArray }
