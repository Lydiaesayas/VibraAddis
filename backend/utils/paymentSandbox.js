/**
 * Payment Sandbox Testing Utilities
 * This file provides utilities for testing payment gateway integrations in sandbox mode
 */

const telebirrService = require('../services/telebirrService');
const cbeBirrService = require('../services/cbeBirrService');

class PaymentSandbox {
    /**
     * Test Telebirr payment flow
     */
    static async testTelebirrPayment(testData) {
        console.log('🧪 Testing Telebirr Payment Flow...');
        
        try {
            // Check if Telebirr is configured
            if (!telebirrService.isConfigured()) {
                console.log('⚠️  Telebirr not configured. Using mock mode.');
                return this.mockPaymentResponse('telebirr', testData);
            }

            // Initialize payment
            const initResult = await telebirrService.initializePayment({
                amount: testData.amount || 100,
                phoneNumber: testData.phoneNumber || '+251911234567',
                invoiceNumber: testData.invoiceNumber || 'TEST-' + Date.now(),
                description: testData.description || 'Test payment',
                returnUrl: 'http://localhost:3000/payment/return',
                notifyUrl: 'http://localhost:5000/api/payments/notify'
            });

            console.log('✅ Payment initialized:', initResult);

            // Simulate payment verification (in real scenario, user would complete payment first)
            console.log('⏳ Waiting for payment completion...');
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Verify payment
            const verifyResult = await telebirrService.verifyPayment(initResult.paymentId);
            console.log('✅ Payment verified:', verifyResult);

            return {
                success: true,
                service: 'telebirr',
                initialization: initResult,
                verification: verifyResult
            };

        } catch (error) {
            console.error('❌ Telebirr test failed:', error);
            return {
                success: false,
                service: 'telebirr',
                error: error.message
            };
        }
    }

    /**
     * Test CBE Birr payment flow
     */
    static async testCBEBirrPayment(testData) {
        console.log('🧪 Testing CBE Birr Payment Flow...');
        
        try {
            // Check if CBE Birr is configured
            if (!cbeBirrService.isConfigured()) {
                console.log('⚠️  CBE Birr not configured. Using mock mode.');
                return this.mockPaymentResponse('cbe_birr', testData);
            }

            // Initialize payment
            const initResult = await cbeBirrService.initializePayment({
                amount: testData.amount || 100,
                phoneNumber: testData.phoneNumber || '+251911234567',
                invoiceNumber: testData.invoiceNumber || 'TEST-' + Date.now(),
                description: testData.description || 'Test payment',
                returnUrl: 'http://localhost:3000/payment/return',
                notifyUrl: 'http://localhost:5000/api/payments/notify'
            });

            console.log('✅ Payment initialized:', initResult);

            // Simulate payment verification
            console.log('⏳ Waiting for payment completion...');
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Verify payment
            const verifyResult = await cbeBirrService.verifyPayment(initResult.paymentId);
            console.log('✅ Payment verified:', verifyResult);

            return {
                success: true,
                service: 'cbe_birr',
                initialization: initResult,
                verification: verifyResult
            };

        } catch (error) {
            console.error('❌ CBE Birr test failed:', error);
            return {
                success: false,
                service: 'cbe_birr',
                error: error.message
            };
        }
    }

    /**
     * Mock payment response for testing without real payment gateway
     */
    static mockPaymentResponse(service, testData) {
        const mockPaymentId = 'MOCK-' + service.toUpperCase() + '-' + Date.now();
        
        return {
            success: true,
            service: service,
            mode: 'mock',
            initialization: {
                paymentId: mockPaymentId,
                paymentUrl: `https://mock-payment-gateway.com/pay/${mockPaymentId}`,
                expiresAt: new Date(Date.now() + 15 * 60 * 1000).toISOString()
            },
            verification: {
                status: 'completed',
                amount: testData.amount || 100,
                transactionId: 'TXN-' + Date.now(),
                paidAt: new Date().toISOString()
            },
            note: 'This is a mock response. Configure real payment gateway credentials for actual payments.'
        };
    }

    /**
     * Test refund flow
     */
    static async testRefund(service, paymentId, amount) {
        console.log(`🧪 Testing ${service} Refund Flow...`);
        
        try {
            let result;
            
            if (service === 'telebirr') {
                if (!telebirrService.isConfigured()) {
                    return this.mockRefundResponse(service, paymentId, amount);
                }
                result = await telebirrService.refundPayment(paymentId, amount, 'Test refund');
            } else if (service === 'cbe_birr') {
                if (!cbeBirrService.isConfigured()) {
                    return this.mockRefundResponse(service, paymentId, amount);
                }
                result = await cbeBirrService.refundPayment(paymentId, amount, 'Test refund');
            }

            console.log('✅ Refund processed:', result);
            return result;

        } catch (error) {
            console.error('❌ Refund test failed:', error);
            return {
                success: false,
                service: service,
                error: error.message
            };
        }
    }

    /**
     * Mock refund response
     */
    static mockRefundResponse(service, paymentId, amount) {
        return {
            success: true,
            service: service,
            mode: 'mock',
            refundId: 'REF-' + service.toUpperCase() + '-' + Date.now(),
            status: 'processed',
            note: 'This is a mock response. Configure real payment gateway credentials for actual refunds.'
        };
    }

    /**
     * Run comprehensive payment tests
     */
    static async runAllTests() {
        console.log('🚀 Running Comprehensive Payment Tests...\n');

        const testData = {
            amount: 100,
            phoneNumber: '+251911234567',
            invoiceNumber: 'TEST-' + Date.now(),
            description: 'Comprehensive test payment'
        };

        const results = {
            telebirr: await this.testTelebirrPayment(testData),
            cbe_birr: await this.testCBEBirrPayment(testData)
        };

        console.log('\n📊 Test Results Summary:');
        console.log('========================');
        console.log('Telebirr:', results.telebirr.success ? '✅ PASSED' : '❌ FAILED');
        console.log('CBE Birr:', results.cbe_birr.success ? '✅ PASSED' : '❌ FAILED');
        console.log('========================\n');

        return results;
    }
}

// CLI interface for running tests
if (require.main === module) {
    const args = process.argv.slice(2);
    const command = args[0];

    if (command === 'test-all') {
        PaymentSandbox.runAllTests();
    } else if (command === 'test-telebirr') {
        PaymentSandbox.testTelebirrPayment({});
    } else if (command === 'test-cbe') {
        PaymentSandbox.testCBEBirrPayment({});
    } else {
        console.log('Usage:');
        console.log('  node utils/paymentSandbox.js test-all      # Run all tests');
        console.log('  node utils/paymentSandbox.js test-telebirr  # Test Telebirr only');
        console.log('  node utils/paymentSandbox.js test-cbe       # Test CBE Birr only');
    }
}

module.exports = PaymentSandbox;
