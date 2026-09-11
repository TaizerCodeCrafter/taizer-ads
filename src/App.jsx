import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import AppBanner from './components/AppBanner';
import StoryAvatars from './components/StoryAvatars';
import SocialSubscribe from './components/SocialSubscribe';
import AdCard from './components/AdCard';
import AdDetailView from './components/AdDetailView';
import UserDashboard from './components/UserDashboard';
import AdminPanel from './components/AdminPanel/AdminPanel';
import CeoAdminLogin from './components/AdminPanel/CeoAdminLogin';
import LoginForm from './components/LoginForm';
import Footer from './components/Footer';
import QuickSideWidget from './components/QuickSideWidget';
import MobileMenuDrawer from './components/MobileMenuDrawer';
import MobileHomeBar from './components/MobileHomeBar';
import { getAdValidity, calculateExpiryDate, calculateExpiryFromDateString, getDaysBetween, matchAdSearch } from './utils/adValidity';
import { 
  SafetyModal, 
  HowToPublishModal, 
  AgentsModal, 
  FakeAdsModal,
  AboutModal,
  ContactModal,
  FaqModal
} from './components/Modals';
import { initialAds, mockStories, initialUsers } from './data/mockAds';
import { defaultSiteConfig } from './data/siteConfig';
import NoticeBanner from './components/NoticeBanner';
import { CheckCircle2, AlertTriangle, Flame, Phone, MessageCircle, X, Sparkles } from 'lucide-react';
import {
  checkDbHealth,
  fetchAdsFromDb,
  createAdInDb,
  updateAdInDb,
  deleteAdInDb,
  fetchConfigFromDb,
  saveConfigToDb,
  fetchUsersFromDb,
  saveUserToDb,
  deleteUserFromDb,
  fetchStoriesFromDb,
  createStoryInDb,
  deleteStoryInDb,
  seedDatabaseToMongo
} from './services/api';

export default function App() {
  const [ads, setAds] = useState(() => {
    try {
      const saved = localStorage.getItem('taizer_ads_ad_list') || localStorage.getItem('lanka_ads_ad_list');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to parse saved ads', e);
    }
    return initialAds;
  });
  const [stories, setStories] = useState(() => {
    try {
      const saved = localStorage.getItem('taizer_ads_stories') || localStorage.getItem('lanka_ads_stories');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to parse saved stories', e);
    }
    return mockStories;
  });
  const [selectedStoryOffer, setSelectedStoryOffer] = useState(null);
  const [users, setUsers] = useState(() => {
    try {
      const saved = localStorage.getItem('taizer_ads_users') || localStorage.getItem('lanka_ads_users');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to parse saved users', e);
    }
    return initialUsers;
  });
  const [siteConfig, setSiteConfig] = useState(() => {
    try {
      const saved = localStorage.getItem('taizer_ads_site_config') || localStorage.getItem('lanka_ads_site_config');
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...defaultSiteConfig,
          ...parsed,
          adminProfile: {
            ...defaultSiteConfig.adminProfile,
            ...(parsed.adminProfile || {})
          },
          loginForm: {
            ...defaultSiteConfig.loginForm,
            ...(parsed.loginForm || {})
          },
          smsGateway: {
            ...defaultSiteConfig.smsGateway,
            ...(parsed.smsGateway || {})
          }
        };
      }
    } catch (e) {
      console.error('Failed to parse saved site config', e);
    }
    return defaultSiteConfig;
  });
  const [selectedAd, setSelectedAd] = useState(null);
  const [currentView, setCurrentView] = useState(() => {
    try {
      const savedUser = localStorage.getItem('taizer_ads_current_user');
      const savedView = localStorage.getItem('taizer_ads_current_view');
      if (savedUser && savedView === 'dashboard') {
        return 'dashboard';
      }
    } catch (e) {}
    return 'feed';
  });
  const [dashboardTab, setDashboardTab] = useState('new-ad');
  const [currentLang, setCurrentLang] = useState('sin'); // 'sin' | 'en'

  // Authentication State (Persisted in localStorage across page refreshes)
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('taizer_ads_current_user');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to parse saved current user', e);
    }
    return null;
  });

  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    try {
      const saved = localStorage.getItem('taizer_ads_current_user');
      return Boolean(saved);
    } catch (e) {
      return false;
    }
  });
  const [isCeoUnlocked, setIsCeoUnlocked] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilterQuery, setActiveFilterQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [savedOnly, setSavedOnly] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Modals state
  const [isSafetyModalOpen, setIsSafetyModalOpen] = useState(false);
  const [isHowToPublishOpen, setIsHowToPublishOpen] = useState(false);
  const [isAgentsOpen, setIsAgentsOpen] = useState(false);
  const [isFakeAdsOpen, setIsFakeAdsOpen] = useState(false);
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isFaqModalOpen, setIsFaqModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [dbStatus, setDbStatus] = useState({ isConnected: false, dbState: 'Checking...' });

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Check MongoDB health and load live data if available
  const refreshDbStatus = async () => {
    try {
      const health = await checkDbHealth();
      setDbStatus(health);
      return health;
    } catch (e) {
      setDbStatus({ isConnected: false, dbState: 'Offline' });
      return { isConnected: false };
    }
  };

  useEffect(() => {
    const initMongoData = async () => {
      const health = await refreshDbStatus();
      if (health && health.isConnected) {
        // 1. Fetch ads from MongoDB
        const dbAds = await fetchAdsFromDb();
        if (dbAds && dbAds.length > 0) {
          setAds(dbAds);
          try {
            localStorage.setItem('taizer_ads_ad_list', JSON.stringify(dbAds));
          } catch (e) {}
        }

        // 2. Fetch site configuration from MongoDB
        const dbConfig = await fetchConfigFromDb();
        if (dbConfig) {
          setSiteConfig(prev => {
            const merged = {
              ...defaultSiteConfig,
              ...prev,
              ...dbConfig,
              adminProfile: {
                ...defaultSiteConfig.adminProfile,
                ...(prev.adminProfile || {}),
                ...(dbConfig.adminProfile || {})
              }
            };
            try {
              localStorage.setItem('taizer_ads_site_config', JSON.stringify(merged));
            } catch (e) {}
            return merged;
          });
        }

        // 3. Fetch users from MongoDB
        const dbUsers = await fetchUsersFromDb();
        if (dbUsers && dbUsers.length > 0) {
          setUsers(dbUsers);
          try {
            localStorage.setItem('taizer_ads_users', JSON.stringify(dbUsers));
            const savedUserStr = localStorage.getItem('taizer_ads_current_user');
            if (savedUserStr) {
              const parsedUser = JSON.parse(savedUserStr);
              const fresh = dbUsers.find(u => u.id === parsedUser.id || (u.phone && parsedUser.phone && u.phone.replace(/[^0-9]/g, '') === parsedUser.phone.replace(/[^0-9]/g, '')));
              if (fresh) {
                setCurrentUser(fresh);
                localStorage.setItem('taizer_ads_current_user', JSON.stringify(fresh));
              }
            }
          } catch (e) {}
        } else {
          // If no users in MongoDB yet, seed initial mock users
          initialUsers.forEach(u => {
            saveUserToDb(u).catch(e => console.warn('User seed error', e));
          });
        }

        // 4. Fetch stories from MongoDB
        const dbStories = await fetchStoriesFromDb();
        if (dbStories && dbStories.length > 0) {
          setStories(dbStories);
          try {
            localStorage.setItem('taizer_ads_stories', JSON.stringify(dbStories));
          } catch (e) {}
        } else {
          // If no stories in MongoDB yet, seed mock stories
          mockStories.forEach(s => {
            createStoryInDb(s).catch(e => console.warn('Story seed error', e));
          });
        }
      }
    };

    initMongoData();
  }, []);

  // Secret CEO URL Route Detection (e.g. /ceo, #ceo, ?ceo)
  useEffect(() => {
    const checkCeoRoute = () => {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      const search = window.location.search.toLowerCase();
      
      if (path.includes('ceo') || hash.includes('ceo') || search.includes('ceo')) {
        if (!isCeoUnlocked) {
          setCurrentView('ceo-login');
        } else {
          setCurrentView('admin');
        }
      }
    };

    checkCeoRoute();
    window.addEventListener('popstate', checkCeoRoute);
    window.addEventListener('hashchange', checkCeoRoute);
    return () => {
      window.removeEventListener('popstate', checkCeoRoute);
      window.removeEventListener('hashchange', checkCeoRoute);
    };
  }, [isCeoUnlocked]);

  // Exit Admin and clear URL back to root
  const handleExitAdmin = () => {
    if (window.location.pathname.includes('ceo') || window.location.hash.includes('ceo') || window.location.search.includes('ceo')) {
      window.history.pushState(null, '', '/');
    }
    setIsCeoUnlocked(false);
    setCurrentView('feed');
    showToast('Admin session closed. (ප්‍රසිද්ධ මුල් පිටුවට පැමිණියෙමු)');
  };

  // Update site configuration and persist to localStorage & MongoDB
  const handleUpdateSiteConfig = (cfg) => {
    setSiteConfig(cfg);
    try {
      localStorage.setItem('taizer_ads_site_config', JSON.stringify(cfg));
    } catch (e) {
      console.error('Failed to persist siteConfig to localStorage', e);
    }
    saveConfigToDb(cfg).catch(err => console.warn('Mongo config save sync failed', err));
  };

  // Update users and persist to localStorage & MongoDB
  const handleUpdateUsers = (newUsers, specificUser = null) => {
    setUsers(newUsers);
    try {
      localStorage.setItem('taizer_ads_users', JSON.stringify(newUsers));
    } catch (e) {
      console.error('Failed to persist users to localStorage', e);
    }
    if (specificUser) {
      saveUserToDb(specificUser).catch(err => console.warn('Mongo user save sync failed', err));
    } else if (newUsers && newUsers.length > 0) {
      newUsers.forEach(u => {
        saveUserToDb(u).catch(err => console.warn('Mongo user save sync failed', err));
      });
    }
  };

  // Adjust user credits (Add or Deduct)
  const handleAdjustUserCredits = (userId, amount, note, type = 'add') => {
    const numAmount = Math.abs(Number(amount) || 0);
    if (numAmount <= 0) return;
    const delta = type === 'add' ? numAmount : -numAmount;

    let updatedUserObj = null;
    const updatedUsers = users.map((u) => {
      if (u.id === userId) {
        const newCredits = Math.max(0, (u.credits || 0) + delta);
        const tx = {
          id: `tx-${Date.now()}`,
          amount: numAmount,
          type,
          date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
          note: note || (type === 'add' ? 'Admin Deposit / Top-up' : 'Admin Deduction')
        };
        updatedUserObj = {
          ...u,
          credits: newCredits,
          creditHistory: [tx, ...(u.creditHistory || [])]
        };
        return updatedUserObj;
      }
      return u;
    });

    handleUpdateUsers(updatedUsers, updatedUserObj);

    // If currently logged in user is this user, also update currentUser state and persistence
    if (currentUser && currentUser.id === userId && updatedUserObj) {
      setCurrentUser(updatedUserObj);
      try {
        localStorage.setItem('taizer_ads_current_user', JSON.stringify(updatedUserObj));
      } catch (e) {}
    }

    showToast(`User ${userId} credits: ${type === 'add' ? '+' : '-'}Rs. ${numAmount.toLocaleString()}.00`);
  };

  // Use credits to activate an ad package from User Dashboard
  const handleUseCredits = (amount, packageName) => {
    if (!currentUser) return false;
    const currentCredits = currentUser.credits || 0;
    if (currentCredits < amount) {
      showToast('ක්‍රෙඩිට් ශේෂය ප්‍රමාණවත් නොවේ. (Insufficient credits balance)');
      return false;
    }
    handleAdjustUserCredits(currentUser.id, amount, `Activated ${packageName} package`, 'deduct');
    showToast(`Rs. ${amount.toLocaleString()} deducted for ${packageName}!`);
    return true;
  };

  // User Login handler
  const handleLoginSuccess = (userData) => {
    const rawPhone = (userData?.phone || '').replace(/[^0-9]/g, '');
    let matchedUser = users.find((u) => {
      const uPhone = (u.phone || '').replace(/[^0-9]/g, '');
      return uPhone === rawPhone || (rawPhone.length >= 7 && uPhone.endsWith(rawPhone.slice(-7)));
    });

    if (!matchedUser) {
      matchedUser = {
        id: `#${Math.floor(10000 + Math.random() * 90000)}`,
        name: `User ${userData.phone}`,
        phone: userData.phone,
        email: '',
        role: 'Advertiser',
        status: 'Active',
        credits: 0,
        joinedDate: new Date().toISOString().split('T')[0],
        lastActive: 'Just now',
        location: 'Colombo',
        notes: 'Auto-registered via OTP Login',
        creditHistory: []
      };
      handleUpdateUsers([matchedUser, ...users]);
    } else {
      matchedUser = { ...matchedUser, lastActive: 'Just now' };
      handleUpdateUsers(users.map((u) => (u.id === matchedUser.id ? matchedUser : u)));
    }

    // Explicitly sync this user account to MongoDB
    saveUserToDb(matchedUser).catch((err) => console.warn('Mongo user register sync failed', err));

    setIsLoggedIn(true);
    setCurrentUser(matchedUser);
    try {
      localStorage.setItem('taizer_ads_current_user', JSON.stringify(matchedUser));
      localStorage.setItem('taizer_ads_current_view', 'dashboard');
    } catch (e) {}
    setCurrentView('dashboard');
    setDashboardTab('new-ad');
    showToast(`සාදරයෙන් පිළිගනිමු ${matchedUser.name}! (Welcome)`);
  };

  // User Logout handler (Only triggered when user clicks Logout button)
  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    try {
      localStorage.removeItem('taizer_ads_current_user');
      localStorage.removeItem('taizer_ads_current_view');
    } catch (e) {}
    setCurrentView('feed');
    showToast('ගිණුමෙන් ඉවත් විය (Logged out successfully).');
  };

  // Search handler
  const handleSearchSubmit = (e) => {
    e?.preventDefault();
    setActiveFilterQuery(searchQuery.trim());
    setSavedOnly(false);
    setCurrentView('feed');
  };

  // Automatically reset search filter when input is cleared
  useEffect(() => {
    if (!searchQuery.trim() && activeFilterQuery) {
      setActiveFilterQuery('');
    }
  }, [searchQuery, activeFilterQuery]);

  // Persist currentView to localStorage for seamless refresh
  useEffect(() => {
    try {
      if (currentView === 'dashboard' || currentView === 'feed') {
        localStorage.setItem('taizer_ads_current_view', currentView);
      }
    } catch (e) {}
  }, [currentView]);

  const updateAdsAndPersist = (newAds) => {
    setAds(newAds);
    try {
      localStorage.setItem('taizer_ads_ad_list', JSON.stringify(newAds));
    } catch (e) {
      console.error('Failed to persist ads', e);
    }
  };

  const updateStoriesAndPersist = (newStories) => {
    setStories(newStories);
    try {
      localStorage.setItem('taizer_ads_stories', JSON.stringify(newStories));
    } catch (e) {
      console.error('Failed to persist stories', e);
    }
  };

  // Automatic real-time background expiration runner: checks all approved ads and marks expired
  useEffect(() => {
    const checkAndExpireAds = () => {
      const now = Date.now();
      let changed = false;
      const updated = ads.map((ad) => {
        if (ad.status === 'Approved' && !ad.isExpired) {
          const validity = getAdValidity(ad);
          if (validity.isExpired) {
            changed = true;
            return {
              ...ad,
              isExpired: true,
              expiresAt: ad.expiresAt || new Date(now - 1000).toISOString()
            };
          }
        }
        return ad;
      });

      if (changed) {
        updateAdsAndPersist(updated);
      }
    };

    checkAndExpireAds();
    const interval = setInterval(checkAndExpireAds, 10000); // checks every 10 seconds
    return () => clearInterval(interval);
  }, [ads]);

  // Add new ad from dashboard form (Persist to Local & MongoDB)
  const handleAddAd = (newAd) => {
    const updated = [newAd, ...ads];
    updateAdsAndPersist(updated);
    createAdInDb(newAd).catch(err => console.warn('Mongo create ad sync failed', err));
    showToast('දැන්වීම Admin Approval සඳහා සාර්ථකව යොමු කරන ලදී!');
  };

  // Delete an ad (Persist to Local & MongoDB)
  const handleDeleteAd = (adId) => {
    const updated = ads.filter((a) => a.id !== adId);
    updateAdsAndPersist(updated);
    deleteAdInDb(adId).catch(err => console.warn('Mongo delete ad sync failed', err));
    showToast('Advertisement deleted.');
  };

  // Update an ad (Persist to Local & MongoDB)
  const handleUpdateAd = (updatedAd) => {
    const updated = ads.map((a) => (a.id === updatedAd.id ? updatedAd : a));
    updateAdsAndPersist(updated);
    if (selectedAd && selectedAd.id === updatedAd.id) {
      setSelectedAd(updatedAd);
    }
    updateAdInDb(updatedAd.id, updatedAd).catch(err => console.warn('Mongo update ad sync failed', err));
  };

  // Admin Approval with Custom Days OR Exact Date Picker
  const handleApproveAd = (adId, validityDaysOrDate = 5) => {
    let numDays = 5;
    let expiryIso = '';

    if (typeof validityDaysOrDate === 'string' && validityDaysOrDate.includes('-')) {
      // User passed a date string like "2026-09-28"
      expiryIso = calculateExpiryFromDateString(validityDaysOrDate);
      numDays = getDaysBetween(expiryIso);
    } else {
      numDays = Math.max(1, Number(validityDaysOrDate) || 5);
      expiryIso = calculateExpiryDate(numDays);
    }

    const formattedDate = new Date(expiryIso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

    let approvedTarget = null;
    const updated = ads.map((a) => {
      if (a.id === adId) {
        approvedTarget = {
          ...a,
          status: 'Approved',
          isExpired: false,
          validityDays: numDays,
          approvedAt: new Date().toISOString(),
          expiresAt: expiryIso,
          renewalStatus: null
        };
        return approvedTarget;
      }
      return a;
    });
    updateAdsAndPersist(updated);
    if (approvedTarget) {
      updateAdInDb(adId, approvedTarget).catch(err => console.warn('Mongo approve ad sync failed', err));
    }
    showToast(`Ad #${adId} Approved for ${numDays} Days! Auto-expires on ${formattedDate}.`);
  };

  const handleRenewAd = (adId, extensionDaysOrDate = 5) => {
    let numDays = 5;
    let expiryIso = '';

    let renewedTarget = null;
    const updated = ads.map((a) => {
      if (a.id === adId) {
        if (typeof extensionDaysOrDate === 'string' && extensionDaysOrDate.includes('-')) {
          expiryIso = calculateExpiryFromDateString(extensionDaysOrDate);
          numDays = getDaysBetween(expiryIso);
        } else {
          numDays = Math.max(1, Number(extensionDaysOrDate) || 5);
          const fromDate = a.expiresAt && new Date(a.expiresAt) > new Date() ? new Date(a.expiresAt) : new Date();
          expiryIso = calculateExpiryDate(numDays, fromDate);
        }

        renewedTarget = {
          ...a,
          status: 'Approved',
          isExpired: false,
          validityDays: numDays,
          expiresAt: expiryIso,
          renewalStatus: null,
          postedTime: 'Just now'
        };
        return renewedTarget;
      }
      return a;
    });
    updateAdsAndPersist(updated);
    if (renewedTarget) {
      updateAdInDb(adId, renewedTarget).catch(err => console.warn('Mongo renew ad sync failed', err));
    }
    showToast(`Ad #${adId} renewed for ${numDays} Days! Live on website.`);
  };

  const handleExpireAd = (adId) => {
    let expiredTarget = null;
    const updated = ads.map((a) => {
      if (a.id === adId) {
        expiredTarget = {
          ...a,
          isExpired: true,
          expiresAt: new Date(Date.now() - 1000).toISOString()
        };
        return expiredTarget;
      }
      return a;
    });
    updateAdsAndPersist(updated);
    if (expiredTarget) {
      updateAdInDb(adId, expiredTarget).catch(err => console.warn('Mongo expire ad sync failed', err));
    }
    showToast(`Ad #${adId} marked as Expired (කල් ඉකුත් විය). Removed from live feed.`);
  };

  const handleRequestAdRenewal = (adId, renewalDays = 5, paidWithCredits = false) => {
    let requestTarget = null;
    const updated = ads.map((a) => {
      if (a.id === adId) {
        requestTarget = {
          ...a,
          renewalStatus: 'requested',
          renewalDaysRequested: Number(renewalDays) || 5,
          renewalPaidWithCredits: Boolean(paidWithCredits),
          renewalRequestedAt: new Date().toISOString()
        };
        return requestTarget;
      }
      return a;
    });
    updateAdsAndPersist(updated);
    if (requestTarget) {
      updateAdInDb(adId, requestTarget).catch(err => console.warn('Mongo renewal request sync failed', err));
    }
    showToast('Renewal request sent to Admin! (අලුත් කිරීමේ ඉල්ලීම යොමු කරන ලදී)');
  };

  const handleRejectAd = (adId) => {
    let rejectTarget = null;
    const updated = ads.map((a) => {
      if (a.id === adId) {
        rejectTarget = { ...a, status: 'Pending Approval', isFake: false };
        return rejectTarget;
      }
      return a;
    });
    updateAdsAndPersist(updated);
    if (rejectTarget) {
      updateAdInDb(adId, rejectTarget).catch(err => console.warn('Mongo reject ad sync failed', err));
    }
    showToast(`Ad #${adId} marked as Pending Approval.`);
  };

  const handleMarkFakeAd = (adId) => {
    let fakeTarget = null;
    const updated = ads.map((a) => {
      if (a.id === adId) {
        const isCurrentlyFake = a.isFake || a.status === 'Fake Ad' || a.category === 'fake';
        const willBeFake = !isCurrentlyFake;
        fakeTarget = {
          ...a,
          isFake: willBeFake,
          status: willBeFake ? 'Fake Ad' : 'Approved',
          category: willBeFake ? 'fake' : (a.category === 'fake' ? 'spa' : a.category)
        };
        return fakeTarget;
      }
      return a;
    });
    updateAdsAndPersist(updated);
    if (selectedAd && selectedAd.id === adId && fakeTarget) {
      setSelectedAd(fakeTarget);
    }
    if (fakeTarget) {
      updateAdInDb(adId, fakeTarget).catch(err => console.warn('Mongo mark fake ad sync failed', err));
    }
    showToast(`Ad #${adId} Fake/Scam status updated.`);
  };

  const handleAddStory = (newStory) => {
    const updated = [newStory, ...stories];
    updateStoriesAndPersist(updated);
    createStoryInDb(newStory).catch(err => console.warn('Mongo story create sync failed', err));
    showToast('New story avatar added & saved to database!');
  };

  const handleDeleteStory = (storyId) => {
    const updated = stories.filter((s) => s.id !== storyId);
    updateStoriesAndPersist(updated);
    deleteStoryInDb(storyId).catch(err => console.warn('Mongo story delete sync failed', err));
    showToast('Story avatar removed.');
  };

  // Add user complaint from AdDetailView and persist to MongoDB
  const handleAddComplaint = (complaintData) => {
    const newComplaint = {
      id: `comp-${Date.now()}`,
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      ...complaintData
    };
    const updatedComplaints = [newComplaint, ...(siteConfig.complaints || [])];
    const updatedConfig = {
      ...siteConfig,
      complaints: updatedComplaints
    };
    handleUpdateSiteConfig(updatedConfig);
    showToast('පැමිණිල්ල Admin වෙත සාර්ථකව යොමු විය (Complaint saved).');
  };

  // Handle click on a story avatar
  const handleSelectStory = (story) => {
    if (story.adId || story.isSpecialOffer) {
      const linkedAd = ads.find((a) => a.id === story.adId);
      setSelectedStoryOffer({ story, ad: linkedAd });
    } else {
      setSelectedStoryOffer({ story, ad: null });
    }
  };

  // Toggle Save ad
  const handleToggleSave = (adId) => {
    setAds((prev) =>
      prev.map((ad) => {
        if (ad.id === adId) {
          const updated = { ...ad, isSaved: !ad.isSaved };
          updateAdInDb(adId, { isSaved: updated.isSaved }).catch(e => console.warn('Mongo save sync', e));
          showToast(updated.isSaved ? 'Ad saved to bookmarks!' : 'Ad removed from bookmarks.');
          if (selectedAd && selectedAd.id === adId) {
            setSelectedAd(updated);
          }
          return updated;
        }
        return ad;
      })
    );
  };

  // Handle Like
  const handleLikeAd = (adId) => {
    setAds((prev) =>
      prev.map((ad) => {
        if (ad.id === adId) {
          const updated = { ...ad, likes: ad.likes + 1 };
          updateAdInDb(adId, { likes: updated.likes }).catch(e => console.warn('Mongo like sync', e));
          if (selectedAd && selectedAd.id === adId) {
            setSelectedAd(updated);
          }
          return updated;
        }
        return ad;
      })
    );
  };

  // Refresh page / state
  const handleRefresh = () => {
    setSearchQuery('');
    setActiveFilterQuery('');
    setSelectedCategory(null);
    setSavedOnly(false);
    setSelectedAd(null);
    setCurrentView('feed');
    showToast('Feed refreshed! (යාවත්කාලීන විය)');
  };

  const handleOpenHome = () => {
    setSearchQuery('');
    setActiveFilterQuery('');
    setSelectedCategory(null);
    setSavedOnly(false);
    setSelectedAd(null);
    setCurrentView('feed');
    setMobileSidebarOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Filter ads for public feed (Only Approved ads, with Fake Ads isolated into their own category)
  const filteredAds = ads.filter((ad) => {
    const isAdFake = ad.isFake || ad.status === 'Fake Ad' || ad.category === 'fake';

    // If user explicitly chose 'fake' category:
    if (selectedCategory === 'fake') {
      return isAdFake && ad.isActive !== false;
    }

    // Normal feed: EXCLUDE fake ads completely!
    if (isAdFake) return false;

    if (ad.status && ad.status === 'Pending Approval') return false;
    if (ad.isActive === false) return false;

    // EXCLUDE EXPIRED ADS! (Valid for 5 days or set period, then hidden from feed)
    const validity = getAdValidity(ad);
    if (validity.isExpired) return false;

    if (savedOnly && !ad.isSaved) return false;
    if (selectedCategory && selectedCategory !== 'all') {
      const cat = (ad.category || '').toLowerCase();
      const label = (ad.categoryLabel || '').toLowerCase();
      const target = selectedCategory.toLowerCase();
      
      const isMatch = cat === target || 
                      label === target ||
                      cat.includes(target) || 
                      target.includes(cat) ||
                      label.includes(target) ||
                      target.includes(label);
      if (!isMatch) return false;
    }
    if (activeFilterQuery) {
      if (!matchAdSearch(ad, activeFilterQuery)) return false;
    }
    return true;
  });

  const userAds = ads.filter((a) => {
    if (currentUser) {
      const uPhone = (currentUser.phone || '').replace(/[^0-9]/g, '');
      const aPhone = (a.phone || '').replace(/[^0-9]/g, '');
      const isPhoneMatch = Boolean(uPhone && aPhone && (uPhone === aPhone || uPhone.endsWith(aPhone.slice(-7)) || aPhone.endsWith(uPhone.slice(-7))));
      return a.isUserAd || a.userId === currentUser.id || isPhoneMatch;
    }
    return a.isUserAd;
  });

  // Top Super Ad & Remaining Grid (Do not elevate fake ads to Super Ad spot)
  const isFakeCategoryActive = selectedCategory === 'fake';
  const topAd = isFakeCategoryActive ? null : (filteredAds.find((a) => a.isTopBanner) || filteredAds[0]);
  const gridAds = isFakeCategoryActive ? filteredAds : (topAd ? filteredAds.filter((a) => a.id !== topAd.id) : filteredAds);

  const isAdminView = currentView === 'admin' || currentView === 'ceo-login';

  return (
    <div className={`min-h-screen flex flex-col ${isAdminView ? 'bg-[#0b1329]' : 'bg-[#f5f6f8]'}`}>
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-16 right-5 z-50 bg-[#0f172a] text-white px-4 py-2 rounded-xl shadow-lg text-xs font-semibold flex items-center space-x-2 animate-in slide-in-from-top duration-200">
          <CheckCircle2 className="w-4 h-4 text-green-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header: Only shown on Public views (Completely hidden on Admin Panel / CEO login) */}
      {!isAdminView && (
        <Header
          isLoggedIn={isLoggedIn}
          currentLang={currentLang}
          onToggleLang={(lang) => setCurrentLang(lang)}
          onRefresh={handleRefresh}
          onOpenHome={handleOpenHome}
          onOpenAbout={() => setIsAboutModalOpen(true)}
          onOpenContact={() => setIsContactModalOpen(true)}
          onOpenFaq={() => setIsFaqModalOpen(true)}
          onOpenPostModal={() => {
            if (isLoggedIn) {
              setDashboardTab('new-ad');
              setCurrentView('dashboard');
            } else {
              setCurrentView('login');
            }
          }}
          onOpenLogin={() => setCurrentView('login')}
          onToggleMobileSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)}
        />
      )}

      {/* Main Content Layout */}
      <main className={isAdminView ? "flex-1 w-full p-2 sm:p-4 bg-[#0b1329]" : "flex-1 max-w-[1380px] w-full mx-auto px-3 sm:px-4 py-4"}>
        {/* VIEW 1: SUPER ADMIN CONTROL PANEL (Only accessible via URL /ceo) */}
        {currentView === 'admin' ? (
          <AdminPanel
            ads={ads}
            stories={stories}
            siteConfig={siteConfig}
            users={users}
            onUpdateUsers={handleUpdateUsers}
            onAdjustCredits={handleAdjustUserCredits}
            onUpdateSiteConfig={handleUpdateSiteConfig}
            onApproveAd={handleApproveAd}
            onRejectAd={handleRejectAd}
            onRenewAd={handleRenewAd}
            onExpireAd={handleExpireAd}
            onMarkFakeAd={handleMarkFakeAd}
            onUpdateAd={handleUpdateAd}
            onDeleteAd={handleDeleteAd}
            onAddStory={handleAddStory}
            onDeleteStory={handleDeleteStory}
            onExitAdmin={handleExitAdmin}
            onShowToast={showToast}
          />
        ) : currentView === 'ceo-login' ? (
          /* VIEW 2: CEO MASTER ACCESS GATE (Triggered when user enters /ceo in URL) */
          <CeoAdminLogin
            siteConfig={siteConfig}
            onUnlockSuccess={() => {
              setIsCeoUnlocked(true);
              setCurrentView('admin');
            }}
            onExit={handleExitAdmin}
            onShowToast={showToast}
          />
        ) : (
          <div className="flex flex-col md:flex-row gap-4 items-start">
            {/* Desktop Sidebar (hidden on mobile, mobile uses MobileMenuDrawer) */}
            <div className="hidden md:block w-[270px] flex-shrink-0">
              <Sidebar
                isLoggedIn={isLoggedIn}
                currentLang={currentLang}
                onOpenLogin={() => {
                  setCurrentView('login');
                  setMobileSidebarOpen(false);
                }}
                onLogout={handleLogout}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                onSearchSubmit={handleSearchSubmit}
                selectedCategory={selectedCategory}
                onSelectCategory={(cat) => {
                  setSelectedCategory(cat);
                  setSavedOnly(false);
                  setCurrentView('feed');
                  setMobileSidebarOpen(false);
                }}
                savedOnly={savedOnly}
                onToggleSavedOnly={() => {
                  setSavedOnly(!savedOnly);
                  setSelectedCategory(null);
                  setCurrentView('feed');
                  setMobileSidebarOpen(false);
                }}
                onOpenHowToPublish={() => setIsHowToPublishOpen(true)}
                onOpenAgents={() => setIsAgentsOpen(true)}
                onOpenFakeAds={() => setIsFakeAdsOpen(true)}
                onOpenDashboard={() => {
                  if (isLoggedIn) {
                    setDashboardTab('my-ads');
                    setCurrentView('dashboard');
                  } else {
                    setCurrentView('login');
                  }
                  setMobileSidebarOpen(false);
                }}
              />
            </div>

            {/* Right Main Section */}
            <div className="flex-1 min-w-0 space-y-4 w-full">
              {/* VIEW 3: LOGIN / REGISTER VIEW */}
              {currentView === 'login' ? (
                <LoginForm
                  onLoginSuccess={handleLoginSuccess}
                  onOpenAgents={() => setIsAgentsOpen(true)}
                  onShowToast={showToast}
                  siteConfig={siteConfig}
                  isCeoUnlocked={isCeoUnlocked}
                  onOpenAdminTab={() => setCurrentView('admin')}
                />
              ) : currentView === 'dashboard' ? (
                /* VIEW 4: User Dashboard & New Ad Form */
                <UserDashboard
                  initialTab={dashboardTab}
                  userAds={userAds}
                  siteConfig={siteConfig}
                  currentUser={currentUser}
                  onUseCredits={handleUseCredits}
                  onRequestRenewal={handleRequestAdRenewal}
                  onRenewAd={handleRenewAd}
                  onBack={() => setCurrentView('feed')}
                  onAdCreated={handleAddAd}
                  onDeleteAd={handleDeleteAd}
                  onUpdateAd={handleUpdateAd}
                  onShowToast={showToast}
                />
              ) : currentView === 'detail' && selectedAd ? (
                /* VIEW 5: Ad Detail View */
                <AdDetailView
                  ad={selectedAd}
                  onBack={() => setCurrentView('feed')}
                  onToggleSave={handleToggleSave}
                  onLike={handleLikeAd}
                  onShowToast={showToast}
                  onAddComplaint={handleAddComplaint}
                />
              ) : (
                /* VIEW 6: Main Public Feed */
                <>
                  {/* Real-time Admin Notices & Broadcasts (සිංහල නිවේදන) */}
                  <NoticeBanner
                    notices={siteConfig.notices}
                    currentLang={currentLang}
                  />

                  {/* Mobile Home Bar: Search Ads, Category Strip, Purple Banner & Quick Action Buttons (Matching Image 2) */}
                  <MobileHomeBar
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    onSearchSubmit={handleSearchSubmit}
                    selectedCategory={selectedCategory}
                    onSelectCategory={(catId) => {
                      setSelectedCategory(catId);
                      setSavedOnly(false);
                      setCurrentView('feed');
                    }}
                    onOpenAgents={() => setIsAgentsOpen(true)}
                    onOpenFakeAds={() => {
                      setSelectedCategory(selectedCategory === 'fake' ? null : 'fake');
                      setSavedOnly(false);
                      setCurrentView('feed');
                      showToast(selectedCategory === 'fake' ? 'Filters cleared.' : 'Showing verified Fake Ads & Scams archive.');
                    }}
                    onOpenHelpServices={() => setIsContactModalOpen(true)}
                    siteConfig={siteConfig}
                  />

                  {/* 1. Desktop Safety Tips Banner & Dynamic Android App Promo */}
                  <div className="hidden md:block">
                    <AppBanner
                      onOpenSafetyTips={() => setIsSafetyModalOpen(true)}
                      topBanner={siteConfig.topBanner}
                      safetyBanner={siteConfig.safetyBanner}
                      currentLang={currentLang}
                    />
                  </div>

                  {/* 2. Circular Story Avatars */}
                  <div className="bg-white rounded-xl p-3 border border-gray-200 shadow-sm">
                    <StoryAvatars
                      stories={stories}
                      onSelectStory={handleSelectStory}
                    />
                  </div>

                  {/* 3. Desktop Social Subscribe Buttons & Sub-Actions */}
                  <div className="hidden md:block">
                    <SocialSubscribe
                      onOpenAgents={() => setIsAgentsOpen(true)}
                      onOpenFakeAds={() => {
                        setSelectedCategory(selectedCategory === 'fake' ? null : 'fake');
                        setSavedOnly(false);
                        setCurrentView('feed');
                        showToast(selectedCategory === 'fake' ? 'Filters cleared.' : 'Showing verified Fake Ads & Scams archive.');
                      }}
                    />
                  </div>

                  {/* Fake Ads Warning Alert Banner when category is 'fake' */}
                  {selectedCategory === 'fake' && (
                    <div className="bg-red-50 border-2 border-red-500 rounded-xl p-4 text-red-900 shadow-sm flex items-start space-x-3 animate-in fade-in duration-200">
                      <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
                      <div className="space-y-1">
                        <h3 className="font-extrabold text-sm sm:text-base text-red-700 flex items-center space-x-2">
                          <span>🚫 ව්‍යාජ දැන්වීම් සහ වංචා ලේඛනය (Verified Fake Ads & Scams Archive)</span>
                        </h3>
                        <p className="text-xs text-red-800 leading-relaxed font-medium">
                          මෙම දැන්වීම් පරිශීලකයින් රවටා Advance Payment / Reload වංචා කිරීම හේතුවෙන් Admin විසින් ව්‍යාජ (Fake Ads) ලෙස නම් කර ඇත. 
                          <strong> කිසිවිටෙකත් මෙම දැන්වීම්වල ඇති අංකවලට මුදල් තැන්පත් කිරීම හෝ Reload දැමීමෙන් වළකින්න!</strong>
                        </p>
                        <p className="text-[11px] text-red-600">
                          These ads were flagged as scams. Never make advance payments or reload transfers.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Filter status banner if active */}
                  {(selectedCategory || activeFilterQuery || savedOnly) && (
                    <div className="bg-white border border-gray-200 px-4 py-2 rounded-lg flex items-center justify-between text-xs text-gray-700">
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold text-gray-500">Filtered by:</span>
                        {selectedCategory && (
                          <span className={`font-bold px-2 py-0.5 rounded border ${
                            selectedCategory === 'fake'
                              ? 'bg-red-600 text-white border-red-700 animate-pulse'
                              : 'bg-red-50 text-[#f03a5f] border-red-200'
                          }`}>
                            Category: {selectedCategory === 'fake' ? '🚫 Fake Ads (ව්‍යාජ)' : selectedCategory}
                          </span>
                        )}
                        {activeFilterQuery && (
                          <span className="bg-blue-50 text-blue-600 font-bold px-2 py-0.5 rounded border border-blue-200">
                            Query: "{activeFilterQuery}"
                          </span>
                        )}
                        {savedOnly && (
                          <span className="bg-amber-50 text-amber-700 font-bold px-2 py-0.5 rounded border border-amber-200">
                            Saved Ads Only
                          </span>
                        )}
                      </div>
                      <button
                        onClick={handleRefresh}
                        className="text-[#f03a5f] hover:underline font-bold text-xs"
                      >
                        Reset All
                      </button>
                    </div>
                  )}

                  {/* 4. Top Super Ad */}
                  {topAd && (
                    <div className="w-full">
                      <AdCard
                        ad={topAd}
                        onSelectAd={(ad) => {
                          setSelectedAd(ad);
                          setCurrentView('detail');
                        }}
                        onToggleSave={handleToggleSave}
                        onLike={handleLikeAd}
                      />
                    </div>
                  )}

                  {/* 5. Two-Column Ad Cards Grid */}
                  {gridAds.length > 0 ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      {gridAds.map((ad) => (
                        <AdCard
                          key={ad.id}
                          ad={ad}
                          onSelectAd={(ad) => {
                            setSelectedAd(ad);
                            setCurrentView('detail');
                          }}
                          onToggleSave={handleToggleSave}
                          onLike={handleLikeAd}
                        />
                      ))}
                    </div>
                  ) : !topAd && (
                    <div className="bg-white rounded-xl p-10 text-center border border-gray-200 text-gray-500">
                      <p className="text-base font-semibold">දැන්වීම් හමු නොවීය (No Ads Found)</p>
                      <p className="text-xs text-gray-400 mt-1">Try another search keyword or clear filters.</p>
                      <button
                        onClick={handleRefresh}
                        className="mt-3 bg-[#f03a5f] text-white text-xs font-bold px-4 py-2 rounded-lg"
                      >
                        Show All Ads
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Informational Modals */}
      <SafetyModal
        isOpen={isSafetyModalOpen}
        onClose={() => setIsSafetyModalOpen(false)}
      />

      <HowToPublishModal
        isOpen={isHowToPublishOpen}
        onClose={() => setIsHowToPublishOpen(false)}
        onOpenPostModal={() => {
          if (isLoggedIn) {
            setDashboardTab('new-ad');
            setCurrentView('dashboard');
          } else {
            setCurrentView('login');
          }
        }}
      />

      <AgentsModal
        isOpen={isAgentsOpen}
        onClose={() => setIsAgentsOpen(false)}
        agents={siteConfig.agents}
      />

      <FakeAdsModal
        isOpen={isFakeAdsOpen}
        onClose={() => setIsFakeAdsOpen(false)}
      />

      {/* Mobile Menu Drawer (Matching Image 1) */}
      <MobileMenuDrawer
        isOpen={mobileSidebarOpen}
        onClose={() => setMobileSidebarOpen(false)}
        isLoggedIn={isLoggedIn}
        onOpenLogin={() => {
          setCurrentView('login');
          setMobileSidebarOpen(false);
        }}
        onLogout={handleLogout}
        onOpenDashboard={() => {
          if (isLoggedIn) {
            setDashboardTab('my-ads');
            setCurrentView('dashboard');
          } else {
            setCurrentView('login');
          }
          setMobileSidebarOpen(false);
        }}
        onOpenHowToPublish={() => setIsHowToPublishOpen(true)}
        onOpenAgents={() => setIsAgentsOpen(true)}
        onOpenFakeAds={() => {
          setSelectedCategory(selectedCategory === 'fake' ? null : 'fake');
          setSavedOnly(false);
          setCurrentView('feed');
        }}
        savedOnly={savedOnly}
        onToggleSavedOnly={() => {
          setSavedOnly(!savedOnly);
          setSelectedCategory(null);
          setCurrentView('feed');
        }}
        selectedCategory={selectedCategory}
        onSelectCategory={(catId) => {
          if (catId === 'vip') {
            setActiveFilterQuery('VIP');
            setSelectedCategory(null);
          } else {
            setSelectedCategory(catId);
          }
          setSavedOnly(false);
          setCurrentView('feed');
        }}
        onOpenHome={() => {
          setSelectedCategory(null);
          setSavedOnly(false);
          setCurrentView('feed');
        }}
        onOpenAbout={() => setIsAboutModalOpen(true)}
        onOpenContact={() => setIsContactModalOpen(true)}
        onOpenFaq={() => setIsFaqModalOpen(true)}
        currentLang={currentLang}
        onToggleLang={(lang) => setCurrentLang(lang)}
      />

      {/* About Us Modal */}
      <AboutModal
        isOpen={isAboutModalOpen}
        onClose={() => setIsAboutModalOpen(false)}
        onOpenPostModal={() => {
          setIsAboutModalOpen(false);
          if (isLoggedIn) {
            setDashboardTab('new-ad');
            setCurrentView('dashboard');
          } else {
            setCurrentView('login');
          }
        }}
      />

      {/* Contact & Bank Details Modal */}
      <ContactModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
        siteConfig={siteConfig}
      />

      {/* Frequently Asked Questions (FAQ) Modal */}
      <FaqModal
        isOpen={isFaqModalOpen}
        onClose={() => setIsFaqModalOpen(false)}
      />

      {/* Floating Side Quick Action Widget / Toggle Tag (Only on public view) */}
      {!isAdminView && (
        <QuickSideWidget
          siteConfig={siteConfig}
          onOpenPostModal={() => {
            if (isLoggedIn) {
              setDashboardTab('new-ad');
              setCurrentView('dashboard');
            } else {
              setCurrentView('login');
            }
          }}
          onOpenSafetyModal={() => setIsSafetyModalOpen(true)}
          onOpenFakeAds={() => setIsFakeAdsOpen(true)}
          onOpenAgents={() => setIsAgentsOpen(true)}
          onOpenFaq={() => setIsFaqModalOpen(true)}
          onOpenAbout={() => setIsAboutModalOpen(true)}
          onOpenContact={() => setIsContactModalOpen(true)}
          onFilterCategory={(cat) => {
            setSelectedCategory(cat);
            setCurrentView('feed');
          }}
          onResetFilters={handleOpenHome}
        />
      )}

      {/* Special Offer Story Modal (Visitor View) */}
      {selectedStoryOffer && (
        <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-pink-200 shadow-2xl overflow-hidden my-auto animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-[#f03a5f] via-rose-500 to-amber-500 text-white p-4 sm:p-5 flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center font-bold text-lg shadow-inner">
                  <Flame className="w-6 h-6 text-yellow-300 fill-yellow-300" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="bg-white/20 text-white text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                      Special Offer
                    </span>
                    <span className="text-[10px] text-pink-100 font-bold">
                      සුවිශේෂී දීමනාව
                    </span>
                  </div>
                  <h3 className="font-extrabold text-base sm:text-lg tracking-tight mt-0.5">
                    {selectedStoryOffer.story?.name || 'Exclusive Deal'}
                  </h3>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedStoryOffer(null)}
                className="w-8 h-8 rounded-full bg-black/20 hover:bg-black/30 flex items-center justify-center text-white transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 sm:p-6 space-y-4 text-xs">
              {/* Special Offer Highlight Banner */}
              <div className="bg-gradient-to-r from-pink-50 via-rose-50 to-amber-50 border border-pink-200 rounded-xl p-3.5 space-y-1.5">
                <div className="flex items-center space-x-1.5 text-[#f03a5f] font-black text-xs uppercase tracking-wide">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>{selectedStoryOffer.story?.offerTag || selectedStoryOffer.story?.name || 'Limited Time Promo'}</span>
                </div>
                <p className="text-gray-800 text-xs sm:text-sm font-semibold leading-relaxed">
                  {selectedStoryOffer.story?.fullTitle || selectedStoryOffer.story?.offerDetails || 'Special promotional advertisement offer from verified advertiser.'}
                </p>
              </div>

              {/* Linked Ad Card (If available) */}
              {selectedStoryOffer.ad ? (
                <div className="space-y-3">
                  <div className="border border-gray-200 rounded-xl overflow-hidden bg-gray-50 flex flex-col sm:flex-row">
                    <div className="sm:w-44 h-36 relative flex-shrink-0 bg-gray-200">
                      <img
                        src={selectedStoryOffer.ad.image}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute top-2 left-2 bg-[#f03a5f] text-white text-[9px] font-black px-2 py-0.5 rounded shadow-xs">
                        {selectedStoryOffer.ad.badgeType || 'Super Ad'}
                      </span>
                    </div>

                    <div className="p-3.5 flex-1 flex flex-col justify-between space-y-2">
                      <div>
                        <h4 className="font-extrabold text-sm text-gray-900 line-clamp-2">
                          {selectedStoryOffer.ad.title}
                        </h4>
                        <p className="text-xs text-gray-500 mt-1">
                          📍 {selectedStoryOffer.ad.location} • {selectedStoryOffer.ad.categoryLabel || selectedStoryOffer.ad.category}
                        </p>
                        <p className="text-sm font-black text-[#16a34a] mt-1">
                          {selectedStoryOffer.ad.price}
                        </p>
                      </div>

                      <div className="text-[11px] text-gray-600 line-clamp-2">
                        {selectedStoryOffer.ad.description}
                      </div>
                    </div>
                  </div>

                  {/* Direct Contact Buttons */}
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <a
                      href={`tel:${selectedStoryOffer.ad.phone}`}
                      className="bg-[#0f172a] hover:bg-black text-white font-bold py-2.5 px-3 rounded-xl transition text-center shadow-xs flex items-center justify-center space-x-1.5"
                    >
                      <Phone className="w-3.5 h-3.5 text-green-400" />
                      <span>Call {selectedStoryOffer.ad.phone}</span>
                    </a>

                    {selectedStoryOffer.ad.whatsapp ? (
                      <a
                        href={`https://wa.me/${selectedStoryOffer.ad.whatsapp.replace(/[^0-9]/g, '')}?text=Hello,%20I%20saw%20your%20Special%20Offer%20story%20on%20Taizer%20Ads.`}
                        target="_blank"
                        rel="noreferrer"
                        className="bg-[#16a34a] hover:bg-[#15803d] text-white font-bold py-2.5 px-3 rounded-xl transition text-center shadow-xs flex items-center justify-center space-x-1.5"
                      >
                        <MessageCircle className="w-3.5 h-3.5 fill-current" />
                        <span>WhatsApp Chat</span>
                      </a>
                    ) : (
                      <div className="bg-gray-100 text-gray-500 font-semibold py-2.5 px-3 rounded-xl text-center text-xs flex items-center justify-center">
                        Verified Contact
                      </div>
                    )}
                  </div>

                  {/* Primary CTA: View Full Advertisement */}
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedAd(selectedStoryOffer.ad);
                      setCurrentView('detail');
                      setSelectedStoryOffer(null);
                    }}
                    className="w-full bg-gradient-to-r from-[#f03a5f] to-amber-500 hover:from-[#d92348] hover:to-amber-600 text-white font-extrabold py-2.5 px-4 rounded-xl transition shadow-md text-xs sm:text-sm text-center cursor-pointer"
                  >
                    View Full Advertisement (සම්පූර්ණ දැන්වීම බලන්න) →
                  </button>
                </div>
              ) : (
                /* Fallback for Custom/Site Stories */
                <div className="space-y-4">
                  <div className="w-full h-48 rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
                    <img
                      src={selectedStoryOffer.story?.image}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedStoryOffer(null)}
                    className="w-full bg-[#0f172a] hover:bg-black text-white font-bold py-2.5 px-4 rounded-xl text-xs transition cursor-pointer"
                  >
                    Close (වසන්න)
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Comprehensive Rich Modern Footer (Hidden completely on Admin / CEO login) */}
      {!isAdminView && (
        <Footer
          siteConfig={siteConfig}
          isLoggedIn={isLoggedIn}
          currentLang={currentLang}
          onOpenHome={handleOpenHome}
          onOpenAbout={() => setIsAboutModalOpen(true)}
          onOpenContact={() => setIsContactModalOpen(true)}
          onOpenFaq={() => setIsFaqModalOpen(true)}
          onOpenSafetyModal={() => setIsSafetyModalOpen(true)}
          onOpenHowToPublish={() => setIsHowToPublishOpen(true)}
          onOpenAgents={() => setIsAgentsOpen(true)}
          onOpenFakeAds={() => setIsFakeAdsOpen(true)}
          onOpenPostModal={() => {
            if (isLoggedIn) {
              setDashboardTab('new-ad');
              setCurrentView('dashboard');
            } else {
              setCurrentView('login');
            }
          }}
        />
      )}
    </div>
  );
}
