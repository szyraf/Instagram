const formidable = require('formidable')
const path = require('path')
const fs = require('fs')
const getRequestData = require('./getRequestData')

const router = async (req, res) => {
    console.log(req.url)
    console.log(req.method)

    if (req.url == '/api/photos' && req.method == 'POST') {
        // add Photo
        //let data = await getRequestData(req)

        const uploadFolder = path.join(__dirname, 'public', 'files')

        const form = formidable({})
        form.multiples = true
        form.maxFileSize = 50 * 1024 * 1024 // 5MB
        form.uploadDir = uploadFolder
        //console.log(form)

        console.log('aaaa')
        form.parse(req, async (err, fields, files) => {
            console.log('bbbbbbbb')
            console.log(fields)
            console.log('cccc')
            console.log(files)
            console.log('dddd')
            if (err) {
                // TODO
            }

            const file = files.myFile
            console.log('file')
            console.log(file)

            fs.rename(file.filepath, path.join(uploadFolder, 'test.jpg'), function (err) {
                if (err) throw err
                res.write('File uploaded and moved!')
                res.end()
            })

            // res.writeHead(200, { 'Content-Type': 'application/json;charset=utf-8' })
            // res.write(JSON.stringify({ status: 'photo added' }))
            // res.end()

            /*
            const isFileValid = (file) => {
                console.log('type')
                console.log(file.type)
                const type = file.type.split('/').pop()
                const validTypes = ['jpg', 'jpeg', 'png', 'pdf']
                if (validTypes.indexOf(type) === -1) {
                    return false
                }
                return true
            }
            */

            /*
            // Check if multiple files or a single file
            if (!files.myFile.length) {
                //Single file

                const file = files.myFile
                console.log('file')
                console.log(file)

                // checks if the file is valid
                const isValid = isFileValid(file)

                // creates a valid name by removing spaces
                const fileName = encodeURIComponent(file.name.replace(/\s/g, '-'))
                console.log('fileName')
                console.log(fileName)

                if (!isValid) {
                    // throes error if file isn't valid
                    return res.status(400).json({
                        status: 'Fail',
                        message: 'The file type is not a valid type',
                    })
                }
                try {
                    // renames the file in the directory
                    fs.renameSync(file.path, join(uploadFolder, fileName))
                } catch (error) {
                    console.log(error)
                }

                try {
                    // stores the fileName in the database
                    const newFile = await File.create({
                        name: `files/${fileName}`,
                    })
                    return res.status(200).json({
                        status: 'success',
                        message: 'File created successfully!!',
                    })
                } catch (error) {
                    res.json({
                        error,
                    })
                }
            } else {
                // Multiple files
            }
            */
        })
    } else if (req.url == '/api/photos' && req.method == 'GET') {
    } else if (req.url.match(/\/api\/photos\/([0-9]+)/) && req.method == 'GET') {
    } else if (req.url.match(/\/api\/photos\/([0-9]+)/) && req.method == 'DELETE') {
    } else if (req.url == '/api/photos' && req.method == 'PATCH') {
    }

    /*
        case 'POST':
            if (req.url == '/add') {
                let data = await getRequestData(req)
                res.writeHead(200, { 'Content-Type': 'application/json;charset=utf-8' })
                res.write(JSON.stringify({ status: 'animal added', data: controller.getall() }))
                res.end()
                */
}

module.exports = router