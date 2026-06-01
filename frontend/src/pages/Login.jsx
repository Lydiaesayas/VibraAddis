import { useState } from "react"
import { useNavigate } from "react-router-dom"
import api from "../services/api"

function Login() {

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError("")
        setLoading(true)
        try {
            const response = await api.post("/auth/login", { email, password })

            const token = response.data.token ||
                response.data.data?.token ||
                response.data.access_token ||
                response.data.accesToken
            if (!token) {
                console.error("No token in response:", response.data)
                throw new Error("no token in response")
            }

            localStorage.setItem("token", token)

            setTimeout(() => {
                navigate("/admin")
            }, 100)
        } catch (error) {
            console.error("Login failed:", error)
            if (error.response) {
                console.error("Server response:", error.response.data)
                setError(error.response.data.message || "Invalid credentials. Please try again.")
            } else if (error.request) {
                console.error("No response received:", error.request)
                setError("No response from server. Please check your network connection.")
            } else {
                setError(error.message || "Invalid credentials. Please try again.")
            }
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-white">
            <form
                onSubmit={handleSubmit}
                className="bg-zinc-900 p-10 rounded-3xl w-full max-w-md border border-zinc-800"
            >
                <h1 className="text-4xl font-bold mb-8 text-center">
                    Admin Login
                </h1>

                {error && <p className="bg-red-400 text-center p-3 rounded mb-4 bg-red-950/30 p-3 rounded-lg">
                    {error}
                </p>}

                <input
                    type="email"
                    placeholder="Email"
                    className="w-full bg-zinc-800 p-4 rounded-xl mb-5 outline-none"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <div className="relative mb-6">
                    <input
                        type={showPassword ? "text" : "password"}
                        placeholder="password"
                        className="w-full bg-zinc-800 p-4 rounded-xl mb-6 outline-none"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    <button
                        type="button"
                        className="absolute right-4 top-1/2  -translate-y-1/2 text-gray-400 hover:text-purple-400 transition"
                        onClick={() => setShowPassword(!showPassword)}
                        tabIndex={-1}
                    >
                        {showPassword ? (
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                            </svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                        )}

                    </button>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className={`w-full bg-blue-600 hover:bg-purple-700 transition p-4 rounded-xl font-semibold ${loading ? "opacity-50 cursor-not-allowed" : ""}`}>
                    {loading ? "Loading..." : "Login"}
                </button>
            </form>
        </div>
    )

}

export default Login
