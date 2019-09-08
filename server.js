const dotenv = require('dotenv')
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const { newEnforcer } = require('casbin')
const authz = require('./authorize')

const result = dotenv.config()
 
if (result.error) {
    console.log(result.error);
}

const app = express()
const port = process.env.PORT || 3000

// load the casbin model and policy from files, database is also supported.
let enforcer = null

app.use(cors());

// use authz middleware
app.use(authz(async() => {
    enforcer = await newEnforcer('acl/authz_model.conf', 'acl/authz_policy.csv')
    return enforcer
}))

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) => res.send('Hello World!!'))

app.post('/', (req, res) => { 
    console.log(req.body);
    return res.send('Hello Post');
})

app.get('/acl', async (req, res) => {

    let acl = 'null'
    if (enforcer) {
        // acl = enforcer.getPermissionsForUser(req.get('Authorization'))
        acl = await enforcer.getImplicitPermissionsForUser(req.get('Authorization'))
        console.log(acl);
        // console.log(enforcer.getFilteredPolicy(0, req.get('Authorization')))
    } 

    return res.send(acl);
})

app.get('/users/me', (req, res) => { 
    console.log(req.body);
    return res.send({
        id: req.get('Authorization')
    });
})


app.get('/admin', (req, res) => { 
    console.log(req.body);
    return res.send('admin');
})



app.listen(port, () => console.log(`View the website at: http://localhost:${port}`))