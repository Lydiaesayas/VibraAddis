import React, { useState } from 'react'

const PaymentMethodSelector = ({ onSelect, amount, invoiceNumber }) => {
    const [selectedMethod, setSelectedMethod] = useState(null)
    const [phoneNumber, setPhoneNumber] = useState('')

    const paymentMethods = [
        {
            id: 'telebirr',
            name: 'Telebirr',
            description: 'Pay using Telebirr mobile money',
            icon: (
                <svg className="w-12 h-12" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                </svg>
            ),
            color: 'from-orange-500 to-red-500'
        },
        {
            id: 'cbe_birr',
            name: 'CBE Birr',
            description: 'Pay using Commercial Bank of Ethiopia Birr',
            icon: (
                <svg className="w-12 h-12" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                </svg>
            ),
            color: 'from-green-500 to-teal-500'
        }
    ]

    const handleSelect = (method) => {
        setSelectedMethod(method)
    }

    const handleContinue = () => {
        if (selectedMethod && phoneNumber) {
            onSelect({
                method: selectedMethod,
                phoneNumber,
                amount,
                invoiceNumber
            })
        }
    }

    return (
        <div className="bg-zinc-900 rounded-2xl p-8 border border-zinc-800">
            <h2 className="text-2xl font-bold mb-2">Select Payment Method</h2>
            <p className="text-gray-400 mb-6">Choose your preferred payment method to complete the transaction</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {paymentMethods.map((method) => (
                    <div
                        key={method.id}
                        onClick={() => handleSelect(method.id)}
                        className={`p-6 rounded-xl border-2 cursor-pointer transition-all ${
                            selectedMethod === method.id
                                ? 'border-purple-500 bg-purple-500/10'
                                : 'border-zinc-700 hover:border-purple-500/50'
                        }`}
                    >
                        <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${method.color} flex items-center justify-center mb-4 text-white`}>
                            {method.icon}
                        </div>
                        <h3 className="text-xl font-semibold mb-2">{method.name}</h3>
                        <p className="text-gray-400 text-sm">{method.description}</p>
                    </div>
                ))}
            </div>

            {selectedMethod && (
                <div className="mb-6">
                    <label className="block text-gray-400 mb-2">Phone Number</label>
                    <input
                        type="tel"
                        placeholder="+251 911 234 567"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className="w-full bg-zinc-800 p-4 rounded-xl border border-zinc-700 focus:border-purple-500 outline-none transition-colors"
                    />
                    <p className="text-gray-500 text-sm mt-2">
                        Enter your phone number registered with {selectedMethod === 'telebirr' ? 'Telebirr' : 'CBE Birr'}
                    </p>
                </div>
            )}

            <div className="bg-zinc-800 rounded-xl p-4 mb-6">
                <div className="flex justify-between items-center">
                    <span className="text-gray-400">Amount to Pay</span>
                    <span className="text-2xl font-bold text-purple-400">
                        {amount} ETB
                    </span>
                </div>
            </div>

            <button
                onClick={handleContinue}
                disabled={!selectedMethod || !phoneNumber}
                className={`w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 transition p-4 rounded-xl font-semibold ${
                    !selectedMethod || !phoneNumber ? 'opacity-50 cursor-not-allowed' : ''
                }`}
            >
                Continue to Payment
            </button>
        </div>
    )
}

export default PaymentMethodSelector
