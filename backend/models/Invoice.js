const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema(
    {
        invoiceNumber: {
            type: String,
            required: true,
            unique: true
        },
        subscriptionId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'ListingSubscription',
            required: true
        },
        venueId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Venue'
        },
        venueName: {
            type: String,
            required: true
        },
        contactName: {
            type: String,
            required: true
        },
        contactEmail: {
            type: String,
            required: true
        },
        contactPhone: {
            type: String
        },
        planId: {
            type: String,
            required: true
        },
        planName: {
            type: String,
            required: true
        },
        amount: {
            type: Number,
            required: true
        },
        currency: {
            type: String,
            default: 'ETB'
        },
        status: {
            type: String,
            enum: ['draft', 'sent', 'paid', 'overdue', 'cancelled'],
            default: 'draft'
        },
        issueDate: {
            type: Date,
            default: Date.now
        },
        dueDate: {
            type: Date,
            required: true
        },
        paidDate: {
            type: Date
        },
        paymentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Payment'
        },
        items: [{
            description: String,
            quantity: { type: Number, default: 1 },
            unitPrice: Number,
            total: Number
        }],
        subtotal: {
            type: Number,
            required: true
        },
        tax: {
            type: Number,
            default: 0
        },
        taxRate: {
            type: Number,
            default: 0
        },
        total: {
            type: Number,
            required: true
        },
        notes: {
            type: String
        },
        reminderSent: {
            type: Boolean,
            default: false
        },
        reminderCount: {
            type: Number,
            default: 0
        }
    },
    { timestamps: true }
);

// Generate invoice number before saving
invoiceSchema.pre('save', async function(next) {
    if (!this.invoiceNumber) {
        const year = new Date().getFullYear();
        const month = String(new Date().getMonth() + 1).padStart(2, '0');
        const count = await mongoose.model('Invoice').countDocuments({
            invoiceNumber: new RegExp(`^INV-${year}${month}`)
        });
        this.invoiceNumber = `INV-${year}${month}-${String(count + 1).padStart(4, '0')}`;
    }
    next();
});

module.exports = mongoose.model('Invoice', invoiceSchema);
