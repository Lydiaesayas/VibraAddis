import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import AddVenueForm from "../components/AddVenueForm";

function Admin() {
    const [venues, setVenues] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");
    const [showAddForm, setShowAddForm] = useState(false);
    const navigate = useNavigate();

    const fetchVenues = useCallback(async () => {
        try {
            setLoading(true);
            const response = await api.get("/venues");
            setVenues(response.data.venues || response.data);
            setError("");
        } catch (err) {
             console.error("Fetch error:", err);
            setError("Failed to load venues. Please try again later.");
            if (err.response?.status === 401) {
                localStorage.removeItem("token");
                navigate("/login");
            }
        } finally {
            setLoading(false);
        }
    }, [navigate]);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/login");
            return;
        }
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchVenues();
    }, [navigate, fetchVenues]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    }

    const handleVenueAdded = (newVenue) => {
        setVenues([newVenue, ...venues]);
    }

    const handleVenueUpdated = useCallback((updatedVenue) => {
        setVenues((prevVenues) => prevVenues.map(venue => 
            venue._id === updatedVenue._id ? updatedVenue : venue
        ));
    }, []);

    const handleVenueDeleted = async (id) => {
        try {
            await api.delete(`/venues/${id}`);
            setVenues(
            venues.filter(venue => venue._id !== id));
        } catch (error) {
            console.error("Error deleting venue:", error);
            alert("Failed to delete venue.");
        }
    }

    const handleVenueEdit = async(venue) => {
        const newName = prompt(
            "Enter new name:",
             venue.name);
        if (!newName) return;
        try {            
            const response = await api.put(`/venues/${venue._id}`, 
                {
                ...venue,
                name: newName
            });
            handleVenueUpdated(response.data);
        } catch (error) {
            console.error(error);
            alert("Failed to update venue.");
        }
    }
    if (loading) {
        return (
            <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
                <p className="text-xl">Loading venues...</p>
            </div>
        );
    }

    const filteredVenues = venues.filter((venue) =>
    venue.name.toLowerCase().includes(search.toLowerCase()) 
)
    return (
        <div className="min-h-screen bg-gray-950 text-white p-10">
            <div className="max-w-7xl mx-auto">
                 <div className="flex items-center justify-between mb-10">
                    <div className="mb-10">
                        <h1 className="text-5xl font-bold">
                            Vibra<span className="text-purple-500">Addis</span> 
                        </h1>

                        <p className="text-gray-400 mt-2">
                            Admin Dashboard
                        </p>
                    
                    </div>
                    
                    <div className="flex gap-4">
                     <button
                        onClick={() => setShowAddForm(!showAddForm)}
                        className="bg-purple-600 hover:bg-purple-700 text-white py-3 px-6 rounded-xl font-semibold transition"
                     >
                        {showAddForm ? "Hide Form" : "+ Add Venue"}
                     </button>
                     <button
                        onClick={handleLogout}
                        className="bg-red-600 hover:bg-red-700 text-white py-3 px-6 rounded-xl font-semibold transition"
                     >
                        Logout
                     </button>
                    </div>
                 </div>

                 {showAddForm && (
                     <AddVenueForm onVenueAdded={(newVenue) => {
                         handleVenueAdded(newVenue);
                         setShowAddForm(false);
                     }} />
                 )}

                 {error && (
                     <div className="bg-red-950/50 border border-red-800 text-red-300 p-4 rounded-xl mb-6">
                         {error}
                     </div>
                 )}

                 <div className="bg-zinc-900 rounded-3xl border border-zinc-800 p-6 overflow-hidden">
                    <div className="p-6 border-b border-zinc-800 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <h2 className="text-2xl font-bold ">
                          Venue Management
                        </h2>
                        <input
                          type="text"
                          placeholder="Search venues by name..."
                          value={search}
                          onChange={(e) => setSearch(e.target.value)}
                          className="bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2 text-sm outline-none focus:border-purple-500 transition-colors w-full md:w-64"
                        />
                    </div> 

                    {venues.length === 0 ? (
                        <p className="text-gray-400 p-8 text-center">
                            No venues found. Please add a venue to get started.
                        </p>
                    ) : (

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-zinc-800 text-left">
                                <tr>
                                    <th className="p-5">Venue</th>
                                    <th className="p-5">Category</th>
                                    <th className="p-5">Location</th>
                                    <th className="p-5">Rating</th>
                                    <th className="p-5">Actions</th>
                                </tr>
                            </thead>

                            <tbody>
                                {filteredVenues.map((venue) => (
                                    <tr key={venue._id} 
                                    className="border-t border-zinc-800">
                                        <td className="p-5">
                                            {venue.name}
                                        </td>
                                        <td className="p-5">
                                            {venue.category}
                                        </td>
                                        <td className="p-5">
                                            {venue.location}
                                        </td>
                                        <td className="p-5">
                                            {venue.rating}
                                        </td>
                                     
                                        <td className="p-5 flex gap-3">
                                            <button 
                                                onClick={() => handleVenueEdit(venue)}
                                                className="bg-blue-600 hover:bg-blue-700 text-sm py-2 px-4 rounded-xl"
                                            >
                                                Edit
                                            </button>
                                            <button 
                                                onClick={() => handleVenueDeleted(venue._id)}
                                                className="bg-red-600 hover:bg-red-700 text-sm py-2 px-4 rounded-xl"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                
                    )}
                 </div>
            </div>
        </div>
    );
}

export default Admin;