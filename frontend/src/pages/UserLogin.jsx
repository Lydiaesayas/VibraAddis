import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import api from '../services/api'

const UserLogin = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const message = location.state?.message

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [showPassword, setShowPassword] = useState(false)

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            const response = await api.post('/users/login', {
                email: formData.email,
                password: formData.password
            })

            if (response.data.success) {
                // Store tokens
                localStorage.setItem('userToken', response.data.token)
                localStorage.setItem('userRefreshToken', response.data.refreshToken)
                localStorage.setItem('user', JSON.stringify(response.data.user))

                navigate('/')
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-white p-4">
            <form
                onSubmit={handleSubmit}
                className="bg-zinc-900 p-10 rounded-3xl w-full max-w-md border border-zinc-800 shadow-2xl"
            >
                <h1 className="text-4xl font-bold mb-2 text-center">
                    <span className="text-purple-500">VibraAddis</span>
                </h1>
                <p className="text-gray-400 text-center mb-8">Welcome back!</p>

                {message && (
                    <p className="bg-green-950/30 border border-green-800 text-green-300 text-center p-3 rounded-xl mb-4">
                        {message}
                    </p>
                )}

                {error && (
                    <p className="bg-red-950/30 border border-red-800 text-red-300 text-center p-3 rounded-xl mb-4">
                        {error}
                    </p>
                )}

                <input
                    type="email"
                    name="email"
                    placeholder="Email Address"
                    className="w-full bg-zinc-800 p-4 rounded-xl mb-4 outline-none border border-zinc-700 focus:border-purple-500 transition-colors"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />

                <div className="relative mb-6">
                    <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        placeholder="Password"
                        className="w-full bg-zinc-800 p-4 rounded-xl outline-none border border-zinc-700 focus:border-purple-500 transition-colors"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                    <button
                        type="button"
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-purple-400 transition"
                        onClick={() => setShowPassword(!showPassword)}
                        tabIndex={-1}
                    >
                        {showPassword ? (
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                                <line x1="1" y1="1" x2="23" y2="23"></line>
                            </svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                <circle cx="12" cy="12" r="3"></circle>
                            </svg>
                        )}
                    </button>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className={`w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 transition p-4 rounded-xl font-semibold ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                    {loading ? "Logging In..." : "Log In"}
                </button>

                <p className="text-center mt-6 text-gray-400">
                    Don't have an account?{' '}
                    <button
                        type="button"
                        onClick={() => navigate('/register')}
                        className="text-purple-400 hover:text-purple-300 font-semibold"
                    >
                        Sign Up
                    </button>
                </p>

                <div className="mt-6 pt-6 border-t border-zinc-800">
                    <button
                        type="button"
                        onClick={() => navigate('/login')}
                        className="w-full text-gray-400 hover:text-white transition text-sm"
                    >
                        Admin Login
                    </button>
                </div>
            </form>
        </div>
    )
}

export default UserLogin
