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
    { id: 1, title: "Sony WH-1000XM5 Headphones", price: 280, description: "Excellent condition. Barely used.", category: "Audio" },
    { id: 2, title: "The Dark Side of the Moon - Pink Floyd (Vinyl)", price: 45, description: "Original pressing in great shape.", category: "Vinyl" },
    { id: 3, title: "MacBook Pro 16\" M3 Max", price: 2450, description: "2024 model. 64GB RAM, 1TB SSD.", category: "Electronics" },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [aiResult, setAiResult] = useState<any>(null);
  const [aiInput, setAiInput] = useState({ title: "", category: "Audio" });

  const [newItem, setNewItem] = useState({
    title: "", price: "", description: "", category: "Audio"
  });

  // Improved CloserValue AI Estimator
  const getCloserValue = () => {
    const { title, category } = aiInput;
    let basePrice = 50;

    // Base prices by category
    const categoryPrices: { [key: string]: number } = {
      "Audio": 180,
      "Electronics": 900,
      "Photography": 650,
      "Collectibles": 350,
      "Clothes": 45,
      "Books": 25,
      "Vinyl": 35,
      "DVD": 12,
      "CDs": 15,
      "Other": 50
    };

    basePrice = categoryPrices[category] || 50;

    // Keyword adjustments
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes("leica") || lowerTitle.includes("vintage camera")) basePrice *= 2.2;
    if (lowerTitle.includes("macbook") || lowerTitle.includes("pro")) basePrice *= 1.7;
    if (lowerTitle.includes("headphones") || lowerTitle.includes("sony")) basePrice *= 1.3;
    if (lowerTitle.includes("vinyl") || lowerTitle.includes("pink floyd")) basePrice *= 1.4;

    const estimatedLow = Math.round(basePrice * 0.82);
    const estimatedHigh = Math.round(basePrice * 1.18);

    setAiResult({
      estimatedLow,
      estimatedHigh,
      message: `Based on recent sales in ${category}, we recommend listing between $${estimatedLow} and $${estimatedHigh}.`
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
      category: newItem.category
    };

    setListings([listing, ...listings]);
    setNewItem({ title: "", price: "", description: "", category: "Audio" });
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
          <div className="flex items-center gap-6 text-sm">
            <a href="#how" className="hover:text-zinc-400">How it Works</a>
            <a href="#value" className="hover:text-zinc-400">CloserValue AI</a>
            <button 
              onClick={() => setShowForm(!showForm)}
              className="px-6 py-2 bg-white text-black rounded-full text-sm font-medium hover:bg-zinc-200"
            >
              {showForm ? "Close" : "Post Item"}
            </button>
          </div>
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

      {/* How it Works */}
      <section id="how" className="max-w-5xl mx-auto px-6 py-16 border-t border-zinc-800">
        <h2 className="text-4xl font-semibold text-center mb-12">How CloserNet Works</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { num: "01", title: "List Your Item", desc: "Post quickly with photos and details. No complicated rules." },
            { num: "02", title: "Secure Escrow", desc: "Buyer pays into escrow. You only ship after payment is protected." },
            { num: "03", title: "Get Paid Fairly", desc: "Money is released when the buyer confirms delivery. Keep ~95%." }
          ].map((step, i) => (
            <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8">
              <div className="text-5xl font-bold text-zinc-700 mb-6">{step.num}</div>
              <h3 className="text-2xl font-semibold mb-3">{step.title}</h3>
              <p className="text-zinc-400">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CloserValue AI */}
      <section id="value" className="max-w-4xl mx-auto px-6 py-16 border-t border-zinc-800 bg-zinc-900">
        <div className="text-center mb-10">
          <div className="inline-block px-4 py-1 bg-zinc-800 rounded-full text-sm mb-4">AI POWERED</div>
          <h2 className="text-4xl font-semibold mb-4">CloserValue AI</h2>
          <p className="text-zinc-400">Get a smart price suggestion based on recent sales data.</p>
        </div>

        <div className="max-w-md mx-auto bg-zinc-950 border border-zinc-800 rounded-2xl p-8">
          <div className="space-y-4">
            <input type="text" placeholder="Item title" value={aiInput.title} 
              onChange={(e) => setAiInput({...aiInput, title: e.target.value})} className="w-full bg-zinc-900 border border-zinc-800 p-3 rounded-lg" />
            
            <select value={aiInput.category} onChange={(e) => setAiInput({...aiInput, category: e.target.value})} className="w-full bg-zinc-900 border border-zinc-800 p-3 rounded-lg">
              <option value="Audio">Audio</option>
              <option value="Electronics">Electronics</option>
              <option value="Photography">Photography</option>
              <option value="Collectibles">Collectibles</option>
              <option value="Clothes">Clothes</option>
              <option value="Books">Books</option>
              <option value="Vinyl">Vinyl</option>
              <option value="DVD">DVD</option>
              <option value="CDs">CDs</option>
            </select>

            <button onClick={getCloserValue} className="w-full bg-white text-black py-3 rounded-full font-medium hover:bg-zinc-200">
              Get CloserValue Estimate
            </button>
          </div>

          {aiResult && (
            <div className="mt-6 p-5 bg-zinc-900 border border-zinc-800 rounded-xl">
              <div className="text-sm text-zinc-400 mb-1">Recommended Listing Price</div>
              <div className="text-3xl font-semibold mb-2">${aiResult.estimatedLow} – ${aiResult.estimatedHigh}</div>
              <p className="text-sm text-zinc-400">{aiResult.message}</p>
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
              <option value="Audio">Audio</option>
              <option value="Electronics">Electronics</option>
              <option value="Photography">Photography</option>
              <option value="Collectibles">Collectibles</option>
              <option value="Clothes">Clothes</option>
              <option value="Books">Books</option>
              <option value="Vinyl">Vinyl</option>
              <option value="DVD">DVD</option>
              <option value="CDs">CDs</option>
              <option value="Other">Other</option>
            </select>
            
            <textarea placeholder="Description" value={newItem.description} onChange={(e) => setNewItem({...newItem, description: e.target.value})} className="w-full bg-zinc-900 border border-zinc-800 p-3 rounded-lg h-24" />
            <button type="submit" className="w-full bg-white text-black py-3 rounded-full font-medium hover:bg-zinc-200">Post Item</button>
          </form>
        </section>
      )}

      {/* Listings */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-semibold mb-8">Featured Listings</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map((listing) => (
            <div key={listing.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 hover:border-zinc-700 transition-colors">
              <div className="flex justify-between items-start mb-4">
                <span className="text-xs px-3 py-1 bg-zinc-800 rounded-full">{listing.category}</span>
                <span className="font-semibold text-2xl">${listing.price}</span>
              </div>
              <h3 className="font-semibold text-xl mb-3">{listing.title}</h3>
              <p className="text-zinc-400 text-sm">{listing.description}</p>
              <button className="mt-6 w-full py-2.5 border border-zinc-700 rounded-full text-sm hover:bg-zinc-800 transition-colors">
                View Details & Buy
              </button>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
