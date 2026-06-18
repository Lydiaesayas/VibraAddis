import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'

const Invoices = () => {
    const navigate = useNavigate()
    const [invoices, setInvoices] = useState([])
    const [payments, setPayments] = useState([])
    const [loading, setLoading] = useState(true)
    const [activeTab, setActiveTab] = useState('invoices')

    useEffect(() => {
        fetchInvoices()
        fetchPayments()
    }, [])

    const fetchInvoices = async () => {
        try {
            const response = await api.get('/invoices')
            setInvoices(response.data)
        } catch (error) {
            console.error('Error fetching invoices:', error)
        }
    }

    const fetchPayments = async () => {
        try {
            const response = await api.get('/payments')
            setPayments(response.data)
        } catch (error) {
            console.error('Error fetching payments:', error)
        } finally {
            setLoading(false)
        }
    }

    const getStatusColor = (status) => {
        switch (status) {
            case 'paid':
                return 'bg-green-500/20 text-green-400 border-green-500/30'
            case 'pending':
                return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
            case 'overdue':
                return 'bg-red-500/20 text-red-400 border-red-500/30'
            case 'sent':
                return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
            default:
                return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
        }
    }

    const getPaymentStatusColor = (status) => {
        switch (status) {
            case 'completed':
                return 'bg-green-500/20 text-green-400 border-green-500/30'
            case 'pending':
                return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
            case 'failed':
                return 'bg-red-500/20 text-red-400 border-red-500/30'
            case 'refunded':
                return 'bg-purple-500/20 text-purple-400 border-purple-500/30'
            default:
                return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center">
                <p className="text-xl">Loading invoices...</p>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-zinc-950 text-white p-8">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-4xl font-bold mb-8">
                    Billing & <span className="text-purple-500">Payments</span>
                </h1>

                {/* Tabs */}
                <div className="flex gap-4 mb-8">
                    <button
                        onClick={() => setActiveTab('invoices')}
                        className={`px-6 py-3 rounded-xl transition ${
                            activeTab === 'invoices'
                                ? 'bg-purple-600 text-white'
                                : 'bg-zinc-800 text-gray-400 hover:bg-zinc-700'
                        }`}
                    >
                        Invoices
                    </button>
                    <button
                        onClick={() => setActiveTab('payments')}
                        className={`px-6 py-3 rounded-xl transition ${
                            activeTab === 'payments'
                                ? 'bg-purple-600 text-white'
                                : 'bg-zinc-800 text-gray-400 hover:bg-zinc-700'
                        }`}
                    >
                        Payment History
                    </button>
                </div>

                {/* Invoices Tab */}
                {activeTab === 'invoices' && (
                    <div className="bg-zinc-900 rounded-2xl p-6 border border-zinc-800">
                        <h2 className="text-2xl font-semibold mb-6">Invoices</h2>
                        
                        {invoices.length === 0 ? (
                            <p className="text-gray-400 text-center py-8">
                                No invoices found
                            </p>
                        ) : (
                            <div className="space-y-4">
                                {invoices.map((invoice) => (
                                    <div
                                        key={invoice._id}
                                        className="bg-zinc-800 rounded-xl p-6 border border-zinc-700"
                                    >
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <h3 className="text-xl font-semibold mb-1">
                                                    {invoice.invoiceNumber}
                                                </h3>
                                                <p className="text-gray-400">{invoice.planName}</p>
                                            </div>
                                            <span className={`px-3 py-1 rounded-full text-sm border ${getStatusColor(invoice.status)}`}>
                                                {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                                            </span>
                                        </div>

                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                                            <div>
                                                <p className="text-gray-400 text-sm">Amount</p>
                                                <p className="text-lg font-semibold text-purple-400">
                                                    {invoice.amount} {invoice.currency}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-gray-400 text-sm">Due Date</p>
                                                <p className="text-lg font-semibold">
                                                    {new Date(invoice.dueDate).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-gray-400 text-sm">Issued Date</p>
                                                <p className="text-lg font-semibold">
                                                    {new Date(invoice.issuedDate).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-gray-400 text-sm">Reminders</p>
                                                <p className="text-lg font-semibold">
                                                    {invoice.reminderCount}
                                                </p>
                                            </div>
                                        </div>

                                        {invoice.status === 'pending' || invoice.status === 'sent' || invoice.status === 'overdue' ? (
                                            <button
                                                onClick={() => navigate(`/payment/${invoice._id}`)}
                                                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 px-6 py-2 rounded-xl transition font-semibold"
                                            >
                                                Pay Now
                                            </button>
                                        ) : null}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Payments Tab */}
                {activeTab === 'payments' && (
                    <div className="bg-zinc-900 rounded-2xl p-6 border border-zinc-800">
                        <h2 className="text-2xl font-semibold mb-6">Payment History</h2>
                        
                        {payments.length === 0 ? (
                            <p className="text-gray-400 text-center py-8">
                                No payment history found
                            </p>
                        ) : (
                            <div className="space-y-4">
                                {payments.map((payment) => (
                                    <div
                                        key={payment._id}
                                        className="bg-zinc-800 rounded-xl p-6 border border-zinc-700"
                                    >
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <h3 className="text-xl font-semibold mb-1">
                                                    {payment.transactionId}
                                                </h3>
                                                <p className="text-gray-400">{payment.paymentMethod}</p>
                                            </div>
                                            <span className={`px-3 py-1 rounded-full text-sm border ${getPaymentStatusColor(payment.paymentStatus)}`}>
                                                {payment.paymentStatus.charAt(0).toUpperCase() + payment.paymentStatus.slice(1)}
                                            </span>
                                        </div>

                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                            <div>
                                                <p className="text-gray-400 text-sm">Amount</p>
                                                <p className="text-lg font-semibold text-purple-400">
                                                    {payment.amount} {payment.currency}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-gray-400 text-sm">Date</p>
                                                <p className="text-lg font-semibold">
                                                    {new Date(payment.paidAt || payment.createdAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-gray-400 text-sm">Invoice</p>
                                                <p className="text-lg font-semibold">
                                                    {payment.invoiceNumber}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-gray-400 text-sm">Gateway</p>
                                                <p className="text-lg font-semibold">
                                                    {payment.gateway}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}

export default Invoices
