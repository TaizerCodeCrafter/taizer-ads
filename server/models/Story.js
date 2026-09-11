import mongoose from 'mongoose';

const StorySchema = new mongoose.Schema(
  {
    id: { type: mongoose.Schema.Types.Mixed, required: true, unique: true },
    name: { type: String, required: true },
    fullTitle: { type: String, default: '' },
    image: { type: String, default: '' },
    isLive: { type: Boolean, default: true }
  },
  {
    timestamps: true,
    strict: false
  }
);

export default mongoose.models.Story || mongoose.model('Story', StorySchema);
