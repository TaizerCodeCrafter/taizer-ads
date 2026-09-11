export const defaultSiteConfig = {
  // Top Banner (Breathing pulse admin banner)
  topBanner: {
    title: "Download Taizer Ads Android App.",
    subtitle: "Taizer Ads ඇන්ඩ්‍රොයිඩ් ඇප් එක ඩවුන්ලෝඩ් කරන්න.",
    badgeText: "Admin Ad",
    bgColor: "#f06277",
    bgGradient: "linear-gradient(135deg, #f06277 0%, #f59e0b 100%)",
    isGradient: false,
    pulseAnimation: true,
    targetUrl: "https://taizerads.lk/download/taizer_ads.apk",
    actionType: "modal", // 'url' | 'modal'
    openInNewTab: true,
    apkUrl: "https://taizerads.lk/download/taizer_ads.apk",
  },

  // Safety Tips Banner
  safetyBanner: {
    title: "Safety Tips",
    sinhalaTitle: "ආරක්ෂිත උපදෙස්",
    bgColor: "#eab308",
  },

  // Login / Register Form Customization (Admin editable)
  loginForm: {
    title: "Login/ Register",
    subtitle: "ගිණුමට log වීම සහ ගිණුමක් සාදා ගැනීම යන කාර්යයන් දෙකවම මෙම form එක භාවිතා කරන්න.",
    phoneLabel: "Enter Phone Number",
    phoneHelpText: "ඔබගේ දුරකථන අංකය ඇතුලත් කර Send OTP Click කරන්න.",
    phonePlaceholder: "XXXXXXX",
    defaultCountryCode: "+94",
    sendOtpButtonText: "Send OTP",
    sendOtpButtonColor: "#991230",
    otpHintText: "Enter verification code to continue",
    otpLabel: "4-Digit Verification OTP",
    verifyButtonText: "Verify & Login (ඇතුල් වන්න)",
    backButtonText: "Back",
    agentSectionTitle: "Agent support to post an ad.",
    agentSectionSubtitle: "දැන්වීමක් පලකර ගැනීමට නියෝජිත සහාය.",
    agentButtonText: "See Agents",
    agentButtonColor: "#0f172a",
    agentButtonAction: "modal", // 'modal' | 'whatsapp' | 'url'
    agentCustomUrl: "",
    agentWhatsappNumber: "+94771234567"
  },

  // SMS Gateway Configuration (Notify.lk Integration for Sri Lanka)
  smsGateway: {
    provider: 'notifylk',
    enabled: true,
    isLive: false, // Set true once Notify.lk User ID and API Key are entered
    userId: '',
    apiKey: '',
    senderId: 'NotifyDEMO',
    otpLength: 4,
    otpExpiryMinutes: 5,
    messageTemplate: 'Your Taizer Ads verification code is: {OTP}. Valid for 5 minutes. Do not share this code.',
    testPhoneNumber: ''
  },

  // Pricing Tiers (Top-up)
  pricing: {
    normalAd: 700,
    superAd: 1500,
    vipAd: 10000,
    storySpot: 2000,
  },

  // Official Bank Details
  bankDetails: {
    bankName: "Commercial Bank PLC",
    accountName: "Taizer Ads Advertising",
    accountNumber: "8001 2345 6789",
    branch: "Colombo City Branch",
  },

  // Official Contact Channels
  contact: {
    whatsapp: "+94771234567",
    telegram: "+94764097500",
    email: "support@taizerads.lk",
  },

  // Initial Verified Agents
  agents: [
    { id: 1, name: "Colombo Central Verified Agent", phone: "+94 77 123 4567", rating: "4.9/5", status: "Active" },
    { id: 2, name: "Kandy Regional Support Agent", phone: "+94 71 888 9900", rating: "4.8/5", status: "Active" },
    { id: 3, name: "Galle Southern Coast Agent", phone: "+94 76 555 4433", rating: "4.9/5", status: "Active" },
  ],

  // Initial Complaints
  complaints: [
    {
      id: "c-1",
      adId: "ad-1",
      adTitle: "GENUINE LIVE CAM SHOW & MULTIMEDIA STUDIO",
      reason: "Advance Payment Request",
      details: "Requested advance reload before service confirmation.",
      status: "Under Review",
      date: "2026-09-10"
    }
  ],

  // Admin-managed Site Notices / Announcements (සිංහල නිවේදන)
  notices: [
    {
      id: "notice-1",
      titleSin: "විශේෂ ආරක්ෂක නිවේදනයයි (Security Notice)",
      titleEn: "Important Safety Notice",
      contentSin: "කිසිදු දැන්වීම්කරුවෙකුට භාණ්ඩ හෝ සේවා ලබා ගැනීමට පෙර Advance මුදල් (Reload / බැංකු තැන්පතු) නොගෙවන්න. සියලු ගනුදෙනු පරීක්ෂා කිරීමෙන් පසු පමණක් සිදු කරන්න!",
      contentEn: "Do not send advance payments (Reload or Bank transfer) before receiving or verifying services. Beware of scammers!",
      type: "danger", // 'danger' | 'warning' | 'info' | 'success'
      badgeSin: "හදිසි අවවාදයයි",
      badgeEn: "Urgent Warning",
      isActive: true,
      isPinned: true,
      createdAt: "2026-09-11"
    },
    {
      id: "notice-2",
      titleSin: "දැන්වීම් පළ කිරීම හා අනුමැතිය (Ad Approvals)",
      titleEn: "Ad Approval Notice",
      contentSin: "ඔබ ඇතුළත් කරන සියලු දැන්වීම් අපගේ Admin කණ්ඩායම විසින් මිනිත්තු කිහිපයකින් පරීක්ෂා කර Live කරනු ලැබේ.",
      contentEn: "All new advertisements are verified by the Admin team and approved live within a few minutes.",
      type: "info",
      badgeSin: "Admin තොරතුරු",
      badgeEn: "Admin Info",
      isActive: true,
      isPinned: false,
      createdAt: "2026-09-11"
    }
  ],

  // Super Admin Profile & Access Credentials
  adminProfile: {
    name: "Master Administrator",
    email: "admin@taizerads.lk",
    phone: "+94 77 123 4567",
    passcode: "ceo",
    role: "CEO / Super Admin",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=faces",
    lastUpdated: "2026-09-11"
  },

  // Side Toggle Button & Highlighted Blog Posts System
  sideBlog: {
    button: {
      title: "Admin Blog",
      titleSin: "විශේෂ ලිපි",
      badgeText: "HOT",
      badgeColor: "#f59e0b",
      bgColor: "#881337",
      bgGradient: "linear-gradient(135deg, #881337 0%, #be123c 100%)",
      isGradient: true,
      pulseAnimation: true,
      iconType: "Flame" // 'Flame' | 'BookOpen' | 'Sparkles' | 'Zap'
    },
    posts: [
      {
        id: "blog-1",
        title: "How to Safely Book Services & Avoid Advance Scams in Colombo (2026 Guide)",
        titleSin: "කොළඹ සේවා වංචාවලින් තොරව ආරක්ෂිතව ලබාගන්නේ කෙසේද? (2026 සම්පූර්ණ මගපෙන්වීම)",
        category: "Featured Guide",
        badge: "⭐ Admin Highlight",
        excerpt: "Discover insider safety tips, how to verify genuine advertisers, avoid reload scams, and ensure privacy before meeting.",
        excerptSin: "දැන්වීම්කරුවන් නිවැරදිව තහවුරු කරගන්නා ආකාරය, පෙර ගෙවීම් (Reload) වංචා මඟහැරීම සහ ආරක්ෂාව තහවුරු කරගන්නා අයුරු.",
        content: "1. Never send advance money via reload or bank transfer before meeting or verifying service.\n2. Always verify phone numbers and request live confirmation.\n3. Report suspicious profiles immediately using the Taizer Ads complaint portal.",
        imageUrl: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&fit=crop&q=80",
        linkUrl: "https://taizerads.lk/blog/safety-guide-2026",
        actionButtonText: "Read Article / ලිපිය බලන්න",
        isPrimary: true,
        isActive: true,
        author: "Chief Editor",
        readTime: "3 min read",
        publishedDate: "2026-09-11"
      },
      {
        id: "blog-2",
        title: "5 Signs of a Scam Advertisement & How Taizer Ads Verifies Listings",
        titleSin: "ව්‍යාජ දැන්වීම් හඳුනාගැනීමේ ප්‍රධාන ලක්ෂණ 5ක් සහ Taizer Ads ආරක්ෂක පද්ධතිය",
        category: "Safety Tips",
        badge: "🛡️ Scam Alert",
        excerpt: "Spotting fake images, unrealistically low prices, and unverified accounts in Sri Lankan classifieds.",
        excerptSin: "ව්‍යාජ ඡායාරූප, අස්වාභාවික අඩු මිල ගණන් සහ තහවුරු නොකළ ගිණුම් ක්ෂණිකව හඳුනාගන්න.",
        content: "Here are the top 5 warning signs: 1. Demanding money upfront. 2. Refusing phone voice calls. 3. Stock photos stolen from social media. 4. Constant number changing. 5. Vague location details.",
        imageUrl: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&fit=crop&q=80",
        linkUrl: "https://taizerads.lk/blog/scam-prevention",
        actionButtonText: "View Post / ලිපිය",
        isPrimary: false,
        isActive: true,
        author: "Security Team",
        readTime: "4 min read",
        publishedDate: "2026-09-10"
      },
      {
        id: "blog-3",
        title: "How to Boost Your Business Ads with VIP & Super Ads Placement",
        titleSin: "VIP සහ Super Ads මගින් ඔබගේ දැන්වීම් වල ප්‍රතිඵල 400% කින් වැඩිකර ගන්නා ආකාරය",
        category: "Promotions",
        badge: "🚀 Growth Guide",
        excerpt: "Step-by-step tutorial on how to top the search results and receive hundreds of verified client calls weekly.",
        excerptSin: "පළමු පිටුවේ ඉහළින්ම රැඳී සිටිමින් දිනපතා වැඩිම පාරිභෝගික ඇමතුම් ලබාගන්නා ආකාරය.",
        content: "VIP and Super ads enjoy 5x higher visibility, pinned positions at the top of category feeds, and distinct gold badges that build instant trust.",
        imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&fit=crop&q=80",
        linkUrl: "https://taizerads.lk/blog/boost-ads",
        actionButtonText: "Boost Guide / විස්තර",
        isPrimary: false,
        isActive: true,
        author: "Marketing Team",
        readTime: "2 min read",
        publishedDate: "2026-09-09"
      }
    ]
  }
};

