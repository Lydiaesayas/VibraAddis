import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'

const UserProfile = () => {
    const navigate = useNavigate()
    const [user, setUser] = useState(null)
    const [favorites, setFavorites] = useState([])
    const [loading, setLoading] = useState(true)
    const [editing, setEditing] = useState(false)
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: ''
    })

    useEffect(() => {
        fetchUserProfile()
        fetchFavorites()
    }, [])

    const fetchUserProfile = async () => {
        try {
            const response = await api.get('/users/profile')
            setUser(response.data)
            setFormData({
                name: response.data.name,
                email: response.data.email,
                phone: response.data.phone
            })
        } catch (error) {
            console.error('Error fetching profile:', error)
            if (error.response?.status === 401) {
                navigate('/user-login')
            }
        }
    }

    const fetchFavorites = async () => {
        try {
            const response = await api.get('/users/favorites')
            setFavorites(response.data)
        } catch (error) {
            console.error('Error fetching favorites:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleUpdateProfile = async (e) => {
        e.preventDefault()
        try {
            await api.put('/users/profile', formData)
            setUser({ ...user, ...formData })
            setEditing(false)
        } catch (error) {
            console.error('Error updating profile:', error)
        }
    }

    const handleRemoveFavorite = async (venueId) => {
        try {
            await api.delete(`/users/favorites/${venueId}`)
            setFavorites(favorites.filter(fav => fav._id !== venueId))
        } catch (error) {
            console.error('Error removing favorite:', error)
        }
    }

    const handleLogout = async () => {
        try {
            await api.post('/users/logout')
            localStorage.removeItem('userToken')
            localStorage.removeItem('userRefreshToken')
            localStorage.removeItem('user')
            navigate('/')
        } catch (error) {
            console.error('Error logging out:', error)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center">
                <p className="text-xl">Loading profile...</p>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-zinc-950 text-white p-8">
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-4xl font-bold">
                        My <span className="text-purple-500">Profile</span>
                    </h1>
                    <button
                        onClick={handleLogout}
                        className="bg-red-600 hover:bg-red-700 px-6 py-2 rounded-xl transition"
                    >
                        Logout
                    </button>
                </div>

                {/* Profile Information */}
                <div className="bg-zinc-900 rounded-2xl p-8 mb-8 border border-zinc-800">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-semibold">Personal Information</h2>
                        {!editing ? (
                            <button
                                onClick={() => setEditing(true)}
                                className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-xl transition"
                            >
                                Edit Profile
                            </button>
                        ) : (
                            <button
                                onClick={() => setEditing(false)}
                                className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-xl transition"
                            >
                                Cancel
                            </button>
                        )}
                    </div>

                    {editing ? (
                        <form onSubmit={handleUpdateProfile}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-gray-400 mb-2">Full Name</label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full bg-zinc-800 p-3 rounded-xl border border-zinc-700 focus:border-purple-500 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-400 mb-2">Email</label>
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full bg-zinc-800 p-3 rounded-xl border border-zinc-700 focus:border-purple-500 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-400 mb-2">Phone</label>
                                    <input
                                        type="tel"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        className="w-full bg-zinc-800 p-3 rounded-xl border border-zinc-700 focus:border-purple-500 outline-none"
                                    />
                                </div>
                            </div>
                            <button
                                type="submit"
                                className="mt-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 px-6 py-3 rounded-xl transition font-semibold"
                            >
                                Save Changes
                            </button>
                        </form>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <p className="text-gray-400 mb-1">Full Name</p>
                                <p className="text-xl font-semibold">{user?.name}</p>
                            </div>
                            <div>
                                <p className="text-gray-400 mb-1">Email</p>
                                <p className="text-xl font-semibold">{user?.email}</p>
                            </div>
                            <div>
                                <p className="text-gray-400 mb-1">Phone</p>
                                <p className="text-xl font-semibold">{user?.phone}</p>
                            </div>
                            <div>
                                <p className="text-gray-400 mb-1">Member Since</p>
                                <p className="text-xl font-semibold">
                                    {new Date(user?.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Favorites */}
                <div className="bg-zinc-900 rounded-2xl p-8 border border-zinc-800">
                    <h2 className="text-2xl font-semibold mb-6">Favorite Venues</h2>
                    
                    {favorites.length === 0 ? (
                        <p className="text-gray-400 text-center py-8">
                            No favorite venues yet. Start exploring and save your favorites!
                        </p>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {favorites.map((venue) => (
                                <div key={venue._id} className="bg-zinc-800 rounded-xl overflow-hidden border border-zinc-700">
                                    <img
                                        src={venue.image}
                                        alt={venue.name}
                                        className="w-full h-48 object-cover"
                                    />
                                    <div className="p-4">
                                        <h3 className="text-xl font-semibold mb-2">{venue.name}</h3>
                                        <p className="text-gray-400 mb-2">{venue.category}</p>
                                        <p className="text-gray-400 mb-4">{venue.location}</p>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => navigate(`/venue/${venue._id}`)}
                                                className="flex-1 bg-purple-600 hover:bg-purple-700 py-2 rounded-xl transition"
                                            >
                                                View Details
                                            </button>
                                            <button
                                                onClick={() => handleRemoveFavorite(venue._id)}
                                                className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-xl transition"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default UserProfile
