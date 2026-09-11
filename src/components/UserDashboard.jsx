import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Trash2, 
  PlusCircle, 
  CreditCard, 
  KeyRound, 
  FileText, 
  Crown, 
  Sparkles, 
  Zap, 
  Building2, 
  MessageCircle, 
  Check, 
  X, 
  Copy, 
  Clock, 
  ThumbsUp, 
  Eye, 
  CheckCircle, 
  CheckCircle2, 
  Edit, 
  Power,
  Upload,
  Wallet,
  Flame,
  Star,
  CircleDot,
  AlertCircle,
  RefreshCw,
  Calendar
} from 'lucide-react';
import { useDialog } from '../context/DialogContext.jsx';
import { getAdValidity } from '../utils/adValidity.js';

export default function UserDashboard({ 
  onBack, 
  onAdCreated, 
  userAds = [], 
  onDeleteAd, 
  onUpdateAd, 
  initialTab = 'new-ad', 
  onShowToast,
  siteConfig = {},
  currentUser = null,
  onUseCredits,
  onRequestRenewal,
  onRenewAd
}) {
  const { showConfirm, showAlert, showPrompt } = useDialog();
  const [activeTab, setActiveTab] = useState(initialTab); // 'my-ads' | 'new-ad' | 'recover' | 'top-up'

  // Dynamic pricing & contact from Admin Settings
  const normalPrice = siteConfig?.pricing?.normalAd || 700;
  const superPrice = siteConfig?.pricing?.superAd || 1500;
  const vipPrice = siteConfig?.pricing?.vipAd || 10000;
  const storySpotPrice = siteConfig?.pricing?.storySpot || 2000;
  const adminWhatsapp = (siteConfig?.contact?.whatsapp || '94771234567').replace(/[^0-9]/g, '');
  const bankDetails = siteConfig?.bankDetails || {
    bankName: "Commercial Bank PLC",
    accountName: "Taizer Ads Advertising",
    accountNumber: "8001 2345 6789",
    branch: "Colombo City Branch",
  };

  // Story Spot Request Modal State
  const [requestStoryAd, setRequestStoryAd] = useState(null);
  const [storyOfferTag, setStoryOfferTag] = useState('🔥 50% OFF');
  const [storyOfferDetails, setStoryOfferDetails] = useState('');
  const [storyPaymentMethod, setStoryPaymentMethod] = useState('credits'); // 'credits' | 'direct'

  // Ad Validity Renewal Modal State
  const [renewalAd, setRenewalAd] = useState(null);
  const [renewalDays, setRenewalDays] = useState(5);
  const [renewalPaymentMode, setRenewalPaymentMode] = useState('credits'); // 'credits' | 'direct'
  
  // My Ads Filter sub-tab ('all' | 'active' | 'expired' | 'pending')
  const [myAdsFilter, setMyAdsFilter] = useState('all');
  
  // Form State
  const [type, setType] = useState('Super Ad');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [location, setLocation] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [phoneCode, setPhoneCode] = useState('+94');
  const [phone, setPhone] = useState('703670398');
  
  // Image handling
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  
  // Checkboxes
  const [availableWhatsapp, setAvailableWhatsapp] = useState(true);
  const [availableTelegram, setAvailableTelegram] = useState(true);
  const [availableImo, setAvailableImo] = useState(false);
  const [availableViber, setAvailableViber] = useState(false);

  // Top up state
  const [credits, setCredits] = useState(currentUser?.credits ?? 0);
  const [isBankModalOpen, setIsBankModalOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [uploadedSlip, setUploadedSlip] = useState(null);

  useEffect(() => {
    if (currentUser) {
      setCredits(currentUser.credits ?? 0);
    }
  }, [currentUser?.credits]);

  const handlePayWithCredits = async (packageName, cost) => {
    if (credits < cost) {
      showAlert({
        title: 'Insufficient Credits',
        titleSin: 'ප්‍රමාණවත් ක්‍රෙඩිට් නොමැත',
        message: `You need Rs. ${cost.toLocaleString()} credits to activate ${packageName}. Your current balance is Rs. ${credits.toLocaleString()}. Please contact Admin to top up your account.`,
        messageSin: `${packageName} සක්‍රිය කිරීමට රු. ${cost.toLocaleString()} ක ක්‍රෙඩිට් අවශ්‍යයි. ඔබගේ දැනට ඇති ශේෂය රු. ${credits.toLocaleString()} කි. කරුණාකර Admin සම්බන්ධ කරගන්න.`,
        type: 'warning'
      });
      return;
    }
    const confirmed = await showConfirm({
      title: `Activate ${packageName}`,
      titleSin: `${packageName} සක්‍රිය කරන්න`,
      message: `Deduct Rs. ${cost.toLocaleString()} from your wallet balance to activate ${packageName}?`,
      messageSin: `ඔබගේ ක්‍රෙඩිට් ශේෂයෙන් රු. ${cost.toLocaleString()} ක් අඩු කර ${packageName} සක්‍රිය කිරීමට අවශ්‍යද?`,
      type: 'info',
      confirmText: `Confirm & Pay (රු. ${cost.toLocaleString()})`,
      cancelText: 'Cancel'
    });
    if (confirmed) {
      let success = true;
      if (onUseCredits && currentUser) {
        success = onUseCredits(currentUser.id, cost, `Activated ${packageName}`);
      }
      if (success) {
        setCredits(prev => Math.max(0, prev - cost));
        showAlert({
          title: 'Package Activated!',
          titleSin: 'පැකේජය සාර්ථකව සක්‍රිය විය!',
          message: `Congratulations! ${packageName} has been activated using your wallet credits. New balance: Rs. ${Math.max(0, credits - cost).toLocaleString()}.00`,
          messageSin: `සුභ පැතුම්! ඔබගේ ක්‍රෙඩිට් භාවිතයෙන් ${packageName} සාර්ථකව සක්‍රිය විය. නව ශේෂය: රු. ${Math.max(0, credits - cost).toLocaleString()}.00`,
          type: 'success'
        });
      }
    }
  };

  // Story Spot Handlers
  const handleOpenStoryRequestModal = (ad) => {
    setRequestStoryAd(ad);
    setStoryOfferTag(ad.storyOfferTag || '🔥 50% OFF');
    setStoryOfferDetails(ad.storyOfferDetails || ad.title);
    setStoryPaymentMethod(credits >= storySpotPrice ? 'credits' : 'direct');
  };

  const handleCancelStoryRequest = async (ad) => {
    const confirmed = await showConfirm({
      title: 'Cancel Story Spot Request',
      titleSin: 'Story Spot ඉල්ලීම අවලංගු කිරීම',
      message: `Are you sure you want to cancel the Circular Story Spot request for "${ad.title}"?${ad.storyPaidWithCredits ? ` Rs. ${storySpotPrice.toLocaleString()} will be refunded to your wallet credits.` : ''}`,
      messageSin: `ඔබගේ "${ad.title}" දැන්වීමේ Story Spot ඉල්ලීම අවලංගු කිරීමට අවශ්‍යද?${ad.storyPaidWithCredits ? ` රු. ${storySpotPrice.toLocaleString()} ක මුදල නැවත ඔබගේ Wallet එකට බැර වනු ඇත.` : ''}`,
      type: 'warning'
    });
    if (confirmed) {
      if (ad.storyPaidWithCredits) {
        if (onUseCredits && currentUser) {
          onUseCredits(currentUser.id, -storySpotPrice, `Refund: Cancelled Story Spot request for Ad #${ad.id}`);
        }
        setCredits(prev => prev + storySpotPrice);
      }
      const updated = {
        ...ad,
        storySpotRequested: false,
        storyOfferTag: null,
        storyOfferDetails: null,
        storyPaidWithCredits: false
      };
      onUpdateAd && onUpdateAd(updated);
      onShowToast && onShowToast('Story spot request cancelled.');
    }
  };

  const handleSubmitStoryRequest = async (e) => {
    e?.preventDefault();
    if (!storyOfferTag.trim()) {
      await showAlert({
        title: 'Offer Tag Required',
        titleSin: 'විශේෂ දීමනා ලේබලය අවශ්‍යයි',
        message: 'Please enter a short special offer tag (e.g. 🔥 50% OFF or ⭐ Weekend Deal).',
        messageSin: 'කරුණාකර කෙටි විශේෂ දීමනා ලේබලයක් ඇතුළත් කරන්න.',
        type: 'warning'
      });
      return;
    }

    if (storyPaymentMethod === 'credits') {
      if (credits < storySpotPrice) {
        await showAlert({
          title: 'Insufficient Credits',
          titleSin: 'ක්‍රෙඩිට් ශේෂය ප්‍රමාණවත් නොවේ',
          message: `You need Rs. ${storySpotPrice.toLocaleString()} to activate this spot. Your balance is Rs. ${credits.toLocaleString()}. Please choose Contact Admin or top-up your wallet first.`,
          messageSin: `මෙම අවස්ථාව ලබා ගැනීමට රු. ${storySpotPrice.toLocaleString()} ක් අවශ්‍යයි. ඔබගේ දැනට ඇති ශේෂය රු. ${credits.toLocaleString()} කි. කරුණාකර Contact Admin තෝරන්න.`,
          type: 'warning'
        });
        return;
      }

      const confirmed = await showConfirm({
        title: 'Confirm Payment via Wallet',
        titleSin: 'ක්‍රෙඩිට් මගින් ගෙවීම තහවුරු කරන්න',
        message: `Deduct Rs. ${storySpotPrice.toLocaleString()} from your wallet balance to request Circular Story Spot? Admin will review and place your ad in the top circular bar.`,
        messageSin: `රු. ${storySpotPrice.toLocaleString()} ක් ඔබගේ Wallet ශේෂයෙන් අඩු කර Circular Story Spot එක ඉල්ලුම් කිරීමට අවශ්‍යද?`,
        type: 'info',
        confirmText: `Pay Rs. ${storySpotPrice.toLocaleString()}`,
        cancelText: 'Cancel'
      });
      if (!confirmed) return;

      if (onUseCredits && currentUser) {
        onUseCredits(currentUser.id, storySpotPrice, `Special Offer Story Spot for Ad #${requestStoryAd.id} (${storyOfferTag.trim()})`);
      }
      setCredits(prev => Math.max(0, prev - storySpotPrice));
    }

    const updated = {
      ...requestStoryAd,
      storySpotRequested: true,
      storyOfferTag: storyOfferTag.trim(),
      storyOfferDetails: storyOfferDetails.trim() || requestStoryAd.title,
      storyPaidWithCredits: storyPaymentMethod === 'credits',
      storyRequestedDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
    };

    onUpdateAd && onUpdateAd(updated);
    setRequestStoryAd(null);
    onShowToast && onShowToast('විශේෂ දීමනා ඉල්ලීම Admin වෙත යොමු කරන ලදී! (Story spot request submitted to Admin)');

    if (storyPaymentMethod === 'direct') {
      const msg = encodeURIComponent(`Hello Taizer Ads Admin, I have requested a Special Offer Story Spot for my ad "${updated.title}" (Ad ID: ${updated.id}). Offer Tag: ${updated.storyOfferTag}. Please find my payment transfer slip attached.`);
      window.open(`https://wa.me/${adminWhatsapp}?text=${msg}`, '_blank');
    }
  };

  // Ad Validity & Expiration Renewal Handlers
  const getRenewalCost = (ad, days) => {
    const isVip = ad?.badgeType === 'VIP Ad' || ad?.type === 'VIP Ad';
    const isSuper = ad?.badgeType === 'Super Ad' || ad?.type === 'Super Ad';
    if (days === 5) return isVip ? 500 : isSuper ? 350 : 200;
    if (days === 10) return isVip ? 900 : isSuper ? 600 : 350;
    if (days === 30) return isVip ? 2000 : isSuper ? 1400 : 800;
    return days * (isVip ? 80 : isSuper ? 60 : 40);
  };

  const handleOpenRenewalModal = (ad) => {
    setRenewalAd(ad);
    setRenewalDays(5);
    setRenewalPaymentMode(credits >= getRenewalCost(ad, 5) ? 'credits' : 'direct');
  };

  const handleConfirmRenewal = async (e) => {
    e?.preventDefault();
    if (!renewalAd) return;

    const cost = getRenewalCost(renewalAd, renewalDays);

    if (renewalPaymentMode === 'credits') {
      if (credits < cost) {
        await showAlert({
          title: 'Insufficient Credits',
          titleSin: 'ක්‍රෙඩිට් ශේෂය ප්‍රමාණවත් නොවේ',
          message: `You need Rs. ${cost.toLocaleString()} to renew this ad for ${renewalDays} days. Your current balance is Rs. ${credits.toLocaleString()}. Please choose WhatsApp Slip or top-up your wallet first.`,
          messageSin: `දැන්වීම දින ${renewalDays}කට අලුත් කිරීමට රු. ${cost.toLocaleString()} ක් අවශ්‍යයි. ඔබගේ දැනට ඇති ශේෂය රු. ${credits.toLocaleString()} කි. කරුණාකර WhatsApp මගින් ගෙවීම තෝරන්න.`,
          type: 'warning'
        });
        return;
      }

      const confirmed = await showConfirm({
        title: 'Confirm Ad Renewal',
        titleSin: 'දැන්වීම අලුත් කිරීම තහවුරු කරන්න',
        message: `Deduct Rs. ${cost.toLocaleString()} from your wallet to renew "${renewalAd.title}" for ${renewalDays} days?`,
        messageSin: `ඔබගේ Wallet ශේෂයෙන් රු. ${cost.toLocaleString()} ක් අඩු කර "${renewalAd.title}" දැන්වීම දින ${renewalDays}කට අලුත් කිරීමට අවශ්‍යද?`,
        type: 'info',
        confirmText: `Pay Rs. ${cost.toLocaleString()}`,
        cancelText: 'Cancel'
      });
      if (!confirmed) return;

      if (onUseCredits && currentUser) {
        onUseCredits(cost, `Renew Ad #${renewalAd.id} (${renewalDays} Days)`);
      }
      setCredits(prev => Math.max(0, prev - cost));

      if (onRenewAd) {
        onRenewAd(renewalAd.id, renewalDays);
      } else if (onRequestRenewal) {
        onRequestRenewal(renewalAd.id, renewalDays, true);
      }
      onShowToast && onShowToast(`දැන්වීම සාර්ථකව දින ${renewalDays}කට අලුත් කරන ලදී! (Ad renewed for ${renewalDays} days)`);
    } else {
      if (onRequestRenewal) {
        onRequestRenewal(renewalAd.id, renewalDays, false);
      }
      const msg = encodeURIComponent(`Hello Taizer Ads Admin, I want to renew my expired Ad on Taizer Ads:\n\nAd Title: "${renewalAd.title}"\nAd ID: ${renewalAd.id}\nRenewal Period: ${renewalDays} Days\nAmount: Rs. ${cost.toLocaleString()}\n\nI have attached my bank deposit/transfer slip. Please approve and reactivate my ad.`);
      window.open(`https://wa.me/${adminWhatsapp}?text=${msg}`, '_blank');
      onShowToast && onShowToast('අලුත් කිරීමේ ඉල්ලීම Admin වෙත යොමු කරන ලදී! WhatsApp මගින් Slip එක එවන්න.');
    }

    setRenewalAd(null);
  };

  // My Ads management state
  const [selectedAdIds, setSelectedAdIds] = useState([]);
  const [editingAd, setEditingAd] = useState(null);
  const [republishType, setRepublishType] = useState({});
  const [republishOption, setRepublishOption] = useState({});

  // Image change handler
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const objectUrl = URL.createObjectURL(file);
      setImagePreview(objectUrl);
    }
  };

  const handleEditImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file && editingAd) {
      const objectUrl = URL.createObjectURL(file);
      setEditingAd({ ...editingAd, image: objectUrl });
    }
  };

  const handleSaveEditAd = (e) => {
    e.preventDefault();
    if (!editingAd.title?.trim()) {
      showAlert({
        title: 'Title Required',
        titleSin: 'මාතෘකාව අවශ්‍යයි',
        message: 'Please enter a title for the advertisement.',
        type: 'warning'
      });
      return;
    }
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
    onUpdateAd && onUpdateAd(updated);
    setEditingAd(null);
    onShowToast && onShowToast('දැන්වීමේ වෙනස්කම් සාර්ථකව සුරකින ලදී! (Ad updated successfully!)');
  };

  // Form Submit: Creates ad with "Pending Approval"
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      await showAlert({
        title: 'Ad Title Required',
        titleSin: 'දැන්වීමේ මාතෘකාව අවශ්‍යයි',
        message: 'Please enter a title for your advertisement.',
        messageSin: 'කරුණාකර ඔබගේ දැන්වීම සඳහා මාතෘකාවක් ඇතුළත් කරන්න.',
        type: 'warning'
      });
      return;
    }
    if (!category) {
      await showAlert({
        title: 'Category Required',
        titleSin: 'වර්ගය (Category) තෝරන්න',
        message: 'Please select an appropriate category for your advertisement.',
        messageSin: 'කරුණාකර දැන්වීමට අදාළ Category එකක් තෝරන්න.',
        type: 'warning'
      });
      return;
    }
    if (!description.trim()) {
      await showAlert({
        title: 'Description Required',
        titleSin: 'විස්තරය අවශ්‍යයි',
        message: 'Please enter a description for your advertisement.',
        messageSin: 'කරුණාකර දැන්වීම පිළිබඳ කෙටි විස්තරයක් ඇතුළත් කරන්න.',
        type: 'warning'
      });
      return;
    }

    let cleanPhoneInput = (phone || '').toString().trim().replace(/[^0-9]/g, '');
    if (cleanPhoneInput.startsWith('0')) {
      cleanPhoneInput = cleanPhoneInput.substring(1);
    }
    const fullPhone = `${phoneCode}${cleanPhoneInput}`;
    const defaultImg = imagePreview || 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&auto=format&fit=crop&q=80';

    const newAd = {
      id: 'ad-' + Date.now(),
      badgeType: type,
      badgeColor: type === 'Super Ad' ? 'gold' : type === 'VIP Ad' ? 'red' : 'blue',
      likes: 0,
      likesDisplay: '0 Likes',
      views: '0 Views',
      postedTime: 'Just now',
      location: location || 'Colombo',
      categoryLabel: category,
      price: price ? `Rs. ${price}` : 'Rs. 1,500.00',
      isTopBanner: false,
      cashBack: true,
      realImage: true,
      verifiedSeller: true,
      title: title.trim(),
      category: category.toLowerCase().replace(/\s+/g, ''),
      rating: type === 'Super Ad' ? '★★★★★ (Score: 10/10)' : null,
      phone: fullPhone,
      whatsapp: availableWhatsapp ? fullPhone : null,
      telegram: availableTelegram ? fullPhone : null,
      imo: availableImo ? fullPhone : null,
      viber: availableViber ? fullPhone : null,
      image: defaultImg,
      description: description.trim(),
      packages: [
        `⭐ ${title.toUpperCase()} ⭐`,
        `⭐ Location: ${location || 'Colombo'}`,
        `⭐ Price: ${price ? `Rs. ${price}` : 'Rs. 1,500.00'}`,
        `⭐ 24 Hours Service Line Available`,
        "",
        `✨ DESCRIPTION & PACKAGES ✨`,
        description.trim()
      ],
      isSaved: false,
      isFake: false,
      isUserAd: true,
      userId: currentUser?.id || '',
      userName: currentUser?.name || currentUser?.phone || 'Advertiser',
      userPhone: currentUser?.phone || fullPhone,
      status: 'Pending Approval', // Initially Pending Approval as requested by user
      isActive: true
    };

    onAdCreated(newAd);
    onShowToast && onShowToast('දැන්වීම Admin Approval සඳහා සාර්ථකව යොමු කරන ලදී!');

    // Reset Form & Switch to My Ads tab
    setTitle('');
    setLocation('');
    setPrice('');
    setDescription('');
    setSelectedFile(null);
    setImagePreview('');
    setActiveTab('my-ads');
  };

  // Filtered User Ads by Status
  const expiredCount = userAds.filter(a => getAdValidity(a).isExpired).length;
  const activeCount = userAds.filter(a => a.status === 'Approved' && !getAdValidity(a).isExpired).length;
  const pendingCount = userAds.filter(a => a.status === 'Pending Approval').length;

  const filteredUserAds = userAds.filter(a => {
    const validity = getAdValidity(a);
    if (myAdsFilter === 'active') return a.status === 'Approved' && !validity.isExpired;
    if (myAdsFilter === 'expired') return validity.isExpired;
    if (myAdsFilter === 'pending') return a.status === 'Pending Approval';
    return true;
  });

  // Toggle selection for bulk delete
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedAdIds(filteredUserAds.map(a => a.id));
    } else {
      setSelectedAdIds([]);
    }
  };

  const handleToggleSelectAd = (id) => {
    setSelectedAdIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleBulkDelete = async () => {
    if (selectedAdIds.length === 0) return;
    const confirmed = await showConfirm({
      title: 'Delete Selected Advertisements',
      titleSin: 'තෝරාගත් දැන්වීම් ඉවත් කිරීම',
      message: `Are you sure you want to delete ${selectedAdIds.length} advertisement(s)? This action cannot be undone.`,
      messageSin: `තෝරාගත් දැන්වීම් ${selectedAdIds.length}ක් ස්ථිරවම ඉවත් කිරීමට ඔබට සහතිකද?`,
      type: 'danger',
      confirmText: 'Yes, Delete (ඉවත් කරන්න)',
      cancelText: 'Cancel (අවලංගු කරන්න)'
    });
    if (confirmed) {
      selectedAdIds.forEach((id) => onDeleteAd && onDeleteAd(id));
      setSelectedAdIds([]);
      onShowToast && onShowToast('Selected ads deleted successfully.');
    }
  };

  // Toggle Inactive / Active
  const handleToggleActive = (ad) => {
    const updated = { ...ad, isActive: !ad.isActive };
    onUpdateAd && onUpdateAd(updated);
    onShowToast && onShowToast(`Ad marked as ${updated.isActive ? 'Active' : 'Inactive'}.`);
  };

  // Admin approval simulation
  const handleSimulateApproval = (ad) => {
    const newStatus = ad.status === 'Approved' ? 'Pending Approval' : 'Approved';
    const updated = { ...ad, status: newStatus };
    onUpdateAd && onUpdateAd(updated);
    onShowToast && onShowToast(
      newStatus === 'Approved' 
        ? 'Admin අනුමැතිය ලැබුණි! Ad is now Live on site.' 
        : 'Ad marked as Pending Approval.'
    );
  };

  // Handle republish / upgrade submit
  const handleRepublishSubmit = (adId) => {
    const chosenType = republishType[adId] || 'Super Ad';
    const chosenOption = republishOption[adId] || 'Republish';
    const targetAd = userAds.find(a => a.id === adId);
    if (targetAd) {
      const updated = { ...targetAd, badgeType: chosenType, postedTime: 'Just now' };
      onUpdateAd && onUpdateAd(updated);
      onShowToast && onShowToast(`Ad updated with ${chosenOption} as ${chosenType}!`);
    }
  };

  const copyToClipboard = (text, label) => {
    navigator.clipboard?.writeText(text);
    onShowToast && onShowToast(`${label} copied to clipboard!`);
  };

  return (
    <div className="space-y-4">
      {/* Back to Home Button */}
      <div className="flex items-center justify-between pb-1">
        <button
          onClick={onBack}
          className="inline-flex items-center space-x-2 text-xs md:text-sm font-bold text-[#f03a5f] hover:text-[#d92348] transition bg-white border border-red-200 px-3 py-1.5 rounded-lg shadow-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Feed (ආපසු මුල් පිටුවට)</span>
        </button>
      </div>

      {/* Top 4 Stat/Info Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-white border border-gray-200 rounded-xl p-3.5 shadow-xs">
          <p className="text-xs font-semibold text-gray-500">Account ID</p>
          <p className="text-base font-extrabold text-gray-900 mt-1">#29987</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-3.5 shadow-xs">
          <p className="text-xs font-semibold text-gray-500">Account Type</p>
          <p className="text-base font-extrabold text-gray-900 mt-1">User</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-3.5 shadow-xs">
          <p className="text-xs font-semibold text-gray-500">All Ads</p>
          <p className="text-base font-extrabold text-gray-900 mt-1">
            {userAds.length}
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-3.5 shadow-xs">
          <p className="text-xs font-semibold text-gray-500">Credits</p>
          <p className="text-base font-extrabold text-[#16a34a] mt-1">
            Rs. {Number(credits || 0).toFixed(2)}
          </p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="flex border-b border-gray-200 bg-gray-50/70 overflow-x-auto">
          <button
            onClick={() => setActiveTab('my-ads')}
            className={`px-5 py-3 text-xs md:text-sm font-bold transition flex items-center space-x-1.5 whitespace-nowrap ${
              activeTab === 'my-ads'
                ? 'bg-white text-[#f03a5f] border-t-2 border-[#f03a5f] shadow-xs'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>මගේ දැන්වීම් (My Ads) ({userAds.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('new-ad')}
            className={`px-5 py-3 text-xs md:text-sm font-bold transition flex items-center space-x-1.5 whitespace-nowrap ${
              activeTab === 'new-ad'
                ? 'bg-white text-[#f03a5f] border-t-2 border-[#f03a5f] shadow-xs'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            <PlusCircle className="w-4 h-4" />
            <span>නව දැන්වීමක් (New Ad)</span>
          </button>

          <button
            onClick={() => setActiveTab('recover')}
            className={`px-5 py-3 text-xs md:text-sm font-bold transition flex items-center space-x-1.5 whitespace-nowrap ${
              activeTab === 'recover'
                ? 'bg-white text-[#f03a5f] border-t-2 border-[#f03a5f] shadow-xs'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            <KeyRound className="w-4 h-4" />
            <span>මුරපදය (Recover)</span>
          </button>

          <button
            onClick={() => setActiveTab('top-up')}
            className={`px-5 py-3 text-xs md:text-sm font-bold transition flex items-center space-x-1.5 whitespace-nowrap ${
              activeTab === 'top-up'
                ? 'bg-white text-[#f03a5f] border-t-2 border-[#f03a5f] shadow-xs'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>පැකේජ (Top up)</span>
          </button>
        </div>

        {/* Tab Content 1: My Ads (Exact structure from latest screenshot) */}
        {activeTab === 'my-ads' && (
          <div className="p-4 sm:p-6 space-y-4">
            {/* Top Green Admin Contact Box (Screenshot) */}
            <div className="bg-[#f0fdf4] border border-[#bbf7d0] rounded-xl p-4 text-center space-y-2">
              <p className="text-xs text-gray-700 font-medium">
                ඕනෑම ප්‍රශ්නයක් සඳහා <strong>Admin</strong> සහය ලබාගන්න.
              </p>
              <p className="text-xs text-[#16a34a] font-bold">
                For any question, please contact Admin.
              </p>
              <a
                href="https://wa.me/94771234567?text=Hello%20Taizer%20Ads%20Admin,%20I%20have%20a%20question%20regarding%20my%20ad%20approval."
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center space-x-2 border-2 border-[#16a34a] hover:bg-green-50 text-[#16a34a] font-bold py-1.5 px-4 rounded-lg text-xs transition"
              >
                <MessageCircle className="w-3.5 h-3.5 fill-current" />
                <span>Contact Admin</span>
              </a>
            </div>

            {/* Sub-filters for My Ads */}
            <div className="flex flex-wrap items-center gap-2 pb-1">
              <button
                type="button"
                onClick={() => setMyAdsFilter('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer ${
                  myAdsFilter === 'all'
                    ? 'bg-[#0f172a] text-white shadow-xs'
                    : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                }`}
              >
                <span>සියල්ල (All)</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  myAdsFilter === 'all' ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-600'
                }`}>
                  {userAds.length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setMyAdsFilter('active')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer ${
                  myAdsFilter === 'active'
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'bg-white text-emerald-700 border border-emerald-200 hover:bg-emerald-50'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>සක්‍රීය (Active)</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  myAdsFilter === 'active' ? 'bg-emerald-800 text-emerald-100' : 'bg-emerald-100 text-emerald-700'
                }`}>
                  {activeCount}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setMyAdsFilter('expired')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer ${
                  myAdsFilter === 'expired'
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'bg-white text-rose-700 border border-rose-200 hover:bg-rose-50'
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                <span>⏰ කල් ඉකුත් වූ (Expired)</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  myAdsFilter === 'expired' ? 'bg-rose-800 text-rose-100' : 'bg-rose-100 text-rose-700'
                }`}>
                  {expiredCount}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setMyAdsFilter('pending')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer ${
                  myAdsFilter === 'pending'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'bg-white text-amber-700 border border-amber-200 hover:bg-amber-50'
                }`}
              >
                <span>අනුමැතිය සඳහා (Pending)</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  myAdsFilter === 'pending' ? 'bg-amber-800 text-amber-100' : 'bg-amber-100 text-amber-700'
                }`}>
                  {pendingCount}
                </span>
              </button>
            </div>

            {/* Bulk Action Bar: Select All & Delete (Screenshot) */}
            <div className="bg-[#f8fafc] border border-gray-200 rounded-lg px-4 py-2.5 flex items-center space-x-3 text-xs">
              <label className="flex items-center space-x-2 cursor-pointer font-bold text-gray-800 select-none">
                <input
                  type="checkbox"
                  checked={filteredUserAds.length > 0 && selectedAdIds.length === filteredUserAds.length}
                  onChange={handleSelectAll}
                  className="rounded text-[#f03a5f] focus:ring-0 w-4 h-4 cursor-pointer"
                />
                <span>Select All</span>
              </label>

              <button
                type="button"
                onClick={handleBulkDelete}
                disabled={selectedAdIds.length === 0}
                className={`text-white text-xs font-bold px-3 py-1 rounded transition ${
                  selectedAdIds.length > 0 
                    ? 'bg-[#f43f5e] hover:bg-[#e11d48] cursor-pointer' 
                    : 'bg-[#fda4af] cursor-not-allowed'
                }`}
              >
                Delete
              </button>
            </div>

            {/* User Ads Cards in 2-Column Grid (depaththta dekak) */}
            {filteredUserAds.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {filteredUserAds.map((ad) => {
                  const isPending = ad.status === 'Pending Approval';
                  const isChecked = selectedAdIds.includes(ad.id);
                  const validity = getAdValidity(ad);

                  return (
                    <div 
                      key={ad.id}
                      className={`border rounded-xl p-3 bg-white shadow-xs space-y-2.5 flex flex-col justify-between transition ${
                        validity.isExpired 
                          ? 'border-rose-300 bg-rose-50/20' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {/* Top row: Thumbnail with Status Badge, Details, Checkbox */}
                      <div className="flex gap-3 items-start">
                        {/* Compact Thumbnail */}
                        <div className="w-28 sm:w-36 h-24 sm:h-28 relative rounded-lg overflow-hidden border border-gray-200 flex-shrink-0 bg-gray-100">
                          <img
                            src={ad.image}
                            alt={ad.title}
                            className="w-full h-full object-cover"
                          />
                          {ad.isFake || ad.status === 'Fake Ad' ? (
                            <div className="absolute top-1 left-1 bg-red-600 border border-red-700 text-white text-[9px] font-black px-1.5 py-0.5 rounded shadow-xs animate-pulse">
                              🚫 Fake Ad (ව්‍යාජයි)
                            </div>
                          ) : validity.isExpired ? (
                            <div className="absolute top-1 left-1 bg-red-600 border border-red-700 text-white text-[9px] font-black px-1.5 py-0.5 rounded shadow-xs animate-pulse">
                              ⏰ Expired (කල් ඉකුත් විය)
                            </div>
                          ) : ad.renewalStatus === 'requested' ? (
                            <div className="absolute top-1 left-1 bg-purple-600 border border-purple-700 text-white text-[9px] font-black px-1.5 py-0.5 rounded shadow-xs">
                              🔄 Renewal Waiting
                            </div>
                          ) : isPending ? (
                            <div className="absolute top-1 left-1 bg-[#fef08a] border border-[#eab308] text-[#854d0e] text-[9px] font-black px-1.5 py-0.2 rounded shadow-xs">
                              Pending Approval
                            </div>
                          ) : (
                            <div className="absolute top-1 left-1 bg-[#dcfce7] border border-[#22c55e] text-[#166534] text-[9px] font-black px-1.5 py-0.2 rounded shadow-xs">
                              Approved
                            </div>
                          )}
                        </div>

                        {/* Middle Info */}
                        <div className="flex-1 min-w-0 space-y-1">
                          {/* Badges row + Checkbox */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-1.5 flex-wrap gap-y-1">
                              <span className="bg-gray-100 text-gray-800 text-[10px] font-bold px-2 py-0.5 rounded">
                                {ad.badgeType || 'Normal Ad'}
                              </span>
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                                ad.isActive !== false ? 'bg-[#0f172a] text-white' : 'bg-gray-300 text-gray-700'
                              }`}>
                                {ad.isActive !== false ? 'Active' : 'Inactive'}
                              </span>
                              {validity.isExpired ? (
                                <span className="bg-rose-100 text-rose-700 text-[10px] font-bold px-2 py-0.5 rounded border border-rose-200 flex items-center gap-1">
                                  <Clock className="w-2.5 h-2.5" />
                                  <span>Expired</span>
                                </span>
                              ) : (
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1 ${
                                  validity.daysRemaining <= 2 
                                    ? 'bg-amber-100 text-amber-800 border border-amber-300'
                                    : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                }`}>
                                  <Clock className="w-2.5 h-2.5" />
                                  <span>තව දින {validity.daysRemaining}යි</span>
                                </span>
                              )}
                            </div>

                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => handleToggleSelectAd(ad.id)}
                              className="w-4 h-4 rounded text-[#f03a5f] focus:ring-0 cursor-pointer"
                            />
                          </div>

                          {/* Title */}
                          <h4 className="font-extrabold text-xs sm:text-sm text-gray-900 leading-snug line-clamp-1">
                            {ad.title}
                          </h4>

                          {/* Short Description */}
                          <p className="text-[11px] text-gray-500 line-clamp-1">
                            {ad.description}
                          </p>

                          {/* Metrics row */}
                          <div className="flex items-center space-x-3 text-[11px] text-gray-500 pt-0.5">
                            <span className="flex items-center space-x-1 text-blue-600 font-semibold">
                              <ThumbsUp className="w-3 h-3" />
                              <span>{ad.likes || 0} Likes</span>
                            </span>
                            <span className="text-blue-600 font-semibold">
                              {ad.views || '0 Views'}
                            </span>
                            <span className="truncate">{ad.postedTime || 'Just now'}</span>
                          </div>
                        </div>
                      </div>

                      {/* Phone & Whatsapp Gray Row */}
                      <div className="bg-[#f8fafc] border border-gray-200 rounded-md px-3 py-1.5 flex items-center justify-between text-[11px] font-semibold text-gray-700">
                        <span>Phone: <strong>{ad.phone || '+94703670398'}</strong></span>
                        <span>Whatsapp: <strong>{ad.whatsapp ? '1' : '0'}</strong></span>
                      </div>

                      {/* Validity / Expired Notice Banner & Re-activate Button */}
                      {validity.isExpired ? (
                        <div className="bg-rose-50 border-2 border-rose-300 rounded-xl p-3 space-y-2.5 shadow-xs">
                          <div className="flex items-start justify-between gap-2">
                            <div className="text-xs space-y-1">
                              <div className="font-extrabold text-rose-900 flex items-center gap-1.5 text-xs sm:text-sm">
                                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                                <span>වලංගු කාලය අවසන් වී ඇත (Expired Ad)</span>
                              </div>
                              <p className="text-[11px] text-rose-700 font-medium leading-relaxed">
                                මෙම දැන්වීමේ කාලය අවසන් වූ බැවින් එය ප්‍රසිද්ධ පුවරුවෙන් (Public Feed) ස්වයංක්‍රීයව ඉවත් කර ඇත. ඔබගේ ගිණුමේ ශේෂය (Credits) මගින් හෝ Admin ට WhatsApp පණිවිඩයක් යවා ගෙවීම් කර දැන්වීම ක්ෂණිකව නැවත සක්‍රීය (Re-activate) කරගත හැක.
                              </p>
                            </div>
                            <span className="text-[10px] font-black bg-rose-200 text-rose-900 border border-rose-300 px-2 py-1 rounded-md shrink-0">
                              Expired: {validity.formattedExpiry}
                            </span>
                          </div>

                          {ad.renewalStatus === 'requested' ? (
                            <div className="bg-purple-100/90 border border-purple-300 text-purple-900 rounded-lg p-2.5 text-xs flex items-center justify-between shadow-2xs">
                              <span className="font-bold flex items-center gap-1.5">
                                <RefreshCw className="w-3.5 h-3.5 animate-spin text-purple-700" />
                                <span>අලුත් කිරීමේ ඉල්ලීම Admin වෙත යොමු කර ඇත (+{ad.renewalDaysRequested || 5} Days)</span>
                              </span>
                              <span className="text-[10px] font-extrabold bg-purple-200 text-purple-900 px-2 py-0.5 rounded border border-purple-300">
                                Pending Review
                              </span>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleOpenRenewalModal(ad)}
                              className="w-full bg-gradient-to-r from-rose-600 via-rose-500 to-red-600 hover:from-rose-700 hover:to-red-700 text-white font-black py-2.5 px-3 rounded-xl text-xs transition shadow-md flex items-center justify-center space-x-2 active:scale-98 cursor-pointer"
                            >
                              <RefreshCw className="w-4 h-4" />
                              <span>Re-activate / Renew Ad (නැවත සක්‍රීය කර ගන්න)</span>
                            </button>
                          )}
                        </div>
                      ) : ad.renewalStatus === 'requested' ? (
                        <div className="bg-purple-50 border border-purple-200 rounded-lg p-2 flex items-center justify-between text-xs text-purple-900">
                          <span className="font-bold flex items-center gap-1.5">
                            <RefreshCw className="w-3 h-3 animate-spin text-purple-600" />
                            Renewal Request Pending (+{ad.renewalDaysRequested || 5} Days)
                          </span>
                          <span className="text-[10px] font-bold bg-purple-200 text-purple-800 px-2 py-0.5 rounded">
                            Admin Approval
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between text-[11px] text-gray-500 bg-gray-50 px-2.5 py-1 rounded border border-gray-100">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-gray-400" />
                            <span>Valid until: <strong className="text-gray-700">{validity.formattedExpiry}</strong></span>
                          </span>
                          <button
                            type="button"
                            onClick={() => handleOpenRenewalModal(ad)}
                            className="text-[#f03a5f] hover:underline font-bold text-[10px] flex items-center gap-0.5 cursor-pointer"
                          >
                            <RefreshCw className="w-2.5 h-2.5" />
                            <span>Extend (+Days)</span>
                          </button>
                        </div>
                      )}

                      {/* 3 Action Buttons: Edit, Delete, Inactive */}
                      <div className="grid grid-cols-3 gap-1.5">
                        <button
                          type="button"
                          onClick={() => setEditingAd({ ...ad })}
                          className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-bold py-1.5 px-2 rounded text-xs transition text-center shadow-xs flex items-center justify-center space-x-1"
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
                              message: `Are you sure you want to delete "${ad.title}"? This action cannot be undone.`,
                              messageSin: 'මෙම දැන්වීම ස්ථිරවම ඉවත් කිරීමට ඔබට සහතිකද?',
                              type: 'danger',
                              confirmText: 'Delete (ඉවත් කරන්න)',
                              cancelText: 'Cancel (අවලංගු කරන්න)'
                            });
                            if (confirmed) {
                              onDeleteAd && onDeleteAd(ad.id);
                              onShowToast && onShowToast('Advertisement deleted.');
                            }
                          }}
                          className="bg-[#dc2626] hover:bg-[#b91c1c] text-white font-bold py-1.5 px-2 rounded text-xs transition text-center shadow-xs"
                        >
                          Delete
                        </button>

                        <button
                          type="button"
                          onClick={() => handleToggleActive(ad)}
                          className={`font-bold py-1.5 px-2 rounded text-xs transition text-center shadow-xs text-white ${
                            ad.isActive !== false 
                              ? 'bg-[#d97706] hover:bg-[#b45309]' 
                              : 'bg-gray-500 hover:bg-gray-600'
                          }`}
                        >
                          {ad.isActive !== false ? 'Inactive' : 'Activate'}
                        </button>
                      </div>

                      {/* Bottom Options Box (Type & Option Dropdowns + Submit) */}
                      <div className="pt-2 border-t border-dashed border-gray-200 space-y-2">
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div>
                            <label className="block font-bold text-gray-700 mb-0.5 text-[11px]">Type</label>
                            <select
                              value={republishType[ad.id] || ad.badgeType || 'Super Ad'}
                              onChange={(e) => setRepublishType({ ...republishType, [ad.id]: e.target.value })}
                              className="w-full border border-gray-300 rounded px-2 py-1.5 text-xs bg-white focus:outline-none focus:border-[#f03a5f]"
                            >
                              <option value="Super Ad">Super Ad</option>
                              <option value="VIP Ad">VIP Ad</option>
                              <option value="Normal Ad">Normal Ad</option>
                            </select>
                          </div>

                          <div>
                            <label className="block font-bold text-gray-700 mb-0.5 text-[11px]">Option</label>
                            <select
                              value={republishOption[ad.id] || 'Republish'}
                              onChange={(e) => setRepublishOption({ ...republishOption, [ad.id]: e.target.value })}
                              className="w-full border border-gray-300 rounded px-2 py-1.5 text-xs bg-white focus:outline-none focus:border-[#f03a5f]"
                            >
                              <option value="Republish">Republish</option>
                              <option value="Upgrade">Upgrade</option>
                              <option value="Extend">Extend Duration</option>
                            </select>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleRepublishSubmit(ad.id)}
                          className="w-full bg-[#0f172a] hover:bg-black text-white font-bold py-2 px-3 rounded text-xs transition shadow-xs"
                        >
                          Submit
                        </button>
                      </div>

                      {/* Special Offer / Circular Story Spot Promotion Section */}
                      <div className="bg-gradient-to-r from-pink-50 via-rose-50 to-amber-50 border border-pink-200/80 rounded-xl p-3 space-y-2 shadow-2xs">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-1.5">
                            <span className="flex h-2 w-2 relative">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-pink-500"></span>
                            </span>
                            <span className="text-xs font-black text-[#f03a5f] uppercase tracking-wide flex items-center space-x-1">
                              <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                              <span>Circular Story Special Offer Spot</span>
                            </span>
                          </div>

                          {ad.inStorySpot ? (
                            <span className="bg-[#16a34a] text-white text-[9px] font-black px-2 py-0.5 rounded-full flex items-center space-x-1 shadow-2xs">
                              <Check className="w-2.5 h-2.5 stroke-[3]" />
                              <span>Active in Stories</span>
                            </span>
                          ) : ad.storySpotRequested ? (
                            <span className="bg-amber-500 text-black text-[9px] font-black px-2 py-0.5 rounded-full flex items-center space-x-1 shadow-2xs">
                              <Clock className="w-2.5 h-2.5" />
                              <span>Requested</span>
                            </span>
                          ) : (
                            <span className="text-[10px] font-black text-pink-600 bg-pink-100/70 px-2 py-0.5 rounded-full">
                              Rs. {storySpotPrice.toLocaleString()}
                            </span>
                          )}
                        </div>

                        {ad.inStorySpot ? (
                          <div className="bg-white/80 border border-green-200 rounded-lg p-2 text-[11px] text-green-900 space-y-1">
                            <div className="flex items-center justify-between font-bold">
                              <span>Offer Tag: <span className="text-pink-600">{ad.storyOfferTag || 'Special Offer'}</span></span>
                              <span className="text-green-700 text-[10px] bg-green-50 px-1.5 py-0.5 rounded border border-green-200">Live on Top Bar ✓</span>
                            </div>
                            <p className="text-[10px] text-gray-600 truncate">{ad.storyOfferDetails || 'Promotional offer running on website'}</p>
                          </div>
                        ) : ad.storySpotRequested ? (
                          <div className="bg-white/80 border border-amber-200 rounded-lg p-2 text-[11px] text-amber-950 space-y-1.5">
                            <div className="flex items-center justify-between">
                              <span className="font-bold">Tag: <span className="text-[#f03a5f]">{ad.storyOfferTag}</span></span>
                              <button
                                type="button"
                                onClick={() => handleCancelStoryRequest(ad)}
                                className="text-red-600 hover:text-red-700 hover:underline font-bold text-[10px]"
                              >
                                Cancel Request
                              </button>
                            </div>
                            <p className="text-[10px] text-amber-800 leading-snug">
                              Admin will verify payment and place your ad in the top Circular Live Avatars spot.
                            </p>
                          </div>
                        ) : (
                          <div className="space-y-1.5">
                            <p className="text-[10px] text-gray-600 leading-snug">
                              මුල් පිටුවේ උඩින්ම ඇති රවුම් Live Stories වල ඔබේ Special Offer එක පෙන්වා වැඩි පාරිභෝගික පිරිසක් ආකර්ෂණය කරගන්න.
                            </p>
                            <button
                              type="button"
                              onClick={() => handleOpenStoryRequestModal(ad)}
                              className="w-full bg-gradient-to-r from-[#f03a5f] via-rose-500 to-amber-500 hover:from-[#d92348] hover:to-amber-600 text-white font-black py-2 px-3 rounded-lg text-xs transition shadow-sm flex items-center justify-center space-x-1.5 active:scale-98 cursor-pointer"
                            >
                              <Sparkles className="w-3.5 h-3.5" />
                              <span>Request Special Offer Spot (රු. {storySpotPrice.toLocaleString()})</span>
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Admin Approval Simulator Tool */}
                      <div className="bg-amber-50 border border-amber-200 p-2 rounded flex items-center justify-between text-[10px]">
                        <span className="text-amber-900 font-semibold truncate mr-2">
                          {isPending ? '⏳ Awaiting Approval' : '✅ Live on Site'}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleSimulateApproval(ad)}
                          className={`px-2 py-1 rounded font-bold text-white transition flex-shrink-0 ${
                            isPending 
                              ? 'bg-green-600 hover:bg-green-700' 
                              : 'bg-amber-600 hover:bg-amber-700'
                          }`}
                        >
                          {isPending ? 'Approve' : 'Pending'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-10 text-gray-500 space-y-2">
                <p className="font-semibold text-sm">දැන්වීම් කිසිවක් නැත (No Ads in My Ads)</p>
                <p className="text-xs text-gray-400">නව දැන්වීමක් පළ කිරීමට "New Ad" tab එකට යන්න.</p>
                <button
                  onClick={() => setActiveTab('new-ad')}
                  className="mt-2 bg-[#f03a5f] hover:bg-[#d92348] text-white text-xs font-bold px-4 py-2 rounded-lg"
                >
                  Create Ad Now
                </button>
              </div>
            )}
          </div>
        )}

        {/* Tab Content 2: New Ad Form */}
        {activeTab === 'new-ad' && (
          <div className="p-4 sm:p-6 space-y-5">
            <div className="bg-[#eef6ff] border border-[#bfdbfe] rounded-lg p-3.5 text-xs text-[#1e40af] space-y-0.5 leading-relaxed">
              <p className="font-semibold text-[#1e3a8a]">
                දැන්වීම <strong>approve</strong> වීමෙන් පසුව නැවත <strong>edit</strong> කල නොහැක. සියලු දේ නිවැරදිව සම්පූර්ණ කර <strong>submit</strong> කරන්න.
              </p>
              <p className="font-medium text-[#2563eb]">
                Ads cannot be edited after the approval. Fill everything correctly and submit.
              </p>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4 text-xs text-gray-700">
              <div>
                <label className="block font-bold text-gray-800 mb-1.5">Image</label>
                <div className="border border-gray-300 rounded-lg p-2 bg-white flex flex-col sm:flex-row items-start sm:items-center gap-3">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="text-xs file:mr-3 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-gray-200 file:text-gray-800 hover:file:bg-gray-300 cursor-pointer text-gray-600"
                  />
                  {imagePreview && (
                    <div className="flex items-center space-x-2">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-12 h-12 object-cover rounded border border-gray-300"
                      />
                      <span className="text-[11px] text-green-700 font-semibold">Image selected!</span>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-800 mb-1.5">Type</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-xs focus:outline-none focus:border-[#f03a5f] bg-white font-medium"
                >
                  <option value="Super Ad">Super Ad (Rs. 1,500.00)</option>
                  <option value="VIP Ad">VIP Ad (Rs. 10,000.00)</option>
                  <option value="NRA Ad">NRA Ad (Rs. 1,000.00)</option>
                  <option value="Normal Ad">Normal Ad (Rs. 700.00)</option>
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-gray-800 mb-1.5">Title</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Title"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#f03a5f]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-800 mb-1.5">Category</label>
                  <select
                    required
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#f03a5f] bg-white"
                  >
                    <option value="">Select Category</option>
                    <option value="Spa Massage">Spa Massage</option>
                    <option value="Live Cam">Live Cam</option>
                    <option value="Girls Personal">Girls Personal</option>
                    <option value="Boys Personal">Boys Personal</option>
                    <option value="Sale / Rent">Sale / Rent</option>
                    <option value="Marriage Proposal">Marriage Proposal</option>
                    <option value="Toys & Accessories">Toys & Accessories</option>
                    <option value="Rooms">Rooms</option>
                    <option value="Vehicles">Vehicles</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-gray-800 mb-1.5">Location</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Location (e.g. Colombo, Kandy, Gampaha)"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#f03a5f]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-800 mb-1.5">Price</label>
                  <input
                    type="text"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="Price (e.g. 1500.00)"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#f03a5f]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-800 mb-1.5">Description</label>
                <textarea
                  rows={6}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Description"
                  className="w-full border border-gray-300 rounded-lg p-3 text-xs focus:outline-none focus:border-[#f03a5f] leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                <div className="space-y-2">
                  <label className="block font-bold text-gray-800">Phone</label>
                  <div className="flex items-center space-x-2">
                    <select
                      value={phoneCode}
                      onChange={(e) => setPhoneCode(e.target.value)}
                      className="border border-gray-300 rounded-lg px-2.5 py-2 text-xs bg-gray-100 font-semibold focus:outline-none"
                    >
                      <option value="+94">+94</option>
                      <option value="+1">+1</option>
                      <option value="+44">+44</option>
                      <option value="+971">+971</option>
                    </select>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-xs bg-gray-50 focus:outline-none focus:border-[#f03a5f]"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={async () => {
                      const newNum = await showPrompt({
                        title: 'Change Contact Phone',
                        titleSin: 'දුරකථන අංකය වෙනස් කරන්න',
                        message: 'Enter your new contact phone number:',
                        messageSin: 'නව දුරකථන අංකය ඇතුළත් කරන්න:',
                        defaultValue: phone,
                        placeholder: '0703670398',
                        confirmText: 'Update Phone',
                        cancelText: 'Cancel'
                      });
                      if (newNum && newNum.trim()) {
                        setPhone(newNum.trim());
                        onShowToast && onShowToast('Phone number updated.');
                      }
                    }}
                    className="w-full border border-[#dc2626] text-[#dc2626] hover:bg-red-50 py-1.5 rounded-md text-xs font-semibold transition"
                  >
                    Change Phone
                  </button>
                </div>

                <div className="space-y-2.5 pt-4 md:pt-6">
                  <label className="flex items-center space-x-2.5 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={availableWhatsapp}
                      onChange={(e) => setAvailableWhatsapp(e.target.checked)}
                      className="w-4 h-4 rounded text-[#f03a5f] focus:ring-0 cursor-pointer"
                    />
                    <span className="text-xs font-medium text-gray-800">
                      Phone Number Available on Whatsapp
                    </span>
                  </label>

                  <label className="flex items-center space-x-2.5 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={availableTelegram}
                      onChange={(e) => setAvailableTelegram(e.target.checked)}
                      className="w-4 h-4 rounded text-[#f03a5f] focus:ring-0 cursor-pointer"
                    />
                    <span className="text-xs font-medium text-gray-800">
                      Phone Number Available on Telegram
                    </span>
                  </label>

                  <label className="flex items-center space-x-2.5 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={availableImo}
                      onChange={(e) => setAvailableImo(e.target.checked)}
                      className="w-4 h-4 rounded text-[#f03a5f] focus:ring-0 cursor-pointer"
                    />
                    <span className="text-xs font-medium text-gray-800">
                      Phone Number Available on IMO
                    </span>
                  </label>

                  <label className="flex items-center space-x-2.5 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={availableViber}
                      onChange={(e) => setAvailableViber(e.target.checked)}
                      className="w-4 h-4 rounded text-[#f03a5f] focus:ring-0 cursor-pointer"
                    />
                    <span className="text-xs font-medium text-gray-800">
                      Phone Number Available on Viber
                    </span>
                  </label>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <button
                  type="submit"
                  className="bg-[#0f172a] hover:bg-black text-white text-xs md:text-sm font-bold px-7 py-2.5 rounded-lg transition shadow-sm active:scale-95"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Tab Content 3: Recover */}
        {activeTab === 'recover' && (
          <div className="p-4 sm:p-6 space-y-4 max-w-lg">
            <h3 className="font-bold text-gray-900 text-sm">Recover Your Ad / දැන්වීම නැවත ලබා ගැනීම</h3>
            <p className="text-xs text-gray-600">
              Enter your registered phone number or Ad Reference Token to recover management access:
            </p>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Phone Number (e.g. 0703670398)"
                className="w-full border border-gray-300 rounded-lg p-2.5 text-xs focus:outline-none focus:border-[#f03a5f]"
              />
              <button
                type="button"
                onClick={async () => {
                  await showAlert({
                    title: 'Recovery OTP Sent',
                    titleSin: 'OTP අංකය යොමු කරන ලදී',
                    message: 'Recovery OTP code (1234) has been sent to your phone number.',
                    messageSin: 'ගිණුම නැවත ලබා ගැනීමේ OTP කේතය (1234) ඔබගේ දුරකථන අංකයට සාර්ථකව යොමු කරන ලදී.',
                    type: 'success'
                  });
                }}
                className="bg-[#0f172a] hover:bg-black text-white text-xs font-bold px-5 py-2 rounded-lg transition shadow-xs"
              >
                Send Recovery Code
              </button>
            </div>
          </div>
        )}

        {/* Tab Content 4: Top up */}
        {activeTab === 'top-up' && (
          <div className="p-4 sm:p-6 space-y-6">
            {/* Live Wallet Balance Banner */}
            <div className="bg-gradient-to-r from-[#0f172a] via-[#1e293b] to-[#0f172a] text-white p-4 sm:p-5 rounded-2xl border border-gray-700/80 shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center space-x-3.5">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 flex-shrink-0">
                  <Wallet className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-gray-300 font-bold uppercase tracking-wider">Account Wallet Balance</span>
                    <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-black px-2 py-0.5 rounded-full border border-emerald-500/30">
                      Live
                    </span>
                  </div>
                  <div className="text-2xl sm:text-3xl font-black text-emerald-400 mt-0.5">
                    Rs. {(credits || 0).toLocaleString()}.00
                  </div>
                  <p className="text-[11px] text-gray-400 mt-0.5">
                    {currentUser?.name ? `Logged in: ${currentUser.name} (${currentUser.id})` : 'Use credits for instant 1-click ad activations.'}
                  </p>
                </div>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-xs text-gray-300 max-w-xs">
                <p className="font-semibold text-white">Need more credits?</p>
                <p className="text-[11px] text-gray-400 mt-0.5">
                  Contact Admin or transfer to bank account to top up your wallet instantly.
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-gray-50 to-red-50/40 p-4 sm:p-5 rounded-xl border border-gray-200">
              <h3 className="text-sm sm:text-base font-bold text-gray-900 leading-snug">
                Please pay the applicable amount and send the receipt along with the ad's phone number via WhatsApp to get your ad live.
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 mt-1 font-medium">
                ඔබගේ දැන්වීම සජීවී කර ගැනීමට කරුණාකර අදාල මුදල ගෙවා WhatsApp හරහා රිසිට්පත හා දැන්වීම් දුරකථන අංකය එවන්න.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Normal Ad */}
              <div 
                onClick={() => setSelectedPackage('Normal Ad')}
                className={`relative rounded-2xl p-5 border-2 transition-all cursor-pointer bg-white flex flex-col justify-between hover:shadow-md ${
                  selectedPackage === 'Normal Ad' 
                    ? 'border-[#2563eb] ring-2 ring-blue-100 shadow-md' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="bg-blue-100 text-blue-700 text-[11px] font-extrabold px-2.5 py-0.5 rounded-full">
                      Starter Tier
                    </span>
                    <Zap className="w-4 h-4 text-blue-500" />
                  </div>

                  <div>
                    <h4 className="text-base font-extrabold text-gray-900">Normal Ad</h4>
                    <p className="text-xs text-gray-500">Standard visibility listing</p>
                  </div>

                  <div className="pt-2">
                    <span className="text-2xl font-black text-gray-900">Rs. {normalPrice.toLocaleString()}.00</span>
                    <span className="text-xs text-gray-500 font-medium"> / ad</span>
                  </div>

                  <ul className="space-y-2 pt-3 border-t border-gray-100 text-xs text-gray-600">
                    <li className="flex items-center space-x-2">
                      <Check className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
                      <span>Standard listing in public feed</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <Check className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
                      <span>Phone & WhatsApp contact buttons</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <Check className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
                      <span>Active duration: 14 Days</span>
                    </li>
                  </ul>
                </div>

                <div className="pt-4 mt-4 border-t border-gray-100 space-y-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePayWithCredits('Normal Ad', normalPrice);
                    }}
                    className={`w-full flex items-center justify-center space-x-1.5 py-2.5 px-3 rounded-xl font-bold text-xs transition shadow-xs ${
                      credits >= normalPrice
                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-500'
                    }`}
                  >
                    <Wallet className="w-3.5 h-3.5" />
                    <span>Pay with your wallet (Rs. {normalPrice.toLocaleString()})</span>
                  </button>
                  <a
                    href={`https://wa.me/${adminWhatsapp}?text=Hello%20Taizer%20Ads,%20I%20want%20to%20activate%20Normal%20Ad%20(Rs.%20${normalPrice.toLocaleString()}.00)`}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="w-full block text-center py-2 px-3 rounded-xl font-semibold text-xs bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200 transition"
                  >
                    Select Normal Ad (WhatsApp)
                  </a>
                </div>
              </div>

              {/* Super Ad */}
              <div 
                onClick={() => setSelectedPackage('Super Ad')}
                className={`relative rounded-2xl p-5 border-2 transition-all cursor-pointer bg-gradient-to-b from-amber-50/50 via-white to-amber-50/30 flex flex-col justify-between hover:shadow-xl ${
                  selectedPackage === 'Super Ad' 
                    ? 'border-[#d97706] ring-4 ring-amber-100 shadow-lg' 
                    : 'border-[#f59e0b] shadow-sm hover:border-[#d97706]'
                }`}
              >
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-amber-500 to-yellow-500 text-white text-[10px] font-black tracking-wide uppercase px-3 py-0.5 rounded-full shadow-sm flex items-center space-x-1">
                  <Sparkles className="w-3 h-3" />
                  <span>Most Popular</span>
                </div>

                <div className="space-y-3 pt-1">
                  <div className="flex items-center justify-between">
                    <span className="bg-amber-100 text-amber-900 text-[11px] font-extrabold px-2.5 py-0.5 rounded-full">
                      Gold Highlight
                    </span>
                    <Sparkles className="w-4 h-4 text-amber-500" />
                  </div>

                  <div>
                    <h4 className="text-base font-extrabold text-gray-900">Super Ad</h4>
                    <p className="text-xs text-amber-800 font-medium">10x Views with Gold Card border</p>
                  </div>

                  <div className="pt-2">
                    <span className="text-2xl sm:text-3xl font-black text-[#b45309]">Rs. {superPrice.toLocaleString()}.00</span>
                    <span className="text-xs text-gray-500 font-medium"> / ad</span>
                  </div>

                  <ul className="space-y-2 pt-3 border-t border-amber-100 text-xs text-gray-700 font-medium">
                    <li className="flex items-center space-x-2">
                      <Check className="w-3.5 h-3.5 text-amber-600 flex-shrink-0 font-bold" />
                      <span><strong>High-Priority Top Feed Placement</strong></span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <Check className="w-3.5 h-3.5 text-amber-600 flex-shrink-0 font-bold" />
                      <span><strong>Golden Card Border & Super Ad Badge</strong></span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <Check className="w-3.5 h-3.5 text-amber-600 flex-shrink-0 font-bold" />
                      <span>Active for 30 Full Days</span>
                    </li>
                  </ul>
                </div>

                <div className="pt-4 mt-4 border-t border-amber-100 space-y-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePayWithCredits('Super Ad', superPrice);
                    }}
                    className={`w-full flex items-center justify-center space-x-1.5 py-2.5 px-3 rounded-xl font-extrabold text-xs transition shadow-sm ${
                      credits >= superPrice
                        ? 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white'
                        : 'bg-amber-100 hover:bg-amber-200 text-amber-800'
                    }`}
                  >
                    <Wallet className="w-3.5 h-3.5" />
                    <span>Pay with your wallet (Rs. {superPrice.toLocaleString()})</span>
                  </button>
                  <a
                    href={`https://wa.me/${adminWhatsapp}?text=Hello%20Taizer%20Ads,%20I%20want%20to%20activate%20Super%20Ad%20(Rs.%20${superPrice.toLocaleString()}.00)`}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="w-full block text-center py-2 px-3 rounded-xl font-bold text-xs bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 transition"
                  >
                    Select Super Ad (WhatsApp)
                  </a>
                </div>
              </div>

              {/* VIP Ad */}
              <div 
                onClick={() => setSelectedPackage('VIP Ad')}
                className={`relative rounded-2xl p-5 border-2 transition-all cursor-pointer bg-gradient-to-b from-red-50/50 via-white to-red-50/30 flex flex-col justify-between hover:shadow-xl ${
                  selectedPackage === 'VIP Ad' 
                    ? 'border-[#dc2626] ring-4 ring-red-100 shadow-lg' 
                    : 'border-[#ef4444] shadow-sm hover:border-[#dc2626]'
                }`}
              >
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-[#dc2626] text-white text-[10px] font-black tracking-wide uppercase px-3 py-0.5 rounded-full shadow-sm flex items-center space-x-1">
                  <Crown className="w-3 h-3 text-yellow-300" />
                  <span>Ultimate VIP</span>
                </div>

                <div className="space-y-3 pt-1">
                  <div className="flex items-center justify-between">
                    <span className="bg-red-100 text-red-800 text-[11px] font-extrabold px-2.5 py-0.5 rounded-full">
                      Maximum Exposure
                    </span>
                    <Crown className="w-4 h-4 text-[#dc2626]" />
                  </div>

                  <div>
                    <h4 className="text-base font-extrabold text-gray-900">VIP Ad</h4>
                    <p className="text-xs text-red-700 font-medium">Top Position in all categories 24/7</p>
                  </div>

                  <div className="pt-2">
                    <span className="text-2xl sm:text-3xl font-black text-[#dc2626]">Rs. {vipPrice.toLocaleString()}.00</span>
                    <span className="text-xs text-gray-500 font-medium"> / ad</span>
                  </div>

                  <ul className="space-y-2 pt-3 border-t border-red-100 text-xs text-gray-700 font-medium">
                    <li className="flex items-center space-x-2">
                      <Check className="w-3.5 h-3.5 text-[#dc2626] flex-shrink-0 font-bold" />
                      <span><strong>Fixed #1 Top Placement in Taizer Ads</strong></span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <Check className="w-3.5 h-3.5 text-[#dc2626] flex-shrink-0 font-bold" />
                      <span><strong>Glowing Red VIP Ad Badge & Frame</strong></span>
                    </li>
                  </ul>
                </div>

                <div className="pt-4 mt-4 border-t border-red-100 space-y-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePayWithCredits('VIP Ad', vipPrice);
                    }}
                    className={`w-full flex items-center justify-center space-x-1.5 py-2.5 px-3 rounded-xl font-extrabold text-xs transition shadow-sm ${
                      credits >= vipPrice
                        ? 'bg-[#dc2626] hover:bg-[#b91c1c] text-white'
                        : 'bg-red-100 hover:bg-red-200 text-red-800'
                    }`}
                  >
                    <Wallet className="w-3.5 h-3.5" />
                    <span>Pay with your wallet (Rs. {vipPrice.toLocaleString()})</span>
                  </button>
                  <a
                    href={`https://wa.me/${adminWhatsapp}?text=Hello%20Taizer%20Ads,%20I%20want%20to%20activate%20VIP%20Ad%20(Rs.%20${vipPrice.toLocaleString()}.00)`}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="w-full block text-center py-2 px-3 rounded-xl font-bold text-xs bg-red-50 hover:bg-red-100 text-red-800 border border-red-200 transition"
                  >
                    Select VIP Ad (WhatsApp)
                  </a>
                </div>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <a
                href={`https://wa.me/${adminWhatsapp}?text=Hello%20Taizer%20Ads,%20I%20want%20to%20verify%20my%20payment%20receipt%20for%20Ad%20activation.`}
                target="_blank"
                rel="noreferrer"
                className="w-full flex items-center justify-center space-x-2 border-2 border-[#16a34a] hover:bg-green-50/70 text-[#16a34a] font-bold py-3 px-4 rounded-xl text-xs sm:text-sm transition shadow-xs"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>Contact on Whatsapp</span>
              </a>

              <button
                type="button"
                onClick={() => setIsBankModalOpen(true)}
                className="w-full flex items-center justify-center space-x-2 border-2 border-[#16a34a] hover:bg-green-50/70 text-[#16a34a] font-bold py-3 px-4 rounded-xl text-xs sm:text-sm transition shadow-xs"
              >
                <Building2 className="w-4 h-4" />
                <span>Bank Transfer</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Bank Transfer Modal Details */}
      {isBankModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl border border-gray-100 overflow-hidden animate-in fade-in zoom-in-95">
            <div className="bg-[#16a34a] text-white px-5 py-3.5 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Building2 className="w-5 h-5" />
                <h3 className="font-bold text-sm sm:text-base">Bank Transfer Details</h3>
              </div>
              <button 
                onClick={() => setIsBankModalOpen(false)}
                className="p-1 hover:bg-white/10 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs text-gray-700">
              <p className="text-gray-600">
                Please transfer your package fee to our official bank account and send the payment slip via WhatsApp:
              </p>

              <div className="bg-green-50/60 border border-green-200 rounded-xl p-3.5 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 font-semibold">Bank Name:</span>
                  <span className="font-extrabold text-gray-900">{bankDetails.bankName || 'Commercial Bank PLC'}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-500 font-semibold">Account Name:</span>
                  <span className="font-extrabold text-gray-900">{bankDetails.accountName || 'Taizer Ads Advertising'}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-500 font-semibold">Account Number:</span>
                  <div className="flex items-center space-x-1.5">
                    <span className="font-mono font-black text-sm text-[#16a34a]">{bankDetails.accountNumber || '8001 2345 6789'}</span>
                    <button 
                      onClick={() => copyToClipboard((bankDetails.accountNumber || '800123456789').replace(/\s+/g, ''), 'Account Number')}
                      className="p-1 hover:bg-green-100 rounded text-gray-500 hover:text-green-700"
                      title="Copy"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-500 font-semibold">Branch:</span>
                  <span className="font-bold text-gray-900">{bankDetails.branch || 'Colombo City Branch'}</span>
                </div>
              </div>

              <div className="border border-dashed border-gray-300 rounded-xl p-3 text-center space-y-1 bg-gray-50">
                <Upload className="w-5 h-5 text-gray-400 mx-auto" />
                <p className="text-[11px] font-semibold text-gray-700">Upload Slip / රිසිට්පත තෝරන්න</p>
                <input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={(e) => {
                    if (e.target.files?.[0]) {
                      setUploadedSlip(e.target.files[0].name);
                    }
                  }}
                  className="text-[11px] text-gray-500 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-[10px] file:bg-gray-200 cursor-pointer"
                />
                {uploadedSlip && (
                  <p className="text-[11px] text-green-600 font-bold pt-1">
                    ✓ Attached: {uploadedSlip}
                  </p>
                )}
              </div>

              <div className="pt-2 flex items-center justify-between border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setIsBankModalOpen(false)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-semibold"
                >
                  Close
                </button>

                <a
                  href="https://wa.me/94771234567?text=Hello%20Taizer%20Ads,%20I%20have%20completed%20the%20bank%20transfer.%20Please%20find%20my%20slip%20and%20Ad%20Phone%20Number."
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 bg-[#16a34a] hover:bg-[#15803d] text-white font-bold rounded-lg transition flex items-center space-x-1.5"
                >
                  <MessageCircle className="w-3.5 h-3.5 fill-current" />
                  <span>Send Slip via WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* EDIT AD MODAL FOR USER DASHBOARD */}
      {editingAd && (
        <div 
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-150"
          onClick={() => setEditingAd(null)}
        >
          <div 
            className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden my-auto max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-[#0f172a] text-white px-5 py-3.5 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-600/30 border border-blue-400 flex items-center justify-center text-blue-400">
                  <Edit className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm sm:text-base text-white">
                    දැන්වීම සංස්කරණය (Edit Advertisement)
                  </h3>
                  <p className="text-[11px] text-gray-400">
                    Ad ID: #{editingAd.id} • Status: {editingAd.status || 'Approved'}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setEditingAd(null)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form Content */}
            <form 
              onSubmit={handleSaveEditAd}
              className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4 text-xs text-gray-700"
            >
              {/* Title */}
              <div>
                <label className="block font-bold text-gray-800 mb-1">
                  Ad Title / දැන්වීමේ මාතෘකාව <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={editingAd.title || ''}
                  onChange={(e) => setEditingAd({ ...editingAd, title: e.target.value })}
                  placeholder="Enter ad title..."
                  className="w-full border border-gray-300 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-gray-900 focus:outline-none focus:border-[#f03a5f] bg-gray-50 focus:bg-white transition"
                />
              </div>

              {/* Category and Price */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block font-bold text-gray-800 mb-1">
                    Category / වර්ගය
                  </label>
                  <select
                    value={editingAd.category || 'spa'}
                    onChange={(e) => setEditingAd({ ...editingAd, category: e.target.value })}
                    className="w-full border border-gray-300 rounded-xl px-3.5 py-2 text-xs text-gray-900 bg-gray-50 focus:bg-white focus:outline-none focus:border-[#f03a5f]"
                  >
                    <option value="spa">Spa Massage & Wellness (ස්පා සහ සම්බාහන)</option>
                    <option value="studio">Live Cam & Studio (ලයිව් ස්ටුඩියෝ)</option>
                    <option value="lifestyle">Girls Personal (කාන්තා පෞද්ගලික)</option>
                    <option value="boys">Boys Personal (පිරිමි පෞද්ගලික)</option>
                    <option value="special">Personal & Care (පෞද්ගලික සත්කාර)</option>
                    <option value="salerent">Sale / Rent (විකිණීමට / කුලියට)</option>
                    <option value="marriage">Marriage Proposal (මංගල යෝජනා)</option>
                    <option value="accessories">Toys & Accessories (උපාංග සහ භාණ්ඩ)</option>
                    <option value="rooms">Rooms & Boarding (කාමර සහ නවාතැන්)</option>
                    <option value="vehicles">Vehicles & Rentals (වාහන සහ කුලී රථ)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-gray-800 mb-1">
                    Price / මිල
                  </label>
                  <input
                    type="text"
                    value={editingAd.price || ''}
                    onChange={(e) => setEditingAd({ ...editingAd, price: e.target.value })}
                    placeholder="Rs. 1,500.00"
                    className="w-full border border-gray-300 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-gray-900 bg-gray-50 focus:bg-white focus:outline-none focus:border-[#f03a5f]"
                  />
                </div>
              </div>

              {/* Location & Badge Tier */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block font-bold text-gray-800 mb-1">
                    Location / නගරය හෝ ප්‍රදේශය
                  </label>
                  <input
                    type="text"
                    value={editingAd.location || ''}
                    onChange={(e) => setEditingAd({ ...editingAd, location: e.target.value })}
                    placeholder="e.g. Colombo, Kandy, Galle..."
                    className="w-full border border-gray-300 rounded-xl px-3.5 py-2 text-xs text-gray-900 bg-gray-50 focus:bg-white focus:outline-none focus:border-[#f03a5f]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-800 mb-1">
                    Badge Tier / ප්‍රවර්ධන මට්ටම
                  </label>
                  <select
                    value={editingAd.badgeType || 'Super Ad'}
                    onChange={(e) => setEditingAd({ ...editingAd, badgeType: e.target.value })}
                    className="w-full border border-gray-300 rounded-xl px-3.5 py-2 text-xs text-gray-900 bg-gray-50 focus:bg-white focus:outline-none focus:border-[#f03a5f]"
                  >
                    <option value="Super Ad">Super Ad (Gold Highlight)</option>
                    <option value="VIP Ad">VIP Ad (Red VIP Border)</option>
                    <option value="Normal Ad">Normal Ad (Starter Tier)</option>
                  </select>
                </div>
              </div>

              {/* Phone, WhatsApp, Telegram */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-gray-800 mb-1">
                    Phone / දුරකථන අංකය <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={editingAd.phone || ''}
                    onChange={(e) => setEditingAd({ ...editingAd, phone: e.target.value })}
                    placeholder="+94703670398"
                    className="w-full border border-gray-300 rounded-xl px-3 py-2 text-xs text-gray-900 bg-gray-50 focus:bg-white focus:outline-none focus:border-[#f03a5f]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-800 mb-1">
                    WhatsApp අංකය
                  </label>
                  <input
                    type="text"
                    value={editingAd.whatsapp || ''}
                    onChange={(e) => setEditingAd({ ...editingAd, whatsapp: e.target.value })}
                    placeholder="+94703670398"
                    className="w-full border border-gray-300 rounded-xl px-3 py-2 text-xs text-gray-900 bg-gray-50 focus:bg-white focus:outline-none focus:border-[#f03a5f]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-800 mb-1">
                    Telegram අංකය / User
                  </label>
                  <input
                    type="text"
                    value={editingAd.telegram || ''}
                    onChange={(e) => setEditingAd({ ...editingAd, telegram: e.target.value })}
                    placeholder="@username or phone"
                    className="w-full border border-gray-300 rounded-xl px-3 py-2 text-xs text-gray-900 bg-gray-50 focus:bg-white focus:outline-none focus:border-[#f03a5f]"
                  />
                </div>
              </div>

              {/* Image URL & File Upload */}
              <div className="space-y-2">
                <label className="block font-bold text-gray-800">
                  Image URL or Upload Photo / පින්තූරය
                </label>
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <input
                    type="url"
                    value={editingAd.image || ''}
                    onChange={(e) => setEditingAd({ ...editingAd, image: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full sm:flex-1 border border-gray-300 rounded-xl px-3.5 py-2 text-xs text-gray-900 bg-gray-50 focus:bg-white focus:outline-none focus:border-[#f03a5f]"
                  />

                  <label className="w-full sm:w-auto inline-flex items-center justify-center space-x-1.5 px-3 py-2 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-xl text-xs font-semibold text-gray-700 cursor-pointer flex-shrink-0 transition">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Image</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleEditImageChange}
                      className="hidden"
                    />
                  </label>

                  {editingAd.image && (
                    <img
                      src={editingAd.image}
                      alt="Preview"
                      className="w-12 h-12 rounded-xl object-cover border border-gray-300 flex-shrink-0 shadow-2xs"
                      onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=100'; }}
                    />
                  )}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block font-bold text-gray-800 mb-1">
                  Description / විස්තරය <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={4}
                  required
                  value={editingAd.description || ''}
                  onChange={(e) => setEditingAd({ ...editingAd, description: e.target.value })}
                  placeholder="Enter full advertisement description..."
                  className="w-full border border-gray-300 rounded-xl p-3 text-xs sm:text-sm text-gray-900 bg-gray-50 focus:bg-white focus:outline-none focus:border-[#f03a5f] leading-relaxed"
                />
              </div>

              {/* Active Toggle */}
              <div className="flex items-center space-x-2 pt-1">
                <label className="flex items-center space-x-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={editingAd.isActive !== false}
                    onChange={(e) => setEditingAd({ ...editingAd, isActive: e.target.checked })}
                    className="rounded text-[#f03a5f] focus:ring-0 w-4 h-4 cursor-pointer"
                  />
                  <span className="font-bold text-xs text-gray-800">
                    Active on Website (දැන්වීම සජීවීව පෙන්වන්න)
                  </span>
                </label>
              </div>

              {/* Footer Buttons */}
              <div className="pt-4 border-t border-gray-200 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setEditingAd(null)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl text-xs transition"
                >
                  Cancel (අවලංගු කරන්න)
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#f03a5f] hover:bg-[#d92348] text-white font-bold rounded-xl text-xs transition shadow-sm active:scale-98"
                >
                  Save Changes (වෙනස්කම් සුරකින්න)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Request Special Offer Story Spot Modal */}
      {requestStoryAd && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-pink-200 shadow-2xl overflow-hidden my-auto animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-[#f03a5f] to-amber-500 text-white p-4 sm:p-5 flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center font-bold text-lg">
                  <Flame className="w-5 h-5 text-yellow-300 fill-yellow-300" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm sm:text-base tracking-tight">
                    Request Circular Story Spot
                  </h3>
                  <p className="text-[11px] text-pink-100 font-medium">
                    විශේෂ දීමනාවක් ලෙස Story Avatars වල පෙන්වන්න
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setRequestStoryAd(null)}
                className="w-8 h-8 rounded-full bg-black/20 hover:bg-black/30 flex items-center justify-center text-white transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmitStoryRequest} className="p-4 sm:p-6 space-y-4 text-xs">
              {/* Target Ad Info Preview */}
              <div className="bg-pink-50/60 border border-pink-200 rounded-xl p-3 flex items-center space-x-3">
                <img
                  src={requestStoryAd.image}
                  alt=""
                  className="w-14 h-14 rounded-lg object-cover border border-pink-300 flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <span className="bg-[#f03a5f] text-white text-[9px] font-extrabold px-1.5 py-0.2 rounded">
                    Ad #{requestStoryAd.id}
                  </span>
                  <h4 className="font-extrabold text-gray-900 text-xs sm:text-sm truncate mt-0.5">
                    {requestStoryAd.title}
                  </h4>
                  <p className="text-[11px] text-gray-500 truncate">
                    {requestStoryAd.location} • {requestStoryAd.price}
                  </p>
                </div>
              </div>

              {/* Special Offer Short Tag */}
              <div>
                <label className="block font-bold text-gray-800 mb-1">
                  Special Offer Tag / කෙටි ලේබලය <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  maxLength={20}
                  value={storyOfferTag}
                  onChange={(e) => setStoryOfferTag(e.target.value)}
                  placeholder="e.g. 🔥 50% OFF, ⭐ Special Deal, ⚡ Flash Sale"
                  className="w-full border border-gray-300 rounded-xl px-3 py-2 text-xs sm:text-sm text-gray-900 bg-gray-50 focus:bg-white focus:outline-none focus:border-[#f03a5f] font-bold"
                />
                <p className="text-[10px] text-gray-500 mt-1">
                  Story avatar එක යටින් පෙනෙන කෙටි ලේබලයයි (උපරිම අකුරු 20).
                </p>
              </div>

              {/* Offer Description */}
              <div>
                <label className="block font-bold text-gray-800 mb-1">
                  Offer Details / සුවිශේෂී දීමනාවේ විස්තරය
                </label>
                <textarea
                  rows={2}
                  value={storyOfferDetails}
                  onChange={(e) => setStoryOfferDetails(e.target.value)}
                  placeholder="e.g. Get 50% discount for first 10 callers today! Call now."
                  className="w-full border border-gray-300 rounded-xl p-2.5 text-xs text-gray-900 bg-gray-50 focus:bg-white focus:outline-none focus:border-[#f03a5f]"
                />
              </div>

              {/* Fee and Payment Method */}
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-3.5 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-gray-200">
                  <span className="font-extrabold text-gray-700 text-xs">
                    Spot Activation Fee (අය කරනු ලබන ගාස්තුව):
                  </span>
                  <span className="font-black text-sm text-[#f03a5f]">
                    Rs. {storySpotPrice.toLocaleString()}.00
                  </span>
                </div>

                <div className="space-y-2">
                  <label className="block font-bold text-gray-800 text-[11px]">
                    Select Payment Method (ගෙවීම් ක්‍රමය):
                  </label>

                  <label className="flex items-start space-x-2.5 p-2 rounded-lg border border-gray-200 bg-white cursor-pointer hover:border-pink-300 transition">
                    <input
                      type="radio"
                      name="storyPayment"
                      value="credits"
                      checked={storyPaymentMethod === 'credits'}
                      onChange={() => setStoryPaymentMethod('credits')}
                      className="mt-0.5 text-[#f03a5f] focus:ring-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-gray-900 text-xs">Pay via Wallet Credits</span>
                        <span className={`text-[10px] font-extrabold px-1.5 py-0.2 rounded ${credits >= storySpotPrice ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-700'}`}>
                          Balance: Rs. {credits.toLocaleString()}
                        </span>
                      </div>
                      <p className="text-[10px] text-gray-500 mt-0.5">
                        {credits >= storySpotPrice 
                          ? 'Deduct directly from your wallet balance with immediate verification.'
                          : 'Insufficient balance. Please choose Direct / Admin or top-up.'}
                      </p>
                    </div>
                  </label>

                  <label className="flex items-start space-x-2.5 p-2 rounded-lg border border-gray-200 bg-white cursor-pointer hover:border-pink-300 transition">
                    <input
                      type="radio"
                      name="storyPayment"
                      value="direct"
                      checked={storyPaymentMethod === 'direct'}
                      onChange={() => setStoryPaymentMethod('direct')}
                      className="mt-0.5 text-[#f03a5f] focus:ring-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-gray-900 text-xs">Contact Admin / Bank Deposit</span>
                        <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-1.5 py-0.2 rounded">
                          WhatsApp Slip
                        </span>
                      </div>
                      <p className="text-[10px] text-gray-500 mt-0.5">
                        Submit request and send payment slip via WhatsApp to Admin. Admin will place your ad upon confirmation.
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 border-t border-gray-200 flex items-center justify-end space-x-2.5">
                <button
                  type="button"
                  onClick={() => setRequestStoryAd(null)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl text-xs transition cursor-pointer"
                >
                  Cancel (අවලංගු කරන්න)
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-[#f03a5f] to-amber-500 hover:from-[#d92348] hover:to-amber-600 text-white font-extrabold rounded-xl text-xs transition shadow-md flex items-center space-x-1.5 active:scale-98 cursor-pointer"
                >
                  <Flame className="w-3.5 h-3.5 fill-current" />
                  <span>Submit Request (ඉල්ලුම් කරන්න)</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Ad Validity Renewal Modal (දැන්වීම නැවත සක්‍රීය කිරීම / අලුත් කිරීම) */}
      {renewalAd && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-lg w-full p-5 sm:p-6 shadow-2xl border border-gray-100 max-h-[90vh] overflow-y-auto space-y-4">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center font-bold">
                  <RefreshCw className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-black text-gray-900 leading-tight">
                    Renew & Re-activate Ad
                  </h3>
                  <p className="text-[11px] text-gray-500 font-semibold">
                    දැන්වීම නැවත සක්‍රීය කර Live Feed එකට එක් කරන්න
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setRenewalAd(null)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-700 flex items-center justify-center transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Target Ad Preview Card */}
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl border border-gray-200">
              <img
                src={renewalAd.image}
                alt={renewalAd.title}
                className="w-16 h-14 object-cover rounded-lg border border-gray-300 shrink-0"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] font-bold bg-gray-200 text-gray-800 px-1.5 py-0.5 rounded">
                    {renewalAd.badgeType || renewalAd.type || 'Normal Ad'}
                  </span>
                  <span className="text-[10px] font-bold bg-rose-100 text-rose-700 px-1.5 py-0.5 rounded">
                    Ad ID: #{renewalAd.id}
                  </span>
                </div>
                <h4 className="font-extrabold text-xs text-gray-900 truncate mt-0.5">
                  {renewalAd.title}
                </h4>
                <p className="text-[11px] text-gray-500 font-semibold">
                  {renewalAd.location || 'Sri Lanka'} • Rs. {renewalAd.price || 'Negotiable'}
                </p>
              </div>
            </div>

            <form onSubmit={handleConfirmRenewal} className="space-y-4 text-xs">
              {/* Duration Selection (5, 10, 30 Days) */}
              <div>
                <label className="block font-bold text-gray-800 mb-1.5 flex items-center space-x-1">
                  <Calendar className="w-3.5 h-3.5 text-[#f03a5f]" />
                  <span>Select Validity Duration (වලංගු කාල සීමාව තෝරන්න):</span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { days: 5, label: '5 Days (දින 5)', desc: 'Quick boost' },
                    { days: 10, label: '10 Days (දින 10)', desc: 'Popular choice', badge: 'Popular' },
                    { days: 30, label: '30 Days (දින 30)', desc: 'Full month pass', badge: 'Save More' },
                  ].map(option => {
                    const priceForOption = getRenewalCost(renewalAd, option.days);
                    const isSelected = renewalDays === option.days;
                    return (
                      <button
                        key={option.days}
                        type="button"
                        onClick={() => setRenewalDays(option.days)}
                        className={`relative p-3 rounded-xl border text-left transition flex flex-col justify-between ${
                          isSelected
                            ? 'border-[#f03a5f] bg-rose-50/50 shadow-xs ring-1 ring-[#f03a5f]'
                            : 'border-gray-200 bg-white hover:border-gray-300'
                        }`}
                      >
                        {option.badge && (
                          <span className="absolute -top-2 right-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[8px] font-black px-1.5 py-0.2 rounded-full uppercase tracking-wider shadow-2xs">
                            {option.badge}
                          </span>
                        )}
                        <div>
                          <span className={`block font-extrabold text-xs ${isSelected ? 'text-[#f03a5f]' : 'text-gray-900'}`}>
                            {option.label}
                          </span>
                          <span className="text-[10px] text-gray-500 block mt-0.5">
                            {option.desc}
                          </span>
                        </div>
                        <div className="mt-2 pt-1 border-t border-gray-100">
                          <span className="text-xs font-black text-gray-900">
                            Rs. {priceForOption.toLocaleString()}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Total Fee & Payment Method Selection */}
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-3.5 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-gray-200">
                  <span className="font-extrabold text-gray-700 text-xs">
                    Renewal Fee for {renewalDays} Days:
                  </span>
                  <span className="font-black text-sm text-[#f03a5f]">
                    Rs. {getRenewalCost(renewalAd, renewalDays).toLocaleString()}.00
                  </span>
                </div>

                <div className="space-y-2">
                  <label className="block font-bold text-gray-800 text-[11px]">
                    Payment Method (ගෙවීම් ක්‍රමය):
                  </label>

                  {/* Option A: Wallet Credits */}
                  <label className={`flex items-start space-x-2.5 p-2.5 rounded-xl border cursor-pointer transition ${
                    renewalPaymentMode === 'credits' 
                      ? 'border-[#f03a5f] bg-rose-50/40 ring-1 ring-[#f03a5f]' 
                      : 'border-gray-200 bg-white hover:border-pink-300'
                  }`}>
                    <input
                      type="radio"
                      name="renewalPayment"
                      value="credits"
                      checked={renewalPaymentMode === 'credits'}
                      onChange={() => setRenewalPaymentMode('credits')}
                      className="mt-0.5 text-[#f03a5f] focus:ring-0 cursor-pointer"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-gray-900 text-xs flex items-center gap-1">
                          <Wallet className="w-3.5 h-3.5 text-[#f03a5f]" />
                          <span>Pay with Wallet Credits (ක්ෂණික සක්‍රීය කිරීම)</span>
                        </span>
                        <span className={`text-[10px] font-extrabold px-1.5 py-0.2 rounded ${
                          credits >= getRenewalCost(renewalAd, renewalDays) 
                            ? 'bg-emerald-100 text-emerald-800' 
                            : 'bg-rose-100 text-rose-700'
                        }`}>
                          Wallet: Rs. {credits.toLocaleString()}
                        </span>
                      </div>
                      <p className="text-[10px] text-gray-500 mt-0.5">
                        {credits >= getRenewalCost(renewalAd, renewalDays)
                          ? 'Immediate activation! Credits will be deducted and your ad will be live immediately.'
                          : 'Insufficient wallet credits. Please choose Bank Transfer / WhatsApp Slip below.'}
                      </p>
                    </div>
                  </label>

                  {/* Option B: Direct / WhatsApp Slip */}
                  <label className={`flex items-start space-x-2.5 p-2.5 rounded-xl border cursor-pointer transition ${
                    renewalPaymentMode === 'direct' 
                      ? 'border-[#f03a5f] bg-rose-50/40 ring-1 ring-[#f03a5f]' 
                      : 'border-gray-200 bg-white hover:border-pink-300'
                  }`}>
                    <input
                      type="radio"
                      name="renewalPayment"
                      value="direct"
                      checked={renewalPaymentMode === 'direct'}
                      onChange={() => setRenewalPaymentMode('direct')}
                      className="mt-0.5 text-[#f03a5f] focus:ring-0 cursor-pointer"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-gray-900 text-xs flex items-center gap-1">
                          <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Contact Admin & Bank Slip (WhatsApp)</span>
                        </span>
                        <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-1.5 py-0.2 rounded">
                          Bank Transfer
                        </span>
                      </div>
                      <p className="text-[10px] text-gray-500 mt-0.5">
                        Send bank deposit/transfer slip to Admin via WhatsApp. Admin will approve and re-activate within minutes.
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 border-t border-gray-200 flex items-center justify-end space-x-2.5">
                <button
                  type="button"
                  onClick={() => setRenewalAd(null)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl text-xs transition cursor-pointer"
                >
                  Cancel (අවලංගු කරන්න)
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-gradient-to-r from-rose-600 to-[#f03a5f] hover:from-rose-700 hover:to-[#d92348] text-white font-black rounded-xl text-xs transition shadow-md flex items-center space-x-1.5 active:scale-98 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>
                    {renewalPaymentMode === 'credits' 
                      ? `Pay Rs. ${getRenewalCost(renewalAd, renewalDays).toLocaleString()} & Re-activate` 
                      : `Submit Renewal Request (${renewalDays} Days)`}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
