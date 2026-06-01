require("dotenv").config()

const bcrypt = require("bcryptjs")

const connectDB = require("./config/db")
const Admin = require("./models/Admin")

const createAdmin = async () => {
    try {
        await connectDB()
        const existing = await Admin.findOne({ email: "henok@vibraaddis.com" })
        if (existing) {
            console.log("Admin user already exists")
            console.log("Email: henok@vibraaddis.com")
            process.exit(0)
        }

        const hashedPassword = await bcrypt.hash("henok123", 10)
        const admin = new Admin({
            email: "henok@vibraaddis.com",
            password: hashedPassword
        })
        await admin.save()
        console.log("Admin user created successfully")
        console.log("Email:henok@vibraaddis.com")
        console.log("Password: henok123")
        process.exit(0)
    } catch (error) {
        console.error("Error creating admin user:", error)
        process.exit(1)
    }
}
createAdmin()