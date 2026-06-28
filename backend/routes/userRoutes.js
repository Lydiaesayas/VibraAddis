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
    logoutUser,
    getAllUsers
} = require('../controllers/userController')

const { adminOnly } = require('../middleware/authMiddleware')

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

// Admin routes
router.get('/admin/all', protect, adminOnly, getAllUsers)

module.exports = router
