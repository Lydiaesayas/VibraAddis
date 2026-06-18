const express = require('express')
const router = express.Router()

const { loginAdmin, refreshToken, logoutAdmin } = require('../controllers/authController')

//login admin
router.post('/login', loginAdmin)
//refresh token
router.post('/refresh', refreshToken)
//logout
router.post('/logout', logoutAdmin)

module.exports = router