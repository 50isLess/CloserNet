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
  const [showGrokPrompt, setShowGrokPrompt] = useState(false);
  const [grokPrompt, setGrokPrompt] = useState("");

  const [newItem, setNewItem] = useState({
    title: "", price: "", description: "", category: "Audio", image: ""
  });

  const categories = ["All", "Audio", "Electronics", "Photography", "Collectibles", "Clothes", "Books", "Vinyl", "DVD", "CDs", "Other"];

  const filteredListings = listings.filter(listing => {
    const matchesSearch = listing.title.toLowerCase().includes(searchTerm.toLowerCase()) || listing.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || listing.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Smarter CloserValue AI
  const getCloserValue = () => {
    const { title, category } = aiInput;
    let basePrice = 70;
    const basePrices: { [key: string]: number } = {
      Audio: 200, Electronics: 900, Photography: 650, Collectibles: 380,
      Clothes: 50, Books: 25, Vinyl: 40, DVD: 14, CDs: 16, Other: 55
    };
    basePrice = basePrices[category] || 70;

    const lower = title.toLowerCase();
    if (lower.includes("leica")) basePrice *= 2.3;
    if (lower.includes("macbook")) basePrice *= 1.75;
    if (lower.includes("headphones")) basePrice *= 1.3;
    if (lower.includes("vinyl")) basePrice *= 1.35;

    const low = Math.round(basePrice * 0.82);
    const high = Math.round(basePrice * 1.18);

    setAiResult({ low, high, message: `Based on recent sales in ${category.toLowerCase()}, we recommend $${low} – $${high}.` });
  };

  const generateGrokPrompt = () => {
    const prompt = `I'm selling a "${aiInput.title}" in the ${aiInput.category} category. Can you give me a realistic selling price range based on current market value?`;
    setGrokPrompt(prompt);
    setShowGrokPrompt(true);
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
            <a href="#compare" className="hover:text-zinc-400">Compare</a>
            <button onClick={() => setShowForm(!showForm)} className="px-6 py-2 bg-white text-black rounded-full text-sm font-medium hover:bg-zinc-200">
              {showForm ? "Close" : "Post Item"}
            </button>
          </div>
        </div>
      </nav>

      {/* Hero - Strong Value Prop */}
      <section className="max-w-5xl mx-auto px-6 pt-20 pb-16 text-center">
        <h1 className="text-6xl md:text-7xl font-semibold tracking-tighter mb-6">
          Closer to real value.<br />Protected by escrow.
        </h1>
        <p className="text-xl text-zinc-400 max-w-2xl mx-auto mb-10">
          A simpler peer-to-peer marketplace. Only ~5% total fees.<br />
          Keep more of your money with built-in escrow protection.
        </p>
        <div className="flex gap-4 justify-center">
          <button onClick={() => setShowForm(true)} className="px-8 py-3.5 bg-white text-black rounded-full text-lg font-medium hover:bg-zinc-200">
            Post an Item
          </button>
          <button onClick={() => document.getElementById('value')?.scrollIntoView({ behavior: 'smooth' })} className="px-8 py-3.5 border border-zinc-700 rounded-full text-lg hover:bg-zinc-900">
            Try CloserValue AI
          </button>
        </div>
      </section>

      {/* How it Works */}
      <section id="how" className="max-w-5xl mx-auto px-6 py-16 border-t border-zinc-800">
        <h2 className="text-4xl font-semibold text-center mb-12">How CloserNet Works</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { num: "01", title: "List Your Item", desc: "Post quickly with photos and details. No complicated seller rules or high fees." },
            { num: "02", title: "Secure Escrow", desc: "Buyer pays into escrow. You only ship once the payment is protected." },
            { num: "03", title: "Get Paid Fairly", desc: "Funds are released when the buyer confirms delivery. You keep ~95% of the sale." }
          ].map((step, i) => (
            <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8">
              <div className="text-5xl font-bold text-zinc-700 mb-6">{step.num}</div>
              <h3 className="text-2xl font-semibold mb-3">{step.title}</h3>
              <p className="text-zinc-400">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CloserValue AI + Ask Grok */}
      <section id="value" className="max-w-4xl mx-auto px-6 py-14 border-t border-zinc-800 bg-zinc-900">
        <div className="text-center mb-8">
          <div className="inline-block px-4 py-1 bg-zinc-800 rounded-full text-sm mb-4">DEMO + REAL AI</div>
          <h2 className="text-4xl font-semibold mb-3">CloserValue AI</h2>
          <p className="text-zinc-400">Get a smart price suggestion. For the most accurate price, ask Grok directly.</p>
        </div>

        <div className="max-w-md mx-auto bg-zinc-950 border border-zinc-800 rounded-2xl p-8">
          <div className="space-y-4">
            <input type="text" placeholder="Item title" value={aiInput.title} onChange={(e) => setAiInput({...aiInput, title: e.target.value})} className="w-full bg-zinc-900 border border-zinc-800 p-3 rounded-lg" />
            <select value={aiInput.category} onChange={(e) => setAiInput({...aiInput, category: e.target.value})} className="w-full bg-zinc-900 border border-zinc-800 p-3 rounded-lg">
              {categories.filter(c => c !== "All").map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
            <button onClick={getCloserValue} className="w-full bg-white text-black py-3 rounded-full font-medium hover:bg-zinc-200">Get Demo Estimate</button>
          </div>

          {aiResult && (
            <div className="mt-6 p-5 bg-zinc-900 border border-zinc-800 rounded-xl">
              <div className="text-sm text-zinc-400 mb-1">Demo Estimate</div>
              <div className="text-3xl font-semibold mb-2">${aiResult.low} – ${aiResult.high}</div>
              <p className="text-sm text-zinc-400 mb-4">{aiResult.message}</p>
              <button onClick={generateGrokPrompt} className="w-full py-2.5 border border-zinc-700 rounded-full text-sm hover:bg-zinc-800">
                Get Real Price Suggestion from Grok
              </button>
            </div>
          )}
        </div>
      </section>

      {/* CloserNet vs eBay Comparison */}
      <section id="compare" className="max-w-5xl mx-auto px-6 py-16 border-t border-zinc-800">
        <h2 className="text-4xl font-semibold text-center mb-12">CloserNet vs eBay</h2>
        <div className="overflow-x-auto">
          <table className="w-full border border-zinc-800 rounded-2xl overflow-hidden">
            <thead className="bg-zinc-900">
              <tr>
                <th className="text-left p-6 font-medium">Feature</th>
                <th className="text-center p-6 font-medium text-green-400">CloserNet</th>
                <th className="text-center p-6 font-medium text-zinc-400">eBay</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {[
                ["Total Fees", "~5%", "13%+"],
                ["Escrow Protection", "Built-in & free", "Extra cost or limited"],
                ["Experience", "Simple & modern", "Complex with many rules"],
                ["Seller Payout", "~95% of sale", "~87% of sale"],
                ["Best For", "Used goods & collectibles", "New retail + auctions"]
              ].map(([feature, closer, ebay], i) => (
                <tr key={i} className="hover:bg-zinc-900/50">
                  <td className="p-6 font-medium">{feature}</td>
                  <td className="p-6 text-center text-green-400 font-medium">{closer}</td>
                  <td className="p-6 text-center text-zinc-400">{ebay}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Trust & Safety */}
      <section className="max-w-5xl mx-auto px-6 py-16 border-t border-zinc-800 bg-zinc-900">
        <h2 className="text-4xl font-semibold text-center mb-12">Trust & Safety Built In</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-8">
            <h3 className="text-2xl font-semibold mb-4">Escrow Protection</h3>
            <p className="text-zinc-400">Money is held safely until the buyer confirms they received the item. No more shipping without payment security.</p>
          </div>
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-8">
            <h3 className="text-2xl font-semibold mb-4">Fair for Both Sides</h3>
            <p className="text-zinc-400">Buyers get protection. Sellers get paid reliably. We built CloserNet to reduce risk for everyone involved.</p>
          </div>
        </div>
      </section>

      {/* Search + Filter */}
      <section className="max-w-6xl mx-auto px-6 py-8 border-t border-zinc-800">
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <input type="text" placeholder="Search listings..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="flex-1 bg-zinc-900 border border-zinc-800 p-3 rounded-lg" />
          <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="bg-zinc-900 border border-zinc-800 p-3 rounded-lg md:w-52">
            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        </div>

        {/* Listings */}
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
            <input type="text" placeholder="Image URL (optional)" value={newItem.image} onChange={(e) => setNewItem({...newItem, image: e.target.value})} className="w-full bg-zinc-900 border border-zinc-800 p-3 rounded-lg" />
            <textarea placeholder="Description" value={newItem.description} onChange={(e) => setNewItem({...newItem, description: e.target.value})} className="w-full bg-zinc-900 border border-zinc-800 p-3 rounded-lg h-24" />
            <button type="submit" className="w-full bg-white text-black py-3 rounded-full font-medium hover:bg-zinc-200">Post Item</button>
          </form>
        </section>
      )}

      {/* Grok Prompt Modal */}
      {showGrokPrompt && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-zinc-900 border border-zinc-700 rounded-2xl p-8 max-w-lg mx-4">
            <h3 className="text-xl font-semibold mb-4">Ask Grok for a Real Price</h3>
            <p className="text-zinc-400 mb-4">Copy this message and paste it in our chat:</p>
            <div className="bg-zinc-950 p-4 rounded-lg text-sm mb-6 border border-zinc-800">{grokPrompt}</div>
            <div className="flex gap-3">
              <button onClick={() => { navigator.clipboard.writeText(grokPrompt); alert("Copied! Now paste it in our chat."); }} className="flex-1 py-3 bg-white text-black rounded-full font-medium">Copy Message</button>
              <button onClick={() => setShowGrokPrompt(false)} className="flex-1 py-3 border border-zinc-700 rounded-full">Close</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
