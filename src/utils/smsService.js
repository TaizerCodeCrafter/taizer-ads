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
  let clean = phone.replace(/[^0-9+]/g, '');

  if (clean.startsWith('+')) {
    clean = clean.substring(1);
  }

  // Handle local 10-digit 07XXXXXXXX
  if (clean.startsWith('0') && clean.length === 10) {
    clean = '94' + clean.substring(1);
  } else if (clean.length === 9 && (clean.startsWith('7') || clean.startsWith('1') || clean.startsWith('2') || clean.startsWith('3') || clean.startsWith('4') || clean.startsWith('5') || clean.startsWith('6') || clean.startsWith('8') || clean.startsWith('9'))) {
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
 * High-level OTP Dispatcher
 * Dispatches either real SMS (if Live mode & keys configured) or simulation test code
 */
export async function dispatchOtp({ phone, countryCode = '+94', smsConfig = {} }) {
  const fullPhone = `${countryCode}${phone}`.trim();
  const normalized = normalizePhoneNumber(fullPhone);
  const otpLength = Number(smsConfig?.otpLength) || 4;
  const otpCode = generateOtp(otpLength);

  const rawTemplate = smsConfig?.messageTemplate || 'Your Taizer Ads verification code is: {OTP}. Valid for 5 minutes. Do not share this code.';
  const message = rawTemplate.replace(/\{OTP\}/g, otpCode);

  const isLive = Boolean(smsConfig?.isLive && smsConfig?.userId && smsConfig?.apiKey);

  if (isLive) {
    const result = await sendNotifyLkSms({
      to: normalized,
      message,
      userId: smsConfig.userId,
      apiKey: smsConfig.apiKey,
      senderId: smsConfig.senderId || 'NotifyDEMO'
    });

    return {
      ...result,
      otpCode, // Kept in memory for client verification
      phone: normalized,
      isLive: true,
      timestamp: Date.now()
    };
  } else {
    // Demo / Test Mode
    return {
      success: true,
      isLive: false,
      otpCode,
      phone: normalized,
      message: `[Test Mode] OTP generated: ${otpCode} (Or use test code: 1234)`,
      timestamp: Date.now()
    };
  }
}
