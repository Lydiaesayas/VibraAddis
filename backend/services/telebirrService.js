const crypto = require('crypto');

class TelebirrService {
    constructor() {
        this.apiKey = process.env.TELEBIRR_API_KEY;
        this.merchantCode = process.env.TELEBIRR_MERCHANT_CODE;
        this.secretKey = process.env.TELEBIRR_SECRET_KEY;
        this.environment = process.env.TELEBIRR_ENVIRONMENT || 'sandbox';
        
        // API endpoints
        this.sandboxUrl = 'https://sandbox.telebirr.et/api/v1';
        this.productionUrl = 'https://api.telebirr.et/api/v1';
        this.baseUrl = this.environment === 'production' ? this.productionUrl : this.sandboxUrl;
    }

    /**
     * Generate signature for Telebirr API requests
     */
    generateSignature(data) {
        const sortedKeys = Object.keys(data).sort();
        const signatureString = sortedKeys.map(key => `${key}=${data[key]}`).join('&');
        const hmac = crypto.createHmac('sha256', this.secretKey);
        hmac.update(signatureString);
        return hmac.digest('hex');
    }

    /**
     * Initialize payment
     */
    async initializePayment(paymentData) {
        try {
            const {
                amount,
                phoneNumber,
                invoiceNumber,
                description,
                returnUrl,
                notifyUrl
            } = paymentData;

            const timestamp = new Date().getTime();
            const nonce = crypto.randomBytes(16).toString('hex');

            const requestData = {
                apiKey: this.apiKey,
                merchantCode: this.merchantCode,
                amount: amount.toString(),
                phoneNumber,
                invoiceNumber,
                description,
                returnUrl,
                notifyUrl,
                timestamp: timestamp.toString(),
                nonce
            };

            const signature = this.generateSignature(requestData);
            requestData.signature = signature;

            const response = await fetch(`${this.baseUrl}/payment/initialize`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(requestData)
            });

            const result = await response.json();

            if (result.success) {
                return {
                    success: true,
                    paymentId: result.paymentId,
                    paymentUrl: result.paymentUrl,
                    expiresAt: result.expiresAt
                };
            } else {
                throw new Error(result.message || 'Payment initialization failed');
            }
        } catch (error) {
            console.error('Telebirr payment initialization error:', error);
            throw error;
        }
    }

    /**
     * Verify payment status
     */
    async verifyPayment(paymentId) {
        try {
            const timestamp = new Date().getTime();
            const nonce = crypto.randomBytes(16).toString('hex');

            const requestData = {
                apiKey: this.apiKey,
                merchantCode: this.merchantCode,
                paymentId,
                timestamp: timestamp.toString(),
                nonce
            };

            const signature = this.generateSignature(requestData);
            requestData.signature = signature;

            const response = await fetch(`${this.baseUrl}/payment/verify`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(requestData)
            });

            const result = await response.json();

            if (result.success) {
                return {
                    success: true,
                    status: result.status, // 'completed', 'pending', 'failed', 'cancelled'
                    amount: result.amount,
                    transactionId: result.transactionId,
                    paidAt: result.paidAt
                };
            } else {
                throw new Error(result.message || 'Payment verification failed');
            }
        } catch (error) {
            console.error('Telebirr payment verification error:', error);
            throw error;
        }
    }

    /**
     * Refund payment
     */
    async refundPayment(paymentId, amount, reason) {
        try {
            const timestamp = new Date().getTime();
            const nonce = crypto.randomBytes(16).toString('hex');

            const requestData = {
                apiKey: this.apiKey,
                merchantCode: this.merchantCode,
                paymentId,
                amount: amount.toString(),
                reason,
                timestamp: timestamp.toString(),
                nonce
            };

            const signature = this.generateSignature(requestData);
            requestData.signature = signature;

            const response = await fetch(`${this.baseUrl}/payment/refund`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(requestData)
            });

            const result = await response.json();

            if (result.success) {
                return {
                    success: true,
                    refundId: result.refundId,
                    status: result.status
                };
            } else {
                throw new Error(result.message || 'Refund failed');
            }
        } catch (error) {
            console.error('Telebirr refund error:', error);
            throw error;
        }
    }

    /**
     * Check if service is configured
     */
    isConfigured() {
        return this.apiKey && this.merchantCode && this.secretKey;
    }
}

module.exports = new TelebirrService();
