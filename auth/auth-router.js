const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const secret = require('../api/secrets').jwtSecret




module.exports = router;