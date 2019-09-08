const dotenv = require('dotenv')
const express = require('express')
const bodyParser = require('body-parser')

const result = dotenv.config()
 
if (result.error) {
    console.log(result.error);
}

const app = express()
const port = 3000

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) => res.send('Hello World!!'))

app.post('/', (req, res) => { 
    console.log(req.body);
    return res.send('Hello Post');
})

app.listen(port, () => console.log(`View the website at: http://localhost:${port}`))