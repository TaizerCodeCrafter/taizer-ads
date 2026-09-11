import React, { useState } from 'react';
import { X, Upload, CheckCircle2 } from 'lucide-react';
import { useDialog } from '../context/DialogContext.jsx';

export default function PostAdModal({ isOpen, onClose, onAddAd }) {
  const { showAlert } = useDialog();
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('spa');
  const [badgeType, setBadgeType] = useState('Super Ad');
  const [phone, setPhone] = useState('0771234567');
  const [whatsapp, setWhatsapp] = useState('94771234567');
  const [imageUrl, setImageUrl] = useState('https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600&auto=format&fit=crop&q=80');
  const [description, setDescription] = useState('');
  const [cashBack, setCashBack] = useState(true);
  const [realImage, setRealImage] = useState(true);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      await showAlert({
        title: 'Information Required',
        titleSin: 'තොරතුරු අවශ්‍යයි',
        message: 'Please fill in both title and description for your advertisement.',
        messageSin: 'කරුණාකර දැන්වීමේ මාතෘකාව සහ විස්තරය ඇතුළත් කරන්න.',
        type: 'warning'
      });
      return;
    }

    const newAd = {
      id: 'ad-' + Date.now(),
      badgeType,
      likes: 1,
      likesDisplay: '1 Likes',
      views: '1 Views',
      postedTime: 'Just now',
      cashBack,
      realImage,
      verifiedSeller: true,
      rating: badgeType === 'Super Ad' ? '★★★★★ (Score: 10/10)' : null,
      title,
      category,
      phone,
      whatsapp,
      image: imageUrl,
      description,
      isSaved: false,
      isFake: false,
    };

    onAddAd(newAd);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl border border-gray-100 overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-[#f03a5f] text-white px-5 py-3.5 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold">Post New Advertisement</h3>
            <p className="text-xs text-pink-100">නව දැන්වීමක් පළ කරන්න</p>
          </div>
          <button 
            onClick={onClose}
            className="p-1 text-white/80 hover:text-white rounded-lg hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-3.5 text-xs text-gray-700">
          <div>
            <label className="block font-bold text-gray-800 mb-1">Ad Title / මාතෘකාව *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Luxury Ayurveda Spa & Body Therapy in Colombo"
              className="w-full border border-gray-300 rounded-lg p-2 text-xs focus:outline-none focus:border-[#f03a5f]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-gray-800 mb-1">Category / වර්ගය</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-2 text-xs focus:outline-none focus:border-[#f03a5f] bg-white"
              >
                <option value="spa">Spa & Massage Wellness</option>
                <option value="studio">Live Cam & Studio</option>
                <option value="lifestyle">Personal & Lifestyle</option>
                <option value="salerent">Sale / Rent</option>
                <option value="marriage">Marriage Proposal</option>
                <option value="accessories">Toys & Accessories</option>
                <option value="rooms">Rooms & Boarding</option>
                <option value="vehicles">Vehicles & Rides</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-gray-800 mb-1">Badge Type</label>
              <select
                value={badgeType}
                onChange={(e) => setBadgeType(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-2 text-xs focus:outline-none focus:border-[#f03a5f] bg-white font-semibold"
              >
                <option value="Super Ad">Super Ad (Gold border)</option>
                <option value="VIP Ad">VIP Ad (Red border)</option>
                <option value="NRA Ad">NRA Ad (Blue border)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-gray-800 mb-1">Phone Number</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="0771234567"
                className="w-full border border-gray-300 rounded-lg p-2 text-xs focus:outline-none focus:border-[#f03a5f]"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-800 mb-1">WhatsApp Number (with country code)</label>
              <input
                type="text"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                placeholder="94771234567"
                className="w-full border border-gray-300 rounded-lg p-2 text-xs focus:outline-none focus:border-[#f03a5f]"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-gray-800 mb-1">Image URL / පින්තූර Link</label>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://images.unsplash.com/..."
              className="w-full border border-gray-300 rounded-lg p-2 text-xs focus:outline-none focus:border-[#f03a5f]"
            />
          </div>

          <div>
            <label className="block font-bold text-gray-800 mb-1">Description / විස්තරය *</label>
            <textarea
              rows={3}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="දැන්වීම පිළිබඳ සම්පූර්ණ විස්තරය මෙහි ලියන්න..."
              className="w-full border border-gray-300 rounded-lg p-2 text-xs focus:outline-none focus:border-[#f03a5f]"
            />
          </div>

          <div className="flex items-center space-x-4 pt-1">
            <label className="flex items-center space-x-2 cursor-pointer font-medium">
              <input
                type="checkbox"
                checked={cashBack}
                onChange={(e) => setCashBack(e.target.checked)}
                className="rounded text-[#16a34a] focus:ring-0 w-3.5 h-3.5"
              />
              <span>Cash Back Guaranteed</span>
            </label>

            <label className="flex items-center space-x-2 cursor-pointer font-medium">
              <input
                type="checkbox"
                checked={realImage}
                onChange={(e) => setRealImage(e.target.checked)}
                className="rounded text-[#7c3aed] focus:ring-0 w-3.5 h-3.5"
              />
              <span>Real Image</span>
            </label>
          </div>

          <div className="flex items-center justify-end space-x-2 pt-3 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#f03a5f] hover:bg-[#d92348] text-white font-bold rounded-lg shadow-sm transition"
            >
              Publish Ad
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
