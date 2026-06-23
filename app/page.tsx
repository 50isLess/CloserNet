'use client';

import { useState } from 'react';

interface Listing {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
}

export default function CloserNet() {
  const [listings, setListings] = useState<Listing[]>([
    {
      id: 1,
      title: "Sony WH-1000XM5 Headphones",
      price: 280,
      description: "Excellent condition. Barely used. Original box included.",
      category: "Audio",
      image: "https://picsum.photos/id/1015/400/300"
    },
    {
      id: 2,
      title: "The Dark Side of the Moon - Pink Floyd (Vinyl)",
      price: 45,
      description: "Original pressing in great shape.",
      category: "Vinyl",
      image: "https://picsum.photos/id/1016/400/300"
    },
    {
      id: 3,
      title: "MacBook Pro 16\" M3 Max",
      price: 2450,
      description: "2024 model. 64GB RAM, 1TB SSD. Like new.",
      category: "Electronics",
      image: "https://picsum.photos/id/201/400/300"
    }
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showForm, setShowForm] = useState(false);
  const [aiResult, setAiResult] = useState<any>(null);
  const [aiInput, setAiInput] = useState({ title: "", category: "Audio" });

  const [newItem, setNewItem] = useState({
    title: "",
    price: "",
    description: "",
    category: "Audio",
    image: ""
  });

  const categories = ["All", "Audio", "Electronics", "Photography", "Collectibles", "Clothes", "Books", "Vinyl", "DVD", "CDs", "Other"];

  // Filter listings
  const filteredListings = listings.filter(listing => {
    const matchesSearch = listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         listing.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || listing.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // CloserValue AI
  const getCloserValue = () => {
    const { title, category } = aiInput;
    let basePrice = 80;

    const prices: { [key: string]: number } = {
      Audio: 220, Electronics: 950, Photography: 700, Collectibles: 380,
      Clothes: 55, Books: 28, Vinyl: 42, DVD: 15, CDs: 18, Other: 60
    };
    basePrice = prices[category] || 80;

    const lower = title.toLowerCase();
    if (lower.includes("leica")) basePrice *= 2.1;
    if (lower.includes("macbook")) basePrice *= 1.8;
    if (lower.includes("headphones")) basePrice *= 1.25;
    if (lower.includes("vinyl")) basePrice *= 1.3;

    const low = Math.round(basePrice * 0.83);
    const high = Math.round(basePrice * 1.17);

    setAiResult({
      low,
      high,
      message: `Based on recent sales in ${category}, we recommend $${low} – $${high}.`
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.title || !newItem.price) return;

    const listing: Listing = {
      id: Date.now(),
      title: newItem.title,
      price: parseFloat(newItem.price),
      description: newItem.description,
      category: newItem.category,
      image: newItem.image || "https://picsum.photos/id/1018/400/300"
    };

    setListings([listing, ...listings]);
    setNewItem({ title: "", price: "", description: "", category: "Audio", image: "" });
    setShowForm(false);
  };

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      {/* Navbar */}
      <nav className="border-b border-zinc-800 bg-zinc-950/80 backdrop-blur sticky top-0 z-50">
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
        <div className="flex gap-4 justify-center">
          <button onClick={() => setShowForm(true)} className="px-8 py-3.5 bg-white text-black rounded-full text-lg font-medium hover:bg-zinc-200">
            Post an Item
          </button>
          <button onClick={() => document.getElementById('value')?.scrollIntoView({ behavior: 'smooth' })} 
                  className="px-8 py-3.5 border border-zinc-700 rounded-full text-lg hover:bg-zinc-900">
            Try CloserValue AI
          </button>
        </div>
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
          <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="bg-zinc-900 border border-zinc-800 p-3 rounded-lg md:w-52">
            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        </div>
      </section>

      {/* CloserValue AI */}
      <section id="value" className="max-w-4xl mx-auto px-6 py-14 border-t border-zinc-800 bg-zinc-900">
        <div className="text-center mb-8">
          <div className="inline-block px-4 py-1 bg-zinc-800 rounded-full text-sm mb-4">AI POWERED</div>
          <h2 className="text-4xl font-semibold mb-3">CloserValue AI</h2>
          <p className="text-zinc-400">Get a smart price recommendation based on recent sales.</p>
        </div>

        <div className="max-w-md mx-auto bg-zinc-950 border border-zinc-800 rounded-2xl p-8">
          <div className="space-y-4">
            <input type="text" placeholder="Item title" value={aiInput.title} onChange={(e) => setAiInput({...aiInput, title: e.target.value})} className="w-full bg-zinc-900 border border-zinc-800 p-3 rounded-lg" />
            <select value={aiInput.category} onChange={(e) => setAiInput({...aiInput, category: e.target.value})} className="w-full bg-zinc-900 border border-zinc-800 p-3 rounded-lg">
              {categories.filter(c => c !== "All").map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
            <button onClick={getCloserValue} className="w-full bg-white text-black py-3 rounded-full font-medium hover:bg-zinc-200">Get Price Estimate</button>
          </div>

          {aiResult && (
            <div className="mt-6 p-5 bg-zinc-900 border border-zinc-800 rounded-xl">
              <div className="text-sm text-zinc-400 mb-1">Recommended Price</div>
              <div className="text-3xl font-semibold">${aiResult.low} – ${aiResult.high}</div>
              <p className="text-sm text-zinc-400 mt-2">{aiResult.message}</p>
            </div>
          )}
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
              {categories.filter(c => c !== "All").map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>

            <input type="text" placeholder="Image URL (paste a link to your photo)" value={newItem.image} onChange={(e) => setNewItem({...newItem, image: e.target.value})} className="w-full bg-zinc-900 border border-zinc-800 p-3 rounded-lg" />
            
            <textarea placeholder="Description" value={newItem.description} onChange={(e) => setNewItem({...newItem, description: e.target.value})} className="w-full bg-zinc-900 border border-zinc-800 p-3 rounded-lg h-24" />
            <button type="submit" className="w-full bg-white text-black py-3 rounded-full font-medium hover:bg-zinc-200">Post Item</button>
          </form>
        </section>
      )}

      {/* Listings */}
      <section className="max-w-6xl mx-auto px-6 py-14">
        <h2 className="text-3xl font-semibold mb-8">Featured Listings</h2>
        
        {filteredListings.length === 0 ? (
          <p className="text-center text-zinc-400 py-10">No listings found.</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredListings.map((listing) => (
              <div key={listing.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden hover:border-zinc-700 transition-colors">
                <img src={listing.image} alt={listing.title} className="w-full h-48 object-cover" />
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-xs px-3 py-1 bg-zinc-800 rounded-full">{listing.category}</span>
                    <span className="font-semibold text-2xl">${listing.price}</span>
                  </div>
                  <h3 className="font-semibold text-xl mb-2">{listing.title}</h3>
                  <p className="text-zinc-400 text-sm mb-6 line-clamp-2">{listing.description}</p>
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
