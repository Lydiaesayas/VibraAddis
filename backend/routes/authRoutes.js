const express = require('express')
const router = express.Router()

const { loginAdmin } = require('../controllers/authController')

//login admin
router.post('/login', loginAdmin)
module.exports = router