import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, default: 'User' },
    phone: { type: String, required: true, index: true },
    email: { type: String, default: '' },
    role: { type: String, default: 'User' }, // 'User' | 'Verified Advertiser' | 'Super Admin'
    status: { type: String, default: 'Active' },
    credits: { type: Number, default: 0 },
    joinedDate: { type: String, default: () => new Date().toISOString().split('T')[0] },
    lastActive: { type: String, default: 'Just now' },
    location: { type: String, default: 'Colombo' },
    notes: { type: String, default: '' },
    creditHistory: { type: Array, default: [] },
    savedAds: { type: [String], default: [] }
  },
  {
    timestamps: true,
    strict: false
  }
);

export default mongoose.models.User || mongoose.model('User', UserSchema);
