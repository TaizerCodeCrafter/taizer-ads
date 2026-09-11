import React, { useState, useEffect } from 'react';
import { ShieldCheck, MessageCircle, ArrowRight, CheckCircle2, Settings, Edit, RefreshCw, Smartphone, Clock, ShieldAlert } from 'lucide-react';
import { useDialog } from '../context/DialogContext.jsx';
import { dispatchOtp, normalizePhoneNumber } from '../utils/smsService.js';

export default function LoginForm({
  onLoginSuccess,
  onOpenAgents,
  onShowToast,
  siteConfig = {},
  isCeoUnlocked = false,
  onOpenAdminTab
}) {
  const { showAlert } = useDialog();
  const formCfg = siteConfig?.loginForm || {};
  const smsCfg = siteConfig?.smsGateway || {};

  const title = formCfg.title || 'Login/ Register';
  const subtitle = formCfg.subtitle || 'ගිණුමට log වීම සහ ගිණුමක් සාදා ගැනීම යන කාර්යයන් දෙකවම මෙම form එක භාවිතා කරන්න.';
  const phoneLabel = formCfg.phoneLabel || 'Enter Phone Number';
  const phoneHelpText = formCfg.phoneHelpText || 'ඔබගේ දුරකථන අංකය ඇතුලත් කර Send OTP Click කරන්න.';
  const phonePlaceholder = formCfg.phonePlaceholder || 'XXXXXXX';
  const defaultCountryCode = formCfg.defaultCountryCode || '+94';
  const sendOtpButtonText = formCfg.sendOtpButtonText || 'Send OTP';
  const sendOtpButtonColor = formCfg.sendOtpButtonColor || '#991230';
  
  const otpSentMessage = formCfg.otpSentMessage || 'OTP Code sent to:';
  const otpHintText = formCfg.otpHintText || 'Enter verification code to continue';
  const otpLabel = formCfg.otpLabel || '4-Digit Verification OTP';
  const verifyButtonText = formCfg.verifyButtonText || 'Verify & Login (ඇතුල් වන්න)';
  const backButtonText = formCfg.backButtonText || 'Back';

  const agentSectionTitle = formCfg.agentSectionTitle || 'Agent support to post an ad.';
  const agentSectionSubtitle = formCfg.agentSectionSubtitle || 'දැන්වීමක් පලකර ගැනීමට නියෝජිත සහාය.';
  const agentButtonText = formCfg.agentButtonText || 'See Agents';
  const agentButtonColor = formCfg.agentButtonColor || '#0f172a';
  const agentButtonAction = formCfg.agentButtonAction || 'modal'; // 'modal' | 'whatsapp' | 'url'
  const agentCustomUrl = formCfg.agentCustomUrl || '';
  const rawWhatsapp = formCfg.agentWhatsappNumber || siteConfig?.contact?.whatsapp || '94771234567';
  const cleanWhatsapp = rawWhatsapp.replace(/[^0-9]/g, '');

  const [countryCode, setCountryCode] = useState(defaultCountryCode);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpStep, setOtpStep] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [activeOtp, setActiveOtp] = useState('');
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [otpSentPhone, setOtpSentPhone] = useState('');
  const [isLiveSmsSent, setIsLiveSmsSent] = useState(false);

  // Normalize phone display (removes redundant leading 0 if country code +94 is chosen)
  const getFormattedPhoneDisplay = () => {
    let clean = (phoneNumber || '').replace(/[^0-9]/g, '');
    if (countryCode === '+94' && clean.startsWith('0')) {
      clean = clean.substring(1);
    }
    return `${countryCode} ${clean}`;
  };

  // 60-Second countdown for Resend OTP
  useEffect(() => {
    let timer;
    if (resendCooldown > 0) {
      timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  const handleSendOtp = async (e) => {
    e?.preventDefault();
    const cleanPhone = phoneNumber.replace(/[^0-9]/g, '');
    if (!cleanPhone || cleanPhone.length < 8) {
      await showAlert({
        title: 'Phone Number Required',
        titleSin: 'දුරකථන අංකය අවශ්‍යයි',
        message: 'Please enter a valid mobile phone number (e.g. 077 123 4567).',
        messageSin: 'කරුණාකර ඉදිරියට යාමට ඔබගේ දුරකථන අංකය ඇතුළත් කරන්න (උදා: 077 123 4567).',
        type: 'warning'
      });
      return;
    }

    setIsSendingOtp(true);

    try {
      const result = await dispatchOtp({
        phone: cleanPhone,
        countryCode,
        smsConfig: smsCfg
      });

      setIsSendingOtp(false);

      if (result.success) {
        setActiveOtp(result.otpCode);
        setOtpSentPhone(result.phone);
        setIsLiveSmsSent(result.isLive);
        setOtpStep(true);
        setResendCooldown(60);

        if (result.isLive) {
          onShowToast && onShowToast(`Real SMS sent to +${result.phone}! Check your inbox.`);
        } else {
          // Demo / Test Mode - Smooth toast without intrusive popup
          onShowToast && onShowToast(`Test Code: ${result.otpCode} (Demo Mode)`);
        }
      } else {
        showAlert({
          title: 'SMS Delivery Notice',
          titleSin: 'SMS පිළිබඳ දැනුම්දීම',
          message: `${result.message || 'Could not send SMS.'} You can use the master test code: 1234 to log in.`,
          messageSin: 'Notify.lk හරහා සැබෑ SMS යැවීම අසාර්ථක විය (SMS Balance හෝ API Key පරීක්ෂා කරන්න). ලොග් වීම සඳහා Master Code එක: 1234 ඇතුළත් කරන්න.',
          type: 'warning'
        });
        setActiveOtp('1234');
        setOtpStep(true);
        setResendCooldown(30);
      }
    } catch (err) {
      setIsSendingOtp(false);
      console.error('Error dispatching OTP:', err);
      showAlert({
        title: 'Connection Notice',
        titleSin: 'සම්බන්ධතා දැනුම්දීම',
        message: 'Could not connect to SMS Gateway. You can still login with test code: 1234',
        messageSin: 'SMS Gateway වෙත සම්බන්ධ වීමට නොහැකි විය. ලොග් වීම සඳහා 1234 කේතය භාවිත කරන්න.',
        type: 'info'
      });
      setActiveOtp('1234');
      setOtpStep(true);
      setResendCooldown(30);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    const cleanInput = otpCode.trim();
    if (!cleanInput) {
      await showAlert({
        title: 'OTP Required',
        titleSin: 'OTP කේතය අවශ්‍යයි',
        message: 'Please enter the 4-digit verification code sent to your phone.',
        messageSin: 'කරුණාකර ඔබගේ දුරකථනයට ලැබුණු OTP කේතය ඇතුළත් කරන්න.',
        type: 'warning'
      });
      return;
    }

    // Verify against generated activeOtp or master code 1234
    if (cleanInput !== activeOtp && cleanInput !== '1234') {
      await showAlert({
        title: 'Incorrect OTP Code',
        titleSin: 'කේතය වැරදියි',
        message: 'The OTP code you entered is invalid. Please check your SMS inbox or click "Resend OTP".',
        messageSin: 'ඔබ ඇතුළත් කළ OTP කේතය වැරදියි. කරුණාකර නැවත උත්සාහ කරන්න හෝ අලුත් කේතයක් ඉල්ලන්න.',
        type: 'danger'
      });
      return;
    }

    // Successful login
    onLoginSuccess({
      phone: `${countryCode} ${phoneNumber}`,
      id: `#${Math.floor(10000 + Math.random() * 90000)}`,
      type: 'User'
    });
  };

  const handleAgentButtonClick = () => {
    if (agentButtonAction === 'whatsapp') {
      window.open(`https://wa.me/${cleanWhatsapp}?text=Hello%20Taizer%20Ads%20Agent,%20I%20need%20assistance%20with%20posting%20my%20ad.`, '_blank');
    } else if (agentButtonAction === 'url' && agentCustomUrl) {
      window.open(agentCustomUrl, '_blank');
    } else {
      onOpenAgents();
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 sm:p-8 max-w-xl animate-in fade-in duration-200">
      {/* Title & Quick Edit for Admin */}
      <div className="space-y-1 pb-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight">
            {title}
          </h2>
          {isCeoUnlocked && (
            <button
              type="button"
              onClick={() => onOpenAdminTab && onOpenAdminTab('loginForm')}
              className="inline-flex items-center space-x-1 text-xs font-bold text-[#f03a5f] hover:bg-pink-50 px-2 py-1 rounded-lg transition"
              title="Edit Login Form in Admin Panel"
            >
              <Edit className="w-3.5 h-3.5" />
              <span>Admin Edit</span>
            </button>
          )}
        </div>
        <div className="w-10 h-1 bg-[#f03a5f] rounded-full" />
        <p className="text-xs text-gray-600 pt-1 font-medium leading-relaxed">
          {subtitle}
        </p>
      </div>

      {!otpStep ? (
        /* Step 1: Enter Phone Number */
        <form onSubmit={handleSendOtp} className="space-y-4 pt-2">
          <div>
            <label className="block text-xs font-bold text-gray-900 mb-1">
              {phoneLabel}
            </label>
            <p className="text-[11px] text-gray-500 mb-2">
              {phoneHelpText}
            </p>

            <div className="flex items-center space-x-2">
              <select
                value={countryCode}
                onChange={(e) => setCountryCode(e.target.value)}
                className="border border-gray-300 rounded-lg px-2.5 py-2.5 text-xs bg-gray-50 font-bold focus:outline-none focus:border-[#f03a5f]"
              >
                <option value="+94">+94</option>
                <option value="+1">+1</option>
                <option value="+44">+44</option>
                <option value="+971">+971</option>
                <option value="+61">+61</option>
                <option value="+91">+91</option>
              </select>

              <input
                type="tel"
                required
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder={phonePlaceholder}
                className="flex-1 border border-gray-300 rounded-lg px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#f03a5f] font-medium"
              />
            </div>
          </div>

          {/* Send OTP Button with Loading State */}
          <button
            type="submit"
            disabled={isSendingOtp}
            style={{ backgroundColor: sendOtpButtonColor }}
            className={`w-full text-white font-bold py-2.5 px-4 rounded-lg text-xs md:text-sm transition shadow-sm active:scale-[0.99] flex items-center justify-center space-x-2 ${
              isSendingOtp ? 'opacity-80 cursor-wait' : 'hover:brightness-110'
            }`}
          >
            {isSendingOtp ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Sending SMS OTP to Phone...</span>
              </>
            ) : (
              <span>{sendOtpButtonText}</span>
            )}
          </button>
        </form>
      ) : (
        /* Step 2: Enter OTP Code */
        <form onSubmit={handleVerifyOtp} className="space-y-4 pt-2">
          {/* SMS Status Notification Box */}
          {isLiveSmsSent ? (
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3.5 text-xs text-emerald-950 space-y-1.5 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1.5 font-bold text-emerald-800">
                  <Smartphone className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Real SMS Sent to: {otpSentPhone ? `+${otpSentPhone}` : getFormattedPhoneDisplay()}</span>
                </div>
                <span className="bg-emerald-200 text-emerald-900 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Live SMS
                </span>
              </div>
              <p className="text-[11px] text-emerald-700 leading-relaxed font-medium">
                Notify.lk හරහා ඔබගේ දුරකථනයට කෙටි පණිවිඩයක් (SMS) යවන ලදී. එම 4-digit OTP කේතය පහතින් ඇතුළත් කරන්න.
              </p>
            </div>
          ) : (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 text-xs text-amber-950 space-y-1.5 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1.5 font-bold text-amber-900">
                  <Smartphone className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>{otpSentMessage} {getFormattedPhoneDisplay()}</span>
                </div>
                <span className="bg-amber-200 text-amber-900 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Demo Mode
                </span>
              </div>
              <p className="text-[11px] text-amber-800 leading-relaxed">
                සත්‍ය SMS යැවීමට Admin Panel එකෙන් Notify.lk සක්‍රිය කරන්න. පරීක්ෂා කිරීම සඳහා කේතය: <strong className="font-black text-amber-950 bg-amber-200/80 px-2 py-0.5 rounded text-xs tracking-wider">{activeOtp || '1234'}</strong> (හෝ 1234).
              </p>
            </div>
          )}

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold text-gray-900">
                {otpLabel}
              </label>
              {/* Resend OTP Cooldown */}
              {resendCooldown > 0 ? (
                <span className="text-[11px] text-gray-500 font-medium flex items-center space-x-1">
                  <Clock className="w-3.5 h-3.5 text-gray-400" />
                  <span>Resend in {resendCooldown}s</span>
                </span>
              ) : (
                <button
                  type="button"
                  onClick={handleSendOtp}
                  disabled={isSendingOtp}
                  className="text-[11px] text-[#f03a5f] hover:underline font-bold flex items-center space-x-1"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Resend OTP SMS</span>
                </button>
              )}
            </div>

            <input
              type="text"
              required
              maxLength={6}
              value={otpCode}
              onChange={(e) => setOtpCode(e.target.value)}
              placeholder="••••"
              className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-center text-lg tracking-[0.3em] font-black focus:outline-none focus:border-[#f03a5f] bg-gray-50 text-gray-900"
            />
          </div>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => {
                setOtpStep(false);
                setOtpCode('');
              }}
              className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-lg text-xs transition"
            >
              {backButtonText}
            </button>
            <button
              type="submit"
              className="flex-1 bg-[#16a34a] hover:bg-[#15803d] text-white font-bold py-2.5 px-4 rounded-lg text-xs md:text-sm transition shadow-sm active:scale-[0.99]"
            >
              {verifyButtonText}
            </button>
          </div>
        </form>
      )}

      {/* Dotted separator line */}
      <div className="border-t border-dashed border-gray-200 my-6" />

      {/* Agent Support Section (Screenshot) */}
      <div className="space-y-3">
        <div>
          <h4 className="text-xs font-bold text-gray-900">
            {agentSectionTitle}
          </h4>
          <p className="text-[11px] text-gray-500 mt-0.5">
            {agentSectionSubtitle}
          </p>
        </div>

        <button
          type="button"
          onClick={handleAgentButtonClick}
          style={{ backgroundColor: agentButtonColor }}
          className="w-full text-white font-bold py-2.5 px-4 rounded-lg text-xs md:text-sm transition shadow-sm flex items-center justify-center space-x-2 hover:brightness-110 active:scale-[0.99]"
        >
          {agentButtonAction === 'whatsapp' ? (
            <MessageCircle className="w-4 h-4 text-green-400" />
          ) : (
            <ShieldCheck className="w-4 h-4 text-purple-400" />
          )}
          <span>{agentButtonText}</span>
        </button>
      </div>
    </div>
  );
}
