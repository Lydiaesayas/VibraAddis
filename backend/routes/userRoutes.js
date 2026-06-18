const express = require('express')
const router = express.Router()
const { protect } = require('../middleware/authMiddleware')
const {
    registerUser,
    loginUser,
    refreshToken,
    getUserProfile,
    updateUserProfile,
    addFavorite,
    removeFavorite,
    logoutUser
} = require('../controllers/userController')

// Public routes
router.post('/register', registerUser)
router.post('/login', loginUser)
router.post('/refresh', refreshToken)
router.post('/logout', logoutUser)

// Protected routes
router.get('/profile', protect, getUserProfile)
router.put('/profile', protect, updateUserProfile)
router.post('/favorites', protect, addFavorite)
router.delete('/favorites/:venueId', protect, removeFavorite)

module.exports = router
