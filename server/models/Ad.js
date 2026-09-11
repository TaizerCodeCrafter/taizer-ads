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
    status: { type: String, default: 'Pending Approval' }, // 'Pending Approval' | 'Approved' | 'Fake Ad' | 'Rejected'
    isApproved: { type: Boolean, default: false },
    paymentSlip: { type: String, default: '' },
    paymentMethod: { type: String, default: 'Bank Transfer' }, // 'Bank Transfer' | 'Wallet Credits' | 'Direct'
    paymentStatus: { type: String, default: 'Pending Verification' }, // 'Pending Verification' | 'Verified' | 'Paid via Wallet' | 'Rejected'
    paymentAmount: { type: Number, default: 0 },
    paymentRef: { type: String, default: '' },
    rejectionReason: { type: String, default: '' },
    submittedAt: { type: Date, default: Date.now },
    approvedAt: { type: Date },
    isFake: { type: Boolean, default: false },
    expiryDate: { type: String, default: '' },
    autoExpireDays: { type: Number, default: 5 },
    renewalStatus: { type: String, default: 'none' }, // 'none' | 'requested' | 'renewed'
    packageUpgradeRequested: { type: String, default: '' },
    packagePaidWithCredits: { type: Boolean, default: false },
    packageRequestedAt: { type: Date },
    userName: { type: String, default: '' },
    userId: { type: String, default: '' }
  },
  {
    timestamps: true,
    strict: false
  }
);

export default mongoose.models.Ad || mongoose.model('Ad', AdSchema);
