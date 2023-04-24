class Tag {
    constructor(id, tag, popularity) {
        this.id = id
        this.tag = tag
        this.popularity = popularity
    }
}

let tagsArray = []

module.exports = { Tag, tagsArray }
