const express = require('express');
const app = express();
const helmet = require('helmet');
const mongoose = require('mongoose');
const users = require('./routes/users');
const login = require('./routes/login');
const cors = require("cors");

require('dotenv').config();
app.use(cors())
app.use(express.json())
app.use(helmet())

mongoose.connect(process.env.DB || 'mongodb://localhost/note-app',
    { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('connected to mongodb'))
    .catch(err => console.log("couldn't connected to mongodb"))


app.get('/', (req, res) => {
    res.json({ message: 'Heyy, its the server of my Note App !' })
})

app.use('/users', users)
app.use('/login', login)


const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`listening from port: ${port}`))