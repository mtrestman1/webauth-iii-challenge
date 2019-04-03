const express = require('express');
const router = express.Router()
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const secret = require('../api/secrets').jwtSecret
const restricted = require('./restricted-middleware');


const db = require('../database/dbConfig')

router.post('/register', (req, res) => {
    let user = req.body;
   // console.log(user)
    const hash = bcrypt.hashSync(user.password, 10) 
   // console.log(`this is my hash ${hash}`)
    user.password = hash;
   // console.log('call to database')
    db('users')
    .insert(user)
    .then(ids => {
        //console.log('insert was successful, got back ID', ids)
        const id = ids[0]
         db('users')
        .where({id})
        .then(users => {
            //console.log('going to send response with users', users)
            res.status(201).json(users)
        })
    })
    .catch(error => {
        res.status(500).json(error)
    })
})

router.post('/login', (req, res) => {
    let { username, password } = req.body;

    db('users')
    .where({ username })
    .first()
    .then(user => {
        if (user && bcrypt.compareSync(password, user.password)) {
          const token = generateToken(user)
  
          res.status(200).json({
            message: `Welcome ${user.username}!`,
            token,
          });
        } else {
          res.status(401).json({ message: 'Invalid Credentials' });
        }
      })
    .catch(error => {
        res.status(500).json(error)
    })
})

function generateToken(user) {
    const payload = {
      subject: user.id,
      username: user.username,
    }
  
  const options = {
    expiresIn: '1d'
  }
  
    return jwt.sign(payload, secret, options)
  }


  router.get('/users', restricted, (req, res) => {
    db('users')
    .then(users => {
        res.status(200).json(users);
    })
    .catch(error => res.send(error))
})


module.exports = router;