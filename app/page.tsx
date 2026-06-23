'use client';

import { useState } from 'react';

interface Listing {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
}

export default function CloserNet() {
  const [listings, setListings] = useState<Listing[]>([
    {
      id: 1,
      title: "Sony WH-1000XM5 Headphones",
      price: 280,
      description: "Excellent condition, barely used.",
      category: "Audio"
    },
    {
      id: 2,
      title: "Vintage Leica M6 Camera",
      price: 1850,
      description: "Beautiful condition. Recently serviced.",
      category: "Photography"
    }
  ]);

  const [showForm, setShowForm] = useState(false);
  const [newItem, setNewItem] = useState({
    title: "",
    price: "",
    description: "",
    category: "Audio"
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.title || !newItem.price) return;

    const listing: Listing = {
      id: Date.now(),
      title: newItem.title,
      price: parseFloat(newItem.price),
      description: newItem.description,
      category: newItem.category
    };

    setListings([listing, ...listings]);
    setNewItem({ title: "", price: "", description: "", category: "Audio" });
    setShowForm(false);
  };

  return (
    <main className="min-h-screen bg-white">
      <nav className="border-b sticky top-0 bg-white z-50">
        <div className="max-w-6xl mx-auto px-6 py-5 flex justify-between items-center">
          <div className="text-2xl font-semibold">CloserNet</div>
          <button 
            onClick={() => setShowForm(!showForm)}
            className="px-6 py-2 bg-black text-white rounded-full text-sm hover:bg-gray-800"
          >
            {showForm ? "Close" : "Post an Item"}
          </button>
        </div>
      </nav>

      <section className="max-w-4xl mx-auto px-6 pt-16 pb-12 text-center">
        <h1 className="text-6xl font-semibold tracking-tight mb-6">
          Closer to real value.<br />Protected by escrow.
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
          A simpler peer-to-peer marketplace. Only ~5% total fees.
        </p>
        <button 
          onClick={() => setShowForm(true)}
          className="px-8 py-3 bg-black text-white rounded-full text-lg hover:bg-gray-800"
        >
          Post Your First Item
        </button>
      </section>

      {showForm && (
        <section className="max-w-xl mx-auto px-6 py-8 border-t bg-gray-50">
          <h3 className="text-2xl font-semibold mb-6">Post a New Item</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input type="text" placeholder="Item title" value={newItem.title} 
              onChange={(e) => setNewItem({...newItem, title: e.target.value})} 
              className="w-full border p-3 rounded-lg" required />
            
            <input type="number" placeholder="Price ($)" value={newItem.price} 
              onChange={(e) => setNewItem({...newItem, price: e.target.value})} 
              className="w-full border p-3 rounded-lg" required />
            
            <select value={newItem.category} 
              onChange={(e) => setNewItem({...newItem, category: e.target.value})} 
              className="w-full border p-3 rounded-lg">
              <option value="Audio">Audio</option>
              <option value="Electronics">Electronics</option>
              <option value="Photography">Photography</option>
              <option value="Collectibles">Collectibles</option>
              <option value="Other">Other</option>
            </select>
            
            <textarea placeholder="Description" value={newItem.description} 
              onChange={(e) => setNewItem({...newItem, description: e.target.value})} 
              className="w-full border p-3 rounded-lg h-24" />
            
            <button type="submit" className="w-full bg-black text-white py-3 rounded-full hover:bg-gray-800">
              Post Item
            </button>
          </form>
        </section>
      )}

      <section className="max-w-6xl mx-auto px-6 py-12">
        <h2 className="text-3xl font-semibold mb-8">Featured Listings</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map((listing) => (
            <div key={listing.id} className="border rounded-2xl p-6">
              <div className="flex justify-between items-start mb-4">
                <span className="text-xs px-3 py-1 bg-gray-100 rounded-full">{listing.category}</span>
                <span className="font-semibold text-xl">${listing.price}</span>
              </div>
              <h3 className="font-semibold text-xl mb-3">{listing.title}</h3>
              <p className="text-gray-600 text-sm">{listing.description}</p>
              <button className="mt-6 w-full py-2.5 border border-gray-300 rounded-full text-sm hover:bg-gray-50">
                View Details
              </button>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
