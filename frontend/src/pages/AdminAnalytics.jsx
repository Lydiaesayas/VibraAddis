import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'

const AdminAnalytics = () => {
    const navigate = useNavigate()
    const [stats, setStats] = useState(null)
    const [revenueData, setRevenueData] = useState([])
    const [subscriptionTrends, setSubscriptionTrends] = useState([])
    const [venuePerformance, setVenuePerformance] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchAnalytics()
    }, [])

    const fetchAnalytics = async () => {
        try {
            const [statsRes, revenueRes, trendsRes, performanceRes] = await Promise.all([
                api.get('/analytics/dashboard'),
                api.get('/analytics/revenue/monthly'),
                api.get('/analytics/subscriptions/trends'),
                api.get('/analytics/venues/performance')
            ])

            setStats(statsRes.data)
            setRevenueData(revenueRes.data)
            setSubscriptionTrends(trendsRes.data)
            setVenuePerformance(performanceRes.data)
        } catch (error) {
            console.error('Error fetching analytics:', error)
            if (error.response?.status === 401) {
                navigate('/login')
            }
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center">
                <p className="text-xl">Loading analytics...</p>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-zinc-950 text-white p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-4xl font-bold">
                        Analytics <span className="text-purple-500">Dashboard</span>
                    </h1>
                    <button
                        onClick={() => navigate('/admin')}
                        className="bg-gray-700 hover:bg-gray-600 px-6 py-2 rounded-xl transition"
                    >
                        Back to Admin
                    </button>
                </div>

                {/* Overview Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-zinc-900 rounded-2xl p-6 border border-zinc-800">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-gray-400">Total Revenue</h3>
                            <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
                                <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                        </div>
                        <p className="text-3xl font-bold text-green-400">
                            {stats?.payments?.totalRevenue?.toLocaleString()} ETB
                        </p>
                        <p className="text-gray-400 text-sm mt-2">
                            {stats?.payments?.completed} completed payments
                        </p>
                    </div>

                    <div className="bg-zinc-900 rounded-2xl p-6 border border-zinc-800">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-gray-400">Active Venues</h3>
                            <div className="w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center">
                                <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                </svg>
                            </div>
                        </div>
                        <p className="text-3xl font-bold text-purple-400">
                            {stats?.venues?.active}
                        </p>
                        <p className="text-gray-400 text-sm mt-2">
                            {stats?.venues?.pending} pending approval
                        </p>
                    </div>

                    <div className="bg-zinc-900 rounded-2xl p-6 border border-zinc-800">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-gray-400">Active Subscriptions</h3>
                            <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center">
                                <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                                </svg>
                            </div>
                        </div>
                        <p className="text-3xl font-bold text-blue-400">
                            {stats?.subscriptions?.active}
                        </p>
                        <p className="text-gray-400 text-sm mt-2">
                            {stats?.subscriptions?.pending} pending
                        </p>
                    </div>

                    <div className="bg-zinc-900 rounded-2xl p-6 border border-zinc-800">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-gray-400">Total Users</h3>
                            <div className="w-10 h-10 bg-pink-500/20 rounded-full flex items-center justify-center">
                                <svg className="w-5 h-5 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                            </div>
                        </div>
                        <p className="text-3xl font-bold text-pink-400">
                            {stats?.users?.total}
                        </p>
                        <p className="text-gray-400 text-sm mt-2">
                            Registered users
                        </p>
                    </div>
                </div>

                {/* Revenue Chart */}
                <div className="bg-zinc-900 rounded-2xl p-6 border border-zinc-800 mb-8">
                    <h2 className="text-2xl font-semibold mb-6">Monthly Revenue</h2>
                    <div className="h-64 flex items-end gap-4">
                        {revenueData.slice(0, 12).map((month, index) => (
                            <div key={index} className="flex-1 flex flex-col items-center">
                                <div
                                    className="w-full bg-gradient-to-t from-purple-600 to-pink-600 rounded-t-lg transition-all hover:from-purple-500 hover:to-pink-500"
                                    style={{
                                        height: `${Math.max(10, (month.total / Math.max(...revenueData.map(m => m.total))) * 100)}%`
                                    }}
                                ></div>
                                <p className="text-xs text-gray-400 mt-2">
                                    {new Date(month._id.year, month._id.month - 1).toLocaleDateString('en-US', { month: 'short' })}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Venue Performance */}
                <div className="bg-zinc-900 rounded-2xl p-6 border border-zinc-800 mb-8">
                    <h2 className="text-2xl font-semibold mb-6">Top Performing Venues</h2>
                    <div className="space-y-4">
                        {venuePerformance.slice(0, 5).map((venue, index) => (
                            <div key={venue._id} className="flex items-center gap-4 bg-zinc-800 rounded-xl p-4">
                                <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center text-purple-400 font-bold">
                                    {index + 1}
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-semibold">{venue.name}</h3>
                                    <p className="text-gray-400 text-sm">{venue.category}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-2xl font-bold text-yellow-400">{venue.rating.toFixed(1)}</p>
                                    <p className="text-gray-400 text-sm">{venue.reviewCount} reviews</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Subscription Trends */}
                <div className="bg-zinc-900 rounded-2xl p-6 border border-zinc-800">
                    <h2 className="text-2xl font-semibold mb-6">Subscription Trends</h2>
                    <div className="space-y-4">
                        {subscriptionTrends.slice(0, 6).map((trend, index) => (
                            <div key={index} className="flex items-center gap-4">
                                <div className="flex-1">
                                    <p className="text-gray-400">
                                        {new Date(trend._id.year, trend._id.month - 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                                    </p>
                                </div>
                                <div className="flex gap-8">
                                    <div className="text-center">
                                        <p className="text-2xl font-bold text-green-400">{trend.active}</p>
                                        <p className="text-gray-400 text-sm">Active</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-2xl font-bold text-yellow-400">{trend.pending}</p>
                                        <p className="text-gray-400 text-sm">Pending</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-2xl font-bold text-purple-400">{trend.total}</p>
                                        <p className="text-gray-400 text-sm">Total</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AdminAnalytics
