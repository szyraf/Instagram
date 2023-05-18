const formidable = require('formidable')
const path = require('path')
let { Photo, photosArray } = require('./photo')
let { Tag, tagsArray } = require('./tag')
const getRequestData = require('./getRequestData')
const fs = require('fs')

module.exports = {
    register: async (req, res) => {
        /*
            - sprawdzamy czy są wszystkie potrzebne dane
            - szyfrujemy hasło bcryptem
            - zapisujemy obiekt usera w pliku modelu
            - uwaga na niepotwierdzone konto
        */
        /*
            - po rejestracji wraca response z informacją, że user powinien potwierdzić konto
            - przykładowa treść:

            skopiuj poniższy link do przeglądarki
            http://localhost:3000/api/user/confirm/<token>
            w celu potwierdzenia konta
            Uwaga: link jest ważny przez godzinę
        */
    },
    confirm: async (req, res) => {},
    login: async (req, res) => {},
    allUsers: async (req, res) => {}
}
