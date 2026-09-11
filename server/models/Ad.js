import mongoose from 'mongoose';

const AdSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true },
    titleSin: { type: String, default: '' },
    categoryLabel: { type: String, default: 'Services' },
    location: { type: String, default: 'Colombo' },
    city: { type: String, default: 'Colombo' },
    price: { type: String, default: '' },
    description: { type: String, default: '' },
    descriptionSin: { type: String, default: '' },
    image: { type: String, default: '' },
    images: { type: [String], default: [] },
    phone: { type: String, default: '' },
    whatsapp: { type: String, default: '' },
    badgeType: { type: String, default: 'Normal Ad' },
    badgeColor: { type: String, default: 'blue' },
    likes: { type: Number, default: 0 },
    views: { type: String, default: '0 Views' },
    postedTime: { type: String, default: 'Just now' },
    status: { type: String, default: 'Pending Approval' }, // 'Pending Approval' | 'Approved' | 'Fake Ad'
    isFake: { type: Boolean, default: false },
    expiryDate: { type: String, default: '' },
    autoExpireDays: { type: Number, default: 5 },
    renewalStatus: { type: String, default: 'none' }, // 'none' | 'requested' | 'renewed'
    userName: { type: String, default: '' },
    userId: { type: String, default: '' }
  },
  {
    timestamps: true,
    strict: false
  }
);

export default mongoose.models.Ad || mongoose.model('Ad', AdSchema);
