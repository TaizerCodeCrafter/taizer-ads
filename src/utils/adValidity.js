/**
 * Ad Validity & Real-Time Auto-Expiration Utility Helper
 */

export function calculateExpiryDate(days = 5, fromDate = new Date()) {
  const base = fromDate instanceof Date ? fromDate : new Date(fromDate);
  const numDays = Math.max(0.1, Number(days) || 5);
  const expiry = new Date(base.getTime() + numDays * 24 * 60 * 60 * 1000);
  return expiry.toISOString();
}

export function calculateExpiryFromDateString(dateStr) {
  if (!dateStr) return calculateExpiryDate(5);
  const target = new Date(dateStr);
  // Set to end of the selected day (23:59:59)
  target.setHours(23, 59, 59, 999);
  return target.toISOString();
}

export function getDaysBetween(targetDate, fromDate = new Date()) {
  const target = new Date(targetDate).getTime();
  const from = new Date(fromDate).getTime();
  const diffMs = target - from;
  return Math.max(1, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
}

export function formatDateForDateInput(date = new Date()) {
  const d = date instanceof Date ? date : new Date(date);
  return d.toISOString().split('T')[0];
}

export function getAdValidity(ad) {
  if (!ad) {
    return {
      isExpired: false,
      daysRemaining: 5,
      hoursRemaining: 120,
      formattedExpiry: '',
      timeRemainingText: '5d left',
      statusBadge: 'Active'
    };
  }

  const now = Date.now();

  // 1. Explicitly flagged as expired
  if (ad.isExpired) {
    const formatted = ad.expiresAt 
      ? new Date(ad.expiresAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
      : 'Expired';
    return {
      isExpired: true,
      daysRemaining: 0,
      hoursRemaining: 0,
      formattedExpiry: formatted,
      timeRemainingText: 'Expired',
      statusBadge: 'Expired'
    };
  }

  // 2. Real-time auto-check if ad has an expiresAt date
  if (ad.expiresAt) {
    const expiryTime = new Date(ad.expiresAt).getTime();
    const diffMs = expiryTime - now;
    const isExpired = diffMs <= 0;

    const formatted = new Date(ad.expiresAt).toLocaleDateString('en-GB', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    });

    if (isExpired) {
      return {
        isExpired: true,
        daysRemaining: 0,
        hoursRemaining: 0,
        formattedExpiry: formatted,
        timeRemainingText: 'Expired (කල් ඉකුත් විය)',
        statusBadge: 'Expired'
      };
    }

    const daysRemaining = Math.max(1, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
    const hoursRemaining = Math.max(1, Math.ceil(diffMs / (1000 * 60 * 60)));
    const timeRemainingText = hoursRemaining < 24 
      ? `${hoursRemaining}h left` 
      : `${daysRemaining}d left`;

    return {
      isExpired: false,
      daysRemaining,
      hoursRemaining,
      formattedExpiry: formatted,
      timeRemainingText,
      statusBadge: 'Active'
    };
  }

  // 3. If ad has approvedAt and validityDays, compute real expiration
  if (ad.approvedAt && ad.validityDays) {
    const approvedTime = new Date(ad.approvedAt).getTime();
    const expiryTime = approvedTime + (ad.validityDays * 24 * 60 * 60 * 1000);
    const diffMs = expiryTime - now;
    const isExpired = diffMs <= 0;

    const formatted = new Date(expiryTime).toLocaleDateString('en-GB', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    });

    if (isExpired) {
      return {
        isExpired: true,
        daysRemaining: 0,
        hoursRemaining: 0,
        formattedExpiry: formatted,
        timeRemainingText: 'Expired (කල් ඉකුත් විය)',
        statusBadge: 'Expired'
      };
    }

    const daysRemaining = Math.max(1, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
    return {
      isExpired: false,
      daysRemaining,
      hoursRemaining: daysRemaining * 24,
      formattedExpiry: formatted,
      timeRemainingText: `${daysRemaining}d left`,
      statusBadge: 'Active'
    };
  }

  // Fallback for pending or unapproved ad
  const days = Number(ad.validityDays) || 5;
  return {
    isExpired: false,
    daysRemaining: days,
    hoursRemaining: days * 24,
    formattedExpiry: `${days} Days from Approval`,
    timeRemainingText: `${days}d`,
    statusBadge: 'Active'
  };
}

/**
 * Location-Aware Search Utilities for Taizer Ads
 * Supports searching by:
 * - Location (English & Sinhala synonyms, e.g. Colombo <-> කොළඹ, Kandy <-> නුවර/මහනුවර, Galle <-> ගාල්ල)
 * - Ad Title, Description, Category, Badge Type, Price, Phone Number
 * - Multi-word queries (e.g. "spa colombo", "girls kandy")
 */

export const LOCATION_SYNONYMS = [
  { en: ['colombo', 'cmb', 'kolamba'], sin: ['කොළඹ', 'කොලඹ'] },
  { en: ['kandy', 'nuwara', 'mahanuwara'], sin: ['මහනුවර', 'නුවර'] },
  { en: ['gampaha'], sin: ['ගම්පහ'] },
  { en: ['galle'], sin: ['ගාල්ල'] },
  { en: ['negombo', 'meegamuwa'], sin: ['මීගමුව', 'මිගමුව'] },
  { en: ['kalutara'], sin: ['කළුතර', 'කලුතර'] },
  { en: ['matara'], sin: ['මාතර'] },
  { en: ['kurunegala'], sin: ['කුරුණෑගල', 'කුරුනෑගල'] },
  { en: ['anuradhapura'], sin: ['අනුරාධපුර', 'අනුරාධපුරය'] },
  { en: ['polonnaruwa'], sin: ['පොළොන්නරුව', 'පොලොන්නරුව'] },
  { en: ['ratnapura'], sin: ['රත්නපුර', 'රත්නපුරය'] },
  { en: ['badulla'], sin: ['බදුල්ල'] },
  { en: ['bandarawela'], sin: ['බණ්ඩාරවෙල'] },
  { en: ['nuwara eliya', 'nuwaraeliya'], sin: ['නුවරඑළිය', 'නුවරඑලිය'] },
  { en: ['matale'], sin: ['මාතලේ'] },
  { en: ['kegalle'], sin: ['කෑගල්ල'] },
  { en: ['puttalam'], sin: ['පුත්තලම'] },
  { en: ['chilaw'], sin: ['හලාවත'] },
  { en: ['jaffna'], sin: ['යාපනය'] },
  { en: ['batticaloa'], sin: ['මඩකලපුව'] },
  { en: ['trincomalee', 'trinco'], sin: ['ත්‍රිකුණාමලය'] },
  { en: ['hambantota'], sin: ['හම්බන්තොට'] },
  { en: ['monaragala'], sin: ['මොණරාගල', 'මොනරාගල'] },
  { en: ['ampara'], sin: ['අම්පාර'] },
  { en: ['dehiwala', 'dehiwela'], sin: ['දෙහිවල'] },
  { en: ['mount lavinia', 'lavinia'], sin: ['ගල්කිස්ස'] },
  { en: ['nugegoda'], sin: ['නුගේගොඩ'] },
  { en: ['maharagama'], sin: ['මහරගම'] },
  { en: ['kotte', 'sri jayawardenepura'], sin: ['කෝට්ටේ'] },
  { en: ['battaramulla'], sin: ['බත්තරමුල්ල'] },
  { en: ['malabe'], sin: ['මාලබේ'] },
  { en: ['kaduwela'], sin: ['කඩුවෙල'] },
  { en: ['homagama'], sin: ['හෝමාගම'] },
  { en: ['kottawa'], sin: ['කොට්ටාව'] },
  { en: ['moratuwa'], sin: ['මොරටුව'] },
  { en: ['panadura'], sin: ['පානදුර'] },
  { en: ['horana'], sin: ['හොරණ'] },
  { en: ['piliyandala'], sin: ['පිළියන්දල', 'පිලියන්දල'] },
  { en: ['wattala'], sin: ['වත්තල'] },
  { en: ['ja-ela', 'ja ela'], sin: ['ජා-ඇල', 'ජා ඇල'] },
  { en: ['kelaniya'], sin: ['කැලණිය'] },
  { en: ['kiribathgoda'], sin: ['කිරිබත්ගොඩ'] },
  { en: ['kadawatha'], sin: ['කඩවත'] },
  { en: ['ragama'], sin: ['රාගම'] },
  { en: ['avissawella'], sin: ['අවිස්සාවේල්ල'] },
  { en: ['island-wide', 'islandwide', 'sri lanka', 'all island'], sin: ['මුළු දිවයිනම', 'දිවයින පුරා'] },
];

/**
 * Expand a search term to include its location synonyms (both EN and SIN)
 */
export function expandSearchTerm(term) {
  const cleanTerm = (term || '').toLowerCase().trim();
  if (!cleanTerm) return [];

  const foundGroup = LOCATION_SYNONYMS.find(group => {
    const inEn = group.en.some(e => e === cleanTerm || e.includes(cleanTerm) || cleanTerm.includes(e));
    const inSin = group.sin.some(s => s === cleanTerm || s.includes(cleanTerm) || cleanTerm.includes(s));
    return inEn || inSin;
  });

  if (foundGroup) {
    return Array.from(new Set([cleanTerm, ...foundGroup.en, ...foundGroup.sin]));
  }

  return [cleanTerm];
}

/**
 * Check whether an advertisement matches a search query.
 * Multi-word queries require all words to match across ad fields.
 * Location synonyms are automatically checked.
 */
export function matchAdSearch(ad, rawQuery) {
  if (!rawQuery || !rawQuery.trim()) return true;
  if (!ad) return false;

  const query = rawQuery.trim().toLowerCase();
  const terms = query.split(/\s+/).filter(Boolean);
  if (terms.length === 0) return true;

  // Build searchable text corpus for this ad
  const searchableCorpus = [
    ad.location || '',
    ad.city || '',
    ad.district || '',
    ad.title || '',
    ad.description || '',
    ad.category || '',
    ad.categoryLabel || '',
    ad.badgeType || '',
    ad.phone || '',
    ad.price || '',
    ad.userName || '',
    ad.name || '',
    ad.id ? String(ad.id) : '',
    Array.isArray(ad.packages) ? ad.packages.join(' ') : ''
  ].join(' ').toLowerCase();

  // Dedicated location corpus
  const locationCorpus = [
    ad.location || '',
    ad.city || '',
    ad.district || '',
    Array.isArray(ad.packages) ? ad.packages.join(' ') : ''
  ].join(' ').toLowerCase();

  // Every term in the user's query must match somewhere in the ad
  return terms.every(term => {
    // 1. Direct match in the whole corpus
    if (searchableCorpus.includes(term)) return true;

    // 2. Location expansion match
    const expandedSynonyms = expandSearchTerm(term);
    const hasLocationMatch = expandedSynonyms.some(syn => 
      locationCorpus.includes(syn) || searchableCorpus.includes(syn)
    );

    return hasLocationMatch;
  });
}

/**
 * Checks if a given payment slip URL / Base64 string is a PDF document
 */
export function isPdfSlip(url) {
  if (!url || typeof url !== 'string') return false;
  return url.startsWith('data:application/pdf') ||
         url.toLowerCase().endsWith('.pdf') ||
         url.toLowerCase().includes('.pdf?') ||
         url.includes('application/pdf');
}
