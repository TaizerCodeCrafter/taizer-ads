import express from 'express';
import mongoose from 'mongoose';
import Ad from '../models/Ad.js';
import SiteConfig from '../models/SiteConfig.js';
import User from '../models/User.js';
import Story from '../models/Story.js';

const router = express.Router();

/**
 * Health & Database Status
 */
router.get('/health', (req, res) => {
  const state = mongoose.connection.readyState;
  const states = { 0: 'Disconnected', 1: 'Connected', 2: 'Connecting', 3: 'Disconnecting' };
  res.json({
    status: 'ok',
    dbState: states[state] || 'Unknown',
    isConnected: state === 1,
    timestamp: new Date().toISOString()
  });
});

/**
 * ADS ENDPOINTS
 */

// GET all ads
router.get('/ads', async (req, res) => {
  try {
    const { status, category, city } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (category) filter.categoryLabel = category;
    if (city) filter.city = city;

    const ads = await Ad.find(filter).sort({ createdAt: -1 }).lean();
    res.json({ success: true, count: ads.length, data: ads });
  } catch (err) {
    console.error('Error fetching ads:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST new ad
router.post('/ads', async (req, res) => {
  try {
    const adData = req.body;
    if (!adData.id) {
      adData.id = `ad-${Date.now()}`;
    }

    const newAd = await Ad.findOneAndUpdate(
      { id: adData.id },
      adData,
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    res.status(201).json({ success: true, data: newAd });
  } catch (err) {
    console.error('Error creating ad:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT update ad
router.put('/ads/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Ad.findOneAndUpdate({ id }, req.body, { new: true });
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Ad not found' });
    }
    res.json({ success: true, data: updated });
  } catch (err) {
    console.error('Error updating ad:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE ad
router.delete('/ads/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Ad.findOneAndDelete({ id });
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Ad not found' });
    }
    res.json({ success: true, message: 'Ad deleted successfully' });
  } catch (err) {
    console.error('Error deleting ad:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

/**
 * SITE CONFIG ENDPOINTS
 */

// GET site config
router.get('/config', async (req, res) => {
  try {
    let config = await SiteConfig.findOne({ key: 'global_config' }).lean();
    if (!config) {
      return res.json({ success: true, data: null, message: 'No custom config in DB yet' });
    }
    res.json({ success: true, data: config });
  } catch (err) {
    console.error('Error fetching config:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT site config
router.put('/config', async (req, res) => {
  try {
    const configData = req.body;
    const updated = await SiteConfig.findOneAndUpdate(
      { key: 'global_config' },
      { ...configData, key: 'global_config' },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    res.json({ success: true, data: updated });
  } catch (err) {
    console.error('Error saving config:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

/**
 * STORIES ENDPOINTS
 */

// GET all stories
router.get('/stories', async (req, res) => {
  try {
    const stories = await Story.find({}).sort({ createdAt: -1 }).lean();
    res.json({ success: true, count: stories.length, data: stories });
  } catch (err) {
    console.error('Error fetching stories:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST new / update story
router.post('/stories', async (req, res) => {
  try {
    const storyData = req.body;
    if (!storyData.id) {
      storyData.id = `story-${Date.now()}`;
    }
    const updated = await Story.findOneAndUpdate(
      { id: storyData.id },
      storyData,
      { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true }
    );
    res.json({ success: true, data: updated });
  } catch (err) {
    console.error('Error saving story:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE story
router.delete('/stories/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Story.findOneAndDelete({ $or: [{ id }, { id: Number(id) }] });
    res.json({ success: true, message: 'Story deleted' });
  } catch (err) {
    console.error('Error deleting story:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

/**
 * USERS ENDPOINTS
 */

// GET users
router.get('/users', async (req, res) => {
  try {
    const users = await User.find({}).sort({ createdAt: -1 }).lean();
    res.json({ success: true, count: users.length, data: users });
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST / PUT user (upsert by id or phone)
router.post('/users', async (req, res) => {
  try {
    const userData = req.body;
    if (!userData.phone) {
      return res.status(400).json({ success: false, message: 'Phone number is required' });
    }

    const rawPhone = String(userData.phone).replace(/[^0-9]/g, '');
    const searchConditions = [];
    if (userData.id) searchConditions.push({ id: userData.id });
    if (userData.phone) searchConditions.push({ phone: userData.phone });
    if (rawPhone.length >= 7) {
      searchConditions.push({ phone: new RegExp(rawPhone.slice(-7) + '$') });
    }

    let existing = await User.findOne({ $or: searchConditions });

    if (existing) {
      const updated = await User.findOneAndUpdate(
        { _id: existing._id },
        { ...userData, id: existing.id || userData.id },
        { returnDocument: 'after' }
      );
      return res.json({ success: true, data: updated });
    } else {
      if (!userData.id) {
        userData.id = `#${Math.floor(10000 + Math.random() * 90000)}`;
      }
      const newUser = await User.create(userData);
      return res.status(201).json({ success: true, data: newUser });
    }
  } catch (err) {
    console.error('Error saving user:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE user
router.delete('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await User.findOneAndDelete({ id });
    res.json({ success: true, message: 'User deleted successfully' });
  } catch (err) {
    console.error('Error deleting user:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

/**
 * SEED DATABASE ENDPOINT
 * Populates MongoDB with default mock ads, users, stories and configuration
 */
router.post('/seed', async (req, res) => {
  try {
    const { ads = [], config = {}, stories = [], users = [] } = req.body;

    let seededAdsCount = 0;
    let seededStoriesCount = 0;
    let seededUsersCount = 0;

    // Seed Ads
    if (ads && ads.length > 0) {
      for (const ad of ads) {
        await Ad.findOneAndUpdate({ id: ad.id }, ad, { upsert: true });
        seededAdsCount++;
      }
    }

    // Seed Stories
    if (stories && stories.length > 0) {
      for (const story of stories) {
        await Story.findOneAndUpdate({ id: story.id }, story, { upsert: true });
        seededStoriesCount++;
      }
    }

    // Seed Users
    if (users && users.length > 0) {
      for (const u of users) {
        await User.findOneAndUpdate({ phone: u.phone }, u, { upsert: true });
        seededUsersCount++;
      }
    }

    // Seed Config
    if (config && Object.keys(config).length > 0) {
      await SiteConfig.findOneAndUpdate(
        { key: 'global_config' },
        { ...config, key: 'global_config' },
        { upsert: true }
      );
    }

    res.json({
      success: true,
      message: `Database successfully seeded with ${seededAdsCount} ads, ${seededUsersCount} users, and ${seededStoriesCount} stories!`,
      seededAdsCount,
      seededStoriesCount,
      seededUsersCount
    });
  } catch (err) {
    console.error('Error seeding database:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
