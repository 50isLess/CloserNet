'use client';

import { useState } from 'react';

interface Listing {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image?: string;
}

export default function CloserNet() {
  const [listings, setListings] = useState<Listing[]>([
    { 
      id: 1, 
      title: "Sony WH-1000XM5 Headphones", 
      price: 280, 
      description: "Excellent condition. Barely used.", 
      category: "Audio",
      image: "https://picsum.photos/id/1015/300/200"
    },
    { 
      id: 2, 
      title: "The Dark Side of the Moon - Pink Floyd (Vinyl)", 
      price: 45, 
      description: "Original pressing in great shape.", 
      category: "Vinyl",
      image: "https://picsum.photos/id/1016/300/200"
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showForm, setShowForm] = useState(false);

  const [newItem, setNewItem] = useState({
    title: "",
    price: "",
    description: "",
    category: "Audio",
    image: ""
  });

  const categories = ["All", "Audio", "Electronics", "Photography", "Collectibles", "Clothes", "Books", "Vinyl", "DVD", "CDs", "Other"];

  // Filtered listings
  const filteredListings = listings.filter(listing => {
    const matchesSearch = listing.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         listing.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || listing.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.title || !newItem.price) return;

    const listing: Listing = {
      id: Date.now(),
      title: newItem.title,
      price: parseFloat(newItem.price),
      description: newItem.description,
      category: newItem.category,
      image: newItem.image || "https://picsum.photos/id/1018/300/200"
    };

    setListings([listing, ...listings]);
    setNewItem({ title: "", price: "", description: "", category: "Audio", image: "" });
    setShowForm(false);
  };

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      {/* Navbar */}
      <nav className="border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-5 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
              <span className="text-black font-bold text-xl">C</span>
            </div>
            <div className="text-2xl font-semibold tracking-tight">CloserNet</div>
          </div>
          <button 
            onClick={() => setShowForm(!showForm)}
            className="px-6 py-2 bg-white text-black rounded-full text-sm font-medium hover:bg-zinc-200"
          >
            {showForm ? "Close" : "Post Item"}
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-6 pt-20 pb-16 text-center">
        <h1 className="text-6xl md:text-7xl font-semibold tracking-tighter mb-6">
          Closer to real value.<br />Protected by escrow.
        </h1>
        <p className="text-xl text-zinc-400 max-w-2xl mx-auto mb-10">
          A simpler peer-to-peer marketplace with ~5% total fees.
        </p>
        <button onClick={() => setShowForm(true)} className="px-8 py-3.5 bg-white text-black rounded-full text-lg font-medium hover:bg-zinc-200">
          Post an Item
        </button>
      </section>

      {/* Search + Filter */}
      <section className="max-w-6xl mx-auto px-6 pb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="text"
            placeholder="Search listings..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 bg-zinc-900 border border-zinc-800 p-3 rounded-lg"
          />
          <select 
            value={selectedCategory} 
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-zinc-900 border border-zinc-800 p-3 rounded-lg md:w-48"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </section>

      {/* Post Form */}
      {showForm && (
        <section className="max-w-xl mx-auto px-6 py-10 border-t border-zinc-800">
          <h3 className="text-2xl font-semibold mb-6">Post a New Item</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input type="text" placeholder="Item Title" value={newItem.title} onChange={(e) => setNewItem({...newItem, title: e.target.value})} className="w-full bg-zinc-900 border border-zinc-800 p-3 rounded-lg" required />
            <input type="number" placeholder="Price ($)" value={newItem.price} onChange={(e) => setNewItem({...newItem, price: e.target.value})} className="w-full bg-zinc-900 border border-zinc-800 p-3 rounded-lg" required />
            
            <select value={newItem.category} onChange={(e) => setNewItem({...newItem, category: e.target.value})} className="w-full bg-zinc-900 border border-zinc-800 p-3 rounded-lg">
              {categories.filter(c => c !== "All").map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>

            <input type="text" placeholder="Image URL (optional)" value={newItem.image} onChange={(e) => setNewItem({...newItem, image: e.target.value})} className="w-full bg-zinc-900 border border-zinc-800 p-3 rounded-lg" />
            
            <textarea placeholder="Description" value={newItem.description} onChange={(e) => setNewItem({...newItem, description: e.target.value})} className="w-full bg-zinc-900 border border-zinc-800 p-3 rounded-lg h-24" />
            
            <button type="submit" className="w-full bg-white text-black py-3 rounded-full font-medium hover:bg-zinc-200">Post Item</button>
          </form>
        </section>
      )}

      {/* Listings */}
      <section className="max-w-6xl mx-auto px-6 py-12">
        <h2 className="text-3xl font-semibold mb-8">Featured Listings ({filteredListings.length})</h2>
        
        {filteredListings.length === 0 ? (
          <p className="text-center text-zinc-400 py-12">No listings found matching your search.</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredListings.map((listing) => (
              <div key={listing.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden hover:border-zinc-700 transition-colors">
                {listing.image && (
                  <img src={listing.image} alt={listing.title} className="w-full h-48 object-cover" />
                )}
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-xs px-3 py-1 bg-zinc-800 rounded-full">{listing.category}</span>
                    <span className="font-semibold text-2xl">${listing.price}</span>
                  </div>
                  <h3 className="font-semibold text-xl mb-3">{listing.title}</h3>
                  <p className="text-zinc-400 text-sm mb-6">{listing.description}</p>
                  <button className="w-full py-2.5 border border-zinc-700 rounded-full text-sm hover:bg-zinc-800 transition-colors">
                    View Details & Buy
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
