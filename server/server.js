const express = require('express');
const cors = require("cors")
const middleware = require('./middleware.js');
const app = express()

// const corsOptions = {
//     origin: 'http://localhost:3000'
// }

app.use(cors())
app.use(express.json());

const PORT = 4000


app.get('/', (req, res) => {
    res.status(200).send('Hello World')
})

app.post('/generate', middleware.generateToken, (req, res) => {
    res.json({token: res.locals.signature});
})

app.use((err, req, res, next) => {
    console.log(err)
    const defaultErr = {
        log: 'unknown error',
        status: 500,
        message: { err: 'An error occurred' }
    }
    const errorObj = Object.assign({}, defaultErr, err);
    return res.status(errorObj.status).json(errorObj.message);
})

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
})

module.exports = app