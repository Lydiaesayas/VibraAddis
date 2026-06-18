import React, { useState, useEffect } from 'react'
import api from '../services/api'

const PaymentProcessing = ({ paymentData, onComplete, onCancel }) => {
    const [status, setStatus] = useState('initializing')
    const [progress, setProgress] = useState(0)
    const [error, setError] = useState(null)

    useEffect(() => {
        processPayment()
    }, [paymentData])

    const processPayment = async () => {
        try {
            setStatus('initializing')
            setProgress(10)

            // Initialize payment
            const initResponse = await api.post('/payments/initialize', {
                amount: paymentData.amount,
                paymentMethod: paymentData.method,
                phoneNumber: paymentData.phoneNumber,
                invoiceNumber: paymentData.invoiceNumber,
                description: 'Subscription payment'
            })

            setStatus('processing')
            setProgress(30)

            // Simulate payment processing (in real scenario, user would complete payment on gateway)
            await new Promise(resolve => setTimeout(resolve, 2000))
            setProgress(60)

            // Verify payment
            const verifyResponse = await api.post('/payments/verify', {
                paymentId: initResponse.data.paymentId
            })

            setProgress(90)

            if (verifyResponse.data.success) {
                setStatus('completed')
                setProgress(100)
                setTimeout(() => {
                    onComplete({
                        success: true,
                        paymentId: initResponse.data.paymentId,
                        transactionId: verifyResponse.data.transactionId
                    })
                }, 1000)
            } else {
                throw new Error('Payment verification failed')
            }
        } catch (err) {
            setStatus('failed')
            setError(err.response?.data?.message || 'Payment failed')
            setProgress(0)
        }
    }

    const getStatusMessage = () => {
        switch (status) {
            case 'initializing':
                return 'Initializing payment...'
            case 'processing':
                return 'Processing payment...'
            case 'completed':
                return 'Payment completed successfully!'
            case 'failed':
                return 'Payment failed'
            default:
                return 'Processing...'
        }
    }

    const getStatusColor = () => {
        switch (status) {
            case 'initializing':
                return 'from-blue-500 to-cyan-500'
            case 'processing':
                return 'from-purple-500 to-pink-500'
            case 'completed':
                return 'from-green-500 to-emerald-500'
            case 'failed':
                return 'from-red-500 to-orange-500'
            default:
                return 'from-gray-500 to-gray-600'
        }
    }

    return (
        <div className="bg-zinc-900 rounded-2xl p-8 border border-zinc-800">
            <div className="text-center">
                {/* Progress Animation */}
                <div className="relative w-32 h-32 mx-auto mb-6">
                    <div className={`absolute inset-0 rounded-full bg-gradient-to-br ${getStatusColor()} animate-pulse opacity-20`}></div>
                    <div className={`absolute inset-2 rounded-full bg-gradient-to-br ${getStatusColor()} animate-pulse opacity-40`}></div>
                    <div className={`absolute inset-4 rounded-full bg-gradient-to-br ${getStatusColor()} animate-pulse opacity-60`}></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        {status === 'completed' ? (
                            <svg className="w-16 h-16 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        ) : status === 'failed' ? (
                            <svg className="w-16 h-16 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        ) : (
                            <div className="w-16 h-16 border-4 border-t-purple-500 border-r-purple-500 border-b-purple-500/30 border-l-purple-500/30 rounded-full animate-spin"></div>
                        )}
                    </div>
                </div>

                <h2 className="text-2xl font-bold mb-2">{getStatusMessage()}</h2>
                
                {status === 'processing' && (
                    <p className="text-gray-400 mb-4">
                        Please wait while we process your payment...
                    </p>
                )}

                {status === 'completed' && (
                    <p className="text-green-400 mb-4">
                        Your payment has been successfully processed!
                    </p>
                )}

                {status === 'failed' && (
                    <div className="mb-4">
                        <p className="text-red-400 mb-2">{error}</p>
                        <button
                            onClick={onCancel}
                            className="bg-gray-600 hover:bg-gray-700 px-6 py-2 rounded-xl transition"
                        >
                            Try Again
                        </button>
                    </div>
                )}

                {/* Progress Bar */}
                {status === 'initializing' || status === 'processing' ? (
                    <div className="w-full bg-zinc-800 rounded-full h-2 mb-4">
                        <div
                            className={`bg-gradient-to-r ${getStatusColor()} h-2 rounded-full transition-all duration-500`}
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                ) : null}

                {/* Payment Details */}
                <div className="bg-zinc-800 rounded-xl p-4 mt-6 text-left">
                    <div className="flex justify-between mb-2">
                        <span className="text-gray-400">Payment Method</span>
                        <span className="font-semibold">
                            {paymentData.method === 'telebirr' ? 'Telebirr' : 'CBE Birr'}
                        </span>
                    </div>
                    <div className="flex justify-between mb-2">
                        <span className="text-gray-400">Phone Number</span>
                        <span className="font-semibold">{paymentData.phoneNumber}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-400">Amount</span>
                        <span className="font-semibold text-purple-400">{paymentData.amount} ETB</span>
                    </div>
                </div>

                {/* Security Notice */}
                <div className="mt-6 flex items-center justify-center gap-2 text-gray-500 text-sm">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <span>Secure payment processing</span>
                </div>
            </div>
        </div>
    )
}

export default PaymentProcessing
