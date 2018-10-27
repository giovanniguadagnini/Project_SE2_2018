//import modules / ext. libraries
const express = require('express')
const app = express()
const PORT = process.env.PORT || 3000

//behaviour to attend for GET request to "/"
app.get('/', (req, res) => res.send('Hello World!'))

app.listen(PORT, () => console.log('Listening on port '+ PORT))
