import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PaymentMethodSelector from '../components/PaymentMethodSelector'
import PaymentProcessing from '../components/PaymentProcessing'

const SubscriptionPlans = () => {
    const navigate = useNavigate()
    const [selectedPlan, setSelectedPlan] = useState(null)
    const [showPayment, setShowPayment] = useState(false)
    const [paymentData, setPaymentData] = useState(null)
    const [paymentStatus, setPaymentStatus] = useState(null)

    const plans = [
        {
            id: 'spotlight',
            name: 'Spotlight',
            price: 15000,
            duration: '1 month',
            features: [
                'Featured listing on homepage',
                'Priority search ranking',
                'Unlimited photo uploads',
                'Basic analytics',
                'Email support'
            ],
            popular: true
        },
        {
            id: 'campaign',
            name: 'Campaign',
            price: 40000,
            duration: '3 months',
            features: [
                'All Spotlight features',
                'Social media promotion',
                'Advanced analytics',
                'Custom branding',
                'Priority support',
                'Video uploads'
            ],
            popular: false
        },
        {
            id: 'celebrity',
            name: 'Celebrity',
            price: 80000,
            duration: '6 months',
            features: [
                'All Campaign features',
                'Exclusive VIP events',
                'Premium analytics dashboard',
                'Dedicated account manager',
                '24/7 priority support',
                'Custom integrations'
            ],
            popular: false
        },
        {
            id: 'signature',
            name: 'Signature',
            price: 150000,
            duration: '12 months',
            features: [
                'All Celebrity features',
                'National promotion',
                'White-label solution',
                'API access',
                'Custom development',
                'Unlimited everything'
            ],
            popular: false
        }
    ]

    const handleSelectPlan = (plan) => {
        setSelectedPlan(plan)
        setShowPayment(true)
    }

    const handlePaymentMethodSelect = (data) => {
        setPaymentData(data)
        setPaymentStatus('processing')
    }

    const handlePaymentComplete = (result) => {
        setPaymentStatus('completed')
        setTimeout(() => {
            navigate('/profile', { 
                state: { 
                    message: 'Subscription activated successfully!' 
                }
            })
        }, 2000)
    }

    const handlePaymentCancel = () => {
        setPaymentStatus(null)
        setShowPayment(false)
        setPaymentData(null)
    }

    if (paymentStatus === 'processing' || paymentStatus === 'completed') {
        return (
            <div className="min-h-screen bg-zinc-950 text-white p-8">
                <div className="max-w-2xl mx-auto">
                    <PaymentProcessing
                        paymentData={paymentData}
                        onComplete={handlePaymentComplete}
                        onCancel={handlePaymentCancel}
                    />
                </div>
            </div>
        )
    }

    if (showPayment && selectedPlan) {
        return (
            <div className="min-h-screen bg-zinc-950 text-white p-8">
                <div className="max-w-2xl mx-auto">
                    <button
                        onClick={() => setShowPayment(false)}
                        className="mb-6 text-gray-400 hover:text-white transition"
                    >
                        ← Back to Plans
                    </button>
                    <PaymentMethodSelector
                        amount={selectedPlan.price}
                        invoiceNumber={`SUB-${selectedPlan.id.toUpperCase()}-${Date.now()}`}
                        onSelect={handlePaymentMethodSelect}
                    />
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-zinc-950 text-white p-8">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-5xl font-bold mb-4">
                        Choose Your <span className="text-purple-500">Plan</span>
                    </h1>
                    <p className="text-gray-400 text-xl max-w-2xl mx-auto">
                        Select the perfect subscription plan to showcase your venue to thousands of potential customers
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {plans.map((plan) => (
                        <div
                            key={plan.id}
                            className={`relative bg-zinc-900 rounded-2xl p-6 border-2 transition-all ${
                                plan.popular
                                    ? 'border-purple-500 shadow-2xl shadow-purple-500/20'
                                    : 'border-zinc-800 hover:border-purple-500/50'
                            }`}
                        >
                            {plan.popular && (
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-600 to-pink-600 px-4 py-1 rounded-full text-sm font-semibold">
                                    Most Popular
                                </div>
                            )}

                            <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                            <p className="text-gray-400 mb-4">{plan.duration}</p>
                            
                            <div className="mb-6">
                                <span className="text-4xl font-bold text-purple-400">
                                    {plan.price.toLocaleString()}
                                </span>
                                <span className="text-gray-400"> ETB</span>
                            </div>

                            <ul className="space-y-3 mb-6">
                                {plan.features.map((feature, index) => (
                                    <li key={index} className="flex items-start gap-2 text-sm">
                                        <svg className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span className="text-gray-300">{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            <button
                                onClick={() => handleSelectPlan(plan)}
                                className={`w-full py-3 rounded-xl font-semibold transition ${
                                    plan.popular
                                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500'
                                        : 'bg-zinc-800 hover:bg-zinc-700 border border-zinc-700'
                                }`}
                            >
                                Select Plan
                            </button>
                        </div>
                    ))}
                </div>

                <div className="mt-12 text-center">
                    <p className="text-gray-400 mb-4">
                        Need a custom solution? Contact us for enterprise pricing
                    </p>
                    <button
                        onClick={() => navigate('/contact')}
                        className="text-purple-400 hover:text-purple-300 font-semibold"
                    >
                        Contact Sales →
                    </button>
                </div>
            </div>
        </div>
    )
}

export default SubscriptionPlans
