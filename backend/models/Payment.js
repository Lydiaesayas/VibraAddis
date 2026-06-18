const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema(
    {
        subscriptionId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'ListingSubscription',
            required: true
        },
        venueId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Venue'
        },
        amount: {
            type: Number,
            required: true
        },
        currency: {
            type: String,
            default: 'ETB'
        },
        paymentMethod: {
            type: String,
            enum: ['telebirr', 'cbe_birr', 'cash', 'bank_transfer'],
            required: true
        },
        paymentStatus: {
            type: String,
            enum: ['pending', 'processing', 'completed', 'failed', 'refunded'],
            default: 'pending'
        },
        transactionId: {
            type: String,
            unique: true,
            sparse: true
        },
        paymentGatewayResponse: {
            type: Object
        },
        paidAt: {
            type: Date
        },
        invoiceNumber: {
            type: String,
            unique: true
        },
        notes: {
            type: String
        }
    },
    { timestamps: true }
);

// Generate invoice number before saving
paymentSchema.pre('save', async function(next) {
    if (!this.invoiceNumber) {
        const count = await mongoose.model('Payment').countDocuments();
        this.invoiceNumber = `INV-${String(count + 1).padStart(6, '0')}`;
    }
    next();
});

module.exports = mongoose.model('Payment', paymentSchema);
