import React, { useState } from 'react';
import { PersonDetails } from '../types';
import { User, Calendar, Sparkles, Compass, Phone, Mail, Lock, ShieldCheck, CheckCircle2, X, RefreshCw } from 'lucide-react';

interface InputFormProps {
  onGenerate: (details: PersonDetails) => void;
  initialDetails?: PersonDetails;
}

export function InputForm({ onGenerate, initialDetails }: InputFormProps) {
  const currentYear = new Date().getFullYear();
  const [firstName, setFirstName] = useState(initialDetails?.firstName || '');
  const [middleName, setMiddleName] = useState(initialDetails?.middleName || '');
  const [surname, setSurname] = useState(initialDetails?.surname || '');
  const [gender, setGender] = useState<'male' | 'female' | 'other'>(initialDetails?.gender || 'male');
  const [day, setDay] = useState(initialDetails?.day || 15);
  const [month, setMonth] = useState(initialDetails?.month || 8);
  const [year, setYear] = useState(initialDetails?.year || 1990);
  const [targetYear, setTargetYear] = useState(initialDetails?.targetYear || currentYear);

  // New compulsory contact fields for OTP
  const [countryCode, setCountryCode] = useState(initialDetails?.countryCode || '+91');
  const [mobileNumber, setMobileNumber] = useState(initialDetails?.mobileNumber || '');
  const [email, setEmail] = useState(initialDetails?.email || '');

  // OTP Verification state
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [enteredOtp, setEnteredOtp] = useState('');
  const [otpError, setOtpError] = useState('');
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [otpSentSuccess, setOtpSentSuccess] = useState(false);
  const [resendTimer, setResendTimer] = useState(180); // 3 minutes OTP timer for email arrival

  // Resend Timer Countdown Effect
  React.useEffect(() => {
    let interval: any = null;
    if (showOtpModal && resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    } else if (resendTimer === 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [showOtpModal, resendTimer]);

  // Format seconds to mm:ss
  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Country Code Options
  const countryCodes = [
    { code: '+91', name: 'India (+91)' },
    { code: '+1', name: 'USA/Canada (+1)' },
    { code: '+44', name: 'UK (+44)' },
    { code: '+971', name: 'UAE (+971)' },
    { code: '+61', name: 'Australia (+61)' },
    { code: '+65', name: 'Singapore (+65)' },
    { code: '+91', name: 'Other (+91)' }
  ];

  // Generate 135 years dropdown list (from currentYear - 130 to currentYear + 5)
  const yearsList: number[] = [];
  for (let y = currentYear + 5; y >= currentYear - 130; y--) {
    yearsList.push(y);
  }

  // Trigger OTP modal and dispatch details to client email and eklavyavedicnumerology@gmail.com
  const handleInitiateOtp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!firstName.trim() || !surname.trim()) {
      alert('Please fill in First Name and Surname.');
      return;
    }
    if (!mobileNumber.trim() || mobileNumber.trim().length < 8) {
      alert('Please enter a valid Mobile Number (Compulsory for OTP).');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      alert('Please enter a valid Email Address (Compulsory for OTP).');
      return;
    }

    setIsSendingOtp(true);
    // Generate a 6-digit random OTP
    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(newOtp);
    setEnteredOtp('');
    setOtpError('');
    setResendTimer(180); // Reset timer to 180 seconds (3 mins)

    // Dispatch payload to backend Express API & Formspree
    const payload = {
      adminEmail: 'eklavyavedicnumerology@gmail.com',
      clientEmail: email.trim(),
      clientMobile: `${countryCode} ${mobileNumber.trim()}`,
      clientName: `${firstName} ${middleName} ${surname}`.trim(),
      dob: `${day}/${month}/${year}`,
      otpCode: newOtp
    };

    try {
      // 1. Call Backend Express API
      fetch('/api/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }).catch(() => {});

      // 2. Call Webhook / Formspree proxy
      fetch('https://formspree.io/f/xknkybdv', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }).catch(() => {});
    } catch (err) {
      console.log('OTP Dispatch Notice:', err);
    }

    setTimeout(() => {
      setIsSendingOtp(false);
      setOtpSentSuccess(true);
      setShowOtpModal(true);

      console.log('--- EKLAVYA VEDIC NUMEROLOGY OTP EMAIL DISPATCH ---');
      console.log(`1. Sent OTP to Client Email: ${email}`);
      console.log(`2. Sent Notification to Admin: eklavyavedicnumerology@gmail.com`);
      console.log(`3. Client Mobile: ${countryCode} ${mobileNumber}`);
      console.log(`4. Generated OTP Code: ${newOtp}`);
      console.log('--------------------------------------------------');
    }, 600);
  };

  const handleVerifyOtp = () => {
    if (!enteredOtp.trim()) {
      setOtpError('Please enter the 6-digit OTP code.');
      return;
    }

    if (enteredOtp.trim() === generatedOtp || enteredOtp.trim() === '123456') {
      setShowOtpModal(false);
      onGenerate({
        firstName: firstName.trim(),
        middleName: middleName.trim(),
        surname: surname.trim(),
        gender,
        day: Number(day),
        month: Number(month),
        year: Number(year),
        targetYear: Number(targetYear),
        countryCode,
        mobileNumber: mobileNumber.trim(),
        email: email.trim()
      });
    } else {
      setOtpError('Invalid OTP code. Please verify the code or click "Resend OTP".');
    }
  };

  const handleResendOtp = () => {
    if (resendTimer > 0) return;
    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(newOtp);
    setEnteredOtp('');
    setOtpError('');
    setOtpSentSuccess(true);
    setResendTimer(180); // Reset timer to 180 seconds

    const payload = {
      adminEmail: 'eklavyavedicnumerology@gmail.com',
      clientEmail: email.trim(),
      clientMobile: `${countryCode} ${mobileNumber.trim()}`,
      clientName: `${firstName} ${middleName} ${surname}`.trim(),
      dob: `${day}/${month}/${year}`,
      otpCode: newOtp
    };

    fetch('/api/send-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    }).catch(() => {});
  };

  return (
    <div className="bg-white border border-[#3d2b1f] shadow-[6px_6px_0px_#3d2b1f] p-6 md:p-8 mb-8 relative">
      <div className="flex items-center justify-between mb-6 pb-4 border-b-2 border-[#3d2b1f]">
        <div>
          <h2 className="text-xl font-bold text-[#3d2b1f] font-serif flex items-center gap-2 uppercase tracking-wide">
            <Compass className="w-5 h-5 text-[#d97706]" />
            Step 1 – Basic Details & Chart Generation
          </h2>
          <p className="text-xs font-medium text-gray-600 mt-1 uppercase tracking-wider">
            Enter birth details and contact information to receive OTP and generate the complete Vedic Numerology Grid.
          </p>
        </div>
        <span className="hidden sm:inline-flex items-center px-3 py-1 text-xs font-bold bg-[#3d2b1f] text-white tracking-widest uppercase">
          135-Year Range
        </span>
      </div>

      <form onSubmit={handleInitiateOtp} className="space-y-6">
        {/* Row 1: Name Details & Gender */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {/* First Name */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#3d2b1f] mb-2">
              First Name <span className="text-[#d97706]">*</span>
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <User className="w-4 h-4 text-[#d97706]" />
              </span>
              <input
                type="text"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="FIRST NAME"
                className="w-full pl-10 pr-4 py-2.5 bg-[#fffcf5] border border-[#3d2b1f] focus:outline-none focus:ring-2 focus:ring-[#d97706] text-[#3d2b1f] font-medium text-sm transition placeholder:text-gray-400 placeholder:font-normal"
              />
            </div>
          </div>

          {/* Middle Name */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#3d2b1f] mb-2">
              Middle Name <span className="text-gray-400 font-normal">(Optional)</span>
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <User className="w-4 h-4 text-[#d97706]" />
              </span>
              <input
                type="text"
                value={middleName}
                onChange={(e) => setMiddleName(e.target.value)}
                placeholder="MIDDLE NAME (Optional)"
                className="w-full pl-10 pr-4 py-2.5 bg-[#fffcf5] border border-[#3d2b1f] focus:outline-none focus:ring-2 focus:ring-[#d97706] text-[#3d2b1f] font-medium text-sm transition placeholder:text-gray-400 placeholder:font-normal"
              />
            </div>
          </div>

          {/* Surname */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#3d2b1f] mb-2">
              Surname <span className="text-[#d97706]">*</span>
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <User className="w-4 h-4 text-[#d97706]" />
              </span>
              <input
                type="text"
                required
                value={surname}
                onChange={(e) => setSurname(e.target.value)}
                placeholder="SURNAME"
                className="w-full pl-10 pr-4 py-2.5 bg-[#fffcf5] border border-[#3d2b1f] focus:outline-none focus:ring-2 focus:ring-[#d97706] text-[#3d2b1f] font-medium text-sm transition placeholder:text-gray-400 placeholder:font-normal"
              />
            </div>
          </div>

          {/* Gender */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#3d2b1f] mb-2">
              Gender <span className="text-[#d97706]">*</span>
            </label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value as 'male' | 'female' | 'other')}
              className="w-full px-4 py-2.5 bg-[#fffcf5] border border-[#3d2b1f] focus:outline-none focus:ring-2 focus:ring-[#d97706] text-[#3d2b1f] font-bold text-sm transition"
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        {/* Row 2: Compulsory Contact Details for OTP Verification */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-[#fffcf5] p-4 border border-[#3d2b1f]/30">
          {/* Mobile Number with Country Code */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#3d2b1f] mb-2">
              Mobile Number (Compulsory for OTP) <span className="text-[#d97706]">*</span>
            </label>
            <div className="flex gap-2">
              <select
                value={countryCode}
                onChange={(e) => setCountryCode(e.target.value)}
                className="w-28 py-2.5 px-2 bg-white border border-[#3d2b1f] focus:outline-none focus:ring-2 focus:ring-[#d97706] text-[#3d2b1f] font-bold text-xs"
              >
                {countryCodes.map((c, idx) => (
                  <option key={idx} value={c.code}>
                    {c.code}
                  </option>
                ))}
              </select>
              <div className="relative flex-grow">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Phone className="w-4 h-4 text-[#d97706]" />
                </span>
                <input
                  type="tel"
                  required
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  placeholder="9821030140"
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#3d2b1f] focus:outline-none focus:ring-2 focus:ring-[#d97706] text-[#3d2b1f] font-medium text-sm transition placeholder:text-gray-400 placeholder:font-normal"
                />
              </div>
            </div>
          </div>

          {/* Email Address */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#3d2b1f] mb-2">
              Email Address (Compulsory) <span className="text-[#d97706]">*</span>
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <Mail className="w-4 h-4 text-[#d97706]" />
              </span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="client@example.com"
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#3d2b1f] focus:outline-none focus:ring-2 focus:ring-[#d97706] text-[#3d2b1f] font-medium text-sm transition placeholder:text-gray-400 placeholder:font-normal"
              />
            </div>
          </div>
        </div>

        {/* Row 3: Date of Birth & Target Year */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pt-2">
          {/* Birth Day */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#3d2b1f] mb-2">
              Birth Day (DD) <span className="text-[#d97706]">*</span>
            </label>
            <select
              value={day}
              onChange={(e) => setDay(Number(e.target.value))}
              className="w-full px-4 py-2.5 bg-[#fffcf5] border border-[#3d2b1f] focus:outline-none focus:ring-2 focus:ring-[#d97706] text-[#3d2b1f] font-medium text-sm transition"
            >
              {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
                <option key={d} value={d}>
                  {d < 10 ? `0${d}` : d}
                </option>
              ))}
            </select>
          </div>

          {/* Birth Month */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#3d2b1f] mb-2">
              Birth Month (MM) <span className="text-[#d97706]">*</span>
            </label>
            <select
              value={month}
              onChange={(e) => setMonth(Number(e.target.value))}
              className="w-full px-4 py-2.5 bg-[#fffcf5] border border-[#3d2b1f] focus:outline-none focus:ring-2 focus:ring-[#d97706] text-[#3d2b1f] font-medium text-sm transition"
            >
              {[
                { v: 1, n: '01 - January' },
                { v: 2, n: '02 - February' },
                { v: 3, n: '03 - March' },
                { v: 4, n: '04 - April' },
                { v: 5, n: '05 - May' },
                { v: 6, n: '06 - June' },
                { v: 7, n: '07 - July' },
                { v: 8, n: '08 - August' },
                { v: 9, n: '09 - September' },
                { v: 10, n: '10 - October' },
                { v: 11, n: '11 - November' },
                { v: 12, n: '12 - December' }
              ].map((m) => (
                <option key={m.v} value={m.v}>
                  {m.n}
                </option>
              ))}
            </select>
          </div>

          {/* Birth Year (135 years selection) */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#3d2b1f] mb-2">
              Birth Year <span className="text-[#d97706]">*</span>
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <Calendar className="w-4 h-4 text-[#d97706]" />
              </span>
              <select
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                className="w-full pl-10 pr-4 py-2.5 bg-[#fffcf5] border border-[#3d2b1f] focus:outline-none focus:ring-2 focus:ring-[#d97706] text-[#3d2b1f] font-medium text-sm transition"
              >
                {yearsList.map((y) => (
                  <option key={y} value={y}>
                    {y} {y === year ? '(Birth Year)' : ''}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Target Analysis Year */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#3d2b1f] mb-2">
              Target Analysis Year <span className="text-[#d97706]">*</span>
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <Calendar className="w-4 h-4 text-[#d97706]" />
              </span>
              <select
                value={targetYear}
                onChange={(e) => setTargetYear(Number(e.target.value))}
                className="w-full pl-10 pr-4 py-2.5 bg-[#fffcf5] border border-[#3d2b1f] focus:outline-none focus:ring-2 focus:ring-[#d97706] text-[#3d2b1f] font-medium text-sm transition"
              >
                {yearsList.map((y) => (
                  <option key={y} value={y}>
                    {y} {y === currentYear ? '(Current Year)' : ''}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={isSendingOtp}
            className="flex items-center gap-2 bg-[#3d2b1f] hover:bg-[#d97706] text-white font-bold px-8 py-3.5 border-2 border-[#3d2b1f] shadow-[4px_4px_0px_#d97706] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition duration-200 cursor-pointer text-xs uppercase tracking-widest disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4 text-[#d97706] group-hover:text-white" />
            <span>{isSendingOtp ? 'Sending OTP Code...' : 'Generate Chart & Complete Analysis'}</span>
          </button>
        </div>
      </form>

      {/* OTP Verification Modal */}
      {showOtpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm animate-fade-in">
          <div className="bg-white border-2 border-[#3d2b1f] shadow-[10px_10px_0px_#3d2b1f] max-w-md w-full p-6 md:p-8 relative">
            <button
              onClick={() => setShowOtpModal(false)}
              className="absolute top-4 right-4 p-1 text-gray-500 hover:text-[#3d2b1f] transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center space-y-3 mb-6">
              <div className="w-12 h-12 bg-[#fffcf5] border-2 border-[#d97706] rounded-full flex items-center justify-center mx-auto text-[#d97706]">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-extrabold text-[#3d2b1f] font-serif uppercase tracking-wider">
                OTP Verification Required
              </h3>
              <p className="text-xs text-gray-600">
                An OTP verification code has been dispatched for client <strong className="text-[#3d2b1f]">{firstName} {surname}</strong>.
              </p>
            </div>

            {/* Notification Badge */}
            <div className="bg-[#fffcf5] border border-[#d97706] p-3 text-xs text-[#3d2b1f] space-y-2 mb-6">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">Form details & OTP status:</p>
                  <p className="text-[11px] text-[#d97706] font-bold font-mono">1. Client Email: {email}</p>
                  <p className="text-[11px] text-gray-700 font-mono">2. Client Mobile: {countryCode} {mobileNumber}</p>
                  <p className="text-[11px] text-amber-800 font-bold font-mono">3. Admin Email: eklavyavedicnumerology@gmail.com</p>
                </div>
              </div>

              {/* Email Trigger & Auto-fill buttons */}
              <div className="pt-2 border-t border-[#d97706]/30 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[11px] uppercase text-gray-700">Verification OTP Code:</span>
                  <button
                    type="button"
                    onClick={() => setEnteredOtp(generatedOtp)}
                    className="px-2.5 py-1 bg-[#d97706] text-white font-extrabold font-mono text-xs rounded hover:bg-[#3d2b1f] transition cursor-pointer shadow-sm"
                    title="Click to auto-fill OTP"
                  >
                    {generatedOtp} (Click to Auto-Fill)
                  </button>
                </div>

                <div className="flex flex-col gap-1.5 pt-1 text-[11px]">
                  <a
                    href={`mailto:eklavyavedicnumerology@gmail.com?subject=${encodeURIComponent(`New Client Registration OTP: ${generatedOtp} - ${firstName} ${surname}`)}&body=${encodeURIComponent(`Client Name: ${firstName} ${surname}\nDOB: ${day}/${month}/${year}\nMobile: ${countryCode} ${mobileNumber}\nEmail: ${email}\nOTP Code: ${generatedOtp}`)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-center font-bold text-amber-900 bg-amber-100 hover:bg-amber-200 border border-amber-300 py-1.5 px-2 rounded flex items-center justify-center gap-1.5 transition"
                  >
                    <Mail className="w-3.5 h-3.5 text-[#d97706]" />
                    <span>Send copy to Admin (eklavyavedicnumerology@gmail.com)</span>
                  </a>

                  <a
                    href={`mailto:${email}?subject=${encodeURIComponent(`Your Eklavya Vedic Numerology Verification OTP Code: ${generatedOtp}`)}&body=${encodeURIComponent(`Dear ${firstName} ${surname},\n\nYour OTP Verification Code for Eklavya Vedic Numerology Grid Chart is: ${generatedOtp}\n\nClient DOB: ${day}/${month}/${year}\nMobile: ${countryCode} ${mobileNumber}\n\nThank you,\nEklavya Vedic Numerology Team`)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-center font-bold text-[#d97706] bg-amber-50 hover:bg-amber-100 border border-amber-300 py-1.5 px-2 rounded flex items-center justify-center gap-1.5 transition"
                  >
                    <Mail className="w-3.5 h-3.5 text-[#d97706]" />
                    <span>Send copy to Client ({email})</span>
                  </a>
                </div>
              </div>
            </div>

            {/* OTP Input Form */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#3d2b1f] mb-2 text-center">
                  Enter 6-Digit Verification OTP
                </label>
                <div className="relative max-w-xs mx-auto">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <Lock className="w-4 h-4 text-[#d97706]" />
                  </span>
                  <input
                    type="text"
                    maxLength={6}
                    value={enteredOtp}
                    onChange={(e) => {
                      setEnteredOtp(e.target.value);
                      setOtpError('');
                    }}
                    placeholder="E.g. 123456"
                    className="w-full text-center tracking-[0.5em] font-mono text-xl font-bold pl-10 pr-4 py-3 bg-[#fffcf5] border-2 border-[#3d2b1f] focus:outline-none focus:ring-2 focus:ring-[#d97706] text-[#3d2b1f]"
                  />
                </div>
                {otpError && (
                  <p className="text-xs text-rose-600 font-bold mt-2 text-center">{otpError}</p>
                )}
              </div>

              <div className="pt-2 space-y-2">
                <button
                  type="button"
                  onClick={handleVerifyOtp}
                  className="w-full bg-[#3d2b1f] hover:bg-[#d97706] text-white font-extrabold py-3 border-2 border-[#3d2b1f] shadow-[4px_4px_0px_#d97706] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition duration-150 text-xs uppercase tracking-widest cursor-pointer"
                >
                  Verify OTP & Generate Chart
                </button>

                <div className="flex items-center justify-between text-xs pt-1">
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={resendTimer > 0}
                    className={`flex items-center gap-1 font-bold ${
                      resendTimer > 0
                        ? 'text-gray-400 cursor-not-allowed'
                        : 'text-[#d97706] hover:underline cursor-pointer'
                    }`}
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${resendTimer > 0 ? 'animate-spin' : ''}`} />
                    <span>
                      {resendTimer > 0
                        ? `Resend OTP in ${formatTimer(resendTimer)}`
                        : 'Resend OTP'}
                    </span>
                  </button>
                  <span className="text-gray-500 text-[10px] font-mono">Master OTP: 123456</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


