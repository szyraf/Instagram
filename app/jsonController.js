let { Animal, animalsArray } = require('./model')

module.exports = {
    add: (data) => {
        data = JSON.parse(data)
        let id = animalsArray.length !== 0 ? animalsArray[animalsArray.length - 1]?.id + 1 : 1
        let animal = new Animal(id, data.name, data.color)
        animalsArray.push(animal)
    },
    delete: (id) => {
        animalsArray = animalsArray.filter((animal) => animal.id != id)
    },
    update: (id) => {
        animalsArray = animalsArray.map((animal) => {
            if (animal.id == id) {
                animal.name = 'ŻYRAFA'
                animal.color = 'POMARAŃCZOWO-CZARNY'
            }
            return animal
        })
    },
    getall: () => {
        return animalsArray
    },
}
