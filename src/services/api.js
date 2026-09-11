/**
 * Taizer Ads API Client
 * Interfaces with the Express.js / MongoDB backend
 * Supports graceful fallback to local data if the database or server is offline
 */

const API_BASE = '/api';

/**
 * Check backend and database health status
 */
export async function checkDbHealth() {
  try {
    const res = await fetch(`${API_BASE}/health`, { signal: AbortSignal.timeout(3000) });
    if (!res.ok) return { isConnected: false, dbState: 'Server Error' };
    const data = await res.json();
    return data;
  } catch (err) {
    return { isConnected: false, dbState: 'Offline (Using Local Mode)', error: err.message };
  }
}

/**
 * Fetch all advertisements from MongoDB
 */
export async function fetchAdsFromDb() {
  try {
    const res = await fetch(`${API_BASE}/ads`, { signal: AbortSignal.timeout(4000) });
    if (!res.ok) return null;
    const data = await res.json();
    return data?.data || null;
  } catch (err) {
    console.warn('Could not fetch ads from MongoDB, falling back to local data.', err.message);
    return null;
  }
}

/**
 * Create or save an ad in MongoDB
 */
export async function createAdInDb(adData) {
  try {
    const res = await fetch(`${API_BASE}/ads`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(adData)
    });
    const data = await res.json();
    return data;
  } catch (err) {
    console.warn('Failed to save ad to MongoDB:', err.message);
    return { success: false, error: err.message };
  }
}

/**
 * Update an existing ad in MongoDB
 */
export async function updateAdInDb(id, updates) {
  try {
    const res = await fetch(`${API_BASE}/ads/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    const data = await res.json();
    return data;
  } catch (err) {
    console.warn('Failed to update ad in MongoDB:', err.message);
    return { success: false, error: err.message };
  }
}

/**
 * Delete an ad from MongoDB
 */
export async function deleteAdInDb(id) {
  try {
    const res = await fetch(`${API_BASE}/ads/${id}`, {
      method: 'DELETE'
    });
    const data = await res.json();
    return data;
  } catch (err) {
    console.warn('Failed to delete ad from MongoDB:', err.message);
    return { success: false, error: err.message };
  }
}

/**
 * Fetch global site configuration from MongoDB
 */
export async function fetchConfigFromDb() {
  try {
    const res = await fetch(`${API_BASE}/config`, { signal: AbortSignal.timeout(4000) });
    if (!res.ok) return null;
    const data = await res.json();
    return data?.data || null;
  } catch (err) {
    console.warn('Could not fetch config from MongoDB, using local config.', err.message);
    return null;
  }
}

/**
 * Save global site configuration to MongoDB
 */
export async function saveConfigToDb(configData) {
  try {
    const res = await fetch(`${API_BASE}/config`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(configData)
    });
    const data = await res.json();
    return data;
  } catch (err) {
    console.warn('Failed to save config to MongoDB:', err.message);
    return { success: false, error: err.message };
  }
}

/**
 * Fetch all users from MongoDB
 */
export async function fetchUsersFromDb() {
  try {
    const res = await fetch(`${API_BASE}/users`, { signal: AbortSignal.timeout(4000) });
    if (!res.ok) return null;
    const data = await res.json();
    return data?.data || null;
  } catch (err) {
    console.warn('Could not fetch users from MongoDB:', err.message);
    return null;
  }
}

/**
 * Save user to MongoDB
 */
export async function saveUserToDb(userData) {
  try {
    const res = await fetch(`${API_BASE}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    return await res.json();
  } catch (err) {
    console.warn('Failed to save user to MongoDB:', err.message);
    return { success: false, error: err.message };
  }
}

/**
 * Delete user from MongoDB
 */
export async function deleteUserFromDb(id) {
  try {
    const res = await fetch(`${API_BASE}/users/${encodeURIComponent(id)}`, {
      method: 'DELETE'
    });
    return await res.json();
  } catch (err) {
    console.warn('Failed to delete user from MongoDB:', err.message);
    return { success: false, error: err.message };
  }
}

/**
 * Fetch all stories from MongoDB
 */
export async function fetchStoriesFromDb() {
  try {
    const res = await fetch(`${API_BASE}/stories`, { signal: AbortSignal.timeout(4000) });
    if (!res.ok) return null;
    const data = await res.json();
    return data?.data || null;
  } catch (err) {
    console.warn('Could not fetch stories from MongoDB:', err.message);
    return null;
  }
}

/**
 * Create or save a story in MongoDB
 */
export async function createStoryInDb(storyData) {
  try {
    const res = await fetch(`${API_BASE}/stories`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(storyData)
    });
    return await res.json();
  } catch (err) {
    console.warn('Failed to save story to MongoDB:', err.message);
    return { success: false, error: err.message };
  }
}

/**
 * Delete a story from MongoDB
 */
export async function deleteStoryInDb(id) {
  try {
    const res = await fetch(`${API_BASE}/stories/${encodeURIComponent(id)}`, {
      method: 'DELETE'
    });
    return await res.json();
  } catch (err) {
    console.warn('Failed to delete story from MongoDB:', err.message);
    return { success: false, error: err.message };
  }
}

/**
 * One-click Database Seeder
 * Uploads all mock ads, stories, users, and site config to MongoDB
 */
export async function seedDatabaseToMongo({ ads, config, stories, users }) {
  try {
    const res = await fetch(`${API_BASE}/seed`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ads, config, stories, users })
    });
    const data = await res.json();
    return data;
  } catch (err) {
    console.error('Failed to seed MongoDB:', err);
    return { success: false, message: err.message };
  }
}
