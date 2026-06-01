import { useState } from 'react';
import API from '../services/api';

function AddVenueForm({ onVenueAdded }) {
    const [formData, setFormData] = useState({
        name: '',
        category: '',
        location: '',
        image: null,
        rating: '',
        tags: '',
        website: '',
        description: '',
        video: '',
    })

    const handleChange = (e) => {
        if (e.target.name === 'image') {
            setFormData({
                ...formData,
                image: e.target.files[0]
            });
        } else {
            setFormData({
                ...formData,
                [e.target.name]: e.target.value
            });
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = new FormData();
            data.append('name', formData.name);
            data.append('category', formData.category);
            data.append('location', formData.location);
            data.append('rating', Number(formData.rating));
            
            const tagsArray = formData.tags.split(',').map(tag => tag.trim());
            data.append('tags', JSON.stringify(tagsArray)); // Send as JSON string or individual appends
            
            data.append('website', formData.website);
            data.append('description', formData.description);
            data.append('video', formData.video);

            if (formData.image) {
                data.append('image', formData.image);
            }

            const response = await API.post('/venues', data, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            onVenueAdded(response.data);
            setFormData({
                name: '',
                category: '',
                location: '',
                image: null,
                rating: '',
                tags: '',
                website: '',
                description: '',
                video: '',
            });
        } catch (error) {
            console.error('Error adding venue:', error);
        }
    }

    return (
        <form
         onSubmit={handleSubmit} 
         className=" bg-zinc-900 p-8 rounded-3xl border border-zinc-800 mb-10">
            <h2 className="text-3xl font-bold mb-8">
                Add New Venue
            </h2>
            <div className='grid md:grid-cols-2 gap-6'>
                <input 
                 type="text"
                 name="name"
                 placeholder="Venue Name"
                 value={formData.name}
                 onChange={handleChange}
                 className="bg-zinc-800 p-4 rounded-xl outline-none"
                 required
                  />
                <input 
                 type="text"
                 name="category"
                 placeholder="Category (e.g., Nightclub)"
                value={formData.category}
                 onChange={handleChange}
                 className="bg-zinc-800 p-4 rounded-xl outline-none"
                 required
                />
                <input 
                 type="text"
                 name="location"
                 placeholder="Location / Address"
                 value={formData.location}
                 onChange={handleChange}
                 className="bg-zinc-800 p-4 rounded-xl outline-none"
                 required
                />
                <input 
                 type="file"
                 name="image"
                 accept="image/*"
                 onChange={handleChange}
                 className="bg-zinc-800 p-4 rounded-xl outline-none"    
                 required
                /> 
                <input 
                 type="number"
                 step="0.1"
                 name="rating"
                 placeholder="Rating"  
                 value={formData.rating}
                 onChange={handleChange}
                 className="bg-zinc-800 p-4 rounded-xl outline-none"
                 required
                    />
                <input 
                 type="text"
                 name="tags"
                 placeholder="Tags separated by commas"
                 value={formData.tags}
                 onChange={handleChange}
                 className="bg-zinc-800 p-4 rounded-xl outline-none"
                />
                <input 
                 type="url"
                 name="website"
                 placeholder="Website URL (e.g., https://example.com)"
                 value={formData.website}
                  onChange={handleChange}
                 className="bg-zinc-800 p-4 rounded-xl outline-none"
                />
                <input 
                 type="text"
                 name="video"
                 placeholder="Video URL (e.g. .mp4 link)"
                 value={formData.video}
                 onChange={handleChange}
                 className="bg-zinc-800 p-4 rounded-xl outline-none"
                />
                <textarea 
                 name="description"
                 placeholder="Venue Description"
                 value={formData.description}
                 onChange={handleChange}
                 className="bg-zinc-800 p-4 rounded-xl outline-none md:col-span-2 h-32 resize-none"
                />
            </div>
            <button
             type="submit"
             className="mt-8 bg-purple-600  px-8 py-4 hover:bg-purple-700 transition rounded-2xl font-semibold" >
                Add Venue
            </button>
        </form>
    )
}
export default AddVenueForm