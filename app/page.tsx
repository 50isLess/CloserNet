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
      description: "Excellent condition. Barely used. Original box included.",
      category: "Audio"
    },
    {
      id: 2,
      title: "Vintage Leica M6 Camera",
      price: 1850,
      description: "Beautiful condition. Recently serviced with 50mm lens.",
      category: "Photography"
    },
    {
      id: 3,
      title: "MacBook Pro 16\" M3 Max",
      price: 2450,
      description: "2024 model. 64GB RAM, 1TB SSD. Like new condition.",
      category: "Electronics"
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
    <main className="min-h-screen bg-white text-gray-900">
      {/* Navbar */}
      <nav className="border-b sticky top-0 bg-white z-50">
        <div className="max-w-6xl mx-auto px-6 py-5 flex justify-between items-center">
          <div className="text-2xl font-semibold tracking-tight">CloserNet</div>
          <div className="flex items-center gap-4">
            <a href="#how" className="text-sm hover:text-gray-600">How it Works</a>
            <a href="#why" className="text-sm hover:text-gray-600">Why CloserNet</a>
            <button 
              onClick={() => setShowForm(!showForm)}
              className="px-6 py-2 bg-black text-white rounded-full text-sm hover:bg-gray-800 transition-colors"
            >
              {showForm ? "Close" : "Post an Item"}
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-5xl mx-auto px-6 pt-20 pb-16 text-center">
        <h1 className="text-6xl font-semibold tracking-tighter mb-6">
          Closer to real value.<br />Protected by escrow.
        </h1>
        <p className="text-2xl text-gray-600 max-w-3xl mx-auto mb-10">
          A simpler, fairer peer-to-peer marketplace. <br />
          Only ~5% total fees — keep more of your money.
        </p>
        <div className="flex gap-4 justify-center">
          <button 
            onClick={() => setShowForm(true)}
            className="px-8 py-3.5 bg-black text-white rounded-full text-lg hover:bg-gray-800 transition-colors"
          >
            Post an Item
          </button>
          <a href="#how" className="px-8 py-3.5 border border-gray-300 rounded-full text-lg hover:bg-gray-50 transition-colors">
            Learn How It Works
          </a>
        </div>
      </section>

      {/* How it Works */}
      <section id="how" className="max-w-5xl mx-auto px-6 py-16 border-t">
        <h2 className="text-4xl font-semibold text-center mb-12">How CloserNet Works</h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-gray-50 p-8 rounded-2xl">
            <div className="text-5xl font-bold text-gray-200 mb-4">01</div>
            <h3 className="text-2xl font-semibold mb-3">List Your Item</h3>
            <p className="text-gray-600">Post your item quickly with clear photos and descriptions. No complicated rules or high fees.</p>
          </div>
          
          <div className="bg-gray-50 p-8 rounded-2xl">
            <div className="text-5xl font-bold text-gray-200 mb-4">02</div>
            <h3 className="text-2xl font-semibold mb-3">Secure Escrow Payment</h3>
            <p className="text-gray-600">When someone buys your item, the money goes into escrow. You only ship once the payment is secured.</p>
          </div>
          
          <div className="bg-gray-50 p-8 rounded-2xl">
            <div className="text-5xl font-bold text-gray-200 mb-4">03</div>
            <h3 className="text-2xl font-semibold mb-3">Get Paid Safely</h3>
            <p className="text-gray-600">Once the buyer confirms they received the item, the money is released to you. Simple and secure.</p>
          </div>
        </div>
      </section>

      {/* Why CloserNet */}
      <section id="why" className="max-w-5xl mx-auto px-6 py-16 border-t bg-gray-50">
        <h2 className="text-4xl font-semibold text-center mb-12">Why Sellers Choose CloserNet</h2>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-2xl border">
            <h3 className="text-2xl font-semibold mb-4">Much Lower Fees</h3>
            <p className="text-gray-600 mb-4">Only about <span className="font-semibold">5% total fees</span> — compared to 13%+ on eBay and other platforms. You keep significantly more of your money.</p>
            <p className="text-sm text-gray-500">Example: Sell a $300 item and keep ~$285 instead of ~$260.</p>
          </div>

          <div className="bg-white p-8 rounded-2xl border">
            <h3 className="text-2xl font-semibold mb-4">Built-in Trust & Safety</h3>
            <p className="text-gray-600">Our escrow system protects both buyers and sellers. No more worrying about getting scammed or not getting paid after shipping.</p>
          </div>

          <div className="bg-white p-8 rounded-2xl border">
            <h3 className="text-2xl font-semibold mb-4">Simpler Experience</h3>
            <p className="text-gray-600">No complicated seller rules, account health scores, or surprise fees. Just list, sell, and get paid.</p>
          </div>

          <div className="bg-white p-8 rounded-2xl border">
            <h3 className="text-2xl font-semibold mb-4">Better for Everyone</h3>
            <p className="text-gray-600">Buyers get protection. Sellers keep more money. Both sides win with a fairer system.</p>
          </div>
        </div>
      </section>

      {/* Post Item Form */}
      {showForm && (
        <section className="max-w-xl mx-auto px-6 py-10 border-t">
          <h3 className="text-2xl font-semibold mb-6">Post a New Item</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input type="text" placeholder="Item Title" value={newItem.title} 
              onChange={(e) => setNewItem({...newItem, title: e.target.value})} 
              className="w-full border p-3 rounded-lg" required />
            
            <input type="number" placeholder="Price in USD" value={newItem.price} 
              onChange={(e) => setNewItem({...newItem, price: e.target.value})} 
              className="w-full border p-3 rounded-lg" required />
            
            <select value={newItem.category} onChange={(e) => setNewItem({...newItem, category: e.target.value})} 
              className="w-full border p-3 rounded-lg">
              <option value="Audio">Audio Equipment</option>
              <option value="Electronics">Electronics</option>
              <option value="Photography">Photography</option>
              <option value="Collectibles">Collectibles</option>
              <option value="Other">Other</option>
            </select>
            
            <textarea placeholder="Description" value={newItem.description} 
              onChange={(e) => setNewItem({...newItem, description: e.target.value})} 
              className="w-full border p-3 rounded-lg h-28" />
            
            <button type="submit" className="w-full bg-black text-white py-3 rounded-full hover:bg-gray-800">
              Post Item to CloserNet
            </button>
          </form>
        </section>
      )}

      {/* Listings Section */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-semibold">Featured Listings</h2>
            <p className="text-gray-600 mt-1">Real items from real sellers</p>
          </div>
          <button onClick={() => setShowForm(true)} className="text-sm px-5 py-2 border rounded-full hover:bg-gray-50">
            + Post New Item
          </button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map((listing) => (
            <div key={listing.id} className="border rounded-2xl p-6 hover:shadow-sm transition-shadow">
              <div className="flex justify-between mb-4">
                <span className="text-xs px-3 py-1 bg-gray-100 rounded-full">{listing.category}</span>
                <span className="font-semibold text-2xl">${listing.price}</span>
              </div>
              <h3 className="font-semibold text-xl mb-2">{listing.title}</h3>
              <p className="text-gray-600 text-sm">{listing.description}</p>
              <button className="mt-6 w-full py-2.5 border border-gray-300 rounded-full text-sm hover:bg-gray-50">
                View Details & Buy
              </button>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t py-10 text-center text-sm text-gray-500">
        CloserNet • Lower Fees • Escrow Protected • Simpler Selling
      </footer>
    </main>
  );
}
