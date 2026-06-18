const nodemailer = require('nodemailer');

let cachedTransporter = null;

const createTransporter = async () => {
    if (cachedTransporter) return cachedTransporter;

    // Use SMTP environment variables if provided
    if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
        cachedTransporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT) || 587,
            secure: process.env.SMTP_SECURE === 'true',
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS
            }
        });
        return cachedTransporter;
    }

    try {
        // Generate test SMTP service account from ethereal.email
        const testAccount = await nodemailer.createTestAccount();

        // create reusable transporter object using the default SMTP transport
        cachedTransporter = nodemailer.createTransport({
            host: "smtp.ethereal.email",
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: testAccount.user, // generated ethereal user
                pass: testAccount.pass, // generated ethereal password
            },
        });

        return cachedTransporter;
    } catch (error) {
        console.warn("Failed to connect to Ethereal SMTP server, using mock local logger fallback instead.");
        cachedTransporter = {
            sendMail: async (options) => {
                console.log("=== [MOCK EMAIL SENT] ===");
                console.log("To:", options.to);
                console.log("Subject:", options.subject);
                console.log("Body:", options.text);
                console.log("==========================");
                return { messageId: "mock-message-id" };
            }
        };
        return cachedTransporter;
    }
};

const sendReservationEmail = async (bookingData, venueName, bookingRef) => {
    try {
        const transporter = await createTransporter();

        const mailOptions = {
            from: '"VibraAddis Reservations" <reservations@vibraaddis.com>',
            to: bookingData.email,
            subject: `Reservation Confirmed: ${venueName}`,
            text: `Hello ${bookingData.name},\n\nYour reservation at ${venueName} is confirmed!\n\nBooking Reference: ${bookingRef}\nDate: ${new Date(bookingData.date).toLocaleString()}\nGuests: ${bookingData.guests}\n\nSee you there!`,
            html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
                <h2 style="color: #a855f7;">Reservation Confirmed!</h2>
                <p>Hello <strong>${bookingData.name}</strong>,</p>
                <p>Your VIP reservation at <strong>${venueName}</strong> is confirmed.</p>
                <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
                    <p><strong>Booking Reference:</strong> ${bookingRef}</p>
                    <p><strong>Date & Time:</strong> ${new Date(bookingData.date).toLocaleString()}</p>
                    <p><strong>Guests:</strong> ${bookingData.guests}</p>
                </div>
                <p>Enjoy the vibe!</p>
                <p>- VibraAddis Team</p>
            </div>
            `,
        };

        let info = await transporter.sendMail(mailOptions);
        console.log("Message sent: %s", info.messageId);
        // Preview only available when sending through an Ethereal account
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

        return true;
    } catch (error) {
        console.error("Error sending email: ", error);
        return false;
    }
};

// Send payment reminder email
const sendPaymentReminder = async (invoiceData) => {
    try {
        const transporter = await createTransporter();

        const mailOptions = {
            from: '"VibraAddis Billing" <billing@vibraaddis.com>',
            to: invoiceData.contactEmail,
            subject: `Payment Reminder: Invoice ${invoiceData.invoiceNumber}`,
            text: `Hello ${invoiceData.contactName},\n\nThis is a reminder that your invoice ${invoiceData.invoiceNumber} for ${invoiceData.planName} is due on ${new Date(invoiceData.dueDate).toLocaleDateString()}.\n\nAmount: ${invoiceData.amount} ${invoiceData.currency}\n\nPlease make your payment to avoid service interruption.\n\n- VibraAddis Team`,
            html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
                <h2 style="color: #a855f7;">Payment Reminder</h2>
                <p>Hello <strong>${invoiceData.contactName}</strong>,</p>
                <p>This is a reminder that your invoice <strong>${invoiceData.invoiceNumber}</strong> for <strong>${invoiceData.planName}</strong> is due on <strong>${new Date(invoiceData.dueDate).toLocaleDateString()}</strong>.</p>
                <div style="background-color: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b;">
                    <p><strong>Invoice Number:</strong> ${invoiceData.invoiceNumber}</p>
                    <p><strong>Plan:</strong> ${invoiceData.planName}</p>
                    <p><strong>Amount Due:</strong> ${invoiceData.amount} ${invoiceData.currency}</p>
                    <p><strong>Due Date:</strong> ${new Date(invoiceData.dueDate).toLocaleDateString()}</p>
                </div>
                <p>Please make your payment to avoid service interruption.</p>
                <p>- VibraAddis Team</p>
            </div>
            `,
        };

        let info = await transporter.sendMail(mailOptions);
        console.log("Payment reminder sent: %s", info.messageId);
        return true;
    } catch (error) {
        console.error("Error sending payment reminder: ", error);
        return false;
    }
};

// Send subscription expiration warning
const sendExpirationWarning = async (venueData) => {
    try {
        const transporter = await createTransporter();

        const mailOptions = {
            from: '"VibraAddis Subscriptions" <subscriptions@vibraaddis.com>',
            to: venueData.contactEmail,
            subject: `Subscription Expiring Soon: ${venueData.venueName}`,
            text: `Hello ${venueData.contactName},\n\nYour subscription for ${venueData.venueName} will expire on ${new Date(venueData.listingExpiresAt).toLocaleDateString()}.\n\nPlease renew your subscription to keep your venue listed on VibraAddis.\n\n- VibraAddis Team`,
            html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
                <h2 style="color: #a855f7;">Subscription Expiring Soon</h2>
                <p>Hello <strong>${venueData.contactName}</strong>,</p>
                <p>Your subscription for <strong>${venueData.venueName}</strong> will expire on <strong>${new Date(venueData.listingExpiresAt).toLocaleDateString()}</strong>.</p>
                <div style="background-color: #fee2e2; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ef4444;">
                    <p><strong>Venue:</strong> ${venueData.venueName}</p>
                    <p><strong>Expiration Date:</strong> ${new Date(venueData.listingExpiresAt).toLocaleDateString()}</p>
                    <p><strong>Days Remaining:</strong> ${Math.ceil((new Date(venueData.listingExpiresAt) - new Date()) / (1000 * 60 * 60 * 24))}</p>
                </div>
                <p>Please renew your subscription to keep your venue listed on VibraAddis.</p>
                <p>- VibraAddis Team</p>
            </div>
            `,
        };

        let info = await transporter.sendMail(mailOptions);
        console.log("Expiration warning sent: %s", info.messageId);
        return true;
    } catch (error) {
        console.error("Error sending expiration warning: ", error);
        return false;
    }
};

// Send payment confirmation
const sendPaymentConfirmation = async (paymentData) => {
    try {
        const transporter = await createTransporter();

        const mailOptions = {
            from: '"VibraAddis Billing" <billing@vibraaddis.com>',
            to: paymentData.contactEmail,
            subject: `Payment Confirmation: ${paymentData.invoiceNumber}`,
            text: `Hello ${paymentData.contactName},\n\nYour payment of ${paymentData.amount} ${paymentData.currency} for invoice ${paymentData.invoiceNumber} has been received.\n\nThank you for your payment!\n\n- VibraAddis Team`,
            html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
                <h2 style="color: #10b981;">Payment Confirmation</h2>
                <p>Hello <strong>${paymentData.contactName}</strong>,</p>
                <p>Your payment has been successfully received.</p>
                <div style="background-color: #d1fae5; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10b981;">
                    <p><strong>Invoice Number:</strong> ${paymentData.invoiceNumber}</p>
                    <p><strong>Amount Paid:</strong> ${paymentData.amount} ${paymentData.currency}</p>
                    <p><strong>Payment Date:</strong> ${new Date(paymentData.paidAt).toLocaleDateString()}</p>
                    <p><strong>Transaction ID:</strong> ${paymentData.transactionId}</p>
                </div>
                <p>Thank you for your payment!</p>
                <p>- VibraAddis Team</p>
            </div>
            `,
        };

        let info = await transporter.sendMail(mailOptions);
        console.log("Payment confirmation sent: %s", info.messageId);
        return true;
    } catch (error) {
        console.error("Error sending payment confirmation: ", error);
        return false;
    }
};

// Send welcome email for new user registration
const sendWelcomeEmail = async (userData) => {
    try {
        const transporter = await createTransporter();

        const mailOptions = {
            from: '"VibraAddis" <welcome@vibraaddis.com>',
            to: userData.email,
            subject: 'Welcome to VibraAddis!',
            text: `Hello ${userData.name},\n\nWelcome to VibraAddis! Your account has been successfully created.\n\nStart exploring the best nightlife and traditional cultural restaurants in Addis Ababa.\n\n- VibraAddis Team`,
            html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
                <h2 style="color: #a855f7;">Welcome to VibraAddis!</h2>
                <p>Hello <strong>${userData.name}</strong>,</p>
                <p>Your account has been successfully created.</p>
                <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
                    <p><strong>Username:</strong> ${userData.name}</p>
                    <p><strong>Email:</strong> ${userData.email}</p>
                </div>
                <p>Start exploring the best nightlife and traditional cultural restaurants in Addis Ababa.</p>
                <p>- VibraAddis Team</p>
            </div>
            `,
        };

        let info = await transporter.sendMail(mailOptions);
        console.log("Welcome email sent: %s", info.messageId);
        return true;
    } catch (error) {
        console.error("Error sending welcome email: ", error);
        return false;
    }
};

module.exports = {
    sendReservationEmail,
    sendPaymentReminder,
    sendExpirationWarning,
    sendPaymentConfirmation,
    sendWelcomeEmail
};
