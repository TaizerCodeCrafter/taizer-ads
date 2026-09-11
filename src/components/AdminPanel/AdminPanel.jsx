import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  FileSpreadsheet,
  Megaphone,
  CircleDot,
  DollarSign,
  AlertOctagon,
  Users,
  CheckCircle2,
  XCircle,
  X,
  Trash2,
  Edit,
  ExternalLink,
  Download,
  FileText,
  PlusCircle,
  Eye,
  ArrowLeft,
  Save,
  ShieldAlert,
  Sparkles,
  Phone,
  MessageCircle,
  Send,
  Building2,
  RefreshCw,
  Search,
  Check,
  Bell,
  Pin,
  PinOff,
  AlertTriangle,
  Link as LinkIcon,
  Palette,
  Globe,
  LogIn,
  ShieldCheck,
  HelpCircle,
  Wallet,
  CreditCard,
  History,
  UserPlus,
  UserX,
  MapPin,
  Mail,
  Calendar,
  ArrowUpRight,
  ArrowDownLeft,
  Flame,
  Star,
  Clock,
  Lock,
  Key,
  EyeOff,
  User,
  BookOpen,
  Upload,
  Image as ImageIcon,
  Smartphone,
  Database,
  Server,
  HardDrive
} from 'lucide-react';
import { useDialog } from '../../context/DialogContext.jsx';
import { getAdValidity, calculateExpiryDate, calculateExpiryFromDateString, getDaysBetween, formatDateForDateInput, matchAdSearch, isPdfSlip } from '../../utils/adValidity.js';
import { sendNotifyLkSms, generateOtp } from '../../utils/smsService.js';
import { deleteUserFromDb } from '../../services/api.js';

export default function AdminPanel({
  ads,
  stories,
  siteConfig,
  users = [],
  initialTab = 'overview',
  onUpdateUsers,
  onAdjustCredits,
  onUpdateSiteConfig,
  onApproveAd,
  onRejectAd,
  onRenewAd,
  onExpireAd,
  onMarkFakeAd,
  onUpdateAd,
  onDeleteAd,
  onAddStory,
  onDeleteStory,
  onApprovePackageRequest,
  onRejectPackageRequest,
  onExitAdmin,
  onShowToast
}) {
  const { showConfirm, showAlert, showPrompt } = useDialog();
  const [activeAdminTab, setActiveAdminTab] = useState(initialTab || 'overview');

  useEffect(() => {
    if (initialTab) {
      setActiveAdminTab(initialTab);
    }
  }, [initialTab]);
  
  // Local state for banner settings
  const [bannerConfig, setBannerConfig] = useState({
    targetUrl: 'https://taizerads.lk/download/taizer_ads.apk',
    actionType: 'modal',
    openInNewTab: true,
    isGradient: false,
    bgGradient: 'linear-gradient(135deg, #f06277 0%, #f59e0b 100%)',
    ...siteConfig.topBanner
  });

  const solidColorPresets = [
    { name: 'Hot Pink', hex: '#f06277' },
    { name: 'Royal Purple', hex: '#8b5cf6' },
    { name: 'Electric Blue', hex: '#2563eb' },
    { name: 'Emerald Green', hex: '#059669' },
    { name: 'Sunset Amber', hex: '#d97706' },
    { name: 'Crimson Red', hex: '#dc2626' },
    { name: 'Midnight Dark', hex: '#0f172a' },
    { name: 'Neon Cyan', hex: '#0891b2' },
    { name: 'Flame Orange', hex: '#ea580c' },
    { name: 'Deep Rose', hex: '#be123c' },
  ];

  const gradientPresets = [
    { name: 'Sunrise Glow', gradient: 'linear-gradient(135deg, #f06277 0%, #f59e0b 100%)' },
    { name: 'Purple Magic', gradient: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)' },
    { name: 'Ocean Blue', gradient: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)' },
    { name: 'Emerald Forest', gradient: 'linear-gradient(135deg, #10b981 0%, #047857 100%)' },
    { name: 'Fire Storm', gradient: 'linear-gradient(135deg, #ef4444 0%, #7c3aed 100%)' },
    { name: 'Royal Gold', gradient: 'linear-gradient(135deg, #f59e0b 0%, #b45309 100%)' },
    { name: 'Midnight Cyber', gradient: 'linear-gradient(135deg, #0f172a 0%, #3b82f6 100%)' },
    { name: 'Berry Crush', gradient: 'linear-gradient(135deg, #be123c 0%, #f43f5e 100%)' },
  ];

  const [safetyConfig, setSafetyConfig] = useState(siteConfig.safetyBanner);
  const [pricingConfig, setPricingConfig] = useState(siteConfig.pricing);
  const [bankConfig, setBankConfig] = useState(siteConfig.bankDetails);
  const [contactConfig, setContactConfig] = useState(siteConfig.contact);
  const [agentsList, setAgentsList] = useState(siteConfig.agents);
  const [complaintsList, setComplaintsList] = useState(siteConfig.complaints || []);
  const [inspectingSlipAd, setInspectingSlipAd] = useState(null);
  const [slipValidityDays, setSlipValidityDays] = useState(5);

  // Universal Image File Upload Handler (Auto-compresses large device files to Base64 data URL)
  const handleFileUploadAsDataUrl = (file, callback) => {
    if (!file) return;
    if (!file.type || !file.type.startsWith('image/')) {
      showAlert({
        title: 'Invalid File Type',
        titleSin: 'වලංගු නොවන ගොනුවකි',
        message: 'Please select an image file (JPG, PNG, WEBP, GIF).',
        messageSin: 'කරුණාකර පින්තූර ගොනුවක් (JPG, PNG, WEBP) තෝරන්න.',
        type: 'warning'
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result;
      if (!dataUrl) return;
      const img = new window.Image();
      img.onload = () => {
        const maxDim = 1280;
        let { width, height } = img;
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
          try {
            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);
            const compressed = canvas.toDataURL('image/jpeg', 0.85);
            callback(compressed);
            return;
          } catch (err) {
            console.error('Canvas compression error:', err);
          }
        }
        callback(dataUrl);
      };
      img.onerror = () => {
        callback(dataUrl);
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  };
  
  // Local state for Login & Register Form customization
  const [loginFormConfig, setLoginFormConfig] = useState({
    title: "Login/ Register",
    subtitle: "ගිණුමට log වීම සහ ගිණුමක් සාදා ගැනීම යන කාර්යයන් දෙකවම මෙම form එක භාවිතා කරන්න.",
    phoneLabel: "Enter Phone Number",
    phoneHelpText: "ඔබගේ දුරකථන අංකය ඇතුලත් කර Send OTP Click කරන්න.",
    phonePlaceholder: "XXXXXXX",
    defaultCountryCode: "+94",
    sendOtpButtonText: "Send OTP",
    sendOtpButtonColor: "#991230",
    otpHintText: "Enter verification code to continue (Default test code: 1234)",
    otpLabel: "4-Digit Verification OTP",
    verifyButtonText: "Verify & Login (ඇතුල් වන්න)",
    backButtonText: "Back",
    agentSectionTitle: "Agent support to post an ad.",
    agentSectionSubtitle: "දැන්වීමක් පලකර ගැනීමට නියෝජිත සහාය.",
    agentButtonText: "See Agents",
    agentButtonColor: "#0f172a",
    agentButtonAction: "modal", // 'modal' | 'whatsapp' | 'url'
    agentCustomUrl: "",
    agentWhatsappNumber: siteConfig?.contact?.whatsapp || "+94771234567",
    ...(siteConfig.loginForm || {})
  });

  // Real SMS Gateway Configuration (Notify.lk Integration for Sri Lanka)
  const [smsGatewayConfig, setSmsGatewayConfig] = useState({
    provider: 'notifylk',
    enabled: true,
    isLive: false,
    userId: '',
    apiKey: '',
    senderId: 'NotifyDEMO',
    otpLength: 4,
    otpExpiryMinutes: 5,
    messageTemplate: 'Your Taizer Ads verification code is: {OTP}. Valid for 5 minutes. Do not share this code.',
    testPhoneNumber: '',
    ...(siteConfig.smsGateway || {})
  });

  const [testSmsPhone, setTestSmsPhone] = useState('');
  const [testSmsStatus, setTestSmsStatus] = useState(null); // null | 'sending' | 'success' | 'error'
  const [testSmsResult, setTestSmsResult] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);


  useEffect(() => {
    if (siteConfig?.smsGateway) {
      setSmsGatewayConfig(prev => ({
        ...prev,
        ...siteConfig.smsGateway
      }));
    }
  }, [siteConfig?.smsGateway]);

  // Handler to dispatch test SMS to Admin's phone via Notify.lk
  const handleSendTestSms = async () => {
    const cleanNumber = testSmsPhone.replace(/[^0-9]/g, '');
    if (!cleanNumber || cleanNumber.length < 9) {
      await showAlert({
        title: 'Phone Number Required',
        titleSin: 'වලංගු දුරකථන අංකයක් ඇතුළත් කරන්න',
        message: 'Please enter a valid 10-digit Sri Lankan phone number (e.g. 077 123 4567) to test SMS.',
        type: 'warning'
      });
      return;
    }

    if (!smsGatewayConfig.userId || !smsGatewayConfig.apiKey) {
      await showAlert({
        title: 'Notify.lk Credentials Required',
        titleSin: 'Notify.lk තොරතුරු ඇතුළත් කරන්න',
        message: 'Please enter both your Notify.lk User ID and API Key before testing.',
        type: 'warning'
      });
      return;
    }

    setTestSmsStatus('sending');
    setTestSmsResult('');

    const testOtp = generateOtp(4);
    const testMsg = `[TEST] Taizer Ads SMS Gateway test successful! Your verification code is: ${testOtp}.`;

    try {
      const result = await sendNotifyLkSms({
        to: cleanNumber,
        message: testMsg,
        userId: smsGatewayConfig.userId,
        apiKey: smsGatewayConfig.apiKey,
        senderId: smsGatewayConfig.senderId || 'NotifyDEMO'
      });

      if (result.success) {
        setTestSmsStatus('success');
        setTestSmsResult(`SMS dispatched successfully to +${result.to || cleanNumber}! Check your phone.`);
        await showAlert({
          title: 'SMS Sent Successfully! (සාර්ථකයි)',
          titleSin: 'SMS පණිවිඩය සාර්ථකව යවන ලදී!',
          message: `Notify.lk SMS request was accepted. An SMS with code "${testOtp}" was sent to ${testSmsPhone}. Check your phone inbox!`,
          type: 'success'
        });
      } else {
        setTestSmsStatus('error');
        setTestSmsResult(result.message || 'SMS delivery failed');
        await showAlert({
          title: 'SMS Delivery Failed',
          titleSin: 'SMS යැවීම අසාර්ථක විය',
          message: `Error from Notify.lk: ${result.message || 'Check your User ID, API Key, or SMS balance.'}`,
          type: 'danger'
        });
      }
    } catch (err) {
      setTestSmsStatus('error');
      setTestSmsResult(err.message || 'Network error');
      await showAlert({
        title: 'Connection Error',
        titleSin: 'සම්බන්ධතා දෝෂයකි',
        message: err.message || 'Could not connect to Notify.lk server.',
        type: 'danger'
      });
    }
  };

  // Super Admin Profile & Password Security Configuration
  const [adminProfileConfig, setAdminProfileConfig] = useState({
    name: "Master Administrator",
    email: "admin@taizerads.lk",
    phone: "+94 77 123 4567",
    passcode: "ceo",
    role: "CEO / Super Admin",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=faces",
    ...(siteConfig.adminProfile || {})
  });

  const [currentPasswordInput, setCurrentPasswordInput] = useState('');
  const [newPasswordInput, setNewPasswordInput] = useState('');
  const [confirmPasswordInput, setConfirmPasswordInput] = useState('');
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  useEffect(() => {
    if (siteConfig?.adminProfile) {
      setAdminProfileConfig(prev => ({
        ...prev,
        ...siteConfig.adminProfile
      }));
    }
  }, [siteConfig?.adminProfile]);

  // Save Admin Profile Handler
  const handleSaveAdminProfile = (e) => {
    e?.preventDefault();
    const updatedProfile = {
      ...adminProfileConfig,
      lastUpdated: new Date().toISOString().split('T')[0]
    };
    const updatedConfig = {
      ...siteConfig,
      adminProfile: updatedProfile
    };
    onUpdateSiteConfig(updatedConfig);
    onShowToast && onShowToast('Admin profile details updated successfully!');
    showAlert({
      title: 'Profile Updated',
      titleSin: 'පරිපාලක තොරතුරු සුරැකිණි',
      message: 'Admin profile information has been saved successfully.',
      type: 'success'
    });
  };

  // Change Admin Passcode Handler
  const handleChangeAdminPassword = (e) => {
    e?.preventDefault();
    const activePasscode = adminProfileConfig.passcode || siteConfig?.adminProfile?.passcode || 'ceo';

    if (currentPasswordInput.trim() !== activePasscode.trim()) {
      showAlert({
        title: 'Incorrect Current Password',
        titleSin: 'වත්මන් මුරපදය වැරදියි',
        message: 'The current password you entered is incorrect.',
        type: 'danger'
      });
      return;
    }

    if (!newPasswordInput || newPasswordInput.trim().length < 3) {
      showAlert({
        title: 'Password Too Short',
        titleSin: 'මුරපදය කෙටි වැඩියි',
        message: 'New password must be at least 3 characters long.',
        type: 'warning'
      });
      return;
    }

    if (newPasswordInput !== confirmPasswordInput) {
      showAlert({
        title: 'Passwords Do Not Match',
        titleSin: 'මුරපද නොගැලපේ',
        message: 'The new password and confirmation password do not match.',
        type: 'danger'
      });
      return;
    }

    const updatedProfile = {
      ...adminProfileConfig,
      passcode: newPasswordInput.trim(),
      lastUpdated: new Date().toISOString().split('T')[0]
    };
    setAdminProfileConfig(updatedProfile);

    const updatedConfig = {
      ...siteConfig,
      adminProfile: updatedProfile
    };
    onUpdateSiteConfig(updatedConfig);

    setCurrentPasswordInput('');
    setNewPasswordInput('');
    setConfirmPasswordInput('');

    showAlert({
      title: 'Password Updated',
      titleSin: 'මුරපදය සාර්ථකව වෙනස් කරන ලදි',
      message: `Your new CEO access passcode is now active. Remember this password for your next login to /ceo!`,
      type: 'success'
    });
    onShowToast && onShowToast('Admin passcode updated successfully!');
  };

  // Side Blog & Highlight Posts configuration state
  const [sideBlogConfig, setSideBlogConfig] = useState({
    button: {
      title: "Admin Blog",
      titleSin: "විශේෂ ලිපි",
      badgeText: "HOT",
      bgColor: "#881337",
      bgGradient: "linear-gradient(135deg, #881337 0%, #be123c 100%)",
      isGradient: true,
      pulseAnimation: true,
      iconType: "Flame",
      ...(siteConfig.sideBlog?.button || {})
    },
    posts: siteConfig.sideBlog?.posts || []
  });

  const [isBlogModalOpen, setIsBlogModalOpen] = useState(false);
  const [editingBlogPost, setEditingBlogPost] = useState(null);
  const [blogFormData, setBlogFormData] = useState({
    title: '',
    titleSin: '',
    category: 'Featured Guide',
    badge: '⭐ Admin Highlight',
    excerpt: '',
    excerptSin: '',
    content: '',
    imageUrl: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&fit=crop&q=80',
    linkUrl: '',
    actionButtonText: 'Read Article / ලිපිය බලන්න',
    isPrimary: false,
    isActive: true,
    author: 'Chief Editor',
    readTime: '3 min read'
  });

  useEffect(() => {
    if (siteConfig?.sideBlog) {
      setSideBlogConfig({
        button: {
          title: "Admin Blog",
          titleSin: "විශේෂ ලිපි",
          badgeText: "HOT",
          bgColor: "#881337",
          bgGradient: "linear-gradient(135deg, #881337 0%, #be123c 100%)",
          isGradient: true,
          pulseAnimation: true,
          iconType: "Flame",
          ...(siteConfig.sideBlog?.button || {})
        },
        posts: siteConfig.sideBlog?.posts || []
      });
    }
  }, [siteConfig?.sideBlog]);

  // Save Side Blog Button Settings
  const handleSaveBlogButtonSettings = (e) => {
    e?.preventDefault();
    const updatedConfig = {
      ...siteConfig,
      sideBlog: {
        ...(siteConfig.sideBlog || {}),
        button: sideBlogConfig.button,
        posts: sideBlogConfig.posts || []
      }
    };
    onUpdateSiteConfig(updatedConfig);
    onShowToast && onShowToast('Side toggle button settings saved successfully!');
    showAlert({
      title: 'Settings Saved',
      titleSin: 'සැකසුම් සුරැකිණි',
      message: 'Side toggle blog button appearance has been updated.',
      type: 'success'
    });
  };

  // Open modal for new blog post
  const handleOpenNewBlogModal = () => {
    setEditingBlogPost(null);
    setBlogFormData({
      title: '',
      titleSin: '',
      category: 'Featured Guide',
      badge: '⭐ Admin Highlight',
      excerpt: '',
      excerptSin: '',
      content: '',
      imageUrl: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&fit=crop&q=80',
      linkUrl: '',
      actionButtonText: 'Read Article / ලිපිය බලන්න',
      isPrimary: (sideBlogConfig.posts || []).length === 0,
      isActive: true,
      author: 'Admin Team',
      readTime: '3 min read'
    });
    setIsBlogModalOpen(true);
  };

  // Open modal for editing existing blog post
  const handleOpenEditBlogModal = (post) => {
    setEditingBlogPost(post);
    setBlogFormData({ ...post });
    setIsBlogModalOpen(true);
  };

  // Submit Add / Edit Blog Post
  const handleSubmitBlogPost = (e) => {
    e.preventDefault();
    let updatedPosts = [...(sideBlogConfig.posts || [])];

    if (blogFormData.isPrimary) {
      // Unset other primary
      updatedPosts = updatedPosts.map(p => ({ ...p, isPrimary: false }));
    }

    if (editingBlogPost) {
      updatedPosts = updatedPosts.map(p => p.id === editingBlogPost.id ? { ...blogFormData, id: p.id } : p);
    } else {
      const newPost = {
        ...blogFormData,
        id: `blog-${Date.now()}`,
        publishedDate: new Date().toISOString().split('T')[0]
      };
      updatedPosts = [newPost, ...updatedPosts];
    }

    const updatedBlogConfig = {
      ...sideBlogConfig,
      posts: updatedPosts
    };
    setSideBlogConfig(updatedBlogConfig);

    const updatedSiteConfig = {
      ...siteConfig,
      sideBlog: updatedBlogConfig
    };
    onUpdateSiteConfig(updatedSiteConfig);

    setIsBlogModalOpen(false);
    setEditingBlogPost(null);
    onShowToast && onShowToast(editingBlogPost ? 'Blog post updated!' : 'New blog post published!');
  };

  // Delete Blog Post
  const handleDeleteBlogPost = async (postId) => {
    const confirmed = await showConfirm({
      title: 'Delete Blog Post',
      titleSin: 'ලිපිය ඉවත් කිරීම',
      message: 'Are you sure you want to permanently delete this highlighted blog post?',
      type: 'danger',
      confirmText: 'Delete Post'
    });
    if (confirmed) {
      const updatedPosts = (sideBlogConfig.posts || []).filter(p => p.id !== postId);
      const updatedBlogConfig = {
        ...sideBlogConfig,
        posts: updatedPosts
      };
      setSideBlogConfig(updatedBlogConfig);
      onUpdateSiteConfig({
        ...siteConfig,
        sideBlog: updatedBlogConfig
      });
      onShowToast && onShowToast('Blog post deleted successfully.');
    }
  };

  // Toggle Blog Post Active State
  const handleToggleBlogPostActive = (postId) => {
    const updatedPosts = (sideBlogConfig.posts || []).map(p => 
      p.id === postId ? { ...p, isActive: p.isActive === false ? true : false } : p
    );
    const updatedBlogConfig = {
      ...sideBlogConfig,
      posts: updatedPosts
    };
    setSideBlogConfig(updatedBlogConfig);
    onUpdateSiteConfig({
      ...siteConfig,
      sideBlog: updatedBlogConfig
    });
    onShowToast && onShowToast('Post visibility updated.');
  };

  // Set as Primary Highlight
  const handleSetPrimaryHighlight = (postId) => {
    const updatedPosts = (sideBlogConfig.posts || []).map(p => ({
      ...p,
      isPrimary: p.id === postId
    }));
    const updatedBlogConfig = {
      ...sideBlogConfig,
      posts: updatedPosts
    };
    setSideBlogConfig(updatedBlogConfig);
    onUpdateSiteConfig({
      ...siteConfig,
      sideBlog: updatedBlogConfig
    });
    onShowToast && onShowToast('Primary highlight post updated!');
  };

  // Users Management State
  const [usersList, setUsersList] = useState(users);
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [userFilterStatus, setUserFilterStatus] = useState('all'); // 'all' | 'active' | 'suspended' | 'credits'
  const [selectedUserProfile, setSelectedUserProfile] = useState(null);
  const [profileActiveTab, setProfileActiveTab] = useState('credits'); // 'credits' | 'details' | 'ads' | 'notes'
  
  // Quick credit adjustment modal state
  const [creditModalUser, setCreditModalUser] = useState(null);
  const [creditAmount, setCreditAmount] = useState('1500');
  const [creditType, setCreditType] = useState('add'); // 'add' | 'deduct'
  const [creditNote, setCreditNote] = useState('');

  // Register user modal state
  const [isNewUserModalOpen, setIsNewUserModalOpen] = useState(false);
  const [newUserData, setNewUserData] = useState({
    name: '',
    phone: '',
    email: '',
    location: 'Colombo',
    role: 'Verified Advertiser',
    initialCredits: 1500,
    notes: ''
  });

  useEffect(() => {
    setUsersList(users);
  }, [users]);

  // Quick Credit Adjustment submit
  const handleQuickCreditSubmit = (e) => {
    e.preventDefault();
    if (!creditModalUser) return;
    const amt = Number(creditAmount);
    if (isNaN(amt) || amt <= 0) {
      showAlert({
        title: 'Invalid Amount',
        titleSin: 'වලංගු මුදලක් ඇතුළත් කරන්න',
        message: 'Please enter a valid positive credit amount.',
        type: 'warning'
      });
      return;
    }
    onAdjustCredits(creditModalUser.id, amt, creditNote, creditType);
    setCreditModalUser(null);
    setCreditNote('');
    onShowToast && onShowToast(`User ${creditModalUser.name} credits updated!`);
  };

  // Profile modal credit adjust submit
  const handleProfileCreditSubmit = (amount, note, type = 'add') => {
    if (!selectedUserProfile) return;
    const amt = Number(amount);
    if (isNaN(amt) || amt <= 0) {
      showAlert({
        title: 'Invalid Amount',
        titleSin: 'වලංගු මුදලක් ඇතුළත් කරන්න',
        message: 'Please enter a valid positive number for credits.',
        type: 'warning'
      });
      return;
    }
    onAdjustCredits(selectedUserProfile.id, amt, note, type);
    const delta = type === 'add' ? amt : -amt;
    const newBal = Math.max(0, (selectedUserProfile.credits || 0) + delta);
    const newTx = {
      id: `tx-${Date.now()}`,
      amount: amt,
      type,
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      note: note || (type === 'add' ? 'Admin Top-Up' : 'Admin Deduction')
    };
    setSelectedUserProfile({
      ...selectedUserProfile,
      credits: newBal,
      creditHistory: [newTx, ...(selectedUserProfile.creditHistory || [])]
    });
  };

  // Save changes to user profile
  const handleSaveProfileChanges = (e) => {
    e?.preventDefault();
    if (!selectedUserProfile) return;
    const updated = usersList.map(u => u.id === selectedUserProfile.id ? selectedUserProfile : u);
    setUsersList(updated);
    onUpdateUsers(updated);
    onShowToast && onShowToast(`Profile for ${selectedUserProfile.name} saved!`);
  };

  // Toggle user status
  const handleToggleUserStatus = (userId, newStatus) => {
    const updated = usersList.map(u => u.id === userId ? { ...u, status: newStatus } : u);
    setUsersList(updated);
    onUpdateUsers(updated);
    if (selectedUserProfile && selectedUserProfile.id === userId) {
      setSelectedUserProfile({ ...selectedUserProfile, status: newStatus });
    }
    onShowToast && onShowToast(`User status set to ${newStatus}`);
  };

  // Delete user
  const handleDeleteUser = async (userId) => {
    const confirmed = await showConfirm({
      title: 'Delete User Account',
      titleSin: 'පරිශීලක ගිණුම ඉවත් කිරීම',
      message: `Are you sure you want to permanently delete user ${userId}? All associated profile data will be erased.`,
      messageSin: `පරිශීලක ${userId} ගිණුම ස්ථිරවම ඉවත් කිරීමට ඔබට සහතිකද?`,
      type: 'danger',
      confirmText: 'Delete User (ඉවත් කරන්න)',
      cancelText: 'Cancel'
    });
    if (confirmed) {
      const updated = usersList.filter(u => u.id !== userId);
      setUsersList(updated);
      onUpdateUsers(updated);
      deleteUserFromDb(userId).catch(e => console.warn('Mongo user delete sync failed', e));
      if (selectedUserProfile?.id === userId) {
        setSelectedUserProfile(null);
      }
      onShowToast && onShowToast('User account deleted from database.');
    }
  };

  // Create new user
  const handleCreateNewUser = (e) => {
    e.preventDefault();
    if (!newUserData.name.trim() || !newUserData.phone.trim()) {
      showAlert({
        title: 'Details Required',
        titleSin: 'නම හා දුරකථන අංකය අවශ්‍යයි',
        message: 'Please provide both user name and phone number.',
        type: 'warning'
      });
      return;
    }
    const initialAmt = Number(newUserData.initialCredits) || 0;
    const newUser = {
      id: `#${Math.floor(10000 + Math.random() * 90000)}`,
      name: newUserData.name.trim(),
      phone: newUserData.phone.trim(),
      email: newUserData.email.trim(),
      role: newUserData.role,
      status: 'Active',
      credits: initialAmt,
      joinedDate: new Date().toISOString().split('T')[0],
      lastActive: 'Just now',
      location: newUserData.location.trim() || 'Colombo',
      notes: newUserData.notes.trim(),
      creditHistory: initialAmt > 0 ? [
        {
          id: `tx-${Date.now()}`,
          amount: initialAmt,
          type: 'add',
          date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
          note: 'Initial Registration Deposit'
        }
      ] : []
    };
    const updated = [newUser, ...usersList];
    setUsersList(updated);
    onUpdateUsers(updated);
    setIsNewUserModalOpen(false);
    setNewUserData({
      name: '',
      phone: '',
      email: '',
      location: 'Colombo',
      role: 'Verified Advertiser',
      initialCredits: 1500,
      notes: ''
    });
    onShowToast && onShowToast(`User ${newUser.name} created with Rs. ${newUser.credits} credits!`);
  };

  // Helper to find ads for user
  const getUserAds = (user) => {
    if (!user) return [];
    const cleanUserPhone = (user.phone || '').replace(/[^0-9]/g, '');
    return ads.filter(ad => {
      if (ad.userId && ad.userId === user.id) return true;
      const cleanAdPhone = (ad.phone || '').replace(/[^0-9]/g, '');
      if (cleanAdPhone && cleanUserPhone && cleanAdPhone.length >= 7 && cleanUserPhone.length >= 7) {
        return cleanAdPhone.endsWith(cleanUserPhone.slice(-7)) || cleanUserPhone.endsWith(cleanAdPhone.slice(-7));
      }
      return false;
    });
  };

  // Local state for site notices (සිංහල නිවේදන)
  const [noticesList, setNoticesList] = useState(siteConfig.notices || []);
  const [newNoticeTitleSin, setNewNoticeTitleSin] = useState('');
  const [newNoticeTitleEn, setNewNoticeTitleEn] = useState('');
  const [newNoticeContentSin, setNewNoticeContentSin] = useState('');
  const [newNoticeContentEn, setNewNoticeContentEn] = useState('');
  const [newNoticeType, setNewNoticeType] = useState('danger'); // 'danger' | 'warning' | 'info' | 'success'
  const [newNoticeBadgeSin, setNewNoticeBadgeSin] = useState('ආරක්ෂක අවවාදයයි');
  const [newNoticeIsPinned, setNewNoticeIsPinned] = useState(true);
  const [newNoticeIsActive, setNewNoticeIsActive] = useState(true);

  // Sinhala Quick Templates
  const noticePresets = [
    {
      titleSin: 'විශේෂ ආරක්ෂක අනතුරු ඇඟවීමයි',
      titleEn: 'Important Safety Warning',
      contentSin: 'කිසිදු දැන්වීම්කරුවෙකුට භාණ්ඩ හෝ සේවා ලැබීමට පෙර කලින් Advance මුදල් (Reload හෝ බැංකු තැන්පතු) නොගෙවන්න. වංචනිකයන්ගෙන් ප්‍රවේශම් වන්න.',
      contentEn: 'Never send advance payments (Reload or Bank transfers) before receiving or verifying goods/services. Protect yourself from fraud.',
      type: 'danger',
      badgeSin: 'ආරක්ෂක අවවාදයයි',
      isPinned: true
    },
    {
      titleSin: 'දැන්වීම් අනුමත කිරීම පිළිබඳ දැනුම්දීම',
      titleEn: 'Ad Approval Turnaround Notice',
      contentSin: 'ඔබ විසින් පළ කරන සියලුම දැන්වීම් Admin කණ්ඩායම විසින් මිනිත්තු 5-15ක් ඇතුළත පරීක්ෂා කර වෙබ් අඩවියේ සජීවීව පළ කරනු ලැබේ.',
      contentEn: 'All newly posted advertisements are reviewed and approved live by the admin team within 5 to 15 minutes.',
      type: 'info',
      badgeSin: 'Admin තොරතුරු',
      isPinned: false
    },
    {
      titleSin: 'VIP දැන්වීම් සඳහා අද දින විශේෂ වට්ටම්',
      titleEn: 'Special Discount on VIP Ads Today',
      contentSin: 'අද දින VIP දැන්වීම් පළ කිරීම සඳහා 20% ක විශේෂ වට්ටමක් හිමි වේ. වැඩිම පිරිසක් වෙත ළඟා වීමට දැන්ම VIP පැකේජය තෝරන්න.',
      contentEn: 'Get an exclusive 20% discount on all VIP tier advertisements today. Reach thousands of buyers directly!',
      type: 'success',
      badgeSin: 'විශේෂ දීමනාව',
      isPinned: false
    },
    {
      titleSin: 'ව්‍යාජ ගිණුම් හා සැක සහිත දැන්වීම් වාර්තා කරන්න',
      titleEn: 'Report Fake Accounts & Suspicious Ads',
      contentSin: 'ව්‍යාජ හෝ සැක සහිත දැන්වීම් දුටුවහොත් අපගේ Complaints හෝ Hotline හරහා වහාම වාර්තා කරන්න.',
      contentEn: 'If you encounter any suspicious or fake advertisements, report them immediately via our complaints center or hotlines.',
      type: 'warning',
      badgeSin: 'ව්‍යාජ දැන්වීම්',
      isPinned: true
    }
  ];

  const handleApplyNoticePreset = (preset) => {
    setNewNoticeTitleSin(preset.titleSin);
    setNewNoticeTitleEn(preset.titleEn);
    setNewNoticeContentSin(preset.contentSin);
    setNewNoticeContentEn(preset.contentEn);
    setNewNoticeType(preset.type);
    setNewNoticeBadgeSin(preset.badgeSin);
    setNewNoticeIsPinned(preset.isPinned);
  };

  const handleCreateNotice = async (e) => {
    e.preventDefault();
    if (!newNoticeTitleSin.trim() && !newNoticeTitleEn.trim()) {
      await showAlert({
        title: 'Title Required',
        titleSin: 'නිවේදනයේ මාතෘකාව අවශ්‍යයි',
        message: 'Please enter a title for the announcement.',
        messageSin: 'කරුණාකර නිවේදනයේ මාතෘකාව (Title) ඇතුළත් කරන්න.',
        type: 'warning'
      });
      return;
    }
    if (!newNoticeContentSin.trim() && !newNoticeContentEn.trim()) {
      await showAlert({
        title: 'Content Required',
        titleSin: 'විස්තරය අවශ්‍යයි',
        message: 'Please enter the details/content for the announcement.',
        messageSin: 'කරුණාකර නිවේදනයේ විස්තරය (Content) ඇතුළත් කරන්න.',
        type: 'warning'
      });
      return;
    }

    const newNotice = {
      id: 'notice-' + Date.now(),
      titleSin: newNoticeTitleSin.trim(),
      titleEn: newNoticeTitleEn.trim() || newNoticeTitleSin.trim(),
      contentSin: newNoticeContentSin.trim(),
      contentEn: newNoticeContentEn.trim() || newNoticeContentSin.trim(),
      type: newNoticeType,
      badgeSin: newNoticeBadgeSin.trim() || 'නිවේදනයයි',
      badgeEn: newNoticeBadgeSin.trim() === 'ආරක්ෂක අවවාදයයි' ? 'Urgent Warning' : 'Admin Notice',
      isPinned: newNoticeIsPinned,
      isActive: newNoticeIsActive,
      createdAt: new Date().toISOString().split('T')[0]
    };

    const updated = [newNotice, ...noticesList];
    setNoticesList(updated);
    onUpdateSiteConfig({
      ...siteConfig,
      notices: updated
    });

    setNewNoticeTitleSin('');
    setNewNoticeTitleEn('');
    setNewNoticeContentSin('');
    setNewNoticeContentEn('');
    onShowToast && onShowToast('නව සිංහල නිවේදනය සාර්ථකව පළ කරන ලදී! (Notice published live!)');
  };

  const handleToggleNoticeActive = (id) => {
    const updated = noticesList.map(n => n.id === id ? { ...n, isActive: !n.isActive } : n);
    setNoticesList(updated);
    onUpdateSiteConfig({ ...siteConfig, notices: updated });
    onShowToast && onShowToast('Notice status updated!');
  };

  const handleToggleNoticePinned = (id) => {
    const updated = noticesList.map(n => n.id === id ? { ...n, isPinned: !n.isPinned } : n);
    setNoticesList(updated);
    onUpdateSiteConfig({ ...siteConfig, notices: updated });
    onShowToast && onShowToast('Notice pin status updated!');
  };

  const handleDeleteNotice = async (id) => {
    const confirmed = await showConfirm({
      title: 'Delete Announcement',
      titleSin: 'නිවේදනය ඉවත් කිරීම',
      message: 'Are you sure you want to delete this notice broadcast? This cannot be undone.',
      messageSin: 'මෙම නිවේදනය ඉවත් කිරීමට ඔබට සහතිකද?',
      type: 'danger',
      confirmText: 'Delete Notice (ඉවත් කරන්න)',
      cancelText: 'Cancel (අවලංගු කරන්න)'
    });
    if (confirmed) {
      const updated = noticesList.filter(n => n.id !== id);
      setNoticesList(updated);
      onUpdateSiteConfig({ ...siteConfig, notices: updated });
      onShowToast && onShowToast('Notice deleted.');
    }
  };


  // Ads filtering & search
  const [adFilterStatus, setAdFilterStatus] = useState('all');
  const [adFilterBadge, setAdFilterBadge] = useState('all');
  const [adSearchQuery, setAdSearchQuery] = useState('');

  // Editing Ad modal state
  const [editingAd, setEditingAd] = useState(null);

  // New Story state
  const [newStoryName, setNewStoryName] = useState('');
  const [newStoryFullTitle, setNewStoryFullTitle] = useState('');
  const [newStoryImage, setNewStoryImage] = useState('');
  const [newStoryIsLive, setNewStoryIsLive] = useState(true);

  // Quick Feature User Ad into Story state
  const [selectedAdForStory, setSelectedAdForStory] = useState('');
  const [quickStoryTag, setQuickStoryTag] = useState('🔥 50% OFF');
  const [quickStoryDesc, setQuickStoryDesc] = useState('');
  const [quickStoryIsLive, setQuickStoryIsLive] = useState(true);
  const [quickStoryDeductCredits, setQuickStoryDeductCredits] = useState(false);
  const [storyAdSearchQuery, setStoryAdSearchQuery] = useState('');
  const [existingStorySearchQuery, setExistingStorySearchQuery] = useState('');

  // Pending story requests from registered users
  const pendingStoryRequests = ads.filter(a => a.storySpotRequested);
  const registeredUserAds = ads.filter(a => a.status === 'Approved' && a.isActive !== false);

  // Filtered registered ads for Story placement search
  const filteredUserAdsForStory = registeredUserAds.filter(ad => {
    if (!storyAdSearchQuery.trim()) return true;
    const q = storyAdSearchQuery.toLowerCase().trim();
    const matchTitle = (ad.title || '').toLowerCase().includes(q);
    const matchId = (ad.id || '').toString().toLowerCase().includes(q);
    const matchPhone = (ad.phone || '').toLowerCase().includes(q);
    const matchLocation = (ad.location || '').toLowerCase().includes(q);
    const matchPrice = (ad.price || '').toLowerCase().includes(q);
    const matchUser = (ad.userName || ad.name || '').toLowerCase().includes(q);
    return matchTitle || matchId || matchPhone || matchLocation || matchPrice || matchUser;
  });

  // New Agent state
  const [newAgentName, setNewAgentName] = useState('');
  const [newAgentPhone, setNewAgentPhone] = useState('');
  const [newAgentRating, setNewAgentRating] = useState('4.9/5');

  // Stats calculation
  const totalAds = ads.length;
  const pendingAds = ads.filter(a => a.status === 'Pending Approval');
  const approvedAds = ads.filter(a => a.status === 'Approved');
  const fakeAds = ads.filter(a => a.isFake || a.status === 'Fake Ad');
  const expiredAds = ads.filter(a => getAdValidity(a).isExpired);
  const activeLiveAds = ads.filter(a => a.status === 'Approved' && !getAdValidity(a).isExpired);
  const renewalRequests = ads.filter(a => a.renewalStatus === 'requested');
  const packageRequests = siteConfig?.packageRequests || [];
  const pendingPackageRequests = packageRequests.filter(r => r.status === 'Pending Admin Review' || r.status === 'pending' || !r.status);
  const vipAdsCount = ads.filter(a => a.badgeType === 'VIP Ad').length;
  const superAdsCount = ads.filter(a => a.badgeType === 'Super Ad').length;
  const estimatedRevenue = (vipAdsCount * pricingConfig.vipAd) + (superAdsCount * pricingConfig.superAd);

  // Approval validity mapping (custom days or exact date per pending ad)
  const [approvalValidityMap, setApprovalValidityMap] = useState({});

  // Helper to get approval validity settings for an ad
  const getApprovalValidityInfo = (adId) => {
    const val = approvalValidityMap[adId];
    if (typeof val === 'string' && val.includes('-')) {
      const expiryIso = calculateExpiryFromDateString(val);
      const days = getDaysBetween(expiryIso);
      const formatted = new Date(expiryIso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
      return { days, dateStr: val, expiryIso, formattedExpiry: formatted, isDateMode: true, raw: val };
    }
    const days = Math.max(1, Number(val) || 5);
    const expiryIso = calculateExpiryDate(days);
    const formatted = new Date(expiryIso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    return { days, dateStr: formatDateForDateInput(expiryIso), expiryIso, formattedExpiry: formatted, isDateMode: false, raw: days };
  };

  // State for Custom Validity Extension Modal
  const [extensionModalAd, setExtensionModalAd] = useState(null);
  const [extensionDaysInput, setExtensionDaysInput] = useState(5);
  const [extensionDateInput, setExtensionDateInput] = useState('');

  // Filtered ads in manager
  const displayedAds = ads.filter(ad => {
    const validity = getAdValidity(ad);
    if (adFilterStatus === 'pending' && ad.status !== 'Pending Approval') return false;
    if (adFilterStatus === 'approved' && (ad.status !== 'Approved' || validity.isExpired)) return false;
    if (adFilterStatus === 'expired' && !validity.isExpired) return false;
    if (adFilterStatus === 'renewals' && ad.renewalStatus !== 'requested') return false;
    if (adFilterStatus === 'package-requests' && !ad.packageUpgradeRequested) return false;
    if (adFilterStatus === 'fake' && !(ad.isFake || ad.status === 'Fake Ad')) return false;
    if (adFilterBadge !== 'all' && ad.badgeType !== adFilterBadge) return false;
    if (adSearchQuery) {
      return matchAdSearch(ad, adSearchQuery);
    }
    return true;
  });

  // Save Banner Changes
  const handleSaveBanners = () => {
    onUpdateSiteConfig({
      ...siteConfig,
      topBanner: bannerConfig,
      safetyBanner: safetyConfig,
      notices: noticesList
    });
    onShowToast && onShowToast('Top Banner & Safety Alerts updated live!');
  };

  // Save Pricing & Bank
  const handleSavePricing = () => {
    onUpdateSiteConfig({
      ...siteConfig,
      pricing: pricingConfig,
      bankDetails: bankConfig,
      contact: contactConfig
    });
    onShowToast && onShowToast('Pricing, Bank & Contact details saved!');
  };

  // Save Login Form & Real SMS Gateway Customizations
  const handleSaveLoginForm = () => {
    onUpdateSiteConfig({
      ...siteConfig,
      loginForm: loginFormConfig,
      smsGateway: smsGatewayConfig
    });
    onShowToast && onShowToast('Login form & Notify.lk SMS Gateway settings saved live!');
    showAlert({
      title: 'Settings Saved',
      titleSin: 'සැකසුම් සුරැකිණි',
      message: 'Login form customizations and Notify.lk SMS Gateway settings have been saved successfully.',
      type: 'success'
    });
  };

  // Reset Login Form Customizations
  const handleResetLoginForm = async () => {
    const confirmed = await showConfirm({
      title: 'Reset Login Form Settings',
      titleSin: 'ලොගින් පිටුවේ මුල් සැකසුම් ලබා ගැනීම',
      message: 'Are you sure you want to reset the Login & Register form back to default text and colors?',
      messageSin: 'ලොගින් පිටුවේ සියලුම සැකසුම් මුල් තත්වයට පත් කිරීමට ඔබට සහතිකද?',
      type: 'warning'
    });
    if (confirmed) {
      const defaultForm = {
        title: "Login/ Register",
        subtitle: "ගිණුමට log වීම සහ ගිණුමක් සාදා ගැනීම යන කාර්යයන් දෙකවම මෙම form එක භාවිතා කරන්න.",
        phoneLabel: "Enter Phone Number",
        phoneHelpText: "ඔබගේ දුරකථන අංකය ඇතුලත් කර Send OTP Click කරන්න.",
        phonePlaceholder: "XXXXXXX",
        defaultCountryCode: "+94",
        sendOtpButtonText: "Send OTP",
        sendOtpButtonColor: "#991230",
        otpHintText: "Enter verification code to continue (Default test code: 1234)",
        otpLabel: "4-Digit Verification OTP",
        verifyButtonText: "Verify & Login (ඇතුල් වන්න)",
        backButtonText: "Back",
        agentSectionTitle: "Agent support to post an ad.",
        agentSectionSubtitle: "දැන්වීමක් පලකර ගැනීමට නියෝජිත සහාය.",
        agentButtonText: "See Agents",
        agentButtonColor: "#0f172a",
        agentButtonAction: "modal",
        agentCustomUrl: "",
        agentWhatsappNumber: "+94771234567"
      };
      setLoginFormConfig(defaultForm);
      onUpdateSiteConfig({
        ...siteConfig,
        loginForm: defaultForm
      });
      onShowToast && onShowToast('Login form reset to default settings.');
    }
  };

  // Add new story avatar
  const handleCreateStory = async (e) => {
    e.preventDefault();
    if (!newStoryName || !newStoryImage) {
      await showAlert({
        title: 'Information Required',
        titleSin: 'තොරතුරු අවශ්‍යයි',
        message: 'Please provide both story name and image URL.',
        messageSin: 'කරුණාකර නම සහ පින්තූරයේ URL එක ඇතුළත් කරන්න.',
        type: 'warning'
      });
      return;
    }
    const newStory = {
      id: Date.now(),
      name: newStoryName,
      fullTitle: newStoryFullTitle || newStoryName,
      image: newStoryImage,
      isLive: newStoryIsLive
    };
    onAddStory(newStory);
    setNewStoryName('');
    setNewStoryFullTitle('');
    setNewStoryImage('');
    onShowToast && onShowToast('New circular story avatar added!');
  };

  // Approve user's story spot request
  const handleApproveStoryRequest = (targetAd) => {
    const newStory = {
      id: 'story-' + Date.now(),
      name: targetAd.storyOfferTag || targetAd.title.slice(0, 12),
      fullTitle: targetAd.storyOfferDetails || targetAd.title,
      image: targetAd.image,
      isLive: true,
      adId: targetAd.id,
      userId: targetAd.userId || targetAd.phone,
      isSpecialOffer: true,
      offerTag: targetAd.storyOfferTag,
      offerDetails: targetAd.storyOfferDetails
    };
    onAddStory(newStory);
    onUpdateAd({
      ...targetAd,
      inStorySpot: true,
      storySpotRequested: false
    });
    onShowToast && onShowToast(`Ad #${targetAd.id} approved and added to Circular Story Avatars!`);
  };

  // Decline user's story spot request
  const handleDeclineStoryRequest = async (targetAd) => {
    const confirmed = await showConfirm({
      title: 'Decline Story Spot Request',
      titleSin: 'Story Spot ඉල්ලීම ප්‍රතික්ෂේප කිරීම',
      message: `Are you sure you want to decline the Special Offer Story request for "${targetAd.title}"?${targetAd.storyPaidWithCredits ? ` Rs. ${(pricingConfig.storySpot || 2000).toLocaleString()} will be refunded to user's credits.` : ''}`,
      messageSin: `මෙම ඉල්ලීම ප්‍රතික්ෂේප කිරීමට ඔබට සහතිකද?`,
      type: 'warning'
    });
    if (confirmed) {
      if (targetAd.storyPaidWithCredits && onAdjustCredits) {
        const matchedUser = usersList.find(u => u.phone === targetAd.phone || u.id === targetAd.userId);
        if (matchedUser) {
          onAdjustCredits(matchedUser.id, pricingConfig.storySpot || 2000, `Refund: Story spot request declined for Ad #${targetAd.id}`, 'add');
        }
      }
      onUpdateAd({
        ...targetAd,
        storySpotRequested: false,
        storyOfferTag: null,
        storyOfferDetails: null,
        storyPaidWithCredits: false
      });
      onShowToast && onShowToast('Story spot request declined.');
    }
  };

  // Quick Feature Any User Ad
  const handleQuickAddUserAdToStory = async (e) => {
    e?.preventDefault();
    if (!selectedAdForStory) {
      await showAlert({
        title: 'Select Advertisement',
        titleSin: 'දැන්වීමක් තෝරන්න',
        message: 'Please select a registered user ad to place in the Circular Story Spot.',
        type: 'warning'
      });
      return;
    }
    const targetAd = ads.find(a => a.id === selectedAdForStory);
    if (!targetAd) return;

    const fee = pricingConfig.storySpot || 2000;
    if (quickStoryDeductCredits && onAdjustCredits) {
      const matchedUser = usersList.find(u => u.phone === targetAd.phone || u.id === targetAd.userId);
      if (matchedUser) {
        if ((matchedUser.credits || 0) < fee) {
          const proceedWithout = await showConfirm({
            title: 'Insufficient User Credits',
            titleSin: 'පරිශීලකයා සතුව ප්‍රමාණවත් ක්‍රෙඩිට් නොමැත',
            message: `User ${matchedUser.name} has only Rs. ${(matchedUser.credits || 0).toLocaleString()} (Required: Rs. ${fee.toLocaleString()}). Place in Story Spot anyway without deduction?`,
            type: 'warning'
          });
          if (!proceedWithout) return;
        } else {
          onAdjustCredits(matchedUser.id, fee, `Story Spot placement fee for Ad #${targetAd.id}`, 'deduct');
        }
      }
    }

    const newStory = {
      id: 'story-' + Date.now(),
      name: quickStoryTag.trim() || targetAd.title.slice(0, 12),
      fullTitle: quickStoryDesc.trim() || targetAd.title,
      image: targetAd.image,
      isLive: quickStoryIsLive,
      adId: targetAd.id,
      userId: targetAd.userId || targetAd.phone,
      isSpecialOffer: true,
      offerTag: quickStoryTag.trim(),
      offerDetails: quickStoryDesc.trim() || targetAd.title
    };

    onAddStory(newStory);
    onUpdateAd({
      ...targetAd,
      inStorySpot: true,
      storyOfferTag: quickStoryTag.trim(),
      storyOfferDetails: quickStoryDesc.trim()
    });

    setSelectedAdForStory('');
    setQuickStoryTag('🔥 50% OFF');
    setQuickStoryDesc('');
    onShowToast && onShowToast(`Ad #${targetAd.id} placed in Circular Story Avatars!`);
  };

  // Remove Story and unlink from ad
  const handleRemoveStory = async (story) => {
    const confirmed = await showConfirm({
      title: 'Remove Story Avatar',
      titleSin: 'Story Avatar එක ඉවත් කිරීම',
      message: `Are you sure you want to remove "${story.name}" from Circular Live Stories?`,
      type: 'warning'
    });
    if (confirmed) {
      if (story.adId) {
        const linkedAd = ads.find(a => a.id === story.adId);
        if (linkedAd) {
          onUpdateAd({ ...linkedAd, inStorySpot: false });
        }
      }
      onDeleteStory(story.id);
    }
  };

  // Add new agent
  const handleCreateAgent = async (e) => {
    e.preventDefault();
    if (!newAgentName || !newAgentPhone) {
      await showAlert({
        title: 'Agent Details Required',
        titleSin: 'නියෝජිත තොරතුරු අවශ්‍යයි',
        message: 'Please fill in both agent name and phone number.',
        messageSin: 'කරුණාකර නියෝජිතයාගේ නම සහ දුරකථන අංකය ඇතුළත් කරන්න.',
        type: 'warning'
      });
      return;
    }
    const updated = [
      ...agentsList,
      { id: Date.now(), name: newAgentName, phone: newAgentPhone, rating: newAgentRating, status: 'Active' }
    ];
    setAgentsList(updated);
    onUpdateSiteConfig({ ...siteConfig, agents: updated });
    setNewAgentName('');
    setNewAgentPhone('');
    onShowToast && onShowToast('New Verified Agent registered!');
  };

  // Delete agent
  const handleDeleteAgent = (agentId) => {
    const updated = agentsList.filter(a => a.id !== agentId);
    setAgentsList(updated);
    onUpdateSiteConfig({ ...siteConfig, agents: updated });
    onShowToast && onShowToast('Agent removed.');
  };

  // Save edited ad
  const handleSaveEditAd = (e) => {
    e.preventDefault();
    const updated = {
      ...editingAd,
      packages: [
        `⭐ ${(editingAd.title || '').toUpperCase()} ⭐`,
        `⭐ Location: ${editingAd.location || 'Colombo'}`,
        `⭐ Price: ${editingAd.price || 'Rs. 1,500.00'}`,
        `⭐ 24 Hours Service Line Available`,
        "",
        `✨ DESCRIPTION & PACKAGES ✨`,
        (editingAd.description || '').trim()
      ]
    };
    onUpdateAd(updated);
    setEditingAd(null);
    onShowToast && onShowToast('Ad updated successfully! (දැන්වීමේ වෙනස්කම් සුරකින ලදී)');
  };

  return (
    <div className="bg-[#0f172a] text-gray-100 rounded-2xl shadow-2xl border border-gray-800 overflow-hidden min-h-[750px] flex flex-col">
      {/* Top Admin Header Bar */}
      <div className="bg-[#1e293b] border-b border-gray-800 px-5 py-3.5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#f03a5f] to-amber-500 flex items-center justify-center font-black text-white text-lg shadow-md">
            🛡️
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="font-extrabold text-base md:text-lg text-white tracking-tight">
                Taizer Ads Super Admin Panel
              </h2>
              <span className="bg-red-500/20 text-red-400 border border-red-500/30 text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase">
                Full Access
              </span>
            </div>
            <p className="text-xs text-gray-400">Complete Real-Time Website Management Suite</p>
          </div>
        </div>

        <div className="flex items-center space-x-2.5">
          {/* Admin Profile Shortcut Pill */}
          <button
            onClick={() => setActiveAdminTab('profile')}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-xl text-left border transition group ${
              activeAdminTab === 'profile'
                ? 'bg-[#f03a5f]/20 border-[#f03a5f] text-white'
                : 'bg-gray-800/80 hover:bg-gray-700/80 border-gray-700 text-gray-300'
            }`}
            title="Edit Admin Profile & Password"
          >
            <img
              src={adminProfileConfig?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=faces"}
              alt="Admin"
              className="w-6 h-6 rounded-full object-cover border border-emerald-400"
              onError={(e) => {
                e.target.src = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=faces";
              }}
            />
            <div className="hidden sm:block">
              <p className="text-xs font-bold text-white group-hover:text-emerald-300 transition leading-tight">
                {adminProfileConfig?.name || 'Super Admin'}
              </p>
              <p className="text-[10px] text-gray-400 leading-tight">
                {adminProfileConfig?.email || 'admin@taizerads.lk'}
              </p>
            </div>
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 ml-1" />
          </button>

          {/* Exit Admin Button */}
          <button
            onClick={onExitAdmin}
            className="flex items-center space-x-1.5 bg-[#f03a5f] hover:bg-[#d92348] text-white font-bold text-xs px-4 py-2 rounded-xl transition shadow-md active:scale-95"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Exit Admin / View Live Website</span>
          </button>
        </div>
      </div>

      {/* Admin Layout: Sidebar Tabs + Main View Area */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Left Navigation Sidebar */}
        <div className="w-full md:w-64 bg-[#111827] border-r border-gray-800 p-3 flex flex-row md:flex-col gap-1 overflow-x-auto">
          <button
            onClick={() => setActiveAdminTab('overview')}
            className={`w-full flex items-center space-x-2.5 px-3 py-2.5 rounded-xl font-bold text-xs transition whitespace-nowrap ${
              activeAdminTab === 'overview'
                ? 'bg-[#f03a5f] text-white shadow-md'
                : 'text-gray-400 hover:text-white hover:bg-gray-800'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Dashboard Overview</span>
          </button>

          <button
            onClick={() => setActiveAdminTab('ads')}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-bold text-xs transition whitespace-nowrap ${
              activeAdminTab === 'ads'
                ? 'bg-[#f03a5f] text-white shadow-md'
                : 'text-gray-400 hover:text-white hover:bg-gray-800'
            }`}
          >
            <div className="flex items-center space-x-2.5">
              <FileSpreadsheet className="w-4 h-4" />
              <span>All Ads Manager</span>
            </div>
            {pendingAds.length > 0 && (
              <span className="bg-amber-500 text-black text-[10px] font-black px-1.5 py-0.2 rounded-full">
                {pendingAds.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveAdminTab('notices')}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-bold text-xs transition whitespace-nowrap ${
              activeAdminTab === 'notices'
                ? 'bg-[#f03a5f] text-white shadow-md'
                : 'text-gray-400 hover:text-white hover:bg-gray-800'
            }`}
          >
            <div className="flex items-center space-x-2.5">
              <Bell className="w-4 h-4 text-amber-400" />
              <span>Notices (සිංහල නිවේදන)</span>
            </div>
            <span className="bg-pink-500 text-white text-[10px] font-black px-1.5 py-0.2 rounded-full">
              {noticesList.filter(n => n.isActive !== false).length}
            </span>
          </button>

          <button
            onClick={() => setActiveAdminTab('banners')}
            className={`w-full flex items-center space-x-2.5 px-3 py-2.5 rounded-xl font-bold text-xs transition whitespace-nowrap ${
              activeAdminTab === 'banners'
                ? 'bg-[#f03a5f] text-white shadow-md'
                : 'text-gray-400 hover:text-white hover:bg-gray-800'
            }`}
          >
            <Megaphone className="w-4 h-4" />
            <span>Top Banners & Pulse</span>
          </button>

          <button
            onClick={() => setActiveAdminTab('stories')}
            className={`w-full flex items-center space-x-2.5 px-3 py-2.5 rounded-xl font-bold text-xs transition whitespace-nowrap ${
              activeAdminTab === 'stories'
                ? 'bg-[#f03a5f] text-white shadow-md'
                : 'text-gray-400 hover:text-white hover:bg-gray-800'
            }`}
          >
            <CircleDot className="w-4 h-4" />
            <span>Live Story Avatars</span>
          </button>

          <button
            onClick={() => setActiveAdminTab('pricing')}
            className={`w-full flex items-center space-x-2.5 px-3 py-2.5 rounded-xl font-bold text-xs transition whitespace-nowrap ${
              activeAdminTab === 'pricing'
                ? 'bg-[#f03a5f] text-white shadow-md'
                : 'text-gray-400 hover:text-white hover:bg-gray-800'
            }`}
          >
            <DollarSign className="w-4 h-4" />
            <span>Pricing & Bank Accounts</span>
          </button>

          <button
            onClick={() => setActiveAdminTab('complaints')}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-bold text-xs transition whitespace-nowrap ${
              activeAdminTab === 'complaints'
                ? 'bg-[#f03a5f] text-white shadow-md'
                : 'text-gray-400 hover:text-white hover:bg-gray-800'
            }`}
          >
            <div className="flex items-center space-x-2.5">
              <AlertOctagon className="w-4 h-4" />
              <span>User Complaints</span>
            </div>
            {complaintsList.length > 0 && (
              <span className="bg-red-500 text-white text-[10px] font-black px-1.5 py-0.2 rounded-full">
                {complaintsList.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveAdminTab('agents')}
            className={`w-full flex items-center space-x-2.5 px-3 py-2.5 rounded-xl font-bold text-xs transition whitespace-nowrap ${
              activeAdminTab === 'agents'
                ? 'bg-[#f03a5f] text-white shadow-md'
                : 'text-gray-400 hover:text-white hover:bg-gray-800'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Verified Agents</span>
          </button>

          <button
            onClick={() => setActiveAdminTab('users')}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-bold text-xs transition whitespace-nowrap ${
              activeAdminTab === 'users'
                ? 'bg-[#f03a5f] text-white shadow-md'
                : 'text-gray-400 hover:text-white hover:bg-gray-800'
            }`}
          >
            <div className="flex items-center space-x-2.5">
              <Wallet className="w-4 h-4 text-emerald-400" />
              <span>Users & Credits (පරිශීලකයින්)</span>
            </div>
            <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-black px-1.5 py-0.5 rounded-full border border-emerald-500/30">
              {usersList.length}
            </span>
          </button>

          <button
            onClick={() => setActiveAdminTab('loginForm')}
            className={`w-full flex items-center space-x-2.5 px-3 py-2.5 rounded-xl font-bold text-xs transition whitespace-nowrap ${
              activeAdminTab === 'loginForm'
                ? 'bg-[#f03a5f] text-white shadow-md'
                : 'text-gray-400 hover:text-white hover:bg-gray-800'
            }`}
          >
            <LogIn className="w-4 h-4 text-rose-400" />
            <span>Login Page & Form (ලොගින් පිටුව)</span>
          </button>


          <button
            onClick={() => setActiveAdminTab('profile')}
            className={`w-full flex items-center space-x-2.5 px-3 py-2.5 rounded-xl font-bold text-xs transition whitespace-nowrap ${
              activeAdminTab === 'profile'
                ? 'bg-[#f03a5f] text-white shadow-md'
                : 'text-gray-400 hover:text-white hover:bg-gray-800'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Admin Profile & Security (පරිපාලක)</span>
          </button>

          <button
            onClick={() => setActiveAdminTab('blog')}
            className={`w-full flex items-center space-x-2.5 px-3 py-2.5 rounded-xl font-bold text-xs transition whitespace-nowrap ${
              activeAdminTab === 'blog'
                ? 'bg-[#f03a5f] text-white shadow-md'
                : 'text-gray-400 hover:text-white hover:bg-gray-800'
            }`}
          >
            <BookOpen className="w-4 h-4 text-amber-400" />
            <span>Side Blog & Highlights (බ්ලොග් ලිපි)</span>
          </button>
        </div>

        {/* Main Content Viewport */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto max-h-[85vh] bg-[#0b1329]">
          {/* TAB 1: OVERVIEW */}
          {activeAdminTab === 'overview' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* Stat Counters Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3">
                <div className="bg-[#1e293b] border border-gray-800 p-3.5 rounded-xl shadow-xs">
                  <p className="text-xs text-gray-400 font-semibold">Total Ads</p>
                  <p className="text-2xl font-black text-white mt-1">{totalAds}</p>
                  <p className="text-[10px] text-gray-400 mt-1 font-medium">Database listings</p>
                </div>

                <div className="bg-[#1e293b] border border-amber-900/40 p-3.5 rounded-xl shadow-xs">
                  <p className="text-xs text-amber-400 font-semibold">Pending Approvals</p>
                  <p className="text-2xl font-black text-amber-300 mt-1">{pendingAds.length}</p>
                  <p className="text-[10px] text-amber-200/80 mt-1">Requires review</p>
                </div>

                <div className="bg-[#1e293b] border border-green-900/40 p-3.5 rounded-xl shadow-xs">
                  <p className="text-xs text-green-400 font-semibold">Live on Feed</p>
                  <p className="text-2xl font-black text-green-400 mt-1">{activeLiveAds.length}</p>
                  <p className="text-[10px] text-green-300/80 mt-1 font-medium">Active & within date</p>
                </div>

                {/* ⏰ Expired Ads Counter Card */}
                <div 
                  onClick={() => {
                    setAdFilterStatus('expired');
                    setActiveAdminTab('ads');
                  }}
                  className="bg-[#1e293b] border border-rose-900/50 p-3.5 rounded-xl shadow-xs cursor-pointer hover:border-rose-500 transition group"
                >
                  <p className="text-xs text-rose-400 font-semibold flex items-center justify-between">
                    <span>⏰ Expired Ads</span>
                    <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition" />
                  </p>
                  <p className="text-2xl font-black text-rose-400 mt-1">{expiredAds.length}</p>
                  <p className="text-[10px] text-rose-300/80 mt-1 font-medium">Hidden from feed</p>
                </div>

                {/* 🔄 Renewal Requests Counter Card */}
                <div 
                  onClick={() => {
                    setAdFilterStatus('renewals');
                    setActiveAdminTab('ads');
                  }}
                  className="bg-[#1e293b] border border-purple-900/50 p-3.5 rounded-xl shadow-xs cursor-pointer hover:border-purple-500 transition group"
                >
                  <p className="text-xs text-purple-400 font-semibold flex items-center justify-between">
                    <span>🔄 Renewals</span>
                    <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition" />
                  </p>
                  <p className="text-2xl font-black text-purple-300 mt-1">{renewalRequests.length}</p>
                  <p className="text-[10px] text-purple-200/80 mt-1 font-medium">Waiting approval</p>
                </div>

                {/* 📦 Package Requests Counter Card */}
                <div 
                  onClick={() => {
                    setAdFilterStatus('package-requests');
                    setActiveAdminTab('ads');
                  }}
                  className="bg-[#1e293b] border border-amber-900/50 p-3.5 rounded-xl shadow-xs cursor-pointer hover:border-amber-500 transition group"
                >
                  <p className="text-xs text-amber-400 font-semibold flex items-center justify-between">
                    <span>📦 Packages</span>
                    <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition" />
                  </p>
                  <p className="text-2xl font-black text-amber-300 mt-1">{pendingPackageRequests.length}</p>
                  <p className="text-[10px] text-amber-200/80 mt-1 font-medium">Wallet Requests</p>
                </div>

                <div className="bg-[#1e293b] border border-red-900/40 p-3.5 rounded-xl shadow-xs">
                  <p className="text-xs text-red-400 font-semibold">Flagged Fake</p>
                  <p className="text-2xl font-black text-red-400 mt-1">{fakeAds.length}</p>
                  <p className="text-[10px] text-red-300/80 mt-1">Scams marked</p>
                </div>

                <div 
                  onClick={() => setActiveAdminTab('users')}
                  className="bg-[#1e293b] border border-emerald-900/50 p-3.5 rounded-xl shadow-xs cursor-pointer hover:border-emerald-500 transition group"
                >
                  <p className="text-xs text-emerald-400 font-semibold flex items-center justify-between">
                    <span>Users & Credits</span>
                    <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition" />
                  </p>
                  <p className="text-2xl font-black text-emerald-300 mt-1">{usersList.length}</p>
                  <p className="text-[10px] text-emerald-400/80 mt-1 font-medium">
                    Rs. {usersList.reduce((acc, u) => acc + (u.credits || 0), 0).toLocaleString()} bal
                  </p>
                </div>
              </div>

              {/* Quick Pending Approvals Queue */}
              <div className="bg-[#1e293b] border border-gray-800 rounded-xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                    <span>Ads Awaiting Admin Approval ({pendingAds.length})</span>
                  </h3>
                  <button
                    onClick={() => setActiveAdminTab('ads')}
                    className="text-xs text-[#f03a5f] hover:underline font-bold"
                  >
                    View All Ads →
                  </button>
                </div>

                {pendingAds.length > 0 ? (
                  <div className="space-y-3">
                    {pendingAds.map(ad => {
                      const valInfo = getApprovalValidityInfo(ad.id);
                      return (
                        <div
                          key={ad.id}
                          className="bg-[#0f172a] border border-amber-500/30 p-3.5 rounded-xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3"
                        >
                          <div className="flex items-center space-x-3 min-w-0">
                            <img
                              src={ad.image || 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&auto=format&fit=crop&q=80'}
                              alt=""
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&auto=format&fit=crop&q=80';
                              }}
                              className="w-14 h-14 rounded-lg object-cover border border-gray-700 shrink-0"
                            />
                            <div className="min-w-0">
                              <div className="flex items-center space-x-2">
                                <span className="bg-amber-400/20 text-amber-300 text-[10px] font-black px-2 py-0.5 rounded">
                                  {ad.badgeType}
                                </span>
                                <span className="text-[10px] text-gray-400 font-mono">#{ad.id}</span>
                              </div>
                              <h4 className="font-bold text-xs sm:text-sm text-white mt-1 line-clamp-1">
                                {ad.title}
                              </h4>
                              <p className="text-[11px] text-gray-400">
                                Phone: {ad.phone} • Price: {ad.price}
                              </p>
                            </div>
                          </div>

                          <div className="flex flex-wrap items-center gap-2 self-end lg:self-center">
                            {/* Duration Presets + Custom Days + Date Picker */}
                            <div className="flex flex-wrap items-center gap-1 bg-gray-900 border border-gray-700 p-1.5 rounded-xl text-xs">
                              <span className="text-[10px] text-gray-400 font-bold px-1 flex items-center gap-1">
                                <Clock className="w-3 h-3 text-amber-400" />
                                <span>Days:</span>
                              </span>

                              {[1, 3, 5, 7, 10, 15, 30].map(d => (
                                <button
                                  key={d}
                                  type="button"
                                  onClick={() => setApprovalValidityMap(prev => ({ ...prev, [ad.id]: d }))}
                                  className={`px-1.5 py-0.5 rounded text-[10px] font-black transition cursor-pointer ${
                                    !valInfo.isDateMode && valInfo.days === d
                                      ? 'bg-[#f03a5f] text-white shadow-xs'
                                      : 'text-gray-400 hover:text-white'
                                  }`}
                                >
                                  {d}d
                                </button>
                              ))}

                              {/* Custom Days Input */}
                              <div className="flex items-center space-x-1 bg-black/40 border border-gray-700 rounded px-1.5 py-0.5" title="Enter any custom number of days">
                                <span className="text-[9px] text-gray-400">Custom:</span>
                                <input
                                  type="number"
                                  min="1"
                                  max="365"
                                  value={valInfo.days}
                                  onChange={(e) => {
                                    const v = Math.max(1, parseInt(e.target.value) || 1);
                                    setApprovalValidityMap(prev => ({ ...prev, [ad.id]: v }));
                                  }}
                                  className="w-10 bg-transparent text-center text-[10.5px] text-amber-300 font-black focus:outline-none"
                                />
                                <span className="text-[9px] text-gray-400">d</span>
                              </div>

                              {/* Calendar Date Picker */}
                              <div className="flex items-center space-x-1 bg-black/40 border border-gray-700 rounded px-1.5 py-0.5" title="Pick exact expiration date from calendar">
                                <Calendar className="w-3 h-3 text-amber-400 shrink-0" />
                                <input
                                  type="date"
                                  min={formatDateForDateInput(new Date())}
                                  value={valInfo.dateStr}
                                  onChange={(e) => {
                                    if (e.target.value) {
                                      setApprovalValidityMap(prev => ({ ...prev, [ad.id]: e.target.value }));
                                    }
                                  }}
                                  className="bg-transparent text-[10px] text-gray-300 focus:outline-none cursor-pointer"
                                />
                              </div>
                            </div>

                            <button
                              onClick={() => onApproveAd(ad.id, valInfo.raw)}
                              className="bg-green-600 hover:bg-green-500 text-white text-xs font-bold px-3 py-2 rounded-xl flex items-center space-x-1.5 shadow-sm transition active:scale-95 cursor-pointer"
                              title={`Auto-expires on ${valInfo.formattedExpiry}`}
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Approve ({valInfo.days}d • {valInfo.formattedExpiry})</span>
                            </button>
                            <button
                              onClick={() => onRejectAd(ad.id)}
                              className="bg-red-600 hover:bg-red-500 text-white text-xs font-bold px-3 py-2 rounded-xl flex items-center space-x-1 shadow-sm transition cursor-pointer"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                              <span>Reject</span>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-6 text-gray-500 text-xs">
                    ✓ All submitted advertisements have been reviewed and approved!
                  </div>
                )}
              </div>

              {/* Quick Ad Renewal Requests Queue */}
              {renewalRequests.length > 0 && (
                <div className="bg-[#1e293b] border border-purple-800/60 rounded-xl p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                      <span className="w-2 h-2 rounded-full bg-purple-400 animate-ping" />
                      <span>Ad Renewal Requests ({renewalRequests.length})</span>
                    </h3>
                    <button
                      onClick={() => {
                        setAdFilterStatus('renewals');
                        setActiveAdminTab('ads');
                      }}
                      className="text-xs text-purple-400 hover:underline font-bold"
                    >
                      View in Ads Manager →
                    </button>
                  </div>

                  <div className="space-y-3">
                    {renewalRequests.map(ad => (
                      <div
                        key={ad.id}
                        className="bg-[#0f172a] border border-purple-500/40 p-3.5 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                      >
                        <div className="flex items-center space-x-3">
                          <img
                            src={ad.image || 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&auto=format&fit=crop&q=80'}
                            alt=""
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&auto=format&fit=crop&q=80';
                            }}
                            className="w-14 h-14 rounded-lg object-cover border border-purple-500/30 shrink-0"
                          />
                          <div>
                            <div className="flex items-center space-x-2">
                              <span className="bg-purple-500/20 text-purple-300 text-[10px] font-black px-2 py-0.5 rounded">
                                Request: +{ad.renewalDaysRequested || 5} Days
                              </span>
                              <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                                ad.renewalPaidWithCredits 
                                  ? 'bg-green-500/20 text-green-400' 
                                  : 'bg-blue-500/20 text-blue-400'
                              }`}>
                                {ad.renewalPaidWithCredits ? '✓ Paid with Credits' : 'WhatsApp Slip'}
                              </span>
                            </div>
                            <h4 className="font-bold text-xs sm:text-sm text-white mt-1 line-clamp-1">
                              {ad.title}
                            </h4>
                            <p className="text-[11px] text-gray-400">
                              Ad ID: #{ad.id} • Phone: {ad.phone}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2 self-end sm:self-center">
                          <button
                            onClick={() => onRenewAd && onRenewAd(ad.id, ad.renewalDaysRequested || 5)}
                            className="bg-purple-600 hover:bg-purple-500 text-white text-xs font-black px-3.5 py-1.5 rounded-lg flex items-center space-x-1 shadow-sm transition active:scale-95 cursor-pointer"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Approve Renewal (+{ad.renewalDaysRequested || 5} Days)</span>
                          </button>
                          <button
                            onClick={() => onExpireAd && onExpireAd(ad.id)}
                            className="bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs font-bold px-2.5 py-1.5 rounded-lg transition cursor-pointer"
                          >
                            Dismiss
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 📦 Wallet Package Activation Requests Queue */}
              {pendingPackageRequests.length > 0 && (
                <div className="bg-[#1e293b] border border-amber-800/60 rounded-xl p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                      <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                      <span>Wallet Package Activation Requests ({pendingPackageRequests.length})</span>
                    </h3>
                    <span className="text-xs text-amber-400 font-bold bg-amber-950/60 border border-amber-800 px-2.5 py-0.5 rounded-md">
                      ✓ Paid via Wallet Credits
                    </span>
                  </div>

                  <div className="space-y-3">
                    {pendingPackageRequests.map((req) => (
                      <div
                        key={req.id}
                        className="bg-[#0f172a] border border-amber-500/40 p-4 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-md"
                      >
                        <div className="flex items-center space-x-3.5 min-w-0">
                          {req.targetAdImage ? (
                            <img
                              src={req.targetAdImage}
                              alt=""
                              className="w-14 h-14 rounded-xl object-cover border border-amber-500/30 shrink-0"
                            />
                          ) : (
                            <div className="w-14 h-14 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                              <Sparkles className="w-6 h-6" />
                            </div>
                          )}

                          <div className="space-y-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-1.5">
                              <span className={`text-[10px] font-black px-2 py-0.5 rounded shadow-xs text-white ${
                                req.packageName === 'VIP Ad' ? 'bg-[#dc2626]' : req.packageName === 'Super Ad' ? 'bg-[#d97706]' : 'bg-[#2563eb]'
                              }`}>
                                {req.packageName} (Rs. {Number(req.packageCost || 0).toLocaleString()})
                              </span>
                              <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold px-2 py-0.5 rounded">
                                ✓ Paid via Wallet
                              </span>
                            </div>

                            <h4 className="font-extrabold text-xs sm:text-sm text-white truncate">
                              {req.targetAdTitle || 'New Ad Package Assignment'}
                            </h4>

                            <p className="text-[11px] text-gray-400">
                              User: <strong className="text-gray-200">{req.userName}</strong> ({req.userPhone || req.userId}) • Submitted: {new Date(req.requestedAt).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2 self-end sm:self-center shrink-0">
                          <button
                            type="button"
                            onClick={() => onApprovePackageRequest && onApprovePackageRequest(req.id)}
                            className="bg-green-600 hover:bg-green-500 text-white text-xs font-black px-4 py-2 rounded-xl flex items-center space-x-1.5 shadow-md transition active:scale-95 cursor-pointer"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>✓ Approve & Activate Package</span>
                          </button>

                          <button
                            type="button"
                            onClick={async () => {
                              const reason = await showPrompt({
                                title: 'Reject Package Request',
                                titleSin: 'පැකේජ ඉල්ලීම ප්‍රතික්ෂේප කිරීම',
                                message: `Enter reason to reject ${req.packageName} request and refund Rs. ${Number(req.packageCost || 0).toLocaleString()} to ${req.userName}:`,
                                defaultValue: 'Package request declined by Admin. Credits refunded.',
                                confirmText: 'Reject & Refund Wallet',
                                cancelText: 'Cancel'
                              });
                              if (reason) {
                                onRejectPackageRequest && onRejectPackageRequest(req.id, reason);
                              }
                            }}
                            className="bg-red-950/70 hover:bg-red-900 text-red-300 border border-red-800 text-xs font-bold px-3 py-2 rounded-xl transition cursor-pointer"
                          >
                            ✕ Reject & Refund
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: ALL ADS MANAGER (FULL CRUD) */}
          {activeAdminTab === 'ads' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              {/* Search & Filter Tools Bar */}
              <div className="bg-[#1e293b] border border-gray-800 p-3.5 rounded-xl flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center space-x-2 flex-1 min-w-[200px]">
                  <Search className="w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={adSearchQuery}
                    onChange={(e) => setAdSearchQuery(e.target.value)}
                    placeholder="Search by Title, Phone, or ID..."
                    className="w-full bg-[#0f172a] border border-gray-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#f03a5f]"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <select
                    value={adFilterStatus}
                    onChange={(e) => setAdFilterStatus(e.target.value)}
                    className="bg-[#0f172a] border border-gray-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none cursor-pointer"
                  >
                    <option value="all">All Statuses ({totalAds})</option>
                    <option value="pending">Pending Approval ({pendingAds.length})</option>
                    <option value="package-requests">📦 Package Requests ({pendingPackageRequests.length})</option>
                    <option value="approved">Approved & Live ({activeLiveAds.length})</option>
                    <option value="renewals">🔄 Renewal Requests ({renewalRequests.length})</option>
                    <option value="expired">⏰ Expired Ads ({expiredAds.length})</option>
                    <option value="fake">🚫 Fake Ads Only ({fakeAds.length})</option>
                  </select>

                  <select
                    value={adFilterBadge}
                    onChange={(e) => setAdFilterBadge(e.target.value)}
                    className="bg-[#0f172a] border border-gray-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none cursor-pointer"
                  >
                    <option value="all">All Badges</option>
                    <option value="Super Ad">Super Ad</option>
                    <option value="VIP Ad">VIP Ad</option>
                    <option value="NRA Ad">NRA Ad</option>
                    <option value="Normal Ad">Normal Ad</option>
                  </select>
                </div>
              </div>

              {/* Ads Table / List */}
              <div className="space-y-3">
                {displayedAds.map((ad) => {
                  const isPending = ad.status === 'Pending Approval';
                  const isFake = ad.isFake || ad.status === 'Fake Ad';
                  const validity = getAdValidity(ad);
                  const valInfo = getApprovalValidityInfo(ad.id);

                  return (
                    <div
                      key={ad.id}
                      className={`border rounded-2xl p-4 sm:p-5 transition-all duration-200 shadow-xl flex flex-col gap-3.5 ${
                        isFake 
                          ? 'border-red-600/70 bg-gradient-to-b from-red-950/30 to-[#141e33] hover:border-red-500' 
                          : validity.isExpired
                          ? 'border-rose-800/60 bg-gradient-to-b from-rose-950/20 to-[#141e33] hover:border-rose-600'
                          : ad.renewalStatus === 'requested'
                          ? 'border-purple-800/70 bg-gradient-to-b from-purple-950/20 to-[#141e33] hover:border-purple-600'
                          : isPending
                          ? 'border-amber-500/40 bg-gradient-to-b from-amber-950/15 via-[#16223b] to-[#141e33] hover:border-amber-500/70 shadow-amber-950/20'
                          : 'border-gray-800/90 hover:border-gray-700/90 bg-[#141e33]'
                      }`}
                    >
                      {/* Top Row: Thumbnail + Main Meta + Top Actions */}
                      <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                        <div className="flex items-start space-x-3.5 flex-1 min-w-0 w-full sm:w-auto">
                          <div className="relative flex-shrink-0">
                            <img
                              src={ad.image || 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&auto=format&fit=crop&q=80'}
                              alt=""
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&auto=format&fit=crop&q=80';
                              }}
                              className={`w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover border shadow-md ${
                                isFake ? 'border-red-500 grayscale' : validity.isExpired ? 'border-rose-500' : 'border-gray-700'
                              }`}
                            />
                            {isFake ? (
                              <span className="absolute inset-0 bg-red-950/80 flex items-center justify-center rounded-xl font-black text-[10px] text-white rotate-[-12deg] tracking-wider uppercase shadow">
                                🚫 FAKE
                              </span>
                            ) : validity.isExpired ? (
                              <span className="absolute inset-0 bg-rose-950/85 flex items-center justify-center rounded-xl font-black text-[9px] text-white text-center px-1 uppercase shadow">
                                ⏰ EXPIRED
                              </span>
                            ) : null}
                          </div>

                          <div className="space-y-1.5 min-w-0 flex-1">
                            {/* Badges and tags */}
                            <div className="flex flex-wrap items-center gap-1.5">
                              <span className="text-[10px] font-mono font-bold text-gray-400 bg-gray-900 border border-gray-800 px-2 py-0.5 rounded-md">
                                #{ad.id}
                              </span>
                              <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md ${
                                ad.badgeType === 'VIP Ad'
                                  ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                                  : ad.badgeType === 'Super Ad'
                                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                                  : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                              }`}>
                                {ad.badgeType}
                              </span>

                              {isFake ? (
                                <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-red-600 text-white shadow-xs border border-red-400 flex items-center space-x-1 animate-pulse">
                                  <AlertTriangle className="w-3 h-3 text-white" />
                                  <span>Fake Ad (ව්‍යාජයි)</span>
                                </span>
                              ) : validity.isExpired ? (
                                <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-rose-600 text-white shadow-xs border border-rose-400 flex items-center space-x-1">
                                  <Clock className="w-3 h-3" />
                                  <span>⏰ Expired (කල් ඉකුත් විය)</span>
                                </span>
                              ) : (
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                                  isPending ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                                }`}>
                                  {ad.status || 'Approved'}
                                </span>
                              )}

                              {/* Validity remaining countdown / Expiry date */}
                              {!isPending && !isFake && (
                                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md flex items-center gap-1 ${
                                  validity.isExpired
                                    ? 'bg-rose-950/60 text-rose-300 border border-rose-800'
                                    : validity.daysRemaining <= 2
                                    ? 'bg-amber-950/60 text-amber-300 border border-amber-800'
                                    : 'bg-gray-800/90 text-gray-300 border border-gray-700'
                                }`}>
                                  <Calendar className="w-3 h-3 text-gray-400" />
                                  <span>
                                    {validity.isExpired
                                      ? `Expired on ${validity.formattedExpiry}`
                                      : `Valid: ${validity.daysRemaining}d left (${validity.formattedExpiry})`}
                                  </span>
                                </span>
                              )}

                              {/* Renewal requested badge */}
                              {ad.renewalStatus === 'requested' && (
                                <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-purple-600 text-white border border-purple-400 flex items-center space-x-1 animate-pulse">
                                  <RefreshCw className="w-3 h-3" />
                                  <span>
                                    Renewal Req: +{ad.renewalDaysRequested || 5} Days ({ad.renewalPaidWithCredits ? 'Credits' : 'WhatsApp Slip'})
                                  </span>
                                </span>
                              )}
                            </div>

                            {/* Ad Title */}
                            <h4 className="font-black text-sm sm:text-base text-white line-clamp-1">
                              {ad.title}
                            </h4>

                            {/* Meta items */}
                            <div className="flex flex-wrap items-center gap-2 text-xs text-gray-400">
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3 h-3 text-gray-500" />
                                <span>{ad.location || 'Colombo'}</span>
                              </span>
                              <span>•</span>
                              <span className="font-bold text-amber-300">
                                {ad.price || 'Negotiable'}
                              </span>
                              <span>•</span>
                              <span className="flex items-center gap-1 text-gray-300">
                                <Phone className="w-3 h-3 text-emerald-400" />
                                <span>{ad.phone}</span>
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Top quick actions */}
                        <div className="flex items-center space-x-1.5 self-end sm:self-start shrink-0">
                          <button
                            type="button"
                            onClick={() => setEditingAd(ad)}
                            className="bg-gray-800/90 hover:bg-gray-700 text-gray-200 hover:text-white text-xs font-bold px-2.5 py-1.5 rounded-xl flex items-center space-x-1 border border-gray-700 transition cursor-pointer"
                            title="Edit advertisement details"
                          >
                            <Edit className="w-3.5 h-3.5" />
                            <span>Edit</span>
                          </button>

                          <button
                            type="button"
                            onClick={async () => {
                              const confirmed = await showConfirm({
                                title: 'Delete Advertisement',
                                titleSin: 'දැන්වීම ඉවත් කිරීම',
                                message: `Are you sure you want to permanently delete advertisement #${ad.id} ("${ad.title}")?`,
                                messageSin: `දැන්වීම #${ad.id} ස්ථිරවම ඉවත් කිරීමට ඔබට සහතිකද?`,
                                type: 'danger',
                                confirmText: 'Delete Ad (ඉවත් කරන්න)',
                                cancelText: 'Cancel (අවලංගු කරන්න)'
                              });
                              if (confirmed) {
                                onDeleteAd(ad.id);
                                onShowToast && onShowToast(`Ad #${ad.id} deleted.`);
                              }
                            }}
                            className="bg-red-950/40 hover:bg-red-900/80 text-red-300 border border-red-900/60 text-xs font-bold px-2.5 py-1.5 rounded-xl flex items-center space-x-1 transition cursor-pointer"
                            title="Permanently delete ad"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Dedicated Payment & Slip Verification Bar */}
                      <div className="p-3 rounded-xl bg-[#0b1329]/95 border border-gray-800/90 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-inner">
                        <div className="flex flex-wrap items-center gap-2 text-xs">
                          {/* Payment Method & Expected Price */}
                          <div className="flex items-center space-x-1.5 bg-gray-900/90 border border-gray-700/80 px-2.5 py-1 rounded-lg">
                            <CreditCard className="w-3.5 h-3.5 text-blue-400" />
                            <span className="text-gray-300 font-semibold">{ad.paymentMethod || 'Bank Transfer'}</span>
                            <span className="text-gray-600">•</span>
                            <span className="font-mono font-bold text-emerald-400">
                              {ad.price || `Rs. ${ad.paymentAmount || 1500}`}
                            </span>
                          </div>

                          {/* Payment Status Pill */}
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-bold text-[11px] ${
                            ad.paymentStatus === 'Verified' || ad.paymentStatus === 'Paid via Wallet'
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                              : ad.paymentStatus === 'Rejected'
                              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                              : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                          }`}>
                            {ad.paymentStatus === 'Verified' || ad.paymentStatus === 'Paid via Wallet' ? (
                              <CheckCircle2 className="w-3.5 h-3.5" />
                            ) : (
                              <Clock className="w-3.5 h-3.5" />
                            )}
                            <span>{ad.paymentStatus || 'Pending Verification'}</span>
                          </span>

                          {/* Bank Reference */}
                          {ad.paymentRef && (
                            <span className="inline-flex items-center gap-1 bg-gray-900 border border-gray-700 px-2 py-1 rounded-lg text-[11px] text-gray-300">
                              <span className="text-gray-500 font-normal">Ref:</span>
                              <span className="font-mono font-bold text-amber-300">{ad.paymentRef}</span>
                            </span>
                          )}

                          {/* Rejection Reason */}
                          {ad.rejectionReason && (
                            <span className="inline-flex items-center gap-1 bg-rose-950/60 border border-rose-800 px-2.5 py-1 rounded-lg text-[11px] text-rose-300">
                              <AlertOctagon className="w-3 h-3 text-rose-400 shrink-0" />
                              <span>Reason: {ad.rejectionReason}</span>
                            </span>
                          )}
                        </div>

                        {/* Dedicated Payment Slip Button */}
                        {ad.paymentSlip ? (
                          <button
                            type="button"
                            onClick={() => setInspectingSlipAd(ad)}
                            className={`inline-flex items-center justify-center gap-2 px-4 py-1.5 rounded-xl text-xs font-black transition-all duration-200 cursor-pointer shadow-md hover:scale-[1.02] active:scale-95 shrink-0 ${
                              isPdfSlip(ad.paymentSlip)
                                ? 'bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-500 hover:to-rose-600 text-white shadow-red-950/60 border border-red-400/50'
                                : 'bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:to-indigo-600 text-white shadow-blue-950/60 border border-blue-400/50'
                            }`}
                          >
                            <FileText className="w-4 h-4 shrink-0" />
                            <span>
                              {isPdfSlip(ad.paymentSlip)
                                ? '📑 View PDF Receipt (PDF රිසිට්පත)'
                                : '📄 View Payment Slip (රිසිට්පත)'}
                            </span>
                            <ExternalLink className="w-3.5 h-3.5 opacity-80 shrink-0" />
                          </button>
                        ) : (
                          <span className="text-[11px] text-gray-500 italic px-2 py-1">
                            No Bank Slip Uploaded (Wallet / Direct)
                          </span>
                        )}
                      </div>

                      {/* Warnings if Expired or Fake */}
                      {validity.isExpired && !isFake && (
                        <p className="text-[11px] text-rose-400 font-semibold flex items-center space-x-1.5 bg-rose-950/30 border border-rose-900/50 p-2 rounded-xl">
                          <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                          <span>වලංගු කාලය අවසන් වී ඇති බැවින් Public Feed එකෙන් ඉවත් කර ඇත. නැවත සක්‍රීය කිරීමට +Days ලබා දෙන්න.</span>
                        </p>
                      )}
                      {isFake && (
                        <p className="text-[11px] text-red-400 font-semibold flex items-center space-x-1.5 bg-red-950/30 border border-red-900/50 p-2 rounded-xl">
                          <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                          <span>Marked as Scam / Fake Ad. Hidden from normal feed, visible under Fake Ads category.</span>
                        </p>
                      )}

                      {/* Bottom Administrative Actions Bar */}
                      <div className="pt-2 border-t border-gray-800/80 flex flex-wrap items-center justify-between gap-3">
                        {/* If Renewal requested, prioritize Approve Renewal button */}
                        {ad.renewalStatus === 'requested' && (
                          <button
                            onClick={() => onRenewAd && onRenewAd(ad.id, ad.renewalDaysRequested || 5)}
                            className="bg-purple-600 hover:bg-purple-500 text-white text-xs font-black px-3.5 py-1.5 rounded-xl flex items-center space-x-1.5 shadow-md transition active:scale-95 cursor-pointer"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            <span>✓ Approve Renewal (+{ad.renewalDaysRequested || 5}d)</span>
                          </button>
                        )}

                        {isPending ? (
                          <div className="flex flex-wrap items-center gap-2.5 w-full">
                            {/* Duration Presets + Custom Days + Date Picker */}
                            <div className="flex flex-wrap items-center gap-1.5 bg-gray-900 border border-gray-700/80 p-1.5 rounded-xl text-xs">
                              <span className="text-[11px] text-gray-400 font-bold px-1.5 flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5 text-amber-400" />
                                <span>Duration:</span>
                              </span>

                              {[1, 3, 5, 7, 10, 15, 30].map(d => (
                                <button
                                  key={d}
                                  type="button"
                                  onClick={() => setApprovalValidityMap(prev => ({ ...prev, [ad.id]: d }))}
                                  className={`px-2 py-0.5 rounded-lg text-[11px] font-black transition cursor-pointer ${
                                    !valInfo.isDateMode && valInfo.days === d
                                      ? 'bg-[#f03a5f] text-white shadow-xs'
                                      : 'text-gray-400 hover:text-white hover:bg-gray-800'
                                  }`}
                                >
                                  {d}d
                                </button>
                              ))}

                              {/* Custom Days Input */}
                              <div className="flex items-center space-x-1 bg-black/50 border border-gray-700 rounded-lg px-2 py-0.5" title="Enter any custom number of days">
                                <span className="text-[10px] text-gray-400">Custom:</span>
                                <input
                                  type="number"
                                  min="1"
                                  max="365"
                                  value={valInfo.days}
                                  onChange={(e) => {
                                    const v = Math.max(1, parseInt(e.target.value) || 1);
                                    setApprovalValidityMap(prev => ({ ...prev, [ad.id]: v }));
                                  }}
                                  className="w-10 bg-transparent text-center text-xs text-amber-300 font-black focus:outline-none"
                                />
                                <span className="text-[10px] text-gray-400">d</span>
                              </div>

                              {/* Calendar Date Picker */}
                              <div className="flex items-center space-x-1 bg-black/50 border border-gray-700 rounded-lg px-2 py-0.5" title="Pick exact expiration date from calendar">
                                <Calendar className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                                <input
                                  type="date"
                                  min={formatDateForDateInput(new Date())}
                                  value={valInfo.dateStr}
                                  onChange={(e) => {
                                    if (e.target.value) {
                                      setApprovalValidityMap(prev => ({ ...prev, [ad.id]: e.target.value }));
                                    }
                                  }}
                                  className="bg-transparent text-[11px] text-gray-300 focus:outline-none cursor-pointer"
                                />
                              </div>
                            </div>

                            <div className="flex items-center space-x-2 ml-auto">
                              <button
                                onClick={() => onApproveAd(ad.id, valInfo.raw)}
                                className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white text-xs font-black px-4 py-2 rounded-xl flex items-center space-x-1.5 shadow-md shadow-green-950/40 transition active:scale-95 cursor-pointer"
                                title={`Auto-expires on ${valInfo.formattedExpiry}`}
                              >
                                <CheckCircle2 className="w-4 h-4" />
                                <span>Approve & Activate ({valInfo.days}d)</span>
                              </button>

                              <button
                                type="button"
                                onClick={async () => {
                                  const reason = await showPrompt({
                                    title: 'Reject Advertisement',
                                    titleSin: 'දැන්වීම ප්‍රතික්ෂේප කිරීම',
                                    message: 'Enter reason for rejecting this ad / payment slip:',
                                    messageSin: 'දැන්වීම හෝ රිසිට්පත ප්‍රතික්ෂේප කිරීමට හේතුව ඇතුළත් කරන්න:',
                                    defaultValue: 'Invalid or unclear bank payment slip',
                                    placeholder: 'e.g. Slip is unreadable / incorrect deposit amount',
                                    confirmText: 'Reject Ad',
                                    cancelText: 'Cancel'
                                  });
                                  if (reason) {
                                    onRejectAd && onRejectAd(ad.id, reason);
                                  }
                                }}
                                className="bg-rose-950/60 hover:bg-rose-900 text-rose-300 border border-rose-800/80 text-xs font-bold px-3 py-2 rounded-xl flex items-center space-x-1 shadow-sm transition cursor-pointer"
                                title="Reject ad and payment slip"
                              >
                                <XCircle className="w-4 h-4" />
                                <span>Reject</span>
                              </button>

                              {/* Mark / Unmark Fake */}
                              <button
                                onClick={() => onMarkFakeAd(ad.id)}
                                className={`text-xs font-bold px-3 py-2 rounded-xl flex items-center space-x-1 shadow-sm transition cursor-pointer ${
                                  isFake
                                    ? 'bg-purple-700 hover:bg-purple-600 text-white'
                                    : 'bg-red-950/60 hover:bg-red-900 text-red-300 border border-red-800/60'
                                }`}
                                title={isFake ? 'Remove Fake Flag' : 'Mark this advertisement as Fake / Scam'}
                              >
                                <AlertTriangle className="w-3.5 h-3.5" />
                                <span>{isFake ? 'Unmark Fake' : 'Scam / Fake'}</span>
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex flex-wrap items-center gap-2 w-full">
                            {/* Quick Extend +5 Days */}
                            <button
                              onClick={() => onRenewAd && onRenewAd(ad.id, 5)}
                              className="bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold px-3 py-1.5 rounded-xl flex items-center space-x-1 shadow-sm transition cursor-pointer"
                              title="Extend validity period by +5 days"
                            >
                              <RefreshCw className="w-3.5 h-3.5" />
                              <span>{validity.isExpired ? 'Re-activate (+5d)' : '+5 Days'}</span>
                            </button>

                            {/* Custom Validity / Extension Modal Opener */}
                            <button
                              onClick={() => {
                                setExtensionModalAd(ad);
                                setExtensionDaysInput(5);
                                setExtensionDateInput('');
                              }}
                              className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-3 py-1.5 rounded-xl flex items-center space-x-1 shadow-sm transition cursor-pointer"
                              title="Set custom days or exact calendar date"
                            >
                              <Calendar className="w-3.5 h-3.5" />
                              <span>{validity.isExpired ? 'Re-activate Custom...' : 'Extend Custom...'}</span>
                            </button>

                            {/* Expire Now button if active */}
                            {!validity.isExpired && (
                              <button
                                onClick={async () => {
                                  const confirmed = await showConfirm({
                                    title: 'Expire Advertisement',
                                    titleSin: 'දැන්වීම කල් ඉකුත් කරන්න',
                                    message: `Immediately expire Ad #${ad.id} ("${ad.title}") and remove from live feed? User can renew it later.`,
                                    messageSin: `දැන්වීම #${ad.id} කල් ඉකුත් කර Live Feed එකෙන් ඉවත් කිරීමට අවශ්‍යද?`,
                                    type: 'warning',
                                    confirmText: 'Expire Now (ඉවත් කරන්න)',
                                    cancelText: 'Cancel'
                                  });
                                  if (confirmed) {
                                    onExpireAd && onExpireAd(ad.id);
                                  }
                                }}
                                className="bg-rose-950/70 hover:bg-rose-900 text-rose-300 border border-rose-800 text-xs font-bold px-3 py-1.5 rounded-xl flex items-center space-x-1 shadow-sm transition cursor-pointer"
                                title="Force expire this ad now"
                              >
                                <Clock className="w-3.5 h-3.5" />
                                <span>Expire Now</span>
                              </button>
                            )}

                            <button
                              onClick={() => onRejectAd(ad.id)}
                              className="bg-amber-600/80 hover:bg-amber-600 text-white text-xs font-bold px-3 py-1.5 rounded-xl flex items-center space-x-1 shadow-sm transition cursor-pointer"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                              <span>Set Pending</span>
                            </button>

                            {/* Mark / Unmark Fake Ad Button */}
                            <button
                              onClick={() => onMarkFakeAd(ad.id)}
                              className={`text-xs font-bold px-3 py-1.5 rounded-xl flex items-center space-x-1 shadow-sm transition cursor-pointer ml-auto ${
                                isFake
                                  ? 'bg-purple-700 hover:bg-purple-600 text-white'
                                  : 'bg-red-950/80 hover:bg-red-900 text-red-300 hover:text-white border border-red-500/40'
                              }`}
                              title={isFake ? 'Remove Fake Flag' : 'Mark this advertisement as Fake / Scam'}
                            >
                              <AlertTriangle className="w-3.5 h-3.5" />
                              <span>{isFake ? 'Unmark Fake' : 'Mark Fake'}</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB: NOTICES & ANNOUNCEMENTS (සිංහල නිවේදන) */}
          {activeAdminTab === 'notices' && (
            <div className="space-y-6 max-w-4xl animate-in fade-in duration-200">
              {/* Form to Post New Notice */}
              <div className="bg-[#1e293b] border border-gray-800 rounded-xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-extrabold text-sm text-white flex items-center space-x-2">
                    <Bell className="w-4 h-4 text-amber-400" />
                    <span>Post New Notice (නව සිංහල නිවේදනයක් පළ කරන්න)</span>
                  </h3>
                  <span className="text-[11px] text-gray-400 bg-gray-800 px-2 py-0.5 rounded-full">
                    Real-time Live Broadcast
                  </span>
                </div>

                {/* 4 Quick Sinhala Preset Buttons */}
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1.5">
                    ⚡ Quick Presets (ක්ෂණික සිංහල ආකෘති තෝරන්න):
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                    {noticePresets.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleApplyNoticePreset(preset)}
                        className="bg-[#0f172a] hover:bg-gray-800 border border-gray-700 hover:border-amber-400/50 p-2.5 rounded-lg text-left text-xs transition space-y-1"
                      >
                        <div className="flex items-center space-x-1 font-bold text-amber-300 text-[11px]">
                          <span>{preset.type === 'danger' ? '🚨' : preset.type === 'info' ? 'ℹ️' : preset.type === 'success' ? '💎' : '⚠️'}</span>
                          <span className="truncate">{preset.badgeSin}</span>
                        </div>
                        <p className="text-[10px] text-gray-400 truncate">{preset.titleSin}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Notice Form */}
                <form onSubmit={handleCreateNotice} className="space-y-3.5 text-xs">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-gray-300 mb-1">
                        Notice Title (Sinhala) - මාතෘකාව *
                      </label>
                      <input
                        type="text"
                        required
                        value={newNoticeTitleSin}
                        onChange={(e) => setNewNoticeTitleSin(e.target.value)}
                        placeholder="උදා: විශේෂ ආරක්ෂක නිවේදනයයි..."
                        className="w-full bg-[#0f172a] border border-gray-700 rounded-lg p-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-[#f03a5f]"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-gray-300 mb-1">
                        Notice Title (English Optional)
                      </label>
                      <input
                        type="text"
                        value={newNoticeTitleEn}
                        onChange={(e) => setNewNoticeTitleEn(e.target.value)}
                        placeholder="e.g. Important Security Notice..."
                        className="w-full bg-[#0f172a] border border-gray-700 rounded-lg p-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-[#f03a5f]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-gray-300 mb-1">
                        Notice Content (Sinhala) - සම්පූර්ණ විස්තරය *
                      </label>
                      <textarea
                        rows={3}
                        required
                        value={newNoticeContentSin}
                        onChange={(e) => setNewNoticeContentSin(e.target.value)}
                        placeholder="නිවේදනයේ විස්තරය මෙහි ඇතුළත් කරන්න. (උදා: කිසිදු පාර්ශවයකට Advance මුදල් නොගෙවන්න...)"
                        className="w-full bg-[#0f172a] border border-gray-700 rounded-lg p-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-[#f03a5f]"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-gray-300 mb-1">
                        Notice Content (English Optional)
                      </label>
                      <textarea
                        rows={3}
                        value={newNoticeContentEn}
                        onChange={(e) => setNewNoticeContentEn(e.target.value)}
                        placeholder="Enter notice description in English..."
                        className="w-full bg-[#0f172a] border border-gray-700 rounded-lg p-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-[#f03a5f]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block font-semibold text-gray-300 mb-1">Notice Type / Color</label>
                      <select
                        value={newNoticeType}
                        onChange={(e) => setNewNoticeType(e.target.value)}
                        className="w-full bg-[#0f172a] border border-gray-700 rounded-lg p-2 text-white focus:outline-none"
                      >
                        <option value="danger">🚨 Danger (රතු - හදිසි අනතුරු ඇඟවීම)</option>
                        <option value="warning">⚠️ Warning (කහ - ආරක්ෂක අවවාදය)</option>
                        <option value="info">ℹ️ Info (නිල් - සාමාන්‍ය තොරතුරු)</option>
                        <option value="success">✅ Success (කොළ - විශේෂ දීමනා)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-semibold text-gray-300 mb-1">Badge Tag</label>
                      <input
                        type="text"
                        value={newNoticeBadgeSin}
                        onChange={(e) => setNewNoticeBadgeSin(e.target.value)}
                        placeholder="උදා: ආරක්ෂක අවවාදයයි"
                        className="w-full bg-[#0f172a] border border-gray-700 rounded-lg p-2 text-white focus:outline-none"
                      />
                    </div>

                    <div className="flex items-center space-x-4 pt-5">
                      <label className="flex items-center space-x-2 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={newNoticeIsPinned}
                          onChange={(e) => setNewNoticeIsPinned(e.target.checked)}
                          className="w-4 h-4 rounded text-[#f03a5f]"
                        />
                        <span className="font-semibold text-gray-300">📌 Pin to Top</span>
                      </label>

                      <label className="flex items-center space-x-2 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={newNoticeIsActive}
                          onChange={(e) => setNewNoticeIsActive(e.target.checked)}
                          className="w-4 h-4 rounded text-green-500"
                        />
                        <span className="font-semibold text-gray-300">🟢 Active</span>
                      </label>
                    </div>
                  </div>

                  {/* Live Notice Preview */}
                  {(newNoticeTitleSin || newNoticeContentSin) && (
                    <div className="pt-2">
                      <label className="block text-[11px] font-semibold text-gray-400 mb-1">
                        Live Preview (වෙබ් අඩවියේ දිස්වන ආකාරය):
                      </label>
                      <div
                        className={`rounded-xl border p-3 ${
                          newNoticeType === 'danger'
                            ? 'bg-red-500/10 border-red-500 text-red-100'
                            : newNoticeType === 'warning'
                            ? 'bg-amber-500/10 border-amber-500 text-amber-100'
                            : newNoticeType === 'success'
                            ? 'bg-green-500/10 border-green-500 text-green-100'
                            : 'bg-blue-500/10 border-blue-500 text-blue-100'
                        }`}
                      >
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-white/20">
                            {newNoticeBadgeSin || 'නිවේදනය'}
                          </span>
                          {newNoticeIsPinned && (
                            <span className="text-[10px] text-amber-300 font-bold">📌 Pinned</span>
                          )}
                          <h4 className="font-bold text-xs">{newNoticeTitleSin || 'Notice Title'}</h4>
                        </div>
                        <p className="text-[11px] opacity-90">{newNoticeContentSin || 'Notice Content'}</p>
                      </div>
                    </div>
                  )}

                  <div className="pt-2 flex justify-end">
                    <button
                      type="submit"
                      className="bg-[#f03a5f] hover:bg-[#d92348] text-white font-bold px-5 py-2.5 rounded-xl transition shadow-md flex items-center space-x-1.5"
                    >
                      <Megaphone className="w-4 h-4" />
                      <span>Publish Notice (සජීවීව පළ කරන්න)</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* Existing Notices List */}
              <div className="bg-[#1e293b] border border-gray-800 rounded-xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-extrabold text-sm text-white flex items-center space-x-2">
                    <FileSpreadsheet className="w-4 h-4 text-pink-400" />
                    <span>Existing Site Notices & Announcements ({noticesList.length})</span>
                  </h3>
                  <span className="text-xs text-gray-400">
                    Active: {noticesList.filter((n) => n.isActive !== false).length}
                  </span>
                </div>

                {noticesList.length === 0 ? (
                  <p className="text-xs text-gray-400 text-center py-6">කිසිදු නිවේදනයක් පළ කර නොමැත.</p>
                ) : (
                  <div className="space-y-3">
                    {noticesList.map((notice) => (
                      <div
                        key={notice.id}
                        className={`bg-[#0f172a] border rounded-xl p-3.5 flex flex-col md:flex-row md:items-center justify-between gap-3 ${
                          notice.isActive !== false ? 'border-gray-700' : 'border-gray-800 opacity-60'
                        }`}
                      >
                        <div className="space-y-1.5 flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <span
                              className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                                notice.type === 'danger'
                                  ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                                  : notice.type === 'warning'
                                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                                  : notice.type === 'success'
                                  ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                                  : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                              }`}
                            >
                              {notice.badgeSin || notice.badgeEn || 'Notice'}
                            </span>

                            {notice.isPinned && (
                              <span className="text-[10px] text-amber-400 font-bold flex items-center space-x-0.5">
                                <Pin className="w-3 h-3" />
                                <span>Pinned</span>
                              </span>
                            )}

                            <span className="font-extrabold text-xs text-white">
                              {notice.titleSin}
                            </span>
                            {notice.titleEn && notice.titleEn !== notice.titleSin && (
                              <span className="text-[11px] text-gray-400 italic">
                                ({notice.titleEn})
                              </span>
                            )}
                          </div>

                          <p className="text-xs text-gray-300 leading-relaxed font-medium">
                            {notice.contentSin}
                          </p>

                          <div className="flex items-center space-x-3 text-[10px] text-gray-500">
                            <span>📅 {notice.createdAt || 'Recent'}</span>
                            <span className={notice.isActive !== false ? 'text-green-400 font-bold' : 'text-gray-500'}>
                              {notice.isActive !== false ? '● Live on Website' : '○ Disabled (Hidden)'}
                            </span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center space-x-2 flex-shrink-0">
                          <button
                            onClick={() => handleToggleNoticePinned(notice.id)}
                            className={`text-xs px-2.5 py-1.5 rounded-lg font-bold flex items-center space-x-1 transition ${
                              notice.isPinned
                                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                : 'bg-gray-800 text-gray-400 hover:text-white'
                            }`}
                            title={notice.isPinned ? 'Unpin Notice' : 'Pin Notice to Top'}
                          >
                            <Pin className="w-3.5 h-3.5" />
                            <span>{notice.isPinned ? 'Pinned' : 'Pin'}</span>
                          </button>

                          <button
                            onClick={() => handleToggleNoticeActive(notice.id)}
                            className={`text-xs px-2.5 py-1.5 rounded-lg font-bold flex items-center space-x-1 transition ${
                              notice.isActive !== false
                                ? 'bg-green-600/20 text-green-300 border border-green-500/30'
                                : 'bg-gray-800 text-gray-400 hover:text-white'
                            }`}
                          >
                            {notice.isActive !== false ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-green-400" />
                                <span>Active</span>
                              </>
                            ) : (
                              <>
                                <XCircle className="w-3.5 h-3.5" />
                                <span>Inactive</span>
                              </>
                            )}
                          </button>

                          <button
                            onClick={() => handleDeleteNotice(notice.id)}
                            className="bg-red-900/30 hover:bg-red-800/60 text-red-400 text-xs font-bold px-2.5 py-1.5 rounded-lg flex items-center space-x-1 transition"
                            title="Delete Notice"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: TOP BANNERS & PULSE ANIMATION */}
          {activeAdminTab === 'banners' && (
            <div className="space-y-6 max-w-3xl animate-in fade-in duration-200">
              <div className="bg-[#1e293b] border border-gray-800 rounded-xl p-5 space-y-5">
                <div className="flex items-center justify-between">
                  <h3 className="font-extrabold text-sm text-white flex items-center space-x-2">
                    <Megaphone className="w-4 h-4 text-[#f03a5f]" />
                    <span>Configure Pulsing Admin Top Banner (ප්‍රධාන බැනරය)</span>
                  </h3>
                  <span className="text-[11px] text-gray-400 bg-gray-800 px-2 py-0.5 rounded-full">
                    Top Admin Promo Bar
                  </span>
                </div>

                {/* Banner Live Preview */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-semibold text-gray-400">Live Preview (වෙබ් අඩවියේ දිස්වන ආකාරය)</label>
                    <span className="text-[10px] text-gray-400">
                      {bannerConfig.isGradient ? 'Gradient Background Active' : 'Solid Color Active'}
                    </span>
                  </div>
                  <div
                    style={{
                      background: bannerConfig.isGradient && bannerConfig.bgGradient
                        ? bannerConfig.bgGradient
                        : (bannerConfig.bgColor || '#f06277')
                    }}
                    className={`rounded-xl p-3 md:p-3.5 text-white flex items-center justify-between shadow-md transition-all ${
                      bannerConfig.pulseAnimation ? 'banner-pulse-animation' : ''
                    }`}
                  >
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-xs md:text-sm">{bannerConfig.title || 'Banner Title'}</span>
                        <span className="bg-white/20 text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded">
                          {bannerConfig.badgeText || 'Admin Ad'}
                        </span>
                      </div>
                      <p className="text-[11px] text-pink-100 mt-0.5 font-medium">{bannerConfig.subtitle || 'Banner Subtitle'}</p>
                    </div>

                    <div className="flex items-center space-x-2 text-right">
                      {bannerConfig.targetUrl && (
                        <span className="hidden sm:inline-flex items-center space-x-1 text-[10px] bg-black/20 px-2 py-0.5 rounded text-white/90">
                          <LinkIcon className="w-3 h-3" />
                          <span className="max-w-[130px] truncate">{bannerConfig.targetUrl}</span>
                        </span>
                      )}
                      <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center text-[#f03a5f] shadow-xs">
                        <Send className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 text-xs">
                  {/* Titles */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-gray-300 mb-1">Banner Title (English)</label>
                      <input
                        type="text"
                        value={bannerConfig.title}
                        onChange={(e) => setBannerConfig({ ...bannerConfig, title: e.target.value })}
                        className="w-full bg-[#0f172a] border border-gray-700 rounded-lg p-2 text-white focus:outline-none focus:border-[#f03a5f]"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-gray-300 mb-1">Banner Subtitle (Sinhala)</label>
                      <input
                        type="text"
                        value={bannerConfig.subtitle}
                        onChange={(e) => setBannerConfig({ ...bannerConfig, subtitle: e.target.value })}
                        className="w-full bg-[#0f172a] border border-gray-700 rounded-lg p-2 text-white focus:outline-none focus:border-[#f03a5f]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-gray-300 mb-1">Badge Tag</label>
                      <input
                        type="text"
                        value={bannerConfig.badgeText}
                        onChange={(e) => setBannerConfig({ ...bannerConfig, badgeText: e.target.value })}
                        placeholder="e.g. Admin Ad, Special Offer"
                        className="w-full bg-[#0f172a] border border-gray-700 rounded-lg p-2 text-white focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-gray-300 mb-1">Click Action (ක්ලික් කළ විට)</label>
                      <select
                        value={bannerConfig.actionType || 'url'}
                        onChange={(e) => setBannerConfig({ ...bannerConfig, actionType: e.target.value })}
                        className="w-full bg-[#0f172a] border border-gray-700 rounded-lg p-2 text-white focus:outline-none"
                      >
                        <option value="url">🔗 Open Target URL (බාහිර වෙබ්/ලින්ක් එක විවෘත කරන්න)</option>
                        <option value="modal">📥 Open APK Download Modal (ඇප් එක ඩවුන්ලෝඩ් බොක්ස් එක)</option>
                      </select>
                    </div>
                  </div>

                  {/* TARGET URL INPUT SECTION */}
                  <div className="bg-[#0f172a] border border-gray-700 rounded-xl p-3.5 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <label className="block font-bold text-gray-200 text-xs flex items-center space-x-1.5">
                        <LinkIcon className="w-3.5 h-3.5 text-[#f03a5f]" />
                        <span>Banner Target URL (බැනරය ක්ලික් කළ විට යන Link එක):</span>
                      </label>
                      <label className="flex items-center space-x-1.5 text-gray-400 text-[11px] cursor-pointer">
                        <input
                          type="checkbox"
                          checked={bannerConfig.openInNewTab !== false}
                          onChange={(e) => setBannerConfig({ ...bannerConfig, openInNewTab: e.target.checked })}
                          className="w-3.5 h-3.5 rounded text-[#f03a5f]"
                        />
                        <span>Open in New Tab (අලුත් ටැබ් එකක විවෘත කරන්න)</span>
                      </label>
                    </div>

                    <input
                      type="url"
                      value={bannerConfig.targetUrl || ''}
                      onChange={(e) => setBannerConfig({ ...bannerConfig, targetUrl: e.target.value, actionType: 'url' })}
                      placeholder="https://t.me/yourchannel හෝ https://wa.me/9477... හෝ https://example.com"
                      className="w-full bg-[#1e293b] border border-gray-600 rounded-lg p-2.5 text-white placeholder-gray-500 font-mono text-xs focus:outline-none focus:border-[#f03a5f]"
                    />

                    {/* Quick Link Presets */}
                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      <span className="text-[10px] text-gray-400 font-semibold">Quick Link Shortcuts:</span>
                      <button
                        type="button"
                        onClick={() => setBannerConfig({
                          ...bannerConfig,
                          targetUrl: 'https://wa.me/94771234567?text=Hello%20Taizer%20Ads%20Admin',
                          actionType: 'url'
                        })}
                        className="bg-green-600/20 hover:bg-green-600/30 text-green-300 border border-green-500/30 px-2 py-0.5 rounded text-[10px] font-bold"
                      >
                        💬 WhatsApp Link
                      </button>
                      <button
                        type="button"
                        onClick={() => setBannerConfig({
                          ...bannerConfig,
                          targetUrl: 'https://t.me/taizerads_official',
                          actionType: 'url'
                        })}
                        className="bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 px-2 py-0.5 rounded text-[10px] font-bold"
                      >
                        ✈️ Telegram Channel
                      </button>
                      <button
                        type="button"
                        onClick={() => setBannerConfig({
                          ...bannerConfig,
                          targetUrl: 'https://taizerads.lk/download/taizer_ads.apk',
                          actionType: 'modal'
                        })}
                        className="bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 px-2 py-0.5 rounded text-[10px] font-bold"
                      >
                        📥 Official APK Modal
                      </button>
                    </div>
                  </div>

                  {/* COLOR OPTIONS SECTION */}
                  <div className="bg-[#0f172a] border border-gray-700 rounded-xl p-3.5 space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="block font-bold text-gray-200 text-xs flex items-center space-x-1.5">
                        <Palette className="w-3.5 h-3.5 text-amber-400" />
                        <span>Banner Color Options (බැනරයේ වර්ණ විකල්ප):</span>
                      </label>
                      <div className="flex items-center space-x-2 text-[11px]">
                        <button
                          type="button"
                          onClick={() => setBannerConfig({ ...bannerConfig, isGradient: false })}
                          className={`px-2.5 py-1 rounded-lg font-bold transition ${
                            !bannerConfig.isGradient
                              ? 'bg-[#f03a5f] text-white shadow-xs'
                              : 'bg-gray-800 text-gray-400 hover:text-white'
                          }`}
                        >
                          Solid Colors (10)
                        </button>
                        <button
                          type="button"
                          onClick={() => setBannerConfig({ ...bannerConfig, isGradient: true })}
                          className={`px-2.5 py-1 rounded-lg font-bold transition ${
                            bannerConfig.isGradient
                              ? 'bg-[#f03a5f] text-white shadow-xs'
                              : 'bg-gray-800 text-gray-400 hover:text-white'
                          }`}
                        >
                          Gradients (8)
                        </button>
                      </div>
                    </div>

                    {/* 1. Solid Color Palette */}
                    {!bannerConfig.isGradient ? (
                      <div className="space-y-2.5">
                        <label className="block text-[11px] text-gray-400">
                          Select from 10 Solid Color Presets (කැමති වර්ණයක් තෝරන්න):
                        </label>
                        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                          {solidColorPresets.map((preset) => {
                            const isSelected = !bannerConfig.isGradient && bannerConfig.bgColor?.toLowerCase() === preset.hex.toLowerCase();
                            return (
                              <button
                                key={preset.hex}
                                type="button"
                                onClick={() => setBannerConfig({
                                  ...bannerConfig,
                                  bgColor: preset.hex,
                                  isGradient: false
                                })}
                                className={`flex items-center space-x-2 p-1.5 rounded-lg border text-left transition ${
                                  isSelected
                                    ? 'border-white bg-white/10 shadow-sm'
                                    : 'border-gray-700 bg-gray-800/60 hover:bg-gray-800 hover:border-gray-600'
                                }`}
                              >
                                <span
                                  className="w-4 h-4 rounded-full border border-white/30 flex-shrink-0 shadow-xs"
                                  style={{ backgroundColor: preset.hex }}
                                />
                                <span className="text-[10px] font-semibold text-gray-200 truncate">
                                  {preset.name}
                                </span>
                              </button>
                            );
                          })}
                        </div>

                        {/* Custom Hex / Color Picker */}
                        <div className="pt-2 border-t border-gray-800 flex items-center space-x-3">
                          <label className="text-[11px] text-gray-400 whitespace-nowrap">Custom Color Picker:</label>
                          <input
                            type="color"
                            value={bannerConfig.bgColor || '#f06277'}
                            onChange={(e) => setBannerConfig({ ...bannerConfig, bgColor: e.target.value, isGradient: false })}
                            className="w-8 h-8 rounded border border-gray-600 cursor-pointer bg-transparent"
                          />
                          <input
                            type="text"
                            value={bannerConfig.bgColor || '#f06277'}
                            onChange={(e) => setBannerConfig({ ...bannerConfig, bgColor: e.target.value, isGradient: false })}
                            className="w-32 bg-[#1e293b] border border-gray-700 rounded-lg p-1.5 text-white focus:outline-none font-mono text-xs"
                          />
                        </div>
                      </div>
                    ) : (
                      /* 2. Gradient Palette */
                      <div className="space-y-2.5">
                        <label className="block text-[11px] text-gray-400">
                          Select from 8 Modern Gradient Presets (වර්ණ සංයෝජන 8ක්):
                        </label>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                          {gradientPresets.map((preset) => {
                            const isSelected = bannerConfig.isGradient && bannerConfig.bgGradient === preset.gradient;
                            return (
                              <button
                                key={preset.name}
                                type="button"
                                onClick={() => setBannerConfig({
                                  ...bannerConfig,
                                  bgGradient: preset.gradient,
                                  isGradient: true
                                })}
                                className={`flex items-center space-x-2 p-1.5 rounded-lg border text-left transition ${
                                  isSelected
                                    ? 'border-white bg-white/10 ring-1 ring-white'
                                    : 'border-gray-700 bg-gray-800/60 hover:bg-gray-800'
                                }`}
                              >
                                <span
                                  className="w-5 h-5 rounded-md shadow-xs border border-white/20 flex-shrink-0"
                                  style={{ background: preset.gradient }}
                                />
                                <span className="text-[10px] font-semibold text-gray-200 truncate">
                                  {preset.name}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Pulse Animation Toggle */}
                  <label className="flex items-center space-x-3 cursor-pointer pt-2 select-none">
                    <input
                      type="checkbox"
                      checked={bannerConfig.pulseAnimation}
                      onChange={(e) => setBannerConfig({ ...bannerConfig, pulseAnimation: e.target.checked })}
                      className="w-4 h-4 rounded text-[#f03a5f] focus:ring-0"
                    />
                    <span className="font-bold text-gray-200">
                      Enable Continuous Breathing Pulse Animation (ලොකු-පොඩි වන animation එක සක්‍රිය කරන්න)
                    </span>
                  </label>
                </div>

                <div className="pt-3 border-t border-gray-800 flex justify-end">
                  <button
                    onClick={handleSaveBanners}
                    className="bg-[#f03a5f] hover:bg-[#d92348] text-white font-bold text-xs px-5 py-2.5 rounded-xl transition shadow-md flex items-center space-x-1.5"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Banner Settings</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: CIRCULAR LIVE STORIES & SPECIAL OFFERS */}
          {activeAdminTab === 'stories' && (
            <div className="space-y-6 max-w-4xl animate-in fade-in duration-200">
              {/* Header Box */}
              <div className="bg-gradient-to-r from-[#1e293b] via-[#1e293b] to-pink-950/40 border border-pink-500/30 rounded-2xl p-5 flex flex-wrap items-center justify-between gap-4 shadow-xl">
                <div>
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-lg bg-pink-500/20 text-pink-400 flex items-center justify-center font-bold">
                      <Flame className="w-5 h-5 fill-current" />
                    </div>
                    <h3 className="font-black text-base text-white tracking-tight">
                      Circular Live Stories & Special Offers Hub
                    </h3>
                  </div>
                  <p className="text-xs text-gray-300 mt-1">
                    පරිශීලකයින්ගේ විශේෂ දීමනා (Special Offers) මුල් පිටුවේ රවුම් Live Stories වල පෙන්වීම සහ කළමනාකරණය.
                  </p>
                </div>

                <div className="flex items-center space-x-3 text-xs">
                  <div className="bg-[#0f172a] border border-pink-500/40 px-3 py-1.5 rounded-xl">
                    <span className="text-gray-400 text-[11px] block">Current Spot Fee</span>
                    <span className="text-pink-400 font-black text-sm">
                      Rs. {(pricingConfig.storySpot || 2000).toLocaleString()}.00
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveAdminTab('pricing')}
                    className="bg-gray-800 hover:bg-gray-700 text-gray-200 font-bold px-3 py-2 rounded-xl transition text-xs border border-gray-700 cursor-pointer"
                  >
                    Change Fee
                  </button>
                </div>
              </div>

              {/* 1. Pending Registered User Requests */}
              <div className="bg-[#1e293b] border border-gray-800 rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-amber-400" />
                    <h4 className="font-extrabold text-sm text-white">
                      Pending Special Offer Requests from Advertisers ({pendingStoryRequests.length})
                    </h4>
                  </div>
                  {pendingStoryRequests.length > 0 && (
                    <span className="bg-amber-500 text-black font-black text-[10px] px-2 py-0.5 rounded-full animate-pulse">
                      Needs Action
                    </span>
                  )}
                </div>

                {pendingStoryRequests.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                    {pendingStoryRequests.map(ad => (
                      <div
                        key={ad.id}
                        className="bg-[#0f172a] border border-amber-500/40 rounded-xl p-3.5 flex flex-col justify-between space-y-3 shadow-md"
                      >
                        <div className="flex items-start space-x-3">
                          <img
                            src={ad.image}
                            alt=""
                            className="w-14 h-14 rounded-xl object-cover border border-amber-500/50 flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <span className="bg-[#f03a5f] text-white text-[9px] font-black px-1.5 py-0.2 rounded">
                                Ad #{ad.id}
                              </span>
                              {ad.storyPaidWithCredits ? (
                                <span className="bg-green-500/20 text-green-400 border border-green-500/40 text-[9px] font-extrabold px-1.5 py-0.2 rounded">
                                  ✓ Paid via Wallet
                                </span>
                              ) : (
                                <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[9px] font-extrabold px-1.5 py-0.2 rounded">
                                  WhatsApp Deposit Slip
                                </span>
                              )}
                            </div>
                            <h5 className="font-extrabold text-white text-xs truncate mt-1">
                              {ad.title}
                            </h5>
                            <p className="text-[11px] text-gray-400">
                              Phone: <strong className="text-gray-200">{ad.phone}</strong>
                            </p>
                          </div>
                        </div>

                        {/* Offer Details Box */}
                        <div className="bg-[#1e293b] border border-gray-800 rounded-lg p-2 text-xs space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-gray-400 text-[11px]">Requested Tag:</span>
                            <span className="bg-pink-500/20 text-pink-300 font-extrabold text-[11px] px-2 py-0.5 rounded border border-pink-500/30">
                              {ad.storyOfferTag || 'Special Offer'}
                            </span>
                          </div>
                          {ad.storyOfferDetails && (
                            <p className="text-[10px] text-gray-300 line-clamp-2">
                              {ad.storyOfferDetails}
                            </p>
                          )}
                        </div>

                        {/* Actions: Approve & Place vs Decline */}
                        <div className="grid grid-cols-2 gap-2 pt-1">
                          <button
                            type="button"
                            onClick={() => handleApproveStoryRequest(ad)}
                            className="bg-[#16a34a] hover:bg-[#15803d] text-white font-extrabold text-xs py-2 px-3 rounded-xl transition shadow-md flex items-center justify-center space-x-1 cursor-pointer"
                          >
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                            <span>Approve & Place</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeclineStoryRequest(ad)}
                            className="bg-gray-800 hover:bg-red-950/60 hover:text-red-300 text-gray-400 font-bold text-xs py-2 px-3 rounded-xl transition border border-gray-700 cursor-pointer"
                          >
                            <span>Decline</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-[#0f172a] border border-gray-800 rounded-xl p-4 text-center text-xs text-gray-400">
                    දැන්වීම්කරුවන්ගෙන් අලුත් ඉල්ලීම් නොමැත (No pending advertiser requests). පරිශීලකයින්ට Dashboard එක හරහා ඉල්ලුම් කළ හැක, නැතහොත් ඔබට පහතින් කෙලින්ම පරිශීලක දැන්වීමක් තෝරා ඇතුළත් කළ හැක.
                  </div>
                )}
              </div>

              {/* 2. Direct Feature Any Registered User Ad */}
              <div className="bg-[#1e293b] border border-gray-800 rounded-2xl p-5 space-y-4">
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-yellow-400" />
                  <h4 className="font-extrabold text-sm text-white">
                    Directly Feature Any Registered User Ad (කෙලින්ම පරිශීලක දැන්වීමක් ඇතුළත් කරන්න)
                  </h4>
                </div>

                <form onSubmit={handleQuickAddUserAdToStory} className="space-y-3.5 text-xs">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="block font-semibold text-gray-300">
                        Select Approved Registered Ad / දැන්වීම තෝරන්න <span className="text-red-500">*</span>
                      </label>
                      <span className="text-[11px] text-pink-400 font-semibold">
                        {storyAdSearchQuery ? `${filteredUserAdsForStory.length} matching found` : `${registeredUserAds.length} total ads`}
                      </span>
                    </div>

                    {/* Search Bar Input */}
                    <div className="relative">
                      <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="text"
                        value={storyAdSearchQuery}
                        onChange={(e) => setStoryAdSearchQuery(e.target.value)}
                        placeholder="🔍 Search user by Phone (+94...), Ad Title, Ad ID (#101), Location..."
                        className="w-full bg-[#0f172a] border border-gray-700 rounded-xl pl-9 pr-9 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition"
                      />
                      {storyAdSearchQuery && (
                        <button
                          type="button"
                          onClick={() => setStoryAdSearchQuery('')}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white p-1 rounded transition cursor-pointer"
                          title="Clear search"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    {/* Dropdown Select (Filtered dynamically by search) */}
                    <select
                      value={selectedAdForStory}
                      onChange={(e) => {
                        const val = e.target.value;
                        setSelectedAdForStory(val);
                        const matched = ads.find(a => a.id === val);
                        if (matched) {
                          setQuickStoryDesc(matched.title);
                          setQuickStoryTag(matched.storyOfferTag || '🔥 50% OFF');
                        }
                      }}
                      className="w-full bg-[#0f172a] border border-gray-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-pink-500 cursor-pointer"
                    >
                      <option value="">
                        {storyAdSearchQuery 
                          ? `-- Choose from ${filteredUserAdsForStory.length} filtered results --`
                          : '-- Choose an Ad to place in Circular Stories --'}
                      </option>
                      {filteredUserAdsForStory.map(ad => (
                        <option key={ad.id} value={ad.id}>
                          #{ad.id} - {ad.title} ({ad.phone || 'No phone'}) - {ad.price} {ad.inStorySpot ? '★ [Already in Stories]' : ''}
                        </option>
                      ))}
                    </select>

                    {/* Quick Select Matching Results Mini-Cards (if search query entered) */}
                    {storyAdSearchQuery.trim() && filteredUserAdsForStory.length > 0 && (
                      <div className="bg-[#0f172a] border border-gray-800 rounded-xl p-2.5 space-y-2 max-h-56 overflow-y-auto">
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider px-1">
                          Quick Select from Search Results ({filteredUserAdsForStory.length}):
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {filteredUserAdsForStory.slice(0, 6).map(ad => {
                            const isSelected = selectedAdForStory === ad.id;
                            return (
                              <div
                                key={ad.id}
                                onClick={() => {
                                  setSelectedAdForStory(ad.id);
                                  setQuickStoryDesc(ad.title);
                                  setQuickStoryTag(ad.storyOfferTag || '🔥 50% OFF');
                                }}
                                className={`p-2 rounded-lg border flex items-center space-x-2.5 cursor-pointer transition ${
                                  isSelected
                                    ? 'bg-pink-950/40 border-pink-500 ring-1 ring-pink-500'
                                    : 'bg-gray-900/60 border-gray-800 hover:border-gray-700 hover:bg-gray-900'
                                }`}
                              >
                                <img
                                  src={ad.image}
                                  alt=""
                                  className="w-10 h-10 rounded-lg object-cover shrink-0 border border-gray-700"
                                />
                                <div className="min-w-0 flex-1">
                                  <div className="flex items-center space-x-1.5">
                                    <span className="font-mono text-[10px] text-pink-400 font-bold">#{ad.id}</span>
                                    {ad.inStorySpot && (
                                      <span className="text-[8px] bg-green-950 text-green-400 px-1 py-0.2 rounded font-bold">
                                        In Story
                                      </span>
                                    )}
                                  </div>
                                  <h5 className="font-bold text-xs text-white truncate">{ad.title}</h5>
                                  <p className="text-[10px] text-gray-400 truncate">
                                    📞 {ad.phone || 'No phone'} • {ad.price}
                                  </p>
                                </div>
                                <button
                                  type="button"
                                  className={`text-[10px] font-bold px-2 py-1 rounded transition shrink-0 cursor-pointer ${
                                    isSelected
                                      ? 'bg-pink-600 text-white'
                                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                                  }`}
                                >
                                  {isSelected ? '✓ Selected' : 'Select'}
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {storyAdSearchQuery.trim() && filteredUserAdsForStory.length === 0 && (
                      <div className="bg-[#0f172a] border border-gray-800 rounded-xl p-3 text-center text-xs text-gray-400">
                        "{storyAdSearchQuery}" සඳහා ගැලපෙන පරිශීලක දැන්වීම් හමු නොවීය. (No matching user ads found)
                      </div>
                    )}
                  </div>

                  {/* Selected Ad Preview Card (highlighted) */}
                  {selectedAdForStory && (() => {
                    const chosen = ads.find(a => a.id === selectedAdForStory);
                    if (!chosen) return null;
                    return (
                      <div className="p-3 rounded-xl bg-gradient-to-r from-pink-950/30 to-purple-950/20 border border-pink-500/50 flex items-center justify-between gap-3 animate-in fade-in duration-200">
                        <div className="flex items-center space-x-3 min-w-0">
                          <img
                            src={chosen.image}
                            alt=""
                            className="w-12 h-12 rounded-lg object-cover border border-pink-500/60 shrink-0"
                          />
                          <div className="min-w-0">
                            <div className="flex items-center space-x-1.5">
                              <span className="text-[9px] font-black bg-pink-500 text-white px-1.5 py-0.2 rounded">
                                SELECTED AD
                              </span>
                              <span className="font-mono text-[10px] text-gray-400">#{chosen.id}</span>
                            </div>
                            <h5 className="font-extrabold text-xs text-white truncate mt-0.5">{chosen.title}</h5>
                            <p className="text-[11px] text-gray-400">
                              Phone: <strong className="text-white">{chosen.phone || '+94703670398'}</strong> • Price: {chosen.price} • {chosen.location}
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedAdForStory('');
                            setQuickStoryDesc('');
                          }}
                          className="text-xs text-gray-400 hover:text-red-400 px-2.5 py-1 rounded bg-gray-900 border border-gray-800 hover:border-red-900 transition shrink-0 cursor-pointer"
                        >
                          Change
                        </button>
                      </div>
                    );
                  })()}

                  {selectedAdForStory && (
                    <div className="space-y-3 animate-in fade-in duration-200">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block font-semibold text-gray-300 mb-1">
                            Special Offer Tag / කෙටි ලේබලය (Max 15-20 chars)
                          </label>
                          <input
                            type="text"
                            required
                            value={quickStoryTag}
                            onChange={(e) => setQuickStoryTag(e.target.value)}
                            placeholder="e.g. 🔥 50% OFF, ⭐ WEEKEND SPECIAL"
                            className="w-full bg-[#0f172a] border border-gray-700 rounded-xl p-2 text-white focus:outline-none focus:border-pink-500 font-bold"
                          />
                        </div>

                        <div>
                          <label className="block font-semibold text-gray-300 mb-1">
                            Offer Title / විස්තරය
                          </label>
                          <input
                            type="text"
                            value={quickStoryDesc}
                            onChange={(e) => setQuickStoryDesc(e.target.value)}
                            placeholder="Promotional offer title"
                            className="w-full bg-[#0f172a] border border-gray-700 rounded-xl p-2 text-white focus:outline-none focus:border-pink-500"
                          />
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-gray-800">
                        <label className="flex items-center space-x-2 cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={quickStoryIsLive}
                            onChange={(e) => setQuickStoryIsLive(e.target.checked)}
                            className="w-4 h-4 rounded text-green-500"
                          />
                          <span className="font-semibold text-gray-300">Show "Live ✓" Badge</span>
                        </label>

                        <label className="flex items-center space-x-2 cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={quickStoryDeductCredits}
                            onChange={(e) => setQuickStoryDeductCredits(e.target.checked)}
                            className="w-4 h-4 rounded text-pink-500"
                          />
                          <span className="font-semibold text-pink-300">
                            Deduct Fee (Rs. {(pricingConfig.storySpot || 2000).toLocaleString()}) from User's Credits
                          </span>
                        </label>

                        <button
                          type="submit"
                          className="bg-gradient-to-r from-[#f03a5f] to-amber-500 hover:from-[#d92348] hover:to-amber-600 text-white font-extrabold px-5 py-2.5 rounded-xl transition shadow-md flex items-center space-x-1.5 cursor-pointer ml-auto"
                        >
                          <Flame className="w-4 h-4 fill-current" />
                          <span>Publish to Circular Stories</span>
                        </button>
                      </div>
                    </div>
                  )}
                </form>
              </div>

              {/* 3. Existing Stories List (Matches User's Screenshot) */}
              <div className="bg-[#1e293b] border border-gray-800 rounded-2xl p-5 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <h3 className="font-extrabold text-sm text-white flex items-center space-x-2">
                    <CircleDot className="w-4 h-4 text-pink-400" />
                    <span>Existing Circular Live Avatars ({stories.length})</span>
                  </h3>
                  
                  {/* Search Existing Stories */}
                  <div className="flex items-center space-x-2">
                    <div className="relative">
                      <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="text"
                        value={existingStorySearchQuery}
                        onChange={(e) => setExistingStorySearchQuery(e.target.value)}
                        placeholder="Search avatar name..."
                        className="bg-[#0f172a] border border-gray-700 rounded-lg pl-8 pr-7 py-1 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-pink-500 w-44"
                      />
                      {existingStorySearchQuery && (
                        <button
                          type="button"
                          onClick={() => setExistingStorySearchQuery('')}
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                    <span className="text-[11px] text-gray-400 hidden sm:inline">
                      Active on homepage
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {stories.filter(story => {
                    if (!existingStorySearchQuery.trim()) return true;
                    const q = existingStorySearchQuery.toLowerCase().trim();
                    const matchName = (story.name || '').toLowerCase().includes(q);
                    const matchFull = (story.fullTitle || story.offerDetails || '').toLowerCase().includes(q);
                    const matchId = (story.adId || '').toString().toLowerCase().includes(q);
                    return matchName || matchFull || matchId;
                  }).map(story => {
                    const linkedAd = story.adId ? ads.find(a => a.id === story.adId) : null;

                    return (
                      <div
                        key={story.id}
                        className="bg-[#0f172a] border border-gray-700 p-3 rounded-xl flex flex-col items-center text-center space-y-2 relative group hover:border-pink-500/50 transition shadow-xs"
                      >
                        <div className="relative">
                          <img
                            src={story.image}
                            alt=""
                            className="w-14 h-14 rounded-full object-cover border-2 border-pink-500 shadow-md"
                          />
                          {story.isSpecialOffer && (
                            <div className="absolute -top-1 -right-1 bg-amber-500 text-black rounded-full p-0.5 shadow-xs">
                              <Flame className="w-3 h-3 fill-current" />
                            </div>
                          )}
                        </div>

                        <span className="text-xs font-bold text-white truncate max-w-full">
                          {story.name}
                        </span>

                        {linkedAd ? (
                          <span className="text-[10px] text-pink-300 font-semibold bg-pink-950/60 border border-pink-800/60 px-1.5 py-0.2 rounded truncate max-w-full" title={linkedAd.title}>
                            👤 Ad #{linkedAd.id}
                          </span>
                        ) : (
                          <span className="text-[10px] text-gray-400 font-semibold bg-gray-800 px-1.5 py-0.2 rounded">
                            Custom Story
                          </span>
                        )}

                        {story.isLive && (
                          <span className="bg-green-500 text-white text-[9px] font-bold px-1.5 rounded-full">
                            Live ✓
                          </span>
                        )}

                        <button
                          type="button"
                          onClick={() => handleRemoveStory(story)}
                          className="text-red-400 hover:text-red-300 hover:bg-red-950/40 text-xs font-semibold px-2 py-1 rounded transition cursor-pointer"
                          title="Delete Story"
                        >
                          Remove
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 4. Add Custom Story Form (Arbitrary / Site Announcements) */}
              <div className="bg-[#1e293b] border border-gray-800 rounded-2xl p-5 space-y-4">
                <h3 className="font-extrabold text-sm text-white flex items-center space-x-2">
                  <PlusCircle className="w-4 h-4 text-green-400" />
                  <span>Add Custom Circular Live Avatar (General / Standalone)</span>
                </h3>

                <form onSubmit={handleCreateStory} className="space-y-3 text-xs">
                  <div>
                    <label className="block font-semibold text-gray-300 mb-1">Short Name / Label (e.g. VIP Deals)</label>
                    <input
                      type="text"
                      required
                      value={newStoryName}
                      onChange={(e) => setNewStoryName(e.target.value)}
                      placeholder="Short Label"
                      className="w-full bg-[#0f172a] border border-gray-700 rounded-lg p-2 text-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-gray-300 mb-1">Full Title / Description</label>
                    <input
                      type="text"
                      value={newStoryFullTitle}
                      onChange={(e) => setNewStoryFullTitle(e.target.value)}
                      placeholder="Full Story Title"
                      className="w-full bg-[#0f172a] border border-gray-700 rounded-lg p-2 text-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-gray-300 mb-1 text-xs">
                      Avatar Image (Browser Upload හෝ URL)
                    </label>
                    <div className="flex items-center gap-2">
                      <label className="cursor-pointer inline-flex items-center space-x-1.5 bg-slate-800 hover:bg-slate-700 border border-gray-700 px-3 py-2 rounded-lg text-xs font-semibold text-gray-200 transition shrink-0">
                        <Upload className="w-3.5 h-3.5 text-pink-400" />
                        <span>Upload File</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleFileUploadAsDataUrl(file, (url) => setNewStoryImage(url));
                          }}
                        />
                      </label>
                      <input
                        type="url"
                        required
                        value={newStoryImage}
                        onChange={(e) => setNewStoryImage(e.target.value)}
                        placeholder="Or paste URL: https://images.unsplash.com/..."
                        className="flex-1 bg-[#0f172a] border border-gray-700 rounded-lg p-2 text-white focus:outline-none text-xs"
                      />
                    </div>
                  </div>

                  <label className="flex items-center space-x-2 cursor-pointer pt-1 select-none">
                    <input
                      type="checkbox"
                      checked={newStoryIsLive}
                      onChange={(e) => setNewStoryIsLive(e.target.checked)}
                      className="w-4 h-4 rounded text-green-500"
                    />
                    <span className="font-semibold text-gray-300">Show "Live ✓" Badge</span>
                  </label>

                  <div className="pt-2 flex justify-end">
                    <button
                      type="submit"
                      className="bg-green-600 hover:bg-green-500 text-white font-bold px-4 py-2 rounded-xl transition cursor-pointer"
                    >
                      Add Story Avatar
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* TAB 5: PRICING & BANK ACCOUNTS */}
          {activeAdminTab === 'pricing' && (
            <div className="space-y-6 max-w-2xl animate-in fade-in duration-200">
              {/* Package Prices */}
              <div className="bg-[#1e293b] border border-gray-800 rounded-xl p-5 space-y-4">
                <h3 className="font-extrabold text-sm text-white flex items-center space-x-2">
                  <DollarSign className="w-4 h-4 text-green-400" />
                  <span>Set Package Pricing Tiers (Rs.)</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                  <div>
                    <label className="block font-semibold text-gray-300 mb-1">Normal Ad Price (Rs.)</label>
                    <input
                      type="number"
                      value={pricingConfig.normalAd}
                      onChange={(e) => setPricingConfig({ ...pricingConfig, normalAd: Number(e.target.value) })}
                      className="w-full bg-[#0f172a] border border-gray-700 rounded-lg p-2.5 text-white focus:outline-none font-bold"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-amber-400 mb-1">Super Ad Price (Rs.)</label>
                    <input
                      type="number"
                      value={pricingConfig.superAd}
                      onChange={(e) => setPricingConfig({ ...pricingConfig, superAd: Number(e.target.value) })}
                      className="w-full bg-[#0f172a] border border-amber-600/50 rounded-lg p-2.5 text-amber-300 focus:outline-none font-bold"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-red-400 mb-1">VIP Ad Price (Rs.)</label>
                    <input
                      type="number"
                      value={pricingConfig.vipAd}
                      onChange={(e) => setPricingConfig({ ...pricingConfig, vipAd: Number(e.target.value) })}
                      className="w-full bg-[#0f172a] border border-red-600/50 rounded-lg p-2.5 text-red-300 focus:outline-none font-bold"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-pink-400 mb-1">Special Offer Story (Rs.)</label>
                    <input
                      type="number"
                      value={pricingConfig.storySpot ?? 2000}
                      onChange={(e) => setPricingConfig({ ...pricingConfig, storySpot: Number(e.target.value) })}
                      className="w-full bg-[#0f172a] border border-pink-500/50 rounded-lg p-2.5 text-pink-300 focus:outline-none font-bold"
                    />
                  </div>
                </div>
              </div>

              {/* Official Bank Account Details */}
              <div className="bg-[#1e293b] border border-gray-800 rounded-xl p-5 space-y-4">
                <h3 className="font-extrabold text-sm text-white flex items-center space-x-2">
                  <Building2 className="w-4 h-4 text-blue-400" />
                  <span>Official Bank Transfer Details</span>
                </h3>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block font-semibold text-gray-300 mb-1">Bank Name</label>
                    <input
                      type="text"
                      value={bankConfig.bankName}
                      onChange={(e) => setBankConfig({ ...bankConfig, bankName: e.target.value })}
                      className="w-full bg-[#0f172a] border border-gray-700 rounded-lg p-2 text-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-gray-300 mb-1">Account Name</label>
                    <input
                      type="text"
                      value={bankConfig.accountName}
                      onChange={(e) => setBankConfig({ ...bankConfig, accountName: e.target.value })}
                      className="w-full bg-[#0f172a] border border-gray-700 rounded-lg p-2 text-white focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-gray-300 mb-1">Account Number</label>
                      <input
                        type="text"
                        value={bankConfig.accountNumber}
                        onChange={(e) => setBankConfig({ ...bankConfig, accountNumber: e.target.value })}
                        className="w-full bg-[#0f172a] border border-gray-700 rounded-lg p-2 text-white focus:outline-none font-mono font-bold"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-gray-300 mb-1">Branch</label>
                      <input
                        type="text"
                        value={bankConfig.branch}
                        onChange={(e) => setBankConfig({ ...bankConfig, branch: e.target.value })}
                        className="w-full bg-[#0f172a] border border-gray-700 rounded-lg p-2 text-white focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Official Contact Hotlines */}
              <div className="bg-[#1e293b] border border-gray-800 rounded-xl p-5 space-y-4">
                <h3 className="font-extrabold text-sm text-white flex items-center space-x-2">
                  <Phone className="w-4 h-4 text-emerald-400" />
                  <span>Official Admin Support Hotlines</span>
                </h3>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block font-semibold text-gray-300 mb-1">Admin WhatsApp</label>
                    <input
                      type="text"
                      value={contactConfig.whatsapp}
                      onChange={(e) => setContactConfig({ ...contactConfig, whatsapp: e.target.value })}
                      className="w-full bg-[#0f172a] border border-gray-700 rounded-lg p-2 text-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-gray-300 mb-1">Admin Telegram</label>
                    <input
                      type="text"
                      value={contactConfig.telegram}
                      onChange={(e) => setContactConfig({ ...contactConfig, telegram: e.target.value })}
                      className="w-full bg-[#0f172a] border border-gray-700 rounded-lg p-2 text-white focus:outline-none"
                    />
                  </div>
                </div>

                <div className="pt-3 border-t border-gray-800 flex justify-end">
                  <button
                    onClick={handleSavePricing}
                    className="bg-[#f03a5f] hover:bg-[#d92348] text-white font-bold text-xs px-5 py-2.5 rounded-xl transition shadow-md flex items-center space-x-1.5"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Pricing & Bank Details</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: USER COMPLAINTS */}
          {activeAdminTab === 'complaints' && (
            <div className="space-y-4 max-w-3xl animate-in fade-in duration-200">
              <div className="bg-[#1e293b] border border-gray-800 rounded-xl p-5 space-y-4">
                <h3 className="font-extrabold text-sm text-white flex items-center space-x-2">
                  <AlertOctagon className="w-4 h-4 text-red-400" />
                  <span>User Complaints & Scam Reports ({complaintsList.length})</span>
                </h3>

                {complaintsList.length > 0 ? (
                  <div className="space-y-3">
                    {complaintsList.map(comp => (
                      <div
                        key={comp.id}
                        className="bg-[#0f172a] border border-red-500/30 p-4 rounded-xl space-y-2 text-xs"
                      >
                        <div className="flex items-center justify-between">
                          <span className="bg-red-500/20 text-red-300 font-bold px-2 py-0.5 rounded">
                            {comp.reason}
                          </span>
                          <span className="text-gray-400 text-[11px]">{comp.date}</span>
                        </div>

                        <p className="text-gray-200 font-bold">
                          Ad: #{comp.adId} - {comp.adTitle}
                        </p>
                        <p className="text-gray-400">
                          {comp.details}
                        </p>

                        <div className="pt-2 border-t border-gray-800 flex items-center justify-end space-x-2">
                          <button
                            onClick={() => {
                              onDeleteAd(comp.adId);
                              const updated = complaintsList.filter(c => c.id !== comp.id);
                              setComplaintsList(updated);
                              onUpdateSiteConfig({ ...siteConfig, complaints: updated });
                              onShowToast && onShowToast('Reported Ad Banned and Removed!');
                            }}
                            className="bg-red-600 hover:bg-red-500 text-white font-bold px-3 py-1.5 rounded-lg text-xs cursor-pointer"
                          >
                            Ban / Delete Ad
                          </button>
                          <button
                            onClick={() => {
                              const updated = complaintsList.filter(c => c.id !== comp.id);
                              setComplaintsList(updated);
                              onUpdateSiteConfig({ ...siteConfig, complaints: updated });
                              onShowToast && onShowToast('Complaint marked as resolved.');
                            }}
                            className="bg-gray-700 hover:bg-gray-600 text-white font-bold px-3 py-1.5 rounded-lg text-xs cursor-pointer"
                          >
                            Dismiss
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 text-gray-500 text-xs">
                    ✓ No active complaints reported.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 7: VERIFIED AGENTS */}
          {activeAdminTab === 'agents' && (
            <div className="space-y-6 max-w-2xl animate-in fade-in duration-200">
              <div className="bg-[#1e293b] border border-gray-800 rounded-xl p-5 space-y-4">
                <h3 className="font-extrabold text-sm text-white flex items-center space-x-2">
                  <Users className="w-4 h-4 text-purple-400" />
                  <span>Verified Regional Agents Directory ({agentsList.length})</span>
                </h3>

                <div className="space-y-2.5">
                  {agentsList.map(agent => (
                    <div
                      key={agent.id}
                      className="bg-[#0f172a] border border-gray-700 p-3 rounded-xl flex items-center justify-between text-xs"
                    >
                      <div>
                        <h4 className="font-bold text-white">{agent.name}</h4>
                        <p className="text-purple-400 font-semibold">{agent.phone}</p>
                      </div>

                      <div className="flex items-center space-x-3">
                        <span className="text-gray-400 font-medium">★ {agent.rating}</span>
                        <button
                          onClick={() => handleDeleteAgent(agent.id)}
                          className="text-red-400 hover:text-red-300 font-semibold"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Add New Agent Form */}
              <div className="bg-[#1e293b] border border-gray-800 rounded-xl p-5 space-y-4">
                <h3 className="font-extrabold text-sm text-white flex items-center space-x-2">
                  <PlusCircle className="w-4 h-4 text-green-400" />
                  <span>Add New Regional Agent</span>
                </h3>

                <form onSubmit={handleCreateAgent} className="space-y-3 text-xs">
                  <div>
                    <label className="block font-semibold text-gray-300 mb-1">Agent Name</label>
                    <input
                      type="text"
                      required
                      value={newAgentName}
                      onChange={(e) => setNewAgentName(e.target.value)}
                      placeholder="e.g. Negombo Regional Support Agent"
                      className="w-full bg-[#0f172a] border border-gray-700 rounded-lg p-2 text-white focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-gray-300 mb-1">Phone Number</label>
                      <input
                        type="text"
                        required
                        value={newAgentPhone}
                        onChange={(e) => setNewAgentPhone(e.target.value)}
                        placeholder="+94 77 ..."
                        className="w-full bg-[#0f172a] border border-gray-700 rounded-lg p-2 text-white focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-gray-300 mb-1">Rating</label>
                      <input
                        type="text"
                        value={newAgentRating}
                        onChange={(e) => setNewAgentRating(e.target.value)}
                        className="w-full bg-[#0f172a] border border-gray-700 rounded-lg p-2 text-white focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      type="submit"
                      className="bg-purple-600 hover:bg-purple-500 text-white font-bold px-4 py-2 rounded-xl transition"
                    >
                      Register Agent
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* TAB 8: LOGIN / REGISTER PAGE SETTINGS */}
          {activeAdminTab === 'loginForm' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#1e293b] border border-gray-800 p-4 rounded-xl">
                <div>
                  <h3 className="font-extrabold text-sm text-white flex items-center space-x-2">
                    <LogIn className="w-4 h-4 text-[#f03a5f]" />
                    <span>Login & Register Page Customizer (ලොගින් පිටුවේ සියලු තොරතුරු වෙනස් කිරීම)</span>
                  </h3>
                  <p className="text-[11px] text-gray-400 mt-0.5">
                    Customize titles, Sinhala instructions, phone input labels, button text/colors, and agent support options.
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={handleResetLoginForm}
                    className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg text-xs font-bold transition flex items-center space-x-1"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Reset Defaults</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveLoginForm}
                    className="px-4 py-1.5 bg-[#f03a5f] hover:bg-[#d92348] text-white rounded-lg text-xs font-bold transition flex items-center space-x-1.5 shadow-md"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Save Changes (සුරකින්න)</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
                {/* Left Column: Form Controls (7 cols) */}
                <div className="xl:col-span-7 space-y-5">
                  {/* Section 1: Header & Subtitle */}
                  <div className="bg-[#1e293b] border border-gray-800 rounded-xl p-4 sm:p-5 space-y-4">
                    <div className="border-b border-gray-800 pb-2">
                      <h4 className="font-bold text-xs text-white uppercase tracking-wider">
                        1. Form Header & Sinhala Instructions
                      </h4>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-bold text-gray-300 mb-1">
                          Main Title (ප්‍රධාන මාතෘකාව)
                        </label>
                        <input
                          type="text"
                          value={loginFormConfig.title || ''}
                          onChange={(e) => setLoginFormConfig({ ...loginFormConfig, title: e.target.value })}
                          placeholder="Login/ Register"
                          className="w-full bg-[#0f172a] border border-gray-700 rounded-lg px-3 py-2 text-xs text-white font-bold focus:outline-none focus:border-[#f03a5f]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-300 mb-1">
                          Subtitle / Sinhala Instruction (උපදෙස් විස්තරය)
                        </label>
                        <textarea
                          rows={2}
                          value={loginFormConfig.subtitle || ''}
                          onChange={(e) => setLoginFormConfig({ ...loginFormConfig, subtitle: e.target.value })}
                          placeholder="ගිණුමට log වීම සහ ගිණුමක් සාදා ගැනීම යන කාර්යයන් දෙකවම මෙම form එක භාවිතා කරන්න."
                          className="w-full bg-[#0f172a] border border-gray-700 rounded-lg px-3 py-2 text-xs text-gray-200 focus:outline-none focus:border-[#f03a5f] font-medium leading-relaxed"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Section 2: Phone Input & Send OTP Button */}
                  <div className="bg-[#1e293b] border border-gray-800 rounded-xl p-4 sm:p-5 space-y-4">
                    <div className="border-b border-gray-800 pb-2">
                      <h4 className="font-bold text-xs text-white uppercase tracking-wider">
                        2. Phone Field & Send OTP Button (දුරකථන අංකය සහ OTP බටනය)
                      </h4>
                    </div>

                    <div className="space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-bold text-gray-300 mb-1">
                            Phone Input Label
                          </label>
                          <input
                            type="text"
                            value={loginFormConfig.phoneLabel || ''}
                            onChange={(e) => setLoginFormConfig({ ...loginFormConfig, phoneLabel: e.target.value })}
                            placeholder="Enter Phone Number"
                            className="w-full bg-[#0f172a] border border-gray-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#f03a5f]"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-gray-300 mb-1">
                            Input Placeholder
                          </label>
                          <input
                            type="text"
                            value={loginFormConfig.phonePlaceholder || ''}
                            onChange={(e) => setLoginFormConfig({ ...loginFormConfig, phonePlaceholder: e.target.value })}
                            placeholder="XXXXXXX"
                            className="w-full bg-[#0f172a] border border-gray-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#f03a5f]"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-300 mb-1">
                          Phone Help Subtitle (Sinhala)
                        </label>
                        <input
                          type="text"
                          value={loginFormConfig.phoneHelpText || ''}
                          onChange={(e) => setLoginFormConfig({ ...loginFormConfig, phoneHelpText: e.target.value })}
                          placeholder="ඔබගේ දුරකථන අංකය ඇතුලත් කර Send OTP Click කරන්න."
                          className="w-full bg-[#0f172a] border border-gray-700 rounded-lg px-3 py-2 text-xs text-gray-200 focus:outline-none focus:border-[#f03a5f]"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-bold text-gray-300 mb-1">
                            Send OTP Button Text
                          </label>
                          <input
                            type="text"
                            value={loginFormConfig.sendOtpButtonText || ''}
                            onChange={(e) => setLoginFormConfig({ ...loginFormConfig, sendOtpButtonText: e.target.value })}
                            placeholder="Send OTP"
                            className="w-full bg-[#0f172a] border border-gray-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#f03a5f]"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-gray-300 mb-1">
                            Button Color (බටන් වර්ණය)
                          </label>
                          <div className="flex items-center space-x-2">
                            <input
                              type="color"
                              value={loginFormConfig.sendOtpButtonColor || '#991230'}
                              onChange={(e) => setLoginFormConfig({ ...loginFormConfig, sendOtpButtonColor: e.target.value })}
                              className="w-9 h-8 rounded border border-gray-700 cursor-pointer bg-transparent"
                            />
                            <input
                              type="text"
                              value={loginFormConfig.sendOtpButtonColor || '#991230'}
                              onChange={(e) => setLoginFormConfig({ ...loginFormConfig, sendOtpButtonColor: e.target.value })}
                              className="flex-1 bg-[#0f172a] border border-gray-700 rounded-lg px-3 py-1.5 text-xs text-white font-mono focus:outline-none"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Color presets */}
                      <div>
                        <span className="text-[11px] text-gray-400 block mb-1.5">Preset Button Colors:</span>
                        <div className="flex flex-wrap gap-1.5">
                          {[
                            { name: 'Dark Burgundy', hex: '#991230' },
                            { name: 'Crimson Red', hex: '#dc2626' },
                            { name: 'Hot Pink', hex: '#f03a5f' },
                            { name: 'Emerald Green', hex: '#16a34a' },
                            { name: 'Royal Blue', hex: '#2563eb' },
                            { name: 'Midnight Dark', hex: '#0f172a' },
                            { name: 'Purple', hex: '#7c3aed' }
                          ].map(c => (
                            <button
                              key={c.hex}
                              type="button"
                              onClick={() => setLoginFormConfig({ ...loginFormConfig, sendOtpButtonColor: c.hex })}
                              className="flex items-center space-x-1 px-2 py-1 rounded bg-[#0f172a] border border-gray-700 hover:border-gray-500 text-[11px] text-gray-300 transition"
                            >
                              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c.hex }} />
                              <span>{c.name}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Section 3: OTP Verification Step */}
                  <div className="bg-[#1e293b] border border-gray-800 rounded-xl p-4 sm:p-5 space-y-4">
                    <div className="border-b border-gray-800 pb-2">
                      <h4 className="font-bold text-xs text-white uppercase tracking-wider">
                        3. OTP Verification Step (OTP පරීක්ෂණ පියවර)
                      </h4>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-bold text-gray-300 mb-1">
                          OTP Prompt & Test Code Hint
                        </label>
                        <input
                          type="text"
                          value={loginFormConfig.otpHintText || ''}
                          onChange={(e) => setLoginFormConfig({ ...loginFormConfig, otpHintText: e.target.value })}
                          placeholder="Enter verification code to continue (Default test code: 1234)"
                          className="w-full bg-[#0f172a] border border-gray-700 rounded-lg px-3 py-2 text-xs text-gray-200 focus:outline-none focus:border-[#f03a5f]"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-bold text-gray-300 mb-1">
                            OTP Input Label
                          </label>
                          <input
                            type="text"
                            value={loginFormConfig.otpLabel || ''}
                            onChange={(e) => setLoginFormConfig({ ...loginFormConfig, otpLabel: e.target.value })}
                            placeholder="4-Digit Verification OTP"
                            className="w-full bg-[#0f172a] border border-gray-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#f03a5f]"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-gray-300 mb-1">
                            Verify Button Text
                          </label>
                          <input
                            type="text"
                            value={loginFormConfig.verifyButtonText || ''}
                            onChange={(e) => setLoginFormConfig({ ...loginFormConfig, verifyButtonText: e.target.value })}
                            placeholder="Verify & Login (ඇතුල් වන්න)"
                            className="w-full bg-[#0f172a] border border-gray-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#f03a5f]"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Section 4: Real SMS Gateway (Notify.lk Integration for Sri Lanka) */}
                  <div className="bg-[#1e293b] border-2 border-emerald-500/40 rounded-xl p-4 sm:p-5 space-y-4 shadow-lg shadow-emerald-950/20">
                    <div className="border-b border-gray-800 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center space-x-2.5">
                        <div className="p-2 bg-emerald-500/10 rounded-xl text-emerald-400 border border-emerald-500/20">
                          <Smartphone className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-extrabold text-xs sm:text-sm text-white flex items-center space-x-2">
                            <span>Real SMS Gateway (Notify.lk සැබෑ SMS සේවාව)</span>
                            <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[9px] font-black px-2 py-0.5 rounded-full uppercase">
                              Sri Lanka
                            </span>
                          </h4>
                          <p className="text-[11px] text-gray-400">
                            Send real verification OTP SMS directly to users' phones (Dialog, Mobitel, Hutch, Airtel).
                          </p>
                        </div>
                      </div>

                      {/* Live / Demo Mode Toggle Pill */}
                      <div className="flex items-center space-x-2 self-start sm:self-auto bg-[#0f172a] p-1 rounded-xl border border-gray-700">
                        <button
                          type="button"
                          onClick={() => setSmsGatewayConfig({ ...smsGatewayConfig, isLive: false })}
                          className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                            !smsGatewayConfig.isLive
                              ? 'bg-amber-500 text-black shadow-xs'
                              : 'text-gray-400 hover:text-white'
                          }`}
                        >
                          Test Mode
                        </button>
                        <button
                          type="button"
                          onClick={() => setSmsGatewayConfig({ ...smsGatewayConfig, isLive: true })}
                          className={`px-3 py-1 rounded-lg text-xs font-bold transition flex items-center space-x-1 ${
                            smsGatewayConfig.isLive
                              ? 'bg-emerald-600 text-white shadow-xs'
                              : 'text-gray-400 hover:text-white'
                          }`}
                        >
                          <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse" />
                          <span>Live SMS</span>
                        </button>
                      </div>
                    </div>

                    {/* Mode Status Banner */}
                    {smsGatewayConfig.isLive ? (
                      <div className="bg-emerald-950/40 border border-emerald-500/40 rounded-xl p-3 text-xs text-emerald-300 flex items-start space-x-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <div className="space-y-0.5">
                          <p className="font-bold">Live SMS Mode Active (සජීවී SMS ක්‍රියාත්මකයි)</p>
                          <p className="text-[11px] text-emerald-400/90 leading-relaxed">
                            Users will receive genuine SMS verification codes sent from Notify.lk to their phone numbers. Make sure you have sufficient SMS credits in your Notify.lk account.
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-amber-950/40 border border-amber-500/40 rounded-xl p-3 text-xs text-amber-300 flex items-start space-x-2">
                        <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                        <div className="space-y-0.5">
                          <p className="font-bold">Test / Simulation Mode Active</p>
                          <p className="text-[11px] text-amber-300/90 leading-relaxed">
                            No real SMS credits will be deducted. OTP codes will be generated and displayed in a test notification (or master code <strong>1234</strong> can be used). Switch to "Live SMS" once your credentials are ready.
                          </p>
                        </div>
                      </div>
                    )}

                    {/* API Credentials Inputs */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div>
                        <label className="block text-xs font-bold text-gray-300 mb-1">
                          Notify.lk User ID (පරිශීලක ID)
                        </label>
                        <input
                          type="text"
                          value={smsGatewayConfig.userId || ''}
                          onChange={(e) => setSmsGatewayConfig({ ...smsGatewayConfig, userId: e.target.value })}
                          placeholder="e.g. 12345"
                          className="w-full bg-[#0f172a] border border-gray-700 rounded-lg px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
                        />
                        <span className="text-[10px] text-gray-500">Found on your notify.lk account dashboard</span>
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="block text-xs font-bold text-gray-300">
                            Notify.lk API Key / Secret
                          </label>
                          <button
                            type="button"
                            onClick={() => setShowApiKey(!showApiKey)}
                            className="text-[10px] text-emerald-400 hover:underline cursor-pointer"
                          >
                            {showApiKey ? 'Hide' : 'Show'}
                          </button>
                        </div>
                        <input
                          type={showApiKey ? 'text' : 'password'}
                          value={smsGatewayConfig.apiKey || ''}
                          onChange={(e) => setSmsGatewayConfig({ ...smsGatewayConfig, apiKey: e.target.value })}
                          placeholder="e.g. abcd1234efgh5678..."
                          className="w-full bg-[#0f172a] border border-gray-700 rounded-lg px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
                        />
                        <span className="text-[10px] text-gray-500">API token provided by Notify.lk</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div>
                        <label className="block text-xs font-bold text-gray-300 mb-1">
                          Sender ID (යවන්නාගේ නම)
                        </label>
                        <input
                          type="text"
                          value={smsGatewayConfig.senderId || ''}
                          onChange={(e) => setSmsGatewayConfig({ ...smsGatewayConfig, senderId: e.target.value })}
                          placeholder="NotifyDEMO (or approved custom sender)"
                          className="w-full bg-[#0f172a] border border-gray-700 rounded-lg px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
                        />
                        <span className="text-[10px] text-gray-500">Use "NotifyDEMO" for free testing, or your registered brand name</span>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-300 mb-1">
                          OTP Expiry (වලංගු කාලය)
                        </label>
                        <select
                          value={smsGatewayConfig.otpExpiryMinutes || 5}
                          onChange={(e) => setSmsGatewayConfig({ ...smsGatewayConfig, otpExpiryMinutes: Number(e.target.value) })}
                          className="w-full bg-[#0f172a] border border-gray-700 rounded-lg px-3 py-2 text-xs text-white font-bold focus:outline-none focus:border-emerald-500"
                        >
                          <option value={3}>3 Minutes</option>
                          <option value={5}>5 Minutes (Recommended)</option>
                          <option value={10}>10 Minutes</option>
                        </select>
                      </div>
                    </div>

                    {/* SMS Message Template */}
                    <div>
                      <label className="block text-xs font-bold text-gray-300 mb-1">
                        SMS Message Template (කෙටි පණිවිඩයේ පෙළ)
                      </label>
                      <input
                        type="text"
                        value={smsGatewayConfig.messageTemplate || ''}
                        onChange={(e) => setSmsGatewayConfig({ ...smsGatewayConfig, messageTemplate: e.target.value })}
                        placeholder="Your Taizer Ads verification code is: {OTP}. Valid for 5 minutes."
                        className="w-full bg-[#0f172a] border border-gray-700 rounded-lg px-3 py-2 text-xs text-white font-medium focus:outline-none focus:border-emerald-500"
                      />
                      <span className="text-[10px] text-gray-500 font-mono">&#123;OTP&#125; will automatically be replaced with the 4-digit code</span>
                    </div>

                    {/* Test SMS Dispatcher */}
                    <div className="bg-[#0f172a] border border-gray-800 rounded-xl p-3.5 space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-gray-200 flex items-center space-x-1.5">
                          <Send className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Send Test SMS to Phone (පරීක්ෂණ SMS එකක් යවන්න)</span>
                        </span>
                        {testSmsStatus === 'success' && (
                          <span className="text-[10px] text-emerald-400 font-bold flex items-center space-x-1">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Delivered!</span>
                          </span>
                        )}
                      </div>

                      <div className="flex flex-col sm:flex-row items-center gap-2">
                        <input
                          type="tel"
                          value={testSmsPhone}
                          onChange={(e) => setTestSmsPhone(e.target.value)}
                          placeholder="e.g. 077 123 4567"
                          className="w-full sm:flex-1 bg-[#1e293b] border border-gray-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                        />
                        <button
                          type="button"
                          onClick={handleSendTestSms}
                          disabled={testSmsStatus === 'sending'}
                          className="w-full sm:w-auto px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-lg text-xs transition shadow-sm flex items-center justify-center space-x-1.5 active:scale-95 shrink-0 cursor-pointer"
                        >
                          {testSmsStatus === 'sending' ? (
                            <>
                              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                              <span>Sending SMS...</span>
                            </>
                          ) : (
                            <>
                              <Send className="w-3.5 h-3.5" />
                              <span>Send Test SMS</span>
                            </>
                          )}
                        </button>
                      </div>

                      {testSmsResult && (
                        <p className={`text-[11px] font-medium mt-1 ${testSmsStatus === 'error' ? 'text-rose-400' : 'text-emerald-400'}`}>
                          {testSmsResult}
                        </p>
                      )}
                    </div>

                    {/* How to get Notify.lk credentials guide */}
                    <div className="bg-blue-950/30 border border-blue-500/20 rounded-xl p-3 text-[11px] text-blue-200/90 space-y-1">
                      <p className="font-bold text-blue-300">💡 Notify.lk Account එකක් සාදා ගන්නා ආකාරය:</p>
                      <ol className="list-decimal list-inside space-y-0.5 text-[10.5px] text-blue-200/80">
                        <li><a href="https://notify.lk" target="_blank" rel="noreferrer" className="underline font-bold text-blue-300">notify.lk</a> වෙත ගොස් නොමිලේ Account එකක් සාදන්න.</li>
                        <li>Dashboard එකෙන් ඔබගේ <strong>User ID</strong> සහ <strong>API Key</strong> ලබාගෙන ඉහතින් ඇතුළත් කරන්න.</li>
                        <li>ඉන්පසු <strong>Live SMS</strong> toggle කර <strong>Save Changes</strong> ක්ලික් කරන්න.</li>
                      </ol>
                    </div>
                  </div>

                  {/* Section 5: Agent Support Box */}
                  <div className="bg-[#1e293b] border border-gray-800 rounded-xl p-4 sm:p-5 space-y-4">
                    <div className="border-b border-gray-800 pb-2">
                      <h4 className="font-bold text-xs text-white uppercase tracking-wider">
                        5. Agent Support Section (නියෝජිත සහාය කොටස)
                      </h4>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-bold text-gray-300 mb-1">
                          Agent Section Title
                        </label>
                        <input
                          type="text"
                          value={loginFormConfig.agentSectionTitle || ''}
                          onChange={(e) => setLoginFormConfig({ ...loginFormConfig, agentSectionTitle: e.target.value })}
                          placeholder="Agent support to post an ad."
                          className="w-full bg-[#0f172a] border border-gray-700 rounded-lg px-3 py-2 text-xs text-white font-bold focus:outline-none focus:border-[#f03a5f]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-300 mb-1">
                          Agent Section Subtitle (Sinhala)
                        </label>
                        <input
                          type="text"
                          value={loginFormConfig.agentSectionSubtitle || ''}
                          onChange={(e) => setLoginFormConfig({ ...loginFormConfig, agentSectionSubtitle: e.target.value })}
                          placeholder="දැන්වීමක් පලකර ගැනීමට නියෝජිත සහාය."
                          className="w-full bg-[#0f172a] border border-gray-700 rounded-lg px-3 py-2 text-xs text-gray-200 focus:outline-none focus:border-[#f03a5f]"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-bold text-gray-300 mb-1">
                            Agent Button Text
                          </label>
                          <input
                            type="text"
                            value={loginFormConfig.agentButtonText || ''}
                            onChange={(e) => setLoginFormConfig({ ...loginFormConfig, agentButtonText: e.target.value })}
                            placeholder="See Agents"
                            className="w-full bg-[#0f172a] border border-gray-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#f03a5f]"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-gray-300 mb-1">
                            Click Action Type
                          </label>
                          <select
                            value={loginFormConfig.agentButtonAction || 'modal'}
                            onChange={(e) => setLoginFormConfig({ ...loginFormConfig, agentButtonAction: e.target.value })}
                            className="w-full bg-[#0f172a] border border-gray-700 rounded-lg px-3 py-2 text-xs text-white font-bold focus:outline-none focus:border-[#f03a5f]"
                          >
                            <option value="modal">Open Agents Directory Modal (නියෝජිත ලැයිස්තුව)</option>
                            <option value="whatsapp">Open WhatsApp Chat directly (වට්ස්ඇප් වෙත යොමු කරන්න)</option>
                            <option value="url">Open Custom External URL (වෙනත් ලින්ක් එකක්)</option>
                          </select>
                        </div>
                      </div>

                      {loginFormConfig.agentButtonAction === 'whatsapp' && (
                        <div>
                          <label className="block text-xs font-bold text-gray-300 mb-1">
                            Agent WhatsApp Number
                          </label>
                          <input
                            type="text"
                            value={loginFormConfig.agentWhatsappNumber || ''}
                            onChange={(e) => setLoginFormConfig({ ...loginFormConfig, agentWhatsappNumber: e.target.value })}
                            placeholder="+94 77 123 4567"
                            className="w-full bg-[#0f172a] border border-gray-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#f03a5f]"
                          />
                        </div>
                      )}

                      {loginFormConfig.agentButtonAction === 'url' && (
                        <div>
                          <label className="block text-xs font-bold text-gray-300 mb-1">
                            Custom URL Link
                          </label>
                          <input
                            type="url"
                            value={loginFormConfig.agentCustomUrl || ''}
                            onChange={(e) => setLoginFormConfig({ ...loginFormConfig, agentCustomUrl: e.target.value })}
                            placeholder="https://taizerads.lk/agents"
                            className="w-full bg-[#0f172a] border border-gray-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#f03a5f]"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* SECTION 4: REAL SMS GATEWAY (Notify.lk Integration) */}
                  <div className="bg-[#1e293b] border border-gray-800 rounded-xl p-5 space-y-4 shadow-sm">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-800 pb-3">
                      <div className="flex items-center space-x-2.5">
                        <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400 border border-emerald-500/20">
                          <Smartphone className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                            Section 4: Real SMS Gateway (Notify.lk - ශ්‍රී ලංකා SMS සේවාව)
                          </h4>
                          <p className="text-[11px] text-gray-400">
                            Dialog, Mobitel, Hutch, Airtel දුරකථන වෙත සැබෑ SMS OTP යැවීම සක්‍රිය කරන්න
                          </p>
                        </div>
                      </div>

                      {/* Live Toggle Switch */}
                      <div className="flex items-center space-x-3 bg-[#0f172a] px-3 py-1.5 rounded-lg border border-gray-800 self-start sm:self-auto">
                        <span className="text-[11px] font-bold text-gray-300">
                          {smsGatewayConfig.isLive ? '🟢 Live SMS Delivery' : '🟡 Test Mode (Demo)'}
                        </span>
                        <button
                          type="button"
                          onClick={() => setSmsGatewayConfig({ ...smsGatewayConfig, isLive: !smsGatewayConfig.isLive })}
                          className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                            smsGatewayConfig.isLive ? 'bg-emerald-500' : 'bg-gray-700'
                          }`}
                        >
                          <div
                            className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                              smsGatewayConfig.isLive ? 'translate-x-5' : 'translate-x-0'
                            }`}
                          />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Notify.lk User ID */}
                      <div>
                        <label className="block text-xs font-bold text-gray-300 mb-1">
                          Notify.lk User ID <span className="text-emerald-400">*</span>
                        </label>
                        <input
                          type="text"
                          value={smsGatewayConfig.userId || ''}
                          onChange={(e) => setSmsGatewayConfig({ ...smsGatewayConfig, userId: e.target.value })}
                          placeholder="උදා: 12345"
                          className="w-full bg-[#0f172a] border border-gray-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                        />
                      </div>

                      {/* Notify.lk API Key */}
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="block text-xs font-bold text-gray-300">
                            Notify.lk API Key <span className="text-emerald-400">*</span>
                          </label>
                          <button
                            type="button"
                            onClick={() => setShowApiKey(!showApiKey)}
                            className="text-[10px] text-gray-400 hover:text-white flex items-center space-x-1"
                          >
                            {showApiKey ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                            <span>{showApiKey ? 'Hide' : 'Show'}</span>
                          </button>
                        </div>
                        <input
                          type={showApiKey ? 'text' : 'password'}
                          value={smsGatewayConfig.apiKey || ''}
                          onChange={(e) => setSmsGatewayConfig({ ...smsGatewayConfig, apiKey: e.target.value })}
                          placeholder="Notify.lk API Secret Key"
                          className="w-full bg-[#0f172a] border border-gray-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                        />
                      </div>

                      {/* Sender ID */}
                      <div>
                        <label className="block text-xs font-bold text-gray-300 mb-1">
                          Sender ID (යවන්නාගේ නම)
                        </label>
                        <input
                          type="text"
                          value={smsGatewayConfig.senderId || 'NotifyDEMO'}
                          onChange={(e) => setSmsGatewayConfig({ ...smsGatewayConfig, senderId: e.target.value })}
                          placeholder="NotifyDEMO (හෝ ඔබේ අනුමත නම)"
                          className="w-full bg-[#0f172a] border border-gray-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                        />
                        <p className="text-[10px] text-gray-500 mt-1">Default free test sender: NotifyDEMO</p>
                      </div>

                      {/* OTP Code Length */}
                      <div>
                        <label className="block text-xs font-bold text-gray-300 mb-1">
                          OTP Digits Length (කේතයේ ඉලක්කම් ගණන)
                        </label>
                        <select
                          value={smsGatewayConfig.otpLength || 4}
                          onChange={(e) => setSmsGatewayConfig({ ...smsGatewayConfig, otpLength: Number(e.target.value) })}
                          className="w-full bg-[#0f172a] border border-gray-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                        >
                          <option value={4}>4 Digits (Default - වේගවත්)</option>
                          <option value={6}>6 Digits (වැඩි ආරක්ෂාව)</option>
                        </select>
                      </div>
                    </div>

                    {/* Message Template */}
                    <div>
                      <label className="block text-xs font-bold text-gray-300 mb-1">
                        SMS Message Template (SMS පණිවිඩය)
                      </label>
                      <textarea
                        rows={2}
                        value={smsGatewayConfig.messageTemplate || ''}
                        onChange={(e) => setSmsGatewayConfig({ ...smsGatewayConfig, messageTemplate: e.target.value })}
                        placeholder="Your Taizer Ads verification code is: {OTP}. Valid for 5 minutes."
                        className="w-full bg-[#0f172a] border border-gray-700 rounded-lg p-3 text-xs text-white focus:outline-none focus:border-emerald-500"
                      />
                      <p className="text-[10px] text-gray-400 mt-1">
                        Dynamic placeholder: Use <code className="text-emerald-400 bg-black/40 px-1 py-0.5 rounded font-mono">{"{OTP}"}</code> where the 4-digit verification code should appear.
                      </p>
                    </div>

                    {/* Interactive Live Test SMS Tool */}
                    <div className="bg-[#0f172a] border border-emerald-500/20 rounded-xl p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-emerald-400 flex items-center space-x-1.5">
                          <Send className="w-3.5 h-3.5" />
                          <span>Send Test SMS to Your Phone (SMS එකක් යවා පරීක්ෂා කරන්න)</span>
                        </span>
                        <a
                          href="https://notify.lk"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[11px] text-blue-400 hover:underline flex items-center space-x-1"
                        >
                          <span>Open Notify.lk</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>

                      <div className="flex flex-col sm:flex-row items-center gap-2">
                        <div className="flex-1 w-full">
                          <input
                            type="tel"
                            value={testSmsPhone}
                            onChange={(e) => setTestSmsPhone(e.target.value)}
                            placeholder="ඔබගේ ජංගම දුරකථන අංකය (උදා: 0771234567)"
                            className="w-full bg-[#1e293b] border border-gray-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={handleSendTestSms}
                          disabled={testSmsStatus === 'sending'}
                          className="w-full sm:w-auto px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-lg text-xs font-bold transition flex items-center justify-center space-x-1.5 shrink-0"
                        >
                          {testSmsStatus === 'sending' ? (
                            <>
                              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                              <span>Sending SMS...</span>
                            </>
                          ) : (
                            <>
                              <Send className="w-3.5 h-3.5" />
                              <span>Send Test SMS</span>
                            </>
                          )}
                        </button>
                      </div>

                      {testSmsResult && (
                        <div
                          className={`text-xs p-2.5 rounded-lg border ${
                            testSmsStatus === 'success'
                              ? 'bg-emerald-950/40 border-emerald-800 text-emerald-300'
                              : 'bg-red-950/40 border-red-800 text-red-300'
                          }`}
                        >
                          {testSmsResult}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      type="button"
                      onClick={handleSaveLoginForm}
                      className="px-6 py-2.5 bg-[#f03a5f] hover:bg-[#d92348] text-white rounded-xl text-xs sm:text-sm font-bold transition flex items-center space-x-2 shadow-lg"
                    >
                      <Save className="w-4 h-4" />
                      <span>Save All Login Settings (සියලු වෙනස්කම් සුරකින්න)</span>
                    </button>
                  </div>
                </div>

                {/* Right Column: Live Interactive Realtime Replica Preview (5 cols) */}
                <div className="xl:col-span-5">
                  <div className="sticky top-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black uppercase tracking-wider text-amber-400 flex items-center space-x-1.5">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Live Preview (ප්‍රතිඵලය සජීවීව)</span>
                      </span>
                      <span className="text-[10px] bg-green-500/20 text-green-300 px-2 py-0.5 rounded font-bold">
                        Realtime Sync
                      </span>
                    </div>

                    {/* Exact Visual replica of LoginForm */}
                    <div className="bg-white rounded-xl border border-gray-200 shadow-xl p-6 sm:p-7 text-gray-900 animate-in fade-in">
                      {/* Title with red underline accent */}
                      <div className="space-y-1 pb-4">
                        <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight">
                          {loginFormConfig.title || 'Login/ Register'}
                        </h2>
                        <div className="w-10 h-1 bg-[#f03a5f] rounded-full" />
                        <p className="text-xs text-gray-600 pt-1 font-medium leading-relaxed">
                          {loginFormConfig.subtitle || 'ගිණුමට log වීම සහ ගිණුමක් සාදා ගැනීම යන කාර්යයන් දෙකවම මෙම form එක භාවිතා කරන්න.'}
                        </p>
                      </div>

                      {/* Step 1: Phone */}
                      <div className="space-y-4 pt-2">
                        <div>
                          <label className="block text-xs font-bold text-gray-900 mb-1">
                            {loginFormConfig.phoneLabel || 'Enter Phone Number'}
                          </label>
                          <p className="text-[11px] text-gray-500 mb-2">
                            {loginFormConfig.phoneHelpText || 'ඔබගේ දුරකථන අංකය ඇතුලත් කර Send OTP Click කරන්න.'}
                          </p>

                          <div className="flex items-center space-x-2">
                            <span className="border border-gray-300 rounded-lg px-2.5 py-2.5 text-xs bg-gray-50 font-bold text-gray-800">
                              +94
                            </span>
                            <div className="flex-1 border border-gray-300 rounded-lg px-3.5 py-2.5 text-xs text-gray-400 bg-white font-medium">
                              {loginFormConfig.phonePlaceholder || 'XXXXXXX'}
                            </div>
                          </div>
                        </div>

                        {/* Send OTP Button */}
                        <div
                          style={{ backgroundColor: loginFormConfig.sendOtpButtonColor || '#991230' }}
                          className="w-full text-white font-bold py-2.5 px-4 rounded-lg text-xs md:text-sm text-center shadow-sm"
                        >
                          {loginFormConfig.sendOtpButtonText || 'Send OTP'}
                        </div>
                      </div>

                      {/* Dotted separator line */}
                      <div className="border-t border-dashed border-gray-200 my-6" />

                      {/* Agent Support Section */}
                      <div className="space-y-3">
                        <div>
                          <h4 className="text-xs font-bold text-gray-900">
                            {loginFormConfig.agentSectionTitle || 'Agent support to post an ad.'}
                          </h4>
                          <p className="text-[11px] text-gray-500 mt-0.5">
                            {loginFormConfig.agentSectionSubtitle || 'දැන්වීමක් පලකර ගැනීමට නියෝජිත සහාය.'}
                          </p>
                        </div>

                        <div
                          style={{ backgroundColor: loginFormConfig.agentButtonColor || '#0f172a' }}
                          className="w-full text-white font-bold py-2.5 px-4 rounded-lg text-xs md:text-sm shadow-sm flex items-center justify-center space-x-2"
                        >
                          {loginFormConfig.agentButtonAction === 'whatsapp' ? (
                            <MessageCircle className="w-4 h-4 text-green-400" />
                          ) : (
                            <ShieldCheck className="w-4 h-4 text-purple-400" />
                          )}
                          <span>{loginFormConfig.agentButtonText || 'See Agents'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: MONGODB DATABASE MANAGEMENT */}

          {/* TAB 8: USERS & CREDITS MANAGEMENT */}
          {activeAdminTab === 'users' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* Header */}
              <div className="bg-[#1e293b] border border-gray-800 rounded-2xl p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center space-x-3.5">
                  <div className="p-3 bg-emerald-500/10 rounded-2xl text-emerald-400 border border-emerald-500/20 shadow-xs">
                    <Wallet className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="font-black text-lg text-white">
                      User Profiles & Credits (පරිශීලකයින් සහ ක්‍රෙඩිට්)
                    </h3>
                    <p className="text-xs text-gray-400 mt-0.5">
                      පරිශීලක තොරතුරු පරීක්ෂා කිරීම, ක්‍රෙඩිට් එක් කිරීම (Top-Up) හෝ අඩු කිරීම සහ දැන්වීම් කළමනාකරණය.
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setIsNewUserModalOpen(true)}
                    className="flex items-center space-x-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition shadow-md active:scale-95"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>+ Add New User (නව පරිශීලකයෙක්)</span>
                  </button>
                </div>
              </div>

              {/* Stat Counters */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-[#1e293b] border border-gray-800 p-4 rounded-xl shadow-xs">
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-gray-400 font-semibold">Registered Users</p>
                    <Users className="w-4 h-4 text-blue-400" />
                  </div>
                  <p className="text-2xl font-black text-white mt-1">{usersList.length}</p>
                  <p className="text-[11px] text-gray-400 mt-1">Platform user accounts</p>
                </div>

                <div className="bg-[#1e293b] border border-emerald-900/40 p-4 rounded-xl shadow-xs">
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-emerald-400 font-semibold">Total Credit Balances</p>
                    <CreditCard className="w-4 h-4 text-emerald-400" />
                  </div>
                  <p className="text-2xl font-black text-emerald-300 mt-1">
                    Rs. {usersList.reduce((acc, u) => acc + (u.credits || 0), 0).toLocaleString()}
                  </p>
                  <p className="text-[11px] text-emerald-400/80 mt-1">Circulating user wallet balance</p>
                </div>

                <div className="bg-[#1e293b] border border-gray-800 p-4 rounded-xl shadow-xs">
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-green-400 font-semibold">Active Users</p>
                    <CheckCircle2 className="w-4 h-4 text-green-400" />
                  </div>
                  <p className="text-2xl font-black text-green-300 mt-1">
                    {usersList.filter(u => u.status === 'Active').length}
                  </p>
                  <p className="text-[11px] text-gray-400 mt-1">Unrestricted posting access</p>
                </div>

                <div className="bg-[#1e293b] border border-red-900/40 p-4 rounded-xl shadow-xs">
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-red-400 font-semibold">Suspended / Banned</p>
                    <UserX className="w-4 h-4 text-red-400" />
                  </div>
                  <p className="text-2xl font-black text-red-300 mt-1">
                    {usersList.filter(u => u.status !== 'Active').length}
                  </p>
                  <p className="text-[11px] text-red-300/80 mt-1">Blocked / Under review</p>
                </div>
              </div>

              {/* Search & Filter Bar */}
              <div className="bg-[#1e293b] border border-gray-800 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-3">
                <div className="relative w-full md:w-80">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by Name, Phone, ID, Location..."
                    value={userSearchQuery}
                    onChange={(e) => setUserSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-[#0f172a] border border-gray-700 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
                  />
                  {userSearchQuery && (
                    <button
                      onClick={() => setUserSearchQuery('')}
                      className="absolute right-2.5 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white text-xs"
                    >
                      ✕
                    </button>
                  )}
                </div>

                <div className="flex items-center space-x-1.5 overflow-x-auto w-full md:w-auto">
                  {[
                    { id: 'all', label: 'All Users (සියල්ල)' },
                    { id: 'active', label: 'Active (ක්‍රියාකාරී)' },
                    { id: 'credits', label: 'With Credits (> 0)' },
                    { id: 'suspended', label: 'Suspended (අත්හිටවූ)' }
                  ].map((filter) => (
                    <button
                      key={filter.id}
                      onClick={() => setUserFilterStatus(filter.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap ${
                        userFilterStatus === filter.id
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'bg-[#0f172a] text-gray-400 hover:text-white hover:bg-gray-800'
                      }`}
                    >
                      {filter.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Users Table */}
              <div className="bg-[#1e293b] border border-gray-800 rounded-2xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-gray-300">
                    <thead className="bg-[#0f172a] text-gray-400 font-bold uppercase text-[10px] tracking-wider border-b border-gray-800">
                      <tr>
                        <th className="py-3.5 px-4">User</th>
                        <th className="py-3.5 px-4">Contact Info</th>
                        <th className="py-3.5 px-4">Role & Status</th>
                        <th className="py-3.5 px-4 text-right">Credits Balance</th>
                        <th className="py-3.5 px-4 text-center">Ads</th>
                        <th className="py-3.5 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800 font-medium">
                      {usersList
                        .filter(u => {
                          if (userFilterStatus === 'active') return u.status === 'Active';
                          if (userFilterStatus === 'suspended') return u.status !== 'Active';
                          if (userFilterStatus === 'credits') return (u.credits || 0) > 0;
                          return true;
                        })
                        .filter(u => {
                          if (!userSearchQuery) return true;
                          const q = userSearchQuery.toLowerCase();
                          return (
                            (u.name && u.name.toLowerCase().includes(q)) ||
                            (u.phone && u.phone.toLowerCase().includes(q)) ||
                            (u.id && u.id.toLowerCase().includes(q)) ||
                            (u.email && u.email.toLowerCase().includes(q)) ||
                            (u.location && u.location.toLowerCase().includes(q))
                          );
                        })
                        .map((user) => {
                          const userAds = getUserAds(user);
                          return (
                            <tr key={user.id} className="hover:bg-gray-800/50 transition">
                              <td className="py-3.5 px-4">
                                <div className="flex items-center space-x-3">
                                  <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white font-black flex items-center justify-center text-sm shadow-xs flex-shrink-0">
                                    {(user.name || 'U').charAt(0).toUpperCase()}
                                  </div>
                                  <div>
                                    <p className="font-extrabold text-white text-xs">{user.name}</p>
                                    <div className="flex items-center space-x-2 mt-0.5">
                                      <span className="text-[10px] font-mono text-gray-400">{user.id}</span>
                                      <span className="text-[10px] text-gray-400">• {user.location || 'Colombo'}</span>
                                    </div>
                                  </div>
                                </div>
                              </td>

                              <td className="py-3.5 px-4">
                                <div className="space-y-0.5">
                                  <div className="flex items-center space-x-1.5 text-white">
                                    <Phone className="w-3 h-3 text-emerald-400" />
                                    <span>{user.phone}</span>
                                  </div>
                                  {user.email && (
                                    <div className="flex items-center space-x-1.5 text-gray-400 text-[11px]">
                                      <Mail className="w-3 h-3" />
                                      <span className="truncate max-w-[150px]">{user.email}</span>
                                    </div>
                                  )}
                                </div>
                              </td>

                              <td className="py-3.5 px-4">
                                <div className="space-y-1">
                                  <span className="inline-block text-[10px] font-bold bg-blue-500/10 text-blue-300 border border-blue-500/20 px-2 py-0.5 rounded-md">
                                    {user.role || 'Advertiser'}
                                  </span>
                                  <div>
                                    <span className={`inline-block text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                                      user.status === 'Active'
                                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                        : 'bg-red-500/20 text-red-300 border border-red-500/30'
                                    }`}>
                                      {user.status === 'Active' ? '● Active' : '✕ Suspended'}
                                    </span>
                                  </div>
                                </div>
                              </td>

                              <td className="py-3.5 px-4 text-right">
                                <div className="inline-block bg-emerald-950/40 border border-emerald-800/60 rounded-xl px-3 py-1.5 text-right">
                                  <div className="font-mono font-black text-sm text-emerald-400">
                                    Rs. {(user.credits || 0).toLocaleString()}.00
                                  </div>
                                  <div className="text-[10px] text-emerald-300/70 font-semibold">
                                    Wallet Balance
                                  </div>
                                </div>
                              </td>

                              <td className="py-3.5 px-4 text-center">
                                <span className="inline-flex items-center justify-center bg-gray-800 text-white font-bold px-2.5 py-1 rounded-lg text-xs">
                                  {userAds.length} Ads
                                </span>
                              </td>

                              <td className="py-3.5 px-4 text-right">
                                <div className="flex items-center justify-end space-x-2">
                                  {/* Quick Add Credit Button */}
                                  <button
                                    onClick={() => {
                                      setCreditModalUser(user);
                                      setCreditAmount('1500');
                                      setCreditType('add');
                                      setCreditNote('');
                                    }}
                                    className="flex items-center space-x-1 px-2.5 py-1.5 bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-white border border-emerald-500/30 rounded-lg text-xs font-bold transition shadow-xs"
                                    title="Add / Deduct Credits"
                                  >
                                    <PlusCircle className="w-3.5 h-3.5" />
                                    <span>+ Credit</span>
                                  </button>

                                  {/* View Full Profile */}
                                  <button
                                    onClick={() => {
                                      setSelectedUserProfile(user);
                                      setProfileActiveTab('credits');
                                    }}
                                    className="flex items-center space-x-1 px-3 py-1.5 bg-[#f03a5f] hover:bg-[#d92348] text-white rounded-lg text-xs font-bold transition shadow-xs"
                                  >
                                    <Eye className="w-3.5 h-3.5" />
                                    <span>Profile</span>
                                  </button>

                                  {/* Delete user */}
                                  <button
                                    onClick={() => handleDeleteUser(user.id)}
                                    className="p-1.5 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition"
                                    title="Delete User"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>

                  {usersList.length === 0 && (
                    <div className="py-12 text-center text-gray-400 space-y-2">
                      <Users className="w-8 h-8 mx-auto text-gray-600" />
                      <p className="font-bold">No users registered yet.</p>
                      <p className="text-xs text-gray-500">Click "Add New User" to register a profile.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 9: SUPER ADMIN PROFILE & SECURITY SETTINGS */}
          {activeAdminTab === 'profile' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* Header Profile Hero Card */}
              <div className="relative overflow-hidden bg-gradient-to-r from-gray-900 via-[#1e293b] to-gray-900 border border-gray-700/80 rounded-2xl p-6 shadow-xl">
                <div className="absolute -right-6 -bottom-6 w-36 h-36 bg-[#f03a5f]/10 rounded-full blur-2xl pointer-events-none" />
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 relative z-10">
                  <div className="flex items-center space-x-4">
                    <div className="relative group">
                      <img
                        src={adminProfileConfig?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=faces"}
                        alt="Admin Profile"
                        className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-emerald-400 shadow-lg"
                        onError={(e) => {
                          e.target.src = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=faces";
                        }}
                      />
                      <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-[#1e293b] rounded-full shadow-xs" title="Online" />
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                          {adminProfileConfig.name || 'Master Administrator'}
                        </h3>
                        <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                          {adminProfileConfig.role || 'CEO / Super Admin'}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-400 mt-1.5">
                        <span className="flex items-center space-x-1">
                          <Mail className="w-3.5 h-3.5 text-gray-500" />
                          <span>{adminProfileConfig.email || 'admin@taizerads.lk'}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Phone className="w-3.5 h-3.5 text-gray-500" />
                          <span>{adminProfileConfig.phone || '+94 77 123 4567'}</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex sm:flex-col items-start sm:items-end justify-between sm:justify-center border-t sm:border-t-0 border-gray-800 pt-3 sm:pt-0">
                    <span className="text-[11px] text-gray-400 font-semibold">CEO Login Access:</span>
                    <span className="inline-flex items-center space-x-1.5 bg-emerald-950/40 border border-emerald-600/30 text-emerald-300 px-3 py-1 rounded-xl text-xs font-bold mt-1">
                      <Lock className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Passcode Protection Active</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* 2-Column Grid: Profile Settings + Change Password */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left Card: Admin Profile Info (7 cols) */}
                <div className="lg:col-span-7 bg-[#1e293b] border border-gray-800 rounded-2xl p-5 sm:p-6 shadow-sm space-y-5">
                  <div className="border-b border-gray-800 pb-3 flex items-center justify-between">
                    <div className="flex items-center space-x-2.5">
                      <div className="p-2 bg-blue-500/10 rounded-xl text-blue-400 border border-blue-500/20">
                        <User className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm sm:text-base text-white">
                          Admin Profile Information (පරිපාලක තොරතුරු)
                        </h4>
                        <p className="text-xs text-gray-400">Manage administrator display details, contact email & phone.</p>
                      </div>
                    </div>
                  </div>

                  <form onSubmit={handleSaveAdminProfile} className="space-y-4 text-xs">
                    <div>
                      <label className="block text-gray-300 font-bold mb-1.5">
                        Display Name (පරිපාලක නම)
                      </label>
                      <input
                        type="text"
                        required
                        value={adminProfileConfig.name || ''}
                        onChange={(e) => setAdminProfileConfig({ ...adminProfileConfig, name: e.target.value })}
                        placeholder="e.g. Master Administrator / CEO"
                        className="w-full bg-[#0f172a] border border-gray-700 rounded-xl p-3 text-white focus:outline-none focus:border-[#f03a5f] transition text-xs"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-gray-300 font-bold mb-1.5">
                          Official Admin Email (ඊමේල් ලිපිනය)
                        </label>
                        <input
                          type="email"
                          required
                          value={adminProfileConfig.email || ''}
                          onChange={(e) => setAdminProfileConfig({ ...adminProfileConfig, email: e.target.value })}
                          placeholder="admin@taizerads.lk"
                          className="w-full bg-[#0f172a] border border-gray-700 rounded-xl p-3 text-white focus:outline-none focus:border-[#f03a5f] transition text-xs"
                        />
                      </div>

                      <div>
                        <label className="block text-gray-300 font-bold mb-1.5">
                          Admin Contact / WhatsApp Phone
                        </label>
                        <input
                          type="text"
                          required
                          value={adminProfileConfig.phone || ''}
                          onChange={(e) => setAdminProfileConfig({ ...adminProfileConfig, phone: e.target.value })}
                          placeholder="+94 77 123 4567"
                          className="w-full bg-[#0f172a] border border-gray-700 rounded-xl p-3 text-white focus:outline-none focus:border-[#f03a5f] transition text-xs"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-gray-300 font-bold mb-1.5">
                        Role Title / Designation (තනතුර)
                      </label>
                      <input
                        type="text"
                        value={adminProfileConfig.role || ''}
                        onChange={(e) => setAdminProfileConfig({ ...adminProfileConfig, role: e.target.value })}
                        placeholder="CEO / Super Admin"
                        className="w-full bg-[#0f172a] border border-gray-700 rounded-xl p-3 text-white focus:outline-none focus:border-[#f03a5f] transition text-xs"
                      />
                    </div>

                    {/* Admin Avatar Photo: Dual Browser Upload + Web URL */}
                    <div className="bg-[#0f172a]/80 border border-gray-700/80 rounded-2xl p-4 sm:p-5 space-y-3.5">
                      <div className="flex items-center justify-between">
                        <label className="text-gray-200 font-bold text-xs flex items-center space-x-2">
                          <ImageIcon className="w-4 h-4 text-emerald-400" />
                          <span>Admin Profile Photo / Avatar (පරිපාලක පින්තූරය)</span>
                        </label>
                        {adminProfileConfig.avatar && (
                          <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950/60 border border-emerald-800 px-2 py-0.5 rounded-full flex items-center space-x-1">
                            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                            <span>{adminProfileConfig.avatar.startsWith('data:') ? 'Device File Upload' : 'Photo Active'}</span>
                          </span>
                        )}
                      </div>

                      {/* Live Avatar Preview & Dual Upload / URL Controls */}
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                        {/* Live Avatar Preview */}
                        <div className="relative shrink-0 group">
                          <img
                            src={adminProfileConfig.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=faces"}
                            alt="Preview"
                            className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-emerald-400 shadow-md bg-slate-900"
                            onError={(e) => {
                              e.target.src = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=faces";
                            }}
                          />
                          <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-[#1e293b] rounded-full shadow-xs" title="Online" />
                        </div>

                        {/* Upload from Browser / Device + URL Inputs */}
                        <div className="flex-1 w-full space-y-2.5">
                          {/* 1. Device File Browser */}
                          <div className="flex flex-wrap items-center gap-2">
                            <label className="cursor-pointer inline-flex items-center space-x-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white px-3.5 py-2 rounded-xl text-xs font-bold transition shadow-sm">
                              <Upload className="w-3.5 h-3.5" />
                              <span>Upload from Computer / Phone (Browse...)</span>
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    handleFileUploadAsDataUrl(file, (dataUrl) => {
                                      setAdminProfileConfig({ ...adminProfileConfig, avatar: dataUrl });
                                      onShowToast && onShowToast('Admin avatar updated from device!');
                                    });
                                  }
                                }}
                              />
                            </label>
                            <span className="text-[11px] text-gray-400 font-medium">හෝ Web Link එකකින්</span>
                          </div>

                          {/* 2. Web URL input */}
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                              <LinkIcon className="w-3.5 h-3.5" />
                            </div>
                            <input
                              type="url"
                              value={adminProfileConfig.avatar || ''}
                              onChange={(e) => setAdminProfileConfig({ ...adminProfileConfig, avatar: e.target.value })}
                              placeholder="Or paste image URL (https://images.unsplash.com/...)"
                              className="w-full bg-[#0f172a] border border-gray-700 rounded-xl pl-8 pr-3 py-2 text-white focus:outline-none focus:border-emerald-400 transition text-xs"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Avatar Quick Presets */}
                      <div className="pt-2 border-t border-gray-800/80">
                        <label className="block text-gray-400 font-semibold mb-2 text-[11px]">
                          Or Choose Avatar Preset:
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {[
                            { name: 'Admin Pro', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=faces' },
                            { name: 'Executive', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=faces' },
                            { name: 'Security', url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop&crop=faces' },
                            { name: 'Tech Lead', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=faces' },
                            { name: 'Digital CEO', url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&h=200&fit=crop&crop=faces' }
                          ].map((preset, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => setAdminProfileConfig({ ...adminProfileConfig, avatar: preset.url })}
                              className={`flex items-center space-x-2 p-1.5 pr-3 rounded-xl border transition ${
                                adminProfileConfig.avatar === preset.url
                                  ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                                  : 'bg-[#0f172a] border-gray-700 text-gray-400 hover:border-gray-500'
                              }`}
                            >
                              <img src={preset.url} alt={preset.name} className="w-6 h-6 rounded-lg object-cover" />
                              <span className="text-[10px] font-bold">{preset.name}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-gray-800 flex justify-end">
                      <button
                        type="submit"
                        className="px-6 py-2.5 bg-[#f03a5f] hover:bg-[#d92348] text-white font-bold rounded-xl transition flex items-center space-x-2 shadow-md"
                      >
                        <Save className="w-4 h-4" />
                        <span>Save Profile Changes (තොරතුරු සුරකින්න)</span>
                      </button>
                    </div>
                  </form>
                </div>

                {/* Right Card: Security & Change Passcode (5 cols) */}
                <div className="lg:col-span-5 bg-[#1e293b] border border-gray-800 rounded-2xl p-5 sm:p-6 shadow-sm space-y-5">
                  <div className="border-b border-gray-800 pb-3 flex items-center justify-between">
                    <div className="flex items-center space-x-2.5">
                      <div className="p-2 bg-emerald-500/10 rounded-xl text-emerald-400 border border-emerald-500/20">
                        <Key className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm sm:text-base text-white">
                          Security & Passcode (මුරපදය)
                        </h4>
                        <p className="text-xs text-gray-400">Update the access passcode for the /ceo portal.</p>
                      </div>
                    </div>
                  </div>

                  {/* Security Notice Callout */}
                  <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3.5 text-xs text-amber-200/90 space-y-1">
                    <p className="font-bold flex items-center space-x-1.5 text-amber-300">
                      <AlertTriangle className="w-4 h-4 text-amber-400" />
                      <span>Important Notice (විශේෂ අවවාදයයි)</span>
                    </p>
                    <p className="text-[11px] leading-relaxed">
                      මෙම Passcode එක සහ ඔබගේ Admin Email මගින් <strong>/ceo</strong> පිටුවෙන් Admin Panel එකට ඇතුල් වීම පාලනය වේ. ඔබ මෙය වෙනස් කළ පසු ඊළඟ වර ලොග් වීමට Admin Email එක සහ මෙම නව මුරපදයම ඇතුලත් කළ යුතුය. පැරණි හෝ bypass මුරපද (admin/ceo) වලංගු නොවේ.
                    </p>
                  </div>

                  <form onSubmit={handleChangeAdminPassword} className="space-y-4 text-xs">
                    {/* Current Passcode */}
                    <div>
                      <label className="block text-gray-300 font-bold mb-1.5">
                        Current Passcode (දැනට ඇති මුරපදය)
                      </label>
                      <div className="relative">
                        <input
                          type={showCurrentPass ? 'text' : 'password'}
                          required
                          value={currentPasswordInput}
                          onChange={(e) => setCurrentPasswordInput(e.target.value)}
                          placeholder="Enter current passcode"
                          className="w-full bg-[#0f172a] border border-gray-700 rounded-xl p-3 pr-10 text-white focus:outline-none focus:border-emerald-500 transition font-mono"
                        />
                        <button
                          type="button"
                          onClick={() => setShowCurrentPass(!showCurrentPass)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                        >
                          {showCurrentPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    {/* New Passcode */}
                    <div>
                      <label className="block text-gray-300 font-bold mb-1.5">
                        New Passcode (නව මුරපදය)
                      </label>
                      <div className="relative">
                        <input
                          type={showNewPass ? 'text' : 'password'}
                          required
                          minLength={3}
                          value={newPasswordInput}
                          onChange={(e) => setNewPasswordInput(e.target.value)}
                          placeholder="Enter new strong passcode"
                          className="w-full bg-[#0f172a] border border-gray-700 rounded-xl p-3 pr-10 text-white focus:outline-none focus:border-emerald-500 transition font-mono"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPass(!showNewPass)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                        >
                          {showNewPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      <p className="text-[10px] text-gray-400 mt-1">Minimum 3 characters (e.g. your secret CEO passcode)</p>
                    </div>

                    {/* Confirm New Passcode */}
                    <div>
                      <label className="block text-gray-300 font-bold mb-1.5">
                        Confirm New Passcode (නව මුරපදය තහවුරු කරන්න)
                      </label>
                      <div className="relative">
                        <input
                          type={showConfirmPass ? 'text' : 'password'}
                          required
                          value={confirmPasswordInput}
                          onChange={(e) => setConfirmPasswordInput(e.target.value)}
                          placeholder="Re-enter new passcode"
                          className="w-full bg-[#0f172a] border border-gray-700 rounded-xl p-3 pr-10 text-white focus:outline-none focus:border-emerald-500 transition font-mono"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPass(!showConfirmPass)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                        >
                          {showConfirmPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-gray-800">
                      <button
                        type="submit"
                        className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold rounded-xl transition flex items-center justify-center space-x-2 shadow-md cursor-pointer"
                      >
                        <ShieldCheck className="w-4 h-4" />
                        <span>Update CEO Passcode (මුරපදය සුරකින්න)</span>
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}

          {/* TAB 10: SIDE TOGGLE BLOG & HIGHLIGHT POSTS MANAGEMENT */}
          {activeAdminTab === 'blog' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* Header Bar */}
              <div className="bg-[#1e293b] border border-gray-800 rounded-2xl p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center space-x-3.5">
                  <div className="p-3 bg-amber-500/10 rounded-2xl text-amber-400 border border-amber-500/20 shadow-xs">
                    <BookOpen className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="font-black text-lg text-white">
                      Side Blog & Highlight Posts (බ්ලොග් සහ Highlight ලිපි)
                    </h3>
                    <p className="text-xs text-gray-400 mt-0.5">
                      පැත්තේ ඇති පාවෙන Toggle Button එක සහ ඒ මගින් දිස්වන Admin බ්ලොග් ලිපි හා Featured links මෙතැනින් කළමනාකරණය කරන්න.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleOpenNewBlogModal}
                  className="flex items-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white text-xs font-bold rounded-xl transition shadow-md active:scale-95 cursor-pointer"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>+ Add Highlight Post (නව ලිපියක් / ලින්ක් එකක්)</span>
                </button>
              </div>

              {/* SECTION 1: SIDE TOGGLE BUTTON CUSTOMIZATION */}
              <div className="bg-[#1e293b] border border-gray-800 rounded-2xl p-5 sm:p-6 shadow-sm space-y-5">
                <div className="border-b border-gray-800 pb-3 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Palette className="w-5 h-5 text-rose-400" />
                    <div>
                      <h4 className="font-bold text-sm sm:text-base text-white">
                        Floating Side Tag Button Appearance (පාවෙන බටනයේ පෙනුම)
                      </h4>
                      <p className="text-xs text-gray-400">Customize the side button text, badge, colors, and live appearance.</p>
                    </div>
                  </div>
                  <span className="text-[11px] bg-rose-500/20 text-rose-300 font-bold px-2.5 py-0.5 rounded-full border border-rose-500/30">
                    Live Toggle Tag
                  </span>
                </div>

                <form onSubmit={handleSaveBlogButtonSettings} className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
                    {/* Controls (8 cols) */}
                    <div className="md:col-span-8 space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-gray-300 font-bold mb-1.5">
                            Button Main Title (ප්‍රධාන නම)
                          </label>
                          <input
                            type="text"
                            required
                            value={sideBlogConfig.button.title || ''}
                            onChange={(e) => setSideBlogConfig({
                              ...sideBlogConfig,
                              button: { ...sideBlogConfig.button, title: e.target.value }
                            })}
                            placeholder="e.g. Admin Blog"
                            className="w-full bg-[#0f172a] border border-gray-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-[#f03a5f]"
                          />
                        </div>

                        <div>
                          <label className="block text-gray-300 font-bold mb-1.5">
                            Sinhala Subtitle (සිංහල නම)
                          </label>
                          <input
                            type="text"
                            value={sideBlogConfig.button.titleSin || ''}
                            onChange={(e) => setSideBlogConfig({
                              ...sideBlogConfig,
                              button: { ...sideBlogConfig.button, titleSin: e.target.value }
                            })}
                            placeholder="e.g. විශේෂ ලිපි"
                            className="w-full bg-[#0f172a] border border-gray-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-[#f03a5f]"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-gray-300 font-bold mb-1.5">
                            Badge Text (බැජ් එක)
                          </label>
                          <input
                            type="text"
                            value={sideBlogConfig.button.badgeText || ''}
                            onChange={(e) => setSideBlogConfig({
                              ...sideBlogConfig,
                              button: { ...sideBlogConfig.button, badgeText: e.target.value.toUpperCase() }
                            })}
                            placeholder="HOT / NEW / BLOG"
                            className="w-full bg-[#0f172a] border border-gray-700 rounded-xl p-2.5 text-white font-black uppercase focus:outline-none focus:border-[#f03a5f]"
                          />
                        </div>

                        <div>
                          <label className="block text-gray-300 font-bold mb-1.5">
                            Icon Type (අයිකනය)
                          </label>
                          <select
                            value={sideBlogConfig.button.iconType || 'Flame'}
                            onChange={(e) => setSideBlogConfig({
                              ...sideBlogConfig,
                              button: { ...sideBlogConfig.button, iconType: e.target.value }
                            })}
                            className="w-full bg-[#0f172a] border border-gray-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-[#f03a5f]"
                          >
                            <option value="Flame">Flame (ගින්දර)</option>
                            <option value="BookOpen">BookOpen (පොත)</option>
                            <option value="Sparkles">Sparkles (තරු)</option>
                            <option value="Zap">Zap (අකුණ)</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-gray-300 font-bold mb-1.5">
                            Pulsing Pulse Effect
                          </label>
                          <div className="pt-2">
                            <label className="inline-flex items-center space-x-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={sideBlogConfig.button.pulseAnimation !== false}
                                onChange={(e) => setSideBlogConfig({
                                  ...sideBlogConfig,
                                  button: { ...sideBlogConfig.button, pulseAnimation: e.target.checked }
                                })}
                                className="rounded text-[#f03a5f] focus:ring-[#f03a5f]"
                              />
                              <span className="text-gray-300 font-bold">Enable Pulse Ping</span>
                            </label>
                          </div>
                        </div>
                      </div>

                      {/* Color Presets */}
                      <div>
                        <label className="block text-gray-400 font-bold mb-2">
                          Preset Color Themes (වර්ණ තේමා):
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {[
                            { name: 'Rose Flame', gradient: 'linear-gradient(135deg, #881337 0%, #be123c 100%)' },
                            { name: 'Sunset Amber', gradient: 'linear-gradient(135deg, #b45309 0%, #ea580c 100%)' },
                            { name: 'Deep Purple', gradient: 'linear-gradient(135deg, #4c1d95 0%, #7c3aed 100%)' },
                            { name: 'Emerald Wave', gradient: 'linear-gradient(135deg, #065f46 0%, #059669 100%)' },
                            { name: 'Midnight Dark', gradient: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)' }
                          ].map((preset, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => setSideBlogConfig({
                                ...sideBlogConfig,
                                button: {
                                  ...sideBlogConfig.button,
                                  isGradient: true,
                                  bgGradient: preset.gradient
                                }
                              })}
                              style={{ background: preset.gradient }}
                              className="px-3 py-1.5 rounded-xl text-white font-bold text-[11px] shadow-sm border border-white/20 hover:scale-105 transition active:scale-95"
                            >
                              {preset.name}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="pt-2">
                        <button
                          type="submit"
                          className="px-6 py-2.5 bg-[#f03a5f] hover:bg-[#d92348] text-white font-bold rounded-xl shadow-md transition flex items-center space-x-2"
                        >
                          <Save className="w-4 h-4" />
                          <span>Save Button Settings (සැකසුම් සුරකින්න)</span>
                        </button>
                      </div>
                    </div>

                    {/* Live Preview Card (4 cols) */}
                    <div className="md:col-span-4 bg-[#0f172a] border border-gray-800 rounded-2xl p-4 space-y-3">
                      <div className="flex items-center justify-between text-xs font-bold text-gray-400">
                        <span className="flex items-center space-x-1">
                          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                          <span>Live Button Preview</span>
                        </span>
                        <span className="text-[10px] text-green-400">Screen Edge</span>
                      </div>

                      <div className="bg-slate-950 p-6 rounded-xl border border-gray-800 flex items-center justify-center relative overflow-hidden min-h-[140px]">
                        <div className="absolute right-0">
                          <div
                            style={{
                              background: sideBlogConfig.button.isGradient 
                                ? (sideBlogConfig.button.bgGradient || 'linear-gradient(135deg, #881337 0%, #be123c 100%)')
                                : (sideBlogConfig.button.bgColor || '#881337')
                            }}
                            className="flex items-center space-x-2.5 text-white pl-4 pr-3 py-3 rounded-l-2xl shadow-xl border-l border-y border-rose-400/40 select-none"
                          >
                            <div className="relative flex items-center justify-center">
                              {sideBlogConfig.button.pulseAnimation !== false && (
                                <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-300 opacity-75" />
                                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-400" />
                                </span>
                              )}
                              <Flame className="w-4 h-4 text-amber-300 fill-amber-300" />
                            </div>
                            <div className="flex flex-col items-start leading-tight">
                              <div className="flex items-center space-x-1.5">
                                <span className="text-[11px] font-black uppercase text-amber-200">
                                  {sideBlogConfig.button.title || 'Admin Blog'}
                                </span>
                                {sideBlogConfig.button.badgeText && (
                                  <span className="bg-amber-400 text-slate-950 font-black text-[9px] px-1.5 py-0.2 rounded-full uppercase">
                                    {sideBlogConfig.button.badgeText}
                                  </span>
                                )}
                              </div>
                              <span className="text-[9px] font-bold text-rose-100">
                                {sideBlogConfig.button.titleSin || 'විශේෂ ලිපි'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <p className="text-[10px] text-gray-500 text-center">
                        This floating tag appears on the right edge of the public website.
                      </p>
                    </div>
                  </div>
                </form>
              </div>

              {/* SECTION 2: HIGHLIGHTED BLOG POSTS & LINKS LIST */}
              <div className="bg-[#1e293b] border border-gray-800 rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-800 pb-3">
                  <div className="flex items-center space-x-2">
                    <BookOpen className="w-5 h-5 text-amber-400" />
                    <div>
                      <h4 className="font-bold text-sm sm:text-base text-white">
                        All Highlighted Blog Posts & External Links ({sideBlogConfig.posts.length})
                      </h4>
                      <p className="text-xs text-gray-400">Articles, promotions, and special links displayed inside the side drawer.</p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleOpenNewBlogModal}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center space-x-1.5 active:scale-95"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>+ New Blog Post</span>
                  </button>
                </div>

                {/* Posts Table / List */}
                <div className="space-y-3">
                  {sideBlogConfig.posts.map((post) => (
                    <div
                      key={post.id}
                      className={`p-4 rounded-2xl border transition flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                        post.isPrimary
                          ? 'bg-rose-950/20 border-rose-500/50 shadow-md'
                          : 'bg-[#0f172a] border-gray-800 hover:border-gray-700'
                      }`}
                    >
                      <div className="flex items-start space-x-3.5 min-w-0">
                        {post.imageUrl && (
                          <img
                            src={post.imageUrl}
                            alt={post.title}
                            className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl object-cover border border-gray-700 flex-shrink-0"
                          />
                        )}
                        <div className="space-y-1.5 min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            {post.isPrimary && (
                              <span className="bg-amber-500 text-black text-[10px] font-black px-2 py-0.5 rounded-full uppercase flex items-center space-x-1">
                                <Star className="w-3 h-3 fill-current" />
                                <span>Primary Highlight (#1)</span>
                              </span>
                            )}
                            <span className="bg-rose-500/20 text-rose-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-rose-500/30">
                              {post.category || 'Guide'}
                            </span>
                            {post.badge && (
                              <span className="bg-blue-500/20 text-blue-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-blue-500/30">
                                {post.badge}
                              </span>
                            )}
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              post.isActive !== false ? 'bg-green-500/20 text-green-300' : 'bg-gray-700 text-gray-400'
                            }`}>
                              {post.isActive !== false ? '● Live' : '○ Inactive'}
                            </span>
                          </div>

                          <h5 className="font-extrabold text-sm sm:text-base text-white leading-snug">
                            {post.title}
                          </h5>
                          {post.titleSin && (
                            <p className="text-xs text-amber-200/80 font-bold leading-tight">
                              {post.titleSin}
                            </p>
                          )}
                          <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">
                            {post.excerpt || post.content}
                          </p>

                          {post.linkUrl && (
                            <div className="flex items-center space-x-1 text-[11px] text-blue-400">
                              <ExternalLink className="w-3 h-3" />
                              <span className="truncate max-w-xs">{post.linkUrl}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-wrap md:flex-col items-end gap-2 flex-shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-gray-800">
                        {!post.isPrimary && (
                          <button
                            type="button"
                            onClick={() => handleSetPrimaryHighlight(post.id)}
                            className="px-3 py-1.5 bg-amber-500/20 hover:bg-amber-500 text-amber-300 hover:text-black font-bold text-xs rounded-xl border border-amber-500/30 transition flex items-center space-x-1.5 cursor-pointer"
                            title="Make this the top primary highlight card"
                          >
                            <Star className="w-3.5 h-3.5" />
                            <span>Set as #1 Highlight</span>
                          </button>
                        )}

                        <div className="flex items-center space-x-1.5">
                          <button
                            type="button"
                            onClick={() => handleToggleBlogPostActive(post.id)}
                            className={`px-3 py-1.5 rounded-xl font-bold text-xs transition cursor-pointer ${
                              post.isActive !== false
                                ? 'bg-gray-700 hover:bg-gray-600 text-gray-200'
                                : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                            }`}
                          >
                            {post.isActive !== false ? 'Hide Post' : 'Make Live'}
                          </button>

                          <button
                            type="button"
                            onClick={() => handleOpenEditBlogModal(post)}
                            className="p-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition cursor-pointer"
                            title="Edit Blog Post"
                          >
                            <Edit className="w-4 h-4" />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDeleteBlogPost(post.id)}
                            className="p-1.5 bg-red-600/20 hover:bg-red-600 text-red-300 hover:text-white rounded-xl text-xs font-bold transition cursor-pointer"
                            title="Delete Blog Post"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}

                  {sideBlogConfig.posts.length === 0 && (
                    <div className="text-center py-12 text-gray-400 space-y-3">
                      <BookOpen className="w-10 h-10 mx-auto text-gray-600" />
                      <p className="font-bold text-sm">No highlighted blog posts yet.</p>
                      <button
                        type="button"
                        onClick={handleOpenNewBlogModal}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md transition"
                      >
                        + Add Your First Blog Post
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Quick Edit Ad Dialog */}
      {editingAd && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#1e293b] border border-gray-700 rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl p-5 sm:p-6 space-y-4 text-xs text-gray-200">
            <div className="flex items-center justify-between border-b border-gray-700 pb-3">
              <div>
                <h3 className="font-extrabold text-sm sm:text-base text-white">
                  Edit Advertisement #{editingAd.id}
                </h3>
                <p className="text-[11px] text-gray-400">Update ad details, category, contact info, and pricing.</p>
              </div>
              <button
                onClick={() => setEditingAd(null)}
                className="text-gray-400 hover:text-white p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveEditAd} className="space-y-3.5">
              <div>
                <label className="block font-bold mb-1 text-gray-300">Title</label>
                <input
                  type="text"
                  required
                  value={editingAd.title || ''}
                  onChange={(e) => setEditingAd({ ...editingAd, title: e.target.value })}
                  className="w-full bg-[#0f172a] border border-gray-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-[#f03a5f]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1 text-gray-300">Category</label>
                  <select
                    value={editingAd.category || 'Spa & Massage'}
                    onChange={(e) => setEditingAd({ ...editingAd, category: e.target.value })}
                    className="w-full bg-[#0f172a] border border-gray-700 rounded-lg p-2 text-white focus:outline-none"
                  >
                    <option value="Spa & Massage">Spa & Massage</option>
                    <option value="Personal Services">Personal Services</option>
                    <option value="Hotels & Rooms">Hotels & Rooms</option>
                    <option value="Vehicles & Rent">Vehicles & Rent</option>
                    <option value="Jobs & Careers">Jobs & Careers</option>
                    <option value="Real Estate">Real Estate</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Fashion & Beauty">Fashion & Beauty</option>
                    <option value="Services">Services</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold mb-1 text-gray-300">Location (නගරය / දිස්ත්‍රික්කය)</label>
                  <input
                    type="text"
                    value={editingAd.location || ''}
                    onChange={(e) => setEditingAd({ ...editingAd, location: e.target.value })}
                    placeholder="e.g. Colombo, Kandy, Galle"
                    className="w-full bg-[#0f172a] border border-gray-700 rounded-lg p-2 text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold mb-1 text-gray-300">Badge Tier</label>
                  <select
                    value={editingAd.badgeType || 'Normal Ad'}
                    onChange={(e) => setEditingAd({ ...editingAd, badgeType: e.target.value })}
                    className="w-full bg-[#0f172a] border border-gray-700 rounded-lg p-2 text-white focus:outline-none"
                  >
                    <option value="VIP Ad">VIP Ad (Ultimate #1)</option>
                    <option value="Super Ad">Super Ad (Gold)</option>
                    <option value="NRA Ad">NRA Ad</option>
                    <option value="Normal Ad">Normal Ad (Free/Standard)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold mb-1 text-gray-300">Status</label>
                  <select
                    value={editingAd.status || 'Approved'}
                    onChange={(e) => setEditingAd({ ...editingAd, status: e.target.value })}
                    className="w-full bg-[#0f172a] border border-gray-700 rounded-lg p-2 text-white focus:outline-none"
                  >
                    <option value="Approved">Approved (Live)</option>
                    <option value="Pending Approval">Pending Review</option>
                    <option value="Fake Ad">Fake Ad (Reported)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold mb-1 text-gray-300">Price</label>
                  <input
                    type="text"
                    value={editingAd.price || ''}
                    onChange={(e) => setEditingAd({ ...editingAd, price: e.target.value })}
                    placeholder="Rs. 1,500.00"
                    className="w-full bg-[#0f172a] border border-gray-700 rounded-lg p-2 text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold mb-1 text-gray-300">Phone</label>
                  <input
                    type="text"
                    value={editingAd.phone || ''}
                    onChange={(e) => setEditingAd({ ...editingAd, phone: e.target.value })}
                    className="w-full bg-[#0f172a] border border-gray-700 rounded-lg p-2 text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold mb-1 text-gray-300">WhatsApp</label>
                  <input
                    type="text"
                    value={editingAd.whatsapp || ''}
                    onChange={(e) => setEditingAd({ ...editingAd, whatsapp: e.target.value })}
                    placeholder="771234567"
                    className="w-full bg-[#0f172a] border border-gray-700 rounded-lg p-2 text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold mb-1 text-gray-300">Telegram</label>
                  <input
                    type="text"
                    value={editingAd.telegram || ''}
                    onChange={(e) => setEditingAd({ ...editingAd, telegram: e.target.value })}
                    placeholder="@username"
                    className="w-full bg-[#0f172a] border border-gray-700 rounded-lg p-2 text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold mb-1 text-gray-300">Image URL</label>
                <input
                  type="url"
                  value={editingAd.image || ''}
                  onChange={(e) => setEditingAd({ ...editingAd, image: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-[#0f172a] border border-gray-700 rounded-lg p-2 text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold mb-1 text-gray-300">Description (දැන්වීම් විස්තරය)</label>
                <textarea
                  rows={3}
                  value={editingAd.description || ''}
                  onChange={(e) => setEditingAd({ ...editingAd, description: e.target.value })}
                  placeholder="Enter full advertisement text..."
                  className="w-full bg-[#0f172a] border border-gray-700 rounded-lg p-2 text-white focus:outline-none"
                />
              </div>

              <div className="flex items-center space-x-2 pt-1 bg-red-950/30 border border-red-900/40 p-2.5 rounded-lg">
                <input
                  type="checkbox"
                  id="adminIsFakeAd"
                  checked={editingAd.isFake || editingAd.status === 'Fake Ad'}
                  onChange={(e) => setEditingAd({
                    ...editingAd,
                    isFake: e.target.checked,
                    status: e.target.checked ? 'Fake Ad' : (editingAd.status === 'Fake Ad' ? 'Approved' : editingAd.status)
                  })}
                  className="rounded text-red-500 focus:ring-red-500"
                />
                <label htmlFor="adminIsFakeAd" className="text-xs text-red-300 font-bold cursor-pointer">
                  Flag as Fake Ad / Scam Archive (ව්‍යාජ / වංචනික දැන්වීමක් ලෙස ලකුණු කරන්න)
                </label>
              </div>

              <div className="pt-3 border-t border-gray-700 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setEditingAd(null)}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-bold"
                >
                  Cancel (අවලංගු කරන්න)
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#f03a5f] hover:bg-[#d92348] text-white rounded-lg font-bold shadow-md"
                >
                  Save Changes (සුරකින්න)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* FULL USER PROFILE MODAL */}
      {selectedUserProfile && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-[#1e293b] border border-gray-700 rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
            {/* Modal Header */}
            <div className="bg-[#0f172a] p-4 sm:p-5 border-b border-gray-800 flex items-center justify-between">
              <div className="flex items-center space-x-3.5">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white font-black flex items-center justify-center text-lg shadow-md flex-shrink-0">
                  {(selectedUserProfile.name || 'U').charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center space-x-2.5">
                    <h3 className="font-black text-base sm:text-lg text-white">
                      {selectedUserProfile.name}
                    </h3>
                    <span className="font-mono text-xs bg-gray-800 text-gray-300 px-2 py-0.5 rounded-md border border-gray-700">
                      {selectedUserProfile.id}
                    </span>
                    <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                      selectedUserProfile.status === 'Active'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'bg-red-500/20 text-red-300 border border-red-500/30'
                    }`}>
                      {selectedUserProfile.status === 'Active' ? '● Active' : '✕ Suspended'}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-gray-400 mt-1">
                    <span>Joined: {selectedUserProfile.joinedDate || 'Recent'}</span>
                    <span>•</span>
                    <span>City: {selectedUserProfile.location || 'Colombo'}</span>
                    <span>•</span>
                    <span>Role: {selectedUserProfile.role || 'Advertiser'}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setSelectedUserProfile(null)}
                className="text-gray-400 hover:text-white p-2 rounded-xl hover:bg-gray-800 transition"
              >
                ✕
              </button>
            </div>

            {/* Profile Tab Navigation */}
            <div className="bg-[#0f172a]/70 px-4 sm:px-6 border-b border-gray-800 flex space-x-1 sm:space-x-4 overflow-x-auto">
              {[
                { id: 'credits', label: 'Credits & Wallet (ක්‍රෙඩිට්)', icon: Wallet },
                { id: 'details', label: 'Profile Details (තොරතුරු)', icon: Users },
                { id: 'ads', label: `Posted Ads (${getUserAds(selectedUserProfile).length})`, icon: FileSpreadsheet },
                { id: 'notes', label: 'Admin Notes (සටහන්)', icon: ShieldAlert }
              ].map(tab => {
                const IconComponent = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setProfileActiveTab(tab.id)}
                    className={`flex items-center space-x-2 py-3 px-3 border-b-2 font-bold text-xs whitespace-nowrap transition ${
                      profileActiveTab === tab.id
                        ? 'border-emerald-500 text-emerald-400'
                        : 'border-transparent text-gray-400 hover:text-gray-200'
                    }`}
                  >
                    <IconComponent className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Modal Body Viewport */}
            <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-6 text-xs text-gray-200">
              {/* TAB 1: CREDITS & WALLET */}
              {profileActiveTab === 'credits' && (
                <div className="space-y-6">
                  {/* Top Live Credit Balance Display */}
                  <div className="bg-gradient-to-r from-emerald-950/60 via-[#1e293b] to-[#0f172a] border border-emerald-800/60 rounded-2xl p-5 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                        <CreditCard className="w-7 h-7" />
                      </div>
                      <div>
                        <p className="text-xs text-emerald-300 font-bold uppercase tracking-wider">Current Wallet Balance</p>
                        <p className="text-3xl font-black text-white mt-0.5">
                          Rs. {(selectedUserProfile.credits || 0).toLocaleString()}.00
                        </p>
                        <p className="text-[11px] text-gray-400 mt-0.5">
                          Available for instant Normal, Super, and VIP ad activations.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 w-full sm:w-auto">
                      <button
                        onClick={() => {
                          setCreditModalUser(selectedUserProfile);
                          setCreditAmount('1500');
                          setCreditType('add');
                          setCreditNote('Admin top-up');
                        }}
                        className="w-full sm:w-auto px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold rounded-xl shadow-md transition flex items-center justify-center space-x-2"
                      >
                        <PlusCircle className="w-4 h-4" />
                        <span>Quick Add (+ Rs)</span>
                      </button>
                    </div>
                  </div>

                  {/* Add / Deduct Credit Management Panel */}
                  <div className="bg-[#0f172a] border border-gray-800 rounded-2xl p-5 space-y-4">
                    <h4 className="font-extrabold text-sm text-white flex items-center space-x-2">
                      <Wallet className="w-4 h-4 text-emerald-400" />
                      <span>Adjust User Credits (ක්‍රෙඩිට් එකතු කිරීම / අඩු කිරීම)</span>
                    </h4>

                    {/* Quick Preset Amount Buttons */}
                    <div>
                      <label className="block text-gray-400 font-bold mb-1.5 text-[11px]">
                        Quick Preset Amounts:
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {[500, 700, 1500, 5000, 10000].map(amt => (
                          <button
                            key={amt}
                            type="button"
                            onClick={() => setCreditAmount(amt.toString())}
                            className={`px-3 py-1.5 rounded-lg font-mono font-bold text-xs border transition ${
                              creditAmount === amt.toString()
                                ? 'bg-emerald-600 border-emerald-500 text-white'
                                : 'bg-[#1e293b] border-gray-700 text-gray-300 hover:border-gray-500'
                            }`}
                          >
                            + Rs. {amt.toLocaleString()}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-gray-400 font-bold mb-1">Transaction Type</label>
                        <select
                          value={creditType}
                          onChange={(e) => setCreditType(e.target.value)}
                          className="w-full bg-[#1e293b] border border-gray-700 rounded-xl p-2.5 text-white font-bold focus:outline-none"
                        >
                          <option value="add">➕ Add Credits (Top-Up / තැන්පතු)</option>
                          <option value="deduct">➖ Deduct Credits (අඩු කිරීම)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-gray-400 font-bold mb-1">Credit Amount (Rs.)</label>
                        <input
                          type="number"
                          min="1"
                          step="1"
                          value={creditAmount}
                          onChange={(e) => setCreditAmount(e.target.value)}
                          placeholder="e.g. 1500"
                          className="w-full bg-[#1e293b] border border-gray-700 rounded-xl p-2.5 text-white font-mono font-bold focus:outline-none focus:border-emerald-500"
                        />
                      </div>

                      <div>
                        <label className="block text-gray-400 font-bold mb-1">Reason / Reference Note</label>
                        <input
                          type="text"
                          value={creditNote}
                          onChange={(e) => setCreditNote(e.target.value)}
                          placeholder="e.g. Bank slip ref #8392"
                          className="w-full bg-[#1e293b] border border-gray-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-emerald-500"
                        />
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        handleProfileCreditSubmit(creditAmount, creditNote, creditType);
                        setCreditNote('');
                      }}
                      className="w-full sm:w-auto px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold rounded-xl transition shadow-md flex items-center justify-center space-x-2"
                    >
                      <Check className="w-4 h-4" />
                      <span>
                        Apply {creditType === 'add' ? 'Credit Top-Up' : 'Credit Deduction'} (Rs. {Number(creditAmount || 0).toLocaleString()})
                      </span>
                    </button>
                  </div>

                  {/* Transaction History Table */}
                  <div className="space-y-2.5">
                    <h4 className="font-extrabold text-sm text-white flex items-center space-x-2">
                      <History className="w-4 h-4 text-blue-400" />
                      <span>Credit Transaction History (ගනුදෙනු ඉතිහාසය)</span>
                    </h4>

                    {selectedUserProfile.creditHistory && selectedUserProfile.creditHistory.length > 0 ? (
                      <div className="bg-[#0f172a] border border-gray-800 rounded-xl overflow-hidden">
                        <table className="w-full text-left text-xs">
                          <thead className="bg-[#1e293b]/60 text-gray-400 uppercase text-[10px] font-bold border-b border-gray-800">
                            <tr>
                              <th className="py-2.5 px-3">Date</th>
                              <th className="py-2.5 px-3">Type</th>
                              <th className="py-2.5 px-3">Amount</th>
                              <th className="py-2.5 px-3">Note / Reference</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-800 font-medium">
                            {selectedUserProfile.creditHistory.map((tx, idx) => (
                              <tr key={tx.id || idx} className="hover:bg-gray-800/40">
                                <td className="py-2.5 px-3 text-gray-400 whitespace-nowrap">{tx.date}</td>
                                <td className="py-2.5 px-3">
                                  <span className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                    tx.type === 'add'
                                      ? 'bg-emerald-500/20 text-emerald-300'
                                      : 'bg-red-500/20 text-red-300'
                                  }`}>
                                    {tx.type === 'add' ? (
                                      <>
                                        <ArrowDownLeft className="w-3 h-3" />
                                        <span>Deposit</span>
                                      </>
                                    ) : (
                                      <>
                                        <ArrowUpRight className="w-3 h-3" />
                                        <span>Deduction</span>
                                      </>
                                    )}
                                  </span>
                                </td>
                                <td className={`py-2.5 px-3 font-mono font-bold ${
                                  tx.type === 'add' ? 'text-emerald-400' : 'text-red-400'
                                }`}>
                                  {tx.type === 'add' ? '+' : '-'} Rs. {(tx.amount || 0).toLocaleString()}.00
                                </td>
                                <td className="py-2.5 px-3 text-gray-300">{tx.note || '-'}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="bg-[#0f172a] border border-gray-800 rounded-xl p-6 text-center text-gray-500">
                        <History className="w-6 h-6 mx-auto mb-1 text-gray-600" />
                        <p>No transaction history recorded yet for this profile.</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 2: PROFILE DETAILS */}
              {profileActiveTab === 'details' && (
                <form onSubmit={handleSaveProfileChanges} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-300 font-bold mb-1">Full Name (නම)</label>
                      <input
                        type="text"
                        required
                        value={selectedUserProfile.name || ''}
                        onChange={(e) => setSelectedUserProfile({ ...selectedUserProfile, name: e.target.value })}
                        className="w-full bg-[#0f172a] border border-gray-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-300 font-bold mb-1">Phone Number (දුරකථන අංකය)</label>
                      <input
                        type="text"
                        required
                        value={selectedUserProfile.phone || ''}
                        onChange={(e) => setSelectedUserProfile({ ...selectedUserProfile, phone: e.target.value })}
                        className="w-full bg-[#0f172a] border border-gray-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-300 font-bold mb-1">Email Address</label>
                      <input
                        type="email"
                        value={selectedUserProfile.email || ''}
                        onChange={(e) => setSelectedUserProfile({ ...selectedUserProfile, email: e.target.value })}
                        className="w-full bg-[#0f172a] border border-gray-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-300 font-bold mb-1">Location / City (නගරය)</label>
                      <input
                        type="text"
                        value={selectedUserProfile.location || ''}
                        onChange={(e) => setSelectedUserProfile({ ...selectedUserProfile, location: e.target.value })}
                        className="w-full bg-[#0f172a] border border-gray-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-300 font-bold mb-1">Account Role</label>
                      <select
                        value={selectedUserProfile.role || 'Advertiser'}
                        onChange={(e) => setSelectedUserProfile({ ...selectedUserProfile, role: e.target.value })}
                        className="w-full bg-[#0f172a] border border-gray-700 rounded-xl p-2.5 text-white focus:outline-none"
                      >
                        <option value="Advertiser">Advertiser (දැන්වීම්කරු)</option>
                        <option value="Verified Advertiser">Verified Advertiser (සත්‍යාපිත)</option>
                        <option value="VIP Partner">VIP Partner (විශේෂ)</option>
                        <option value="Business Account">Business Account (ව්‍යාපාරික)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-gray-300 font-bold mb-1">Account Status</label>
                      <select
                        value={selectedUserProfile.status || 'Active'}
                        onChange={(e) => setSelectedUserProfile({ ...selectedUserProfile, status: e.target.value })}
                        className="w-full bg-[#0f172a] border border-gray-700 rounded-xl p-2.5 text-white focus:outline-none"
                      >
                        <option value="Active">● Active (ක්‍රියාකාරී)</option>
                        <option value="Suspended">✕ Suspended (අත්හිටවූ)</option>
                        <option value="Banned">🚫 Banned (තහනම් කළ)</option>
                      </select>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-gray-800 flex justify-end">
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold rounded-xl transition shadow-md flex items-center space-x-2"
                    >
                      <Save className="w-4 h-4" />
                      <span>Save Profile Changes (සුරකින්න)</span>
                    </button>
                  </div>
                </form>
              )}

              {/* TAB 3: USER ADS */}
              {profileActiveTab === 'ads' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-extrabold text-sm text-white">
                      Advertisements by {selectedUserProfile.name} ({getUserAds(selectedUserProfile).length})
                    </h4>
                  </div>

                  {getUserAds(selectedUserProfile).length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {getUserAds(selectedUserProfile).map(ad => (
                        <div key={ad.id} className="bg-[#0f172a] border border-gray-800 rounded-xl p-3 flex space-x-3 hover:border-gray-700 transition">
                          <img
                            src={ad.image || 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=150'}
                            alt={ad.title}
                            className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0 space-y-1">
                            <div className="flex items-center justify-between">
                              <span className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded ${
                                ad.badgeType === 'VIP Ad'
                                  ? 'bg-red-500 text-white'
                                  : ad.badgeType === 'Super Ad'
                                  ? 'bg-amber-500 text-white'
                                  : 'bg-blue-600 text-white'
                              }`}>
                                {ad.badgeType || 'Normal Ad'}
                              </span>
                              <span className="text-[10px] font-mono text-emerald-400 font-bold">
                                {ad.price || 'Free'}
                              </span>
                            </div>
                            <h5 className="font-bold text-xs text-white truncate">{ad.title}</h5>
                            <p className="text-[10px] text-gray-400">{ad.location} • {ad.category}</p>

                            <div className="flex items-center space-x-2 pt-1 border-t border-gray-800">
                              <button
                                type="button"
                                onClick={() => setEditingAd(ad)}
                                className="text-[10px] text-blue-400 hover:text-blue-300 font-bold"
                              >
                                Edit Ad
                              </button>
                              <span className="text-gray-600">•</span>
                              <button
                                type="button"
                                onClick={() => onMarkFakeAd && onMarkFakeAd(ad.id)}
                                className="text-[10px] text-amber-400 hover:text-amber-300 font-bold"
                              >
                                Flag Fake
                              </button>
                              <span className="text-gray-600">•</span>
                              <button
                                type="button"
                                onClick={() => onDeleteAd && onDeleteAd(ad.id)}
                                className="text-[10px] text-red-400 hover:text-red-300 font-bold"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-[#0f172a] border border-gray-800 rounded-xl p-8 text-center text-gray-500">
                      <FileSpreadsheet className="w-8 h-8 mx-auto mb-2 text-gray-600" />
                      <p className="font-bold">No advertisements found for this user.</p>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 4: ADMIN NOTES & ACCESS */}
              {profileActiveTab === 'notes' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-300 font-bold mb-1">
                      Internal Admin Notes (පරිපාලක සටහන් - Only visible to admin)
                    </label>
                    <textarea
                      rows={4}
                      value={selectedUserProfile.notes || ''}
                      onChange={(e) => setSelectedUserProfile({ ...selectedUserProfile, notes: e.target.value })}
                      placeholder="Write private notes about this user, phone verification details, payment history, etc..."
                      className="w-full bg-[#0f172a] border border-gray-700 rounded-xl p-3 text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div className="bg-red-950/20 border border-red-900/40 rounded-xl p-4 space-y-3">
                    <h5 className="font-bold text-red-400 text-xs flex items-center space-x-2">
                      <AlertTriangle className="w-4 h-4" />
                      <span>Security & Danger Zone</span>
                    </h5>
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => handleToggleUserStatus(selectedUserProfile.id, selectedUserProfile.status === 'Active' ? 'Suspended' : 'Active')}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                          selectedUserProfile.status === 'Active'
                            ? 'bg-amber-600 hover:bg-amber-500 text-white'
                            : 'bg-green-600 hover:bg-green-500 text-white'
                        }`}
                      >
                        {selectedUserProfile.status === 'Active' ? 'Suspend Account (අත්හිටුවන්න)' : 'Reactivate Account (නැවත සක්‍රිය කරන්න)'}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteUser(selectedUserProfile.id)}
                        className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-bold transition"
                      >
                        Delete User Account (ගිණුම මකන්න)
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-end pt-2 border-t border-gray-800">
                    <button
                      type="button"
                      onClick={handleSaveProfileChanges}
                      className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold rounded-xl transition shadow-md"
                    >
                      Save Notes (සටහන් සුරකින්න)
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* QUICK CREDIT ADJUSTMENT MODAL */}
      {creditModalUser && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#1e293b] border border-gray-700 rounded-2xl w-full max-w-md shadow-2xl p-5 space-y-4 text-xs animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-gray-800 pb-3">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <Wallet className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-white">Adjust Credits (ක්‍රෙඩිට්)</h3>
                  <p className="text-[11px] text-gray-400">{creditModalUser.name} ({creditModalUser.id})</p>
                </div>
              </div>
              <button
                onClick={() => setCreditModalUser(null)}
                className="text-gray-400 hover:text-white p-1"
              >
                ✕
              </button>
            </div>

            {/* Current Balance */}
            <div className="bg-[#0f172a] p-3 rounded-xl border border-gray-800 flex items-center justify-between">
              <span className="text-gray-400 font-semibold">Current Balance:</span>
              <span className="font-mono font-black text-sm text-emerald-400">
                Rs. {(creditModalUser.credits || 0).toLocaleString()}.00
              </span>
            </div>

            <form onSubmit={handleQuickCreditSubmit} className="space-y-3.5">
              <div>
                <label className="block font-bold text-gray-300 mb-1">Action</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setCreditType('add')}
                    className={`py-2 px-3 rounded-xl font-bold transition flex items-center justify-center space-x-1.5 ${
                      creditType === 'add'
                        ? 'bg-emerald-600 text-white shadow-md'
                        : 'bg-[#0f172a] text-gray-400 hover:text-white'
                    }`}
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>Add Credits (+)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setCreditType('deduct')}
                    className={`py-2 px-3 rounded-xl font-bold transition flex items-center justify-center space-x-1.5 ${
                      creditType === 'deduct'
                        ? 'bg-red-600 text-white shadow-md'
                        : 'bg-[#0f172a] text-gray-400 hover:text-white'
                    }`}
                  >
                    <UserX className="w-4 h-4" />
                    <span>Deduct (-)</span>
                  </button>
                </div>
              </div>

              {/* Presets */}
              <div>
                <label className="block font-bold text-gray-400 mb-1 text-[11px]">Presets</label>
                <div className="grid grid-cols-4 gap-1.5">
                  {[500, 700, 1500, 5000].map(amt => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setCreditAmount(amt.toString())}
                      className={`py-1.5 rounded-lg font-mono font-bold text-xs border text-center transition ${
                        creditAmount === amt.toString()
                          ? 'bg-emerald-600 border-emerald-500 text-white'
                          : 'bg-[#0f172a] border-gray-700 text-gray-300 hover:border-gray-500'
                      }`}
                    >
                      {amt >= 1000 ? `${amt / 1000}k` : amt}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-300 mb-1">Amount (Rs.)</label>
                <input
                  type="number"
                  required
                  min="1"
                  step="1"
                  value={creditAmount}
                  onChange={(e) => setCreditAmount(e.target.value)}
                  className="w-full bg-[#0f172a] border border-gray-700 rounded-xl p-2.5 text-white font-mono font-bold focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-300 mb-1">Note / Reference (හේතුව)</label>
                <input
                  type="text"
                  value={creditNote}
                  onChange={(e) => setCreditNote(e.target.value)}
                  placeholder="e.g. Bank deposit slip received"
                  className="w-full bg-[#0f172a] border border-gray-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="pt-2 border-t border-gray-800 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setCreditModalUser(null)}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-5 py-2 text-white font-extrabold rounded-xl shadow-md transition ${
                    creditType === 'add' ? 'bg-emerald-600 hover:bg-emerald-500' : 'bg-red-600 hover:bg-red-500'
                  }`}
                >
                  Confirm {creditType === 'add' ? 'Top-Up' : 'Deduction'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* REGISTER NEW USER MODAL */}
      {isNewUserModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#1e293b] border border-gray-700 rounded-2xl w-full max-w-lg shadow-2xl p-5 sm:p-6 space-y-4 text-xs animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-gray-800 pb-3">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm sm:text-base text-white">
                    Register New User (නව පරිශීලකයෙක් ලියාපදිංචි කිරීම)
                  </h3>
                  <p className="text-[11px] text-gray-400">Create a user profile with starting credits.</p>
                </div>
              </div>
              <button
                onClick={() => setIsNewUserModalOpen(false)}
                className="text-gray-400 hover:text-white p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateNewUser} className="space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-300 mb-1">Full Name (නම) *</label>
                  <input
                    type="text"
                    required
                    value={newUserData.name}
                    onChange={(e) => setNewUserData({ ...newUserData, name: e.target.value })}
                    placeholder="e.g. Kasun Perera"
                    className="w-full bg-[#0f172a] border border-gray-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-300 mb-1">Phone Number (දුරකථන අංකය) *</label>
                  <input
                    type="text"
                    required
                    value={newUserData.phone}
                    onChange={(e) => setNewUserData({ ...newUserData, phone: e.target.value })}
                    placeholder="e.g. +94 77 123 4567"
                    className="w-full bg-[#0f172a] border border-gray-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-300 mb-1">Email (විද්‍යුත් තැපෑල)</label>
                  <input
                    type="email"
                    value={newUserData.email}
                    onChange={(e) => setNewUserData({ ...newUserData, email: e.target.value })}
                    placeholder="e.g. user@example.com"
                    className="w-full bg-[#0f172a] border border-gray-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-300 mb-1">Location / City (නගරය)</label>
                  <input
                    type="text"
                    value={newUserData.location}
                    onChange={(e) => setNewUserData({ ...newUserData, location: e.target.value })}
                    placeholder="e.g. Colombo"
                    className="w-full bg-[#0f172a] border border-gray-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-300 mb-1">Role</label>
                  <select
                    value={newUserData.role}
                    onChange={(e) => setNewUserData({ ...newUserData, role: e.target.value })}
                    className="w-full bg-[#0f172a] border border-gray-700 rounded-xl p-2.5 text-white focus:outline-none"
                  >
                    <option value="Advertiser">Advertiser (දැන්වීම්කරු)</option>
                    <option value="Verified Advertiser">Verified Advertiser (සත්‍යාපිත)</option>
                    <option value="VIP Partner">VIP Partner (විශේෂ)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-gray-300 mb-1">Initial Starting Credits (Rs.)</label>
                  <input
                    type="number"
                    min="0"
                    step="100"
                    value={newUserData.initialCredits}
                    onChange={(e) => setNewUserData({ ...newUserData, initialCredits: e.target.value })}
                    placeholder="1500"
                    className="w-full bg-[#0f172a] border border-gray-700 rounded-xl p-2.5 text-white font-mono font-bold focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-300 mb-1">Admin Notes (අමතර සටහන්)</label>
                <textarea
                  rows={2}
                  value={newUserData.notes}
                  onChange={(e) => setNewUserData({ ...newUserData, notes: e.target.value })}
                  placeholder="Internal notes about this user..."
                  className="w-full bg-[#0f172a] border border-gray-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="pt-3 border-t border-gray-800 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsNewUserModalOpen(false)}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold rounded-xl shadow-md transition"
                >
                  Create User (ලියාපදිංචි කරන්න)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD / EDIT BLOG POST MODAL */}
      {isBlogModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#1e293b] border border-gray-700 rounded-2xl w-full max-w-2xl max-h-[92vh] overflow-y-auto shadow-2xl p-5 sm:p-6 space-y-4 text-xs text-gray-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-gray-700 pb-3">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 bg-rose-500/10 rounded-xl text-rose-400 border border-rose-500/20">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm sm:text-base text-white">
                    {editingBlogPost ? `Edit Blog Post #${editingBlogPost.id}` : 'Create New Highlighted Blog Post'}
                  </h3>
                  <p className="text-[11px] text-gray-400">Add an article, guide, promotion or external blog link to the side drawer.</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsBlogModalOpen(false)}
                className="text-gray-400 hover:text-white p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitBlogPost} className="space-y-4">
              {/* Titles */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block font-bold text-gray-300 mb-1">Post Title (English)</label>
                  <input
                    type="text"
                    required
                    value={blogFormData.title}
                    onChange={(e) => setBlogFormData({ ...blogFormData, title: e.target.value })}
                    placeholder="e.g. Complete Guide to Spa Services in Colombo"
                    className="w-full bg-[#0f172a] border border-gray-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-[#f03a5f]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-300 mb-1">Post Title (Sinhala / සිංහල)</label>
                  <input
                    type="text"
                    value={blogFormData.titleSin}
                    onChange={(e) => setBlogFormData({ ...blogFormData, titleSin: e.target.value })}
                    placeholder="e.g. කොළඹ ස්පා සහ සත්කාරක සේවා පිළිබඳ සම්පූර්ණ මගපෙන්වීම"
                    className="w-full bg-[#0f172a] border border-gray-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-[#f03a5f]"
                  />
                </div>
              </div>

              {/* Category, Badge, Author */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-gray-300 mb-1">Category / Tag</label>
                  <input
                    type="text"
                    value={blogFormData.category}
                    onChange={(e) => setBlogFormData({ ...blogFormData, category: e.target.value })}
                    placeholder="Featured Guide / Safety Tips / Promo"
                    className="w-full bg-[#0f172a] border border-gray-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-[#f03a5f]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-300 mb-1">Highlight Badge</label>
                  <input
                    type="text"
                    value={blogFormData.badge}
                    onChange={(e) => setBlogFormData({ ...blogFormData, badge: e.target.value })}
                    placeholder="⭐ Admin Highlight / 🔥 Hot Post"
                    className="w-full bg-[#0f172a] border border-gray-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-[#f03a5f]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-300 mb-1">Author / Reading Time</label>
                  <input
                    type="text"
                    value={blogFormData.readTime}
                    onChange={(e) => setBlogFormData({ ...blogFormData, readTime: e.target.value })}
                    placeholder="3 min read"
                    className="w-full bg-[#0f172a] border border-gray-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-[#f03a5f]"
                  />
                </div>
              </div>

              {/* Cover Image (Browser Device Upload + Web URL Input + Live Preview) */}
              <div className="bg-[#0f172a] border border-gray-700/80 rounded-2xl p-4 space-y-3.5">
                <div className="flex items-center justify-between">
                  <label className="block font-bold text-gray-200 text-xs flex items-center space-x-2">
                    <ImageIcon className="w-4 h-4 text-rose-400" />
                    <span>Cover Image (කවර පින්තූරය - Browser File Upload හෝ Web URL)</span>
                  </label>
                  {blogFormData.imageUrl && (
                    <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950/60 border border-emerald-800 px-2 py-0.5 rounded-full flex items-center space-x-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      <span>{blogFormData.imageUrl.startsWith('data:') ? 'Device File Upload' : 'Image Set'}</span>
                    </span>
                  )}
                </div>

                {/* Dual Input Area: File Browser Button + Web URL */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* 1. Device File Browser */}
                  <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-700 hover:border-[#f03a5f] bg-[#1e293b]/60 hover:bg-[#1e293b] rounded-xl p-3.5 cursor-pointer transition text-center group">
                    <Upload className="w-5 h-5 text-gray-400 group-hover:text-[#f03a5f] mb-1.5 transition" />
                    <span className="text-xs font-bold text-gray-200 group-hover:text-white">
                      Upload from Device / Computer
                    </span>
                    <span className="text-[10px] text-gray-400 mt-0.5">
                      (Click to browse PNG, JPG, WEBP)
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          handleFileUploadAsDataUrl(file, (dataUrl) => {
                            setBlogFormData({ ...blogFormData, imageUrl: dataUrl });
                            onShowToast && onShowToast('Cover image loaded from device!');
                          });
                        }
                      }}
                    />
                  </label>

                  {/* 2. Web URL input */}
                  <div className="flex flex-col justify-center space-y-1.5 bg-[#1e293b]/60 border border-gray-700 rounded-xl p-3">
                    <span className="text-[11px] font-bold text-gray-300 flex items-center space-x-1.5">
                      <LinkIcon className="w-3 h-3 text-rose-400" />
                      <span>Or Enter Web Image URL:</span>
                    </span>
                    <input
                      type="url"
                      value={blogFormData.imageUrl}
                      onChange={(e) => setBlogFormData({ ...blogFormData, imageUrl: e.target.value })}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full bg-[#0f172a] border border-gray-700 rounded-lg p-2 text-white focus:outline-none focus:border-[#f03a5f] text-xs font-mono"
                    />
                    <span className="text-[9px] text-gray-400">Direct image link (Unsplash, Imgur, Web CDN)</span>
                  </div>
                </div>

                {/* Live Image Preview Card */}
                {blogFormData.imageUrl && (
                  <div className="relative rounded-xl overflow-hidden border border-gray-700 bg-[#1e293b]/90 p-2.5 flex items-center justify-between gap-3 shadow-inner">
                    <div className="flex items-center space-x-3 min-w-0">
                      <img
                        src={blogFormData.imageUrl}
                        alt="Cover Preview"
                        className="w-20 h-14 sm:w-24 sm:h-16 object-cover rounded-lg border border-gray-600 shrink-0 bg-black"
                        onError={(e) => {
                          e.target.src = "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&fit=crop&q=80";
                        }}
                      />
                      <div className="min-w-0">
                        <div className="flex items-center space-x-2">
                          <span className="text-[11px] font-bold text-emerald-400 flex items-center space-x-1">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Preview Active</span>
                          </span>
                          <span className="text-[9px] px-2 py-0.5 rounded-full bg-slate-800 text-gray-300 font-mono">
                            {blogFormData.imageUrl.startsWith('data:') ? 'Local Device Upload' : 'Web URL'}
                          </span>
                        </div>
                        <p className="text-[10px] text-gray-400 truncate mt-1 max-w-xs font-mono">
                          {blogFormData.imageUrl.startsWith('data:') ? 'Base64 image loaded and ready' : blogFormData.imageUrl}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setBlogFormData({ ...blogFormData, imageUrl: '' })}
                      className="text-gray-400 hover:text-red-400 p-2 rounded-lg hover:bg-red-500/10 transition shrink-0"
                      title="Clear image"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}

                {/* Presets Row */}
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <span className="text-[10px] text-gray-400 font-bold">Quick Presets:</span>
                  {[
                    { label: 'Spa & Wellness', url: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&fit=crop&q=80' },
                    { label: 'Security & Safety', url: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&fit=crop&q=80' },
                    { label: 'Business Growth', url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&fit=crop&q=80' },
                    { label: 'Hotel & Travel', url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&fit=crop&q=80' },
                    { label: 'Beauty & Salon', url: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&fit=crop&q=80' }
                  ].map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setBlogFormData({ ...blogFormData, imageUrl: preset.url })}
                      className={`text-[10px] px-2.5 py-1 rounded-lg border transition ${
                        blogFormData.imageUrl === preset.url
                          ? 'bg-rose-500/20 border-rose-500 text-rose-300 font-bold'
                          : 'bg-[#1e293b] border-gray-700 text-gray-300 hover:border-rose-400 hover:text-white'
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Excerpt / Summary */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block font-bold text-gray-300 mb-1">Short Excerpt (English)</label>
                  <textarea
                    rows={2}
                    required
                    value={blogFormData.excerpt}
                    onChange={(e) => setBlogFormData({ ...blogFormData, excerpt: e.target.value })}
                    placeholder="Brief summary to display on the card..."
                    className="w-full bg-[#0f172a] border border-gray-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-[#f03a5f]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-300 mb-1">Short Excerpt (Sinhala / සිංහල)</label>
                  <textarea
                    rows={2}
                    value={blogFormData.excerptSin}
                    onChange={(e) => setBlogFormData({ ...blogFormData, excerptSin: e.target.value })}
                    placeholder="සිංහල කෙටි විස්තරය..."
                    className="w-full bg-[#0f172a] border border-gray-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-[#f03a5f]"
                  />
                </div>
              </div>

              {/* Full Article Content */}
              <div>
                <label className="block font-bold text-gray-300 mb-1">
                  Full Article Body Content (සම්පූර්ණ ලිපිය - Reader එකේ පෙන්වීම සඳහා)
                </label>
                <textarea
                  rows={5}
                  value={blogFormData.content}
                  onChange={(e) => setBlogFormData({ ...blogFormData, content: e.target.value })}
                  placeholder="Write or paste full article paragraphs here. This will be readable inside the slide-out reader..."
                  className="w-full bg-[#0f172a] border border-gray-700 rounded-xl p-3 text-white focus:outline-none focus:border-[#f03a5f]"
                />
              </div>

              {/* External Link URL */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block font-bold text-gray-300 mb-1">
                    External Blog / Article Link (වෙනත් Website / Blog Link එකක්)
                  </label>
                  <input
                    type="url"
                    value={blogFormData.linkUrl}
                    onChange={(e) => setBlogFormData({ ...blogFormData, linkUrl: e.target.value })}
                    placeholder="https://myblog.com/post-url (optional)"
                    className="w-full bg-[#0f172a] border border-gray-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-[#f03a5f]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-300 mb-1">Button Text</label>
                  <input
                    type="text"
                    value={blogFormData.actionButtonText}
                    onChange={(e) => setBlogFormData({ ...blogFormData, actionButtonText: e.target.value })}
                    placeholder="Read Article / ලිපිය බලන්න"
                    className="w-full bg-[#0f172a] border border-gray-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-[#f03a5f]"
                  />
                </div>
              </div>

              {/* Toggles */}
              <div className="flex flex-wrap items-center gap-4 pt-1 bg-[#0f172a] p-3 rounded-xl border border-gray-800">
                <label className="inline-flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={blogFormData.isPrimary}
                    onChange={(e) => setBlogFormData({ ...blogFormData, isPrimary: e.target.checked })}
                    className="rounded text-amber-500 focus:ring-amber-500"
                  />
                  <span className="text-gray-200 font-bold flex items-center space-x-1">
                    <Star className="w-3.5 h-3.5 text-amber-400 fill-current" />
                    <span>Set as #1 Primary Highlight Card (ඉහළින්ම පෙන්වන්න)</span>
                  </span>
                </label>

                <label className="inline-flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={blogFormData.isActive}
                    onChange={(e) => setBlogFormData({ ...blogFormData, isActive: e.target.checked })}
                    className="rounded text-green-500 focus:ring-green-500"
                  />
                  <span className="text-gray-200 font-bold">Publish Live (සජීවීව පෙන්වන්න)</span>
                </label>
              </div>

              <div className="pt-3 border-t border-gray-800 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsBlogModalOpen(false)}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#f03a5f] hover:bg-[#d92348] text-white font-extrabold rounded-xl shadow-md transition"
                >
                  {editingBlogPost ? 'Save Changes (සුරකින්න)' : 'Publish Post (පළ කරන්න)'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Custom Validity / Extension Modal */}
      {extensionModalAd && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#1e293b] border border-gray-700 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-gray-800 pb-3">
              <div className="flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-white text-base">
                  {getAdValidity(extensionModalAd).isExpired ? 'Re-activate Ad (නැවත සක්‍රීය කරන්න)' : 'Extend Expiry Date (වලංගු කාලය දීර්ඝ කරන්න)'}
                </h3>
              </div>
              <button
                onClick={() => setExtensionModalAd(null)}
                className="text-gray-400 hover:text-white p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-[#0f172a] p-3 rounded-xl border border-gray-800 space-y-1">
              <p className="text-xs font-bold text-white line-clamp-1">{extensionModalAd.title}</p>
              <div className="flex items-center space-x-2 text-[11px] text-gray-400">
                <span>Ad #{extensionModalAd.id}</span>
                <span>•</span>
                <span>Phone: {extensionModalAd.phone}</span>
              </div>
              <p className="text-[11px] text-gray-300">
                Current Status:{' '}
                {getAdValidity(extensionModalAd).isExpired ? (
                  <span className="text-rose-400 font-bold">⏰ Expired (කල් ඉකුත් වී ඇත)</span>
                ) : (
                  <span className="text-green-400 font-bold">Active until {getAdValidity(extensionModalAd).formattedExpiry}</span>
                )}
              </p>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-bold text-gray-300 block">
                Select Duration (කාලය තෝරන්න):
              </label>

              {/* Quick Presets */}
              <div className="grid grid-cols-4 gap-2">
                {[1, 3, 5, 7, 10, 15, 30, 60].map(d => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => {
                      setExtensionDaysInput(d);
                      setExtensionDateInput('');
                    }}
                    className={`py-1.5 px-2 rounded-lg text-xs font-black transition cursor-pointer border ${
                      !extensionDateInput && extensionDaysInput === d
                        ? 'bg-[#f03a5f] border-[#f03a5f] text-white shadow-xs'
                        : 'bg-gray-800 border-gray-700 text-gray-300 hover:border-gray-500'
                    }`}
                  >
                    +{d} Days
                  </button>
                ))}
              </div>

              {/* Custom number of days */}
              <div>
                <label className="text-[11px] text-gray-400 block mb-1">
                  Or enter any custom number of days (කැමති දින ගණන):
                </label>
                <div className="flex items-center space-x-2 bg-gray-900 border border-gray-700 rounded-xl p-2">
                  <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                  <input
                    type="number"
                    min="1"
                    max="365"
                    value={extensionDaysInput}
                    onChange={(e) => {
                      setExtensionDaysInput(Math.max(1, parseInt(e.target.value) || 1));
                      setExtensionDateInput('');
                    }}
                    placeholder="e.g. 12"
                    className="bg-transparent text-white font-bold text-sm w-full focus:outline-none"
                  />
                  <span className="text-xs text-gray-400 font-bold">Days</span>
                </div>
              </div>

              {/* Pick exact date */}
              <div>
                <label className="text-[11px] text-gray-400 block mb-1">
                  Or pick exact expiry date from calendar (කැලැන්ඩරයෙන් දිනයක් තෝරන්න):
                </label>
                <div className="flex items-center space-x-2 bg-gray-900 border border-gray-700 rounded-xl p-2">
                  <Calendar className="w-4 h-4 text-amber-400 shrink-0" />
                  <input
                    type="date"
                    min={formatDateForDateInput(new Date())}
                    value={extensionDateInput}
                    onChange={(e) => setExtensionDateInput(e.target.value)}
                    className="bg-transparent text-white font-bold text-sm w-full focus:outline-none cursor-pointer"
                  />
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-gray-800 flex items-center justify-end space-x-2">
              <button
                type="button"
                onClick={() => setExtensionModalAd(null)}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  const param = extensionDateInput ? extensionDateInput : extensionDaysInput;
                  onRenewAd && onRenewAd(extensionModalAd.id, param);
                  setExtensionModalAd(null);
                }}
                className="px-5 py-2 bg-green-600 hover:bg-green-500 text-white rounded-xl text-xs font-extrabold shadow-sm transition cursor-pointer"
              >
                {getAdValidity(extensionModalAd).isExpired ? '✓ Re-activate Ad Now' : '✓ Extend Expiration'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Payment Slip Inspection Modal (High-Fidelity Executive Suite) */}
      {inspectingSlipAd && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
          <div className="bg-[#141e33] border border-gray-700/90 rounded-2xl max-w-4xl w-full overflow-hidden shadow-2xl flex flex-col max-h-[94vh]">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-800/90 bg-gradient-to-r from-[#0b1329] via-[#0f172a] to-[#0b1329]">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/30 text-[#f03a5f]">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="font-black text-sm sm:text-base text-white">
                      Bank Payment Slip Verification
                    </h3>
                    <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md ${
                      isPdfSlip(inspectingSlipAd.paymentSlip)
                        ? 'bg-red-500/20 text-red-300 border border-red-500/40'
                        : 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                    }`}>
                      {isPdfSlip(inspectingSlipAd.paymentSlip) ? '📑 PDF Document' : '🖼️ Photo / Image Slip'}
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-400 mt-0.5">
                    Ad #{inspectingSlipAd.id} • {inspectingSlipAd.title} • {inspectingSlipAd.phone}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <a
                  href={inspectingSlipAd.paymentSlip}
                  target="_blank"
                  rel="noreferrer"
                  className="hidden sm:inline-flex items-center space-x-1 px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-200 rounded-xl text-xs font-bold border border-gray-700 transition"
                  title="Open document in a separate browser tab"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>New Tab</span>
                </a>
                <button
                  type="button"
                  onClick={() => setInspectingSlipAd(null)}
                  className="text-gray-400 hover:text-white p-2 rounded-xl hover:bg-gray-800/80 transition cursor-pointer"
                  title="Close modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1">
              {/* Slip Inspection Canvas */}
              <div className="bg-[#070b14] border border-gray-800 rounded-2xl overflow-hidden shadow-inner flex flex-col">
                {/* Canvas Top Action Bar */}
                <div className="px-3.5 py-2 bg-gray-900/90 border-b border-gray-800/80 flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2 text-gray-300 font-medium text-[11px]">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                    <span>Official Bank Deposit Receipt Preview</span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <a
                      href={inspectingSlipAd.paymentSlip}
                      target="_blank"
                      rel="noreferrer"
                      className="px-2.5 py-1 bg-gray-800 hover:bg-gray-700 text-gray-200 rounded-lg text-[11px] font-bold transition flex items-center space-x-1"
                    >
                      <ExternalLink className="w-3 h-3" />
                      <span>Full View</span>
                    </a>
                    <a
                      href={inspectingSlipAd.paymentSlip}
                      target="_blank"
                      rel="noreferrer"
                      download={`bank-slip-${inspectingSlipAd.id || 'receipt'}.${isPdfSlip(inspectingSlipAd.paymentSlip) ? 'pdf' : 'jpg'}`}
                      className="px-2.5 py-1 bg-gray-800 hover:bg-gray-700 text-gray-200 rounded-lg text-[11px] font-bold transition flex items-center space-x-1"
                    >
                      <Download className="w-3 h-3" />
                      <span>Download</span>
                    </a>
                  </div>
                </div>

                {/* Canvas Viewer */}
                <div className="h-[52vh] min-h-[380px] max-h-[540px] w-full relative flex items-center justify-center bg-gray-950">
                  {isPdfSlip(inspectingSlipAd.paymentSlip) ? (
                    <iframe
                      src={inspectingSlipAd.paymentSlip}
                      title="PDF Payment Slip"
                      className="w-full h-full border-0 bg-white"
                    />
                  ) : (
                    <div className="w-full h-full overflow-auto flex items-center justify-center p-3">
                      <img
                        src={inspectingSlipAd.paymentSlip}
                        alt="Bank Payment Slip"
                        className="max-h-[48vh] max-w-full object-contain rounded-xl shadow-2xl"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Transaction & Ad Summary Cards (4 Metrics Grid) */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                {/* 1. Expected Amount */}
                <div className="bg-[#0b1329] p-3.5 rounded-xl border border-gray-800 shadow-sm flex flex-col justify-between">
                  <span className="text-[10px] text-gray-400 block font-bold uppercase tracking-wider">Amount to Verify</span>
                  <div className="mt-1">
                    <strong className="text-emerald-400 block font-mono text-base sm:text-lg font-black">
                      {inspectingSlipAd.price || `Rs. ${inspectingSlipAd.paymentAmount || 1500}`}
                    </strong>
                    <span className="text-[10px] text-amber-300 font-medium">
                      Status: {inspectingSlipAd.paymentStatus || 'Pending'}
                    </span>
                  </div>
                </div>

                {/* 2. Payment Method & Ref */}
                <div className="bg-[#0b1329] p-3.5 rounded-xl border border-gray-800 shadow-sm flex flex-col justify-between">
                  <span className="text-[10px] text-gray-400 block font-bold uppercase tracking-wider">Payment Method</span>
                  <div className="mt-1">
                    <strong className="text-blue-400 block font-bold truncate">
                      {inspectingSlipAd.paymentMethod || 'Bank Transfer'}
                    </strong>
                    <span className="text-[10px] text-gray-300 font-mono block truncate">
                      Ref: <span className="text-amber-300 font-bold">{inspectingSlipAd.paymentRef || 'Not specified'}</span>
                    </span>
                  </div>
                </div>

                {/* 3. Advertiser Contact */}
                <div className="bg-[#0b1329] p-3.5 rounded-xl border border-gray-800 shadow-sm flex flex-col justify-between">
                  <span className="text-[10px] text-gray-400 block font-bold uppercase tracking-wider">Advertiser Contact</span>
                  <div className="mt-1">
                    <strong className="text-white block font-mono font-bold">
                      {inspectingSlipAd.phone}
                    </strong>
                    <a
                      href={`https://wa.me/${(inspectingSlipAd.phone || '').replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[10px] text-emerald-400 hover:underline flex items-center space-x-1 mt-0.5"
                    >
                      <MessageCircle className="w-3 h-3" />
                      <span>Chat on WhatsApp</span>
                    </a>
                  </div>
                </div>

                {/* 4. Submission Details */}
                <div className="bg-[#0b1329] p-3.5 rounded-xl border border-gray-800 shadow-sm flex flex-col justify-between">
                  <span className="text-[10px] text-gray-400 block font-bold uppercase tracking-wider">Submitted Date</span>
                  <div className="mt-1">
                    <span className="text-gray-300 text-[11px] block font-medium">
                      {inspectingSlipAd.submittedAt || inspectingSlipAd.createdAt
                        ? new Date(inspectingSlipAd.submittedAt || inspectingSlipAd.createdAt).toLocaleString('en-GB')
                        : 'N/A'}
                    </span>
                    <span className="text-[10px] text-purple-300 font-bold block mt-0.5">
                      Badge: {inspectingSlipAd.badgeType}
                    </span>
                  </div>
                </div>
              </div>

              {/* Validity Days Picker for Approval */}
              <div className="bg-[#0b1329] border border-gray-800 p-3.5 rounded-xl space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-300 flex items-center space-x-1.5">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    <span>Select Approval Validity Period (වලංගු කාලය තෝරන්න):</span>
                  </span>
                  <span className="text-xs font-mono font-bold text-emerald-400">
                    Selected: {slipValidityDays} Days
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {[1, 3, 5, 7, 10, 15, 30, 60, 90].map(d => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setSlipValidityDays(d)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition cursor-pointer ${
                        slipValidityDays === d
                          ? 'bg-[#f03a5f] text-white shadow-md shadow-red-950/50 scale-105'
                          : 'bg-gray-800/90 text-gray-400 hover:text-white hover:bg-gray-700'
                      }`}
                    >
                      {d} Days
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer Actions */}
            <div className="p-4 border-t border-gray-800/90 bg-[#0b1329] flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                onClick={async () => {
                  const reason = await showPrompt({
                    title: 'Reject Payment Slip',
                    titleSin: 'රිසිට්පත ප්‍රතික්ෂේප කිරීම',
                    message: 'Enter reason for rejecting this payment slip:',
                    messageSin: 'රිසිට්පත ප්‍රතික්ෂේප කිරීමට හේතුව ඇතුළත් කරන්න:',
                    defaultValue: 'Invalid or unclear bank payment slip',
                    placeholder: 'e.g. Slip is unreadable / incorrect deposit amount',
                    confirmText: 'Reject Slip',
                    cancelText: 'Cancel'
                  });
                  if (reason) {
                    onRejectAd && onRejectAd(inspectingSlipAd.id, reason);
                    setInspectingSlipAd(null);
                  }
                }}
                className="px-4 py-2.5 bg-red-950/60 hover:bg-red-900/90 text-red-300 border border-red-800/80 rounded-xl text-xs font-bold transition flex items-center space-x-2 cursor-pointer shadow-sm"
              >
                <XCircle className="w-4 h-4" />
                <span>Reject Slip / Invalid (ප්‍රතික්ෂේප කරන්න)</span>
              </button>

              <div className="flex items-center space-x-2.5">
                <button
                  type="button"
                  onClick={() => setInspectingSlipAd(null)}
                  className="px-4 py-2.5 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl text-xs font-bold transition cursor-pointer"
                >
                  Close (වසන්න)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onApproveAd && onApproveAd(inspectingSlipAd.id, slipValidityDays);
                    setInspectingSlipAd(null);
                  }}
                  className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white rounded-xl text-xs font-black shadow-lg shadow-green-950/50 transition flex items-center space-x-2 cursor-pointer hover:scale-[1.02] active:scale-95"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>✓ Verify Payment & Approve Ad ({slipValidityDays} Days)</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
