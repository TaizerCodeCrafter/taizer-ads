/**
 * Real SMS Gateway Service for Notify.lk (Sri Lanka)
 * Handles phone normalization, OTP generation, API delivery, and test fallback
 */

/**
 * Normalizes Sri Lankan phone numbers to international standard: 947XXXXXXXX
 * Examples:
 * '0771234567' -> '94771234567'
 * '+94 77 123 4567' -> '94771234567'
 * '771234567' -> '94771234567'
 */
export function normalizePhoneNumber(phone) {
  if (!phone) return '';
  let clean = phone.toString().replace(/[^0-9]/g, '');

  // Handle redundant 0 when combined with country code: +9407... or 9407...
  if (clean.startsWith('940')) {
    clean = '94' + clean.substring(3);
  } else if (clean.startsWith('0')) {
    clean = '94' + clean.substring(1);
  } else if (!clean.startsWith('94') && clean.length === 9) {
    clean = '94' + clean;
  }

  return clean;
}

/**
 * Generate a random 4-digit or 6-digit OTP code
 */
export function generateOtp(length = 4) {
  if (length === 6) {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }
  return Math.floor(1000 + Math.random() * 9000).toString();
}

/**
 * Send real SMS using Notify.lk API
 */
export async function sendNotifyLkSms({ to, message, userId, apiKey, senderId = 'NotifyDEMO' }) {
  const normalizedPhone = normalizePhoneNumber(to);

  if (!normalizedPhone || normalizedPhone.length < 9) {
    return {
      success: false,
      message: 'Invalid Sri Lankan phone number. (වලංගු දුරකථන අංකයක් ඇතුළත් කරන්න)'
    };
  }

  if (!userId || !apiKey) {
    return {
      success: false,
      isMissingCredentials: true,
      message: 'Notify.lk User ID & API Key are required in Admin Panel.'
    };
  }

  try {
    // Notify.lk REST API endpoint
    const endpoint = 'https://app.notify.lk/api/v1/send';

    const formData = new FormData();
    formData.append('user_id', userId.toString().trim());
    formData.append('api_key', apiKey.toString().trim());
    formData.append('sender_id', (senderId || 'NotifyDEMO').toString().trim());
    formData.append('to', normalizedPhone);
    formData.append('message', message);

    const response = await fetch(endpoint, {
      method: 'POST',
      body: formData
    });

    const data = await response.json().catch(() => null);

    if (response.ok && data && (data.status === 'success' || data.code === 200)) {
      return {
        success: true,
        data,
        message: `Real SMS dispatched to +${normalizedPhone} via Notify.lk!`
      };
    } else {
      const errMsg = data?.message || (typeof data?.data === 'string' ? data.data : 'Notify.lk delivery failed');
      return {
        success: false,
        error: errMsg,
        message: errMsg
      };
    }
  } catch (err) {
    console.warn('Direct POST failed (likely browser CORS policy). Trying GET fallback...', err);

    // Fallback GET format supported by Notify.lk
    try {
      const getUrl = `https://app.notify.lk/api/v1/send?user_id=${encodeURIComponent(userId)}&api_key=${encodeURIComponent(apiKey)}&sender_id=${encodeURIComponent(senderId || 'NotifyDEMO')}&to=${encodeURIComponent(normalizedPhone)}&message=${encodeURIComponent(message)}`;
      
      await fetch(getUrl, { mode: 'no-cors' });
      return {
        success: true,
        message: `Real SMS requested for +${normalizedPhone} via Notify.lk!`
      };
    } catch (fallbackErr) {
      return {
        success: false,
        error: err.message,
        message: 'Could not connect to Notify.lk SMS gateway. Check internet or credentials.'
      };
    }
  }
}

/**
 * Strict Sri Lankan Mobile Validator
 * Accepts:
 * - 070, 071, 072, 074, 075, 076, 077, 078 (10 digits)
 * - 70, 71, 72, 74, 75, 76, 77, 78 (9 digits)
 * - 9470, 9471, 9472, 9474, 9475, 9476, 9477, 9478 (11 digits)
 * Rejects all fake / short numbers (e.g. 5151, 1234) and landlines (011, 081, etc.)
 */
export function isValidSriLankanMobile(phone) {
  if (!phone) return false;
  let clean = phone.toString().replace(/[^0-9]/g, '');
  if (clean.startsWith('940')) {
    clean = clean.substring(3);
  } else if (clean.startsWith('94')) {
    clean = clean.substring(2);
  } else if (clean.startsWith('0')) {
    clean = clean.substring(1);
  }
  const validMobilePrefixes = ['70', '71', '72', '74', '75', '76', '77', '78'];
  if (clean.length !== 9) return false;
  return validMobilePrefixes.some(prefix => clean.startsWith(prefix));
}

/**
 * High-level OTP Dispatcher
 * Dispatches real SMS via Notify.lk Gateway with strict phone validation
 */
export async function dispatchOtp({ phone, countryCode = '+94', smsConfig = {} }) {
  let cleanUserPhone = (phone || '').toString().trim();
  if (cleanUserPhone.startsWith('0')) {
    cleanUserPhone = cleanUserPhone.substring(1);
  }
  const fullPhone = `${countryCode}${cleanUserPhone}`.trim();
  const normalized = normalizePhoneNumber(fullPhone);

  // 1. Strict Sri Lankan Mobile Validation
  if (!isValidSriLankanMobile(normalized)) {
    return {
      success: false,
      message: 'Invalid Sri Lankan mobile number. Must be a 9 or 10-digit mobile number starting with 07X (e.g. 077 123 4567).',
      messageSin: 'වලංගු ශ්‍රී ලාංකික ජංගම දුරකථන අංකයක් ඇතුළත් කරන්න (උදා: 077 123 4567 හෝ 77 123 4567).'
    };
  }

  const otpLength = Number(smsConfig?.otpLength) || 4;
  const otpCode = generateOtp(otpLength);

  const rawTemplate = smsConfig?.messageTemplate || 'Your Taizer Ads verification code is: {OTP}. Valid for 5 minutes. Do not share this code.';
  const message = rawTemplate.replace(/\{OTP\}/g, otpCode);

  // Active Notify.lk credentials
  const userId = smsConfig?.userId || '32931';
  const apiKey = smsConfig?.apiKey || 'KzxrjBYwh8kWWVQywsb1';
  const senderId = smsConfig?.senderId || 'NotifyDEMO';

  const result = await sendNotifyLkSms({
    to: normalized,
    message,
    userId,
    apiKey,
    senderId
  });

  return {
    ...result,
    otpCode,
    phone: normalized,
    isLive: true,
    timestamp: Date.now()
  };
}
