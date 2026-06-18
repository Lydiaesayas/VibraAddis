import React from 'react'

const PaymentModal = ({ isOpen, onClose, type, message, onAction }) => {
    if (!isOpen) return null

    const isSuccess = type === 'success'

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div className="bg-zinc-900 rounded-2xl p-8 max-w-md w-full border border-zinc-800">
                <div className="text-center">
                    {/* Icon */}
                    <div className={`w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center ${
                        isSuccess ? 'bg-green-500/20' : 'bg-red-500/20'
                    }`}>
                        {isSuccess ? (
                            <svg className="w-10 h-10 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        ) : (
                            <svg className="w-10 h-10 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        )}
                    </div>

                    {/* Title */}
                    <h2 className={`text-2xl font-bold mb-4 ${isSuccess ? 'text-green-400' : 'text-red-400'}`}>
                        {isSuccess ? 'Payment Successful!' : 'Payment Failed'}
                    </h2>

                    {/* Message */}
                    <p className="text-gray-300 mb-6">
                        {message || (isSuccess 
                            ? 'Your payment has been processed successfully. You will receive a confirmation email shortly.'
                            : 'We were unable to process your payment. Please try again or contact support if the issue persists.'
                        )}
                    </p>

                    {/* Actions */}
                    <div className="flex gap-4">
                        <button
                            onClick={onClose}
                            className="flex-1 bg-zinc-800 hover:bg-zinc-700 py-3 rounded-xl transition font-semibold"
                        >
                            Close
                        </button>
                        {!isSuccess && onAction && (
                            <button
                                onClick={onAction}
                                className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 py-3 rounded-xl transition font-semibold"
                            >
                                Try Again
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PaymentModal
