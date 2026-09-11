import mongoose from 'mongoose';

const SiteConfigSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true, default: 'global_config' },
    topBanner: { type: Object, default: {} },
    safetyBanner: { type: Object, default: {} },
    loginForm: { type: Object, default: {} },
    smsGateway: { type: Object, default: {} },
    pricing: { type: Object, default: {} },
    bankDetails: { type: Object, default: {} },
    contact: { type: Object, default: {} },
    agents: { type: Array, default: [] },
    complaints: { type: Array, default: [] },
    notices: { type: Array, default: [] },
    adminProfile: { type: Object, default: {} },
    sideBlog: { type: Object, default: {} }
  },
  {
    timestamps: true,
    strict: false
  }
);

export default mongoose.models.SiteConfig || mongoose.model('SiteConfig', SiteConfigSchema);
