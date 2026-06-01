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

module.exports = {
    sendReservationEmail
};
