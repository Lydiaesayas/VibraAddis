import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function OwnerDashboard() {
    const [venues, setVenues] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddEventForm, setShowAddEventForm] = useState(false);
    const [selectedVenue, setSelectedVenue] = useState(null);
    const [eventData, setEventData] = useState({
        title: "",
        artist: "",
        date: "",
        time: "",
        description: "",
        image: ""
    });
    const [paymentModal, setPaymentModal] = useState(false);
    const [createdEvent, setCreatedEvent] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchMyVenues = async () => {
            try {
                const response = await api.get("/venues/owner/my-venues");
                setVenues(response.data);
            } catch (error) {
                console.error("Failed to load venues", error);
            } finally {
                setLoading(false);
            }
        };
        fetchMyVenues();
    }, []);

    const handleAddEventSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post("/events", {
                ...eventData,
                venueId: selectedVenue._id
            });
            setCreatedEvent(response.data);
            setShowAddEventForm(false);
            setPaymentModal(true);
        } catch (error) {
            console.error("Failed to create event", error);
            alert("Failed to create event. Make sure you are authorized.");
        }
    };

    const handlePayment = async () => {
        if (!paymentMethod) {
            alert("Please select a payment method");
            return;
        }

        try {
            // Initialize payment
            const initRes = await api.post("/payments/event/initialize", {
                eventId: createdEvent._id,
                paymentMethod
            });
            
            // Mock verify payment right after initialization for demo purposes
            await api.post("/payments/event/verify", {
                transactionId: initRes.data.transactionId,
                paymentGatewayResponse: { status: "success" }
            });

            alert("Payment successful! Event published.");
            setPaymentModal(false);
            setCreatedEvent(null);
        } catch (error) {
            console.error("Payment failed", error);
            alert("Payment failed.");
        }
    };

    if (loading) return <div className="min-h-screen bg-zinc-950 text-white p-10">Loading...</div>;

    return (
        <div className="min-h-screen bg-zinc-950 text-white p-10">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-4xl font-bold mb-8">Owner Dashboard</h1>
                
                {venues.length === 0 ? (
                    <p>You don't have any venues assigned to you yet.</p>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                        {venues.map(venue => (
                            <div key={venue._id} className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6">
                                <h2 className="text-xl font-bold mb-2">{venue.name}</h2>
                                <p className="text-gray-400 mb-4">{venue.category}</p>
                                <button
                                    onClick={() => {
                                        setSelectedVenue(venue);
                                        setShowAddEventForm(true);
                                    }}
                                    className="w-full bg-purple-600 hover:bg-purple-700 py-3 rounded-xl font-semibold"
                                >
                                    Add Event
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {showAddEventForm && (
                    <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 mb-10">
                        <h2 className="text-2xl font-bold mb-6">Add Event for {selectedVenue?.name}</h2>
                        <form onSubmit={handleAddEventSubmit} className="space-y-4">
                            <input type="text" placeholder="Event Title" className="w-full bg-zinc-800 p-4 rounded-xl" required 
                                value={eventData.title} onChange={e => setEventData({...eventData, title: e.target.value})} />
                            <input type="text" placeholder="Artist" className="w-full bg-zinc-800 p-4 rounded-xl" required
                                value={eventData.artist} onChange={e => setEventData({...eventData, artist: e.target.value})} />
                            <input type="date" className="w-full bg-zinc-800 p-4 rounded-xl" required
                                value={eventData.date} onChange={e => setEventData({...eventData, date: e.target.value})} />
                            <input type="time" className="w-full bg-zinc-800 p-4 rounded-xl" required
                                value={eventData.time} onChange={e => setEventData({...eventData, time: e.target.value})} />
                            <input type="url" placeholder="Image URL" className="w-full bg-zinc-800 p-4 rounded-xl" required
                                value={eventData.image} onChange={e => setEventData({...eventData, image: e.target.value})} />
                            <textarea placeholder="Description" className="w-full bg-zinc-800 p-4 rounded-xl h-32" 
                                value={eventData.description} onChange={e => setEventData({...eventData, description: e.target.value})} />
                            
                            <div className="flex gap-4">
                                <button type="submit" className="bg-purple-600 hover:bg-purple-700 py-3 px-8 rounded-xl font-semibold">Proceed to Payment</button>
                                <button type="button" onClick={() => setShowAddEventForm(false)} className="bg-zinc-700 py-3 px-8 rounded-xl">Cancel</button>
                            </div>
                        </form>
                    </div>
                )}

                {paymentModal && (
                    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
                        <div className="bg-zinc-900 p-8 rounded-3xl border border-zinc-800 max-w-md w-full">
                            <h2 className="text-2xl font-bold mb-4">Pay Event Fee</h2>
                            <p className="text-gray-400 mb-6">Pay 500 ETB to publish your event.</p>
                            
                            <select 
                                className="w-full bg-zinc-800 p-4 rounded-xl mb-6"
                                value={paymentMethod}
                                onChange={e => setPaymentMethod(e.target.value)}
                            >
                                <option value="">Select Payment Method</option>
                                <option value="telebirr">Telebirr</option>
                                <option value="cbe_birr">CBE Birr</option>
                                <option value="bank_transfer">Bank Transfer</option>
                            </select>

                            <div className="flex gap-4">
                                <button onClick={handlePayment} className="w-full bg-green-600 hover:bg-green-700 py-3 rounded-xl font-semibold">Pay Now</button>
                                <button onClick={() => setPaymentModal(false)} className="w-full bg-zinc-700 py-3 rounded-xl">Cancel</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default OwnerDashboard;
