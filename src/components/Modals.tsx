"use client";

import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import {
  X,
  CheckCircle,
  ShieldCheck,
  MapPin,
  Smartphone,
  Mail,
  Lock,
  User,
  ArrowRight,
} from "lucide-react";

export const LoginModal: React.FC = () => {
  const { isLoginModalOpen, setIsLoginModalOpen, login, signup, t } = useApp();
  const [isRegister, setIsRegister] = useState(false);
  const [phoneOrEmail, setPhoneOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [otpStep, setOtpStep] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isLoginModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneOrEmail.trim()) return;
    setLoading(true);

    if (isRegister) {
      const email = phoneOrEmail.includes("@")
        ? phoneOrEmail
        : `user_${Date.now()}@ashaal.com.bd`;
      const phone = phoneOrEmail.includes("@")
        ? "+880 1700-000000"
        : phoneOrEmail;
      await signup({
        name: fullName,
        email,
        phone,
        password,
      });
      setLoading(false);
      setIsLoginModalOpen(false);
      return;
    }

    if (!otpStep && phoneOrEmail.includes("17") && !password) {
      setOtpStep(true);
      setLoading(false);
      return;
    }

    await login(phoneOrEmail, password);
    setLoading(false);
    setOtpStep(false);
    setIsLoginModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden relative border border-gray-100 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#16a34a] to-[#15803d] text-white p-5 flex items-center justify-between">
          <div>
            <h3 className="font-extrabold text-lg">
              {otpStep
                ? t("Verify OTP Code", "ওটিপি কোড যাচাই করুন")
                : isRegister
                  ? t("Create Ashaal Account", "আশাল একাউন্ট তৈরি করুন")
                  : t("Welcome to Ashaal!", "আশালে স্বাগতম!")}
            </h3>
            <p className="text-xs text-green-100">
              {otpStep
                ? t(
                    "Enter 4-digit code sent to your phone",
                    "আপনার ফোনে পাঠানো ৪ ডিজিটের কোডটি দিন",
                  )
                : isRegister
                  ? t(
                      "Sign up for personal token, rewards & isolated cart",
                      "সাইন আপ করে উপভোগ করুন পার্সোনাল টোকেন ও রিওয়ার্ড",
                    )
                  : t(
                      "Login with phone or email to load your data",
                      "আপনার ফোন নম্বর বা ইমেইল দিয়ে লগইন করুন",
                    )}
            </p>
          </div>
          <button
            onClick={() => {
              setIsLoginModalOpen(false);
              setOtpStep(false);
            }}
            className="p-1 text-white/80 hover:text-white rounded-full hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Form */}
        <div className="p-6">
          {otpStep ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="text-center py-2">
                <div className="w-12 h-12 rounded-full bg-green-100 text-[#16a34a] flex items-center justify-center mx-auto mb-2 font-bold text-lg">
                  SMS
                </div>
                <p className="text-xs text-gray-600">
                  {t(
                    "Verification code sent to",
                    "ভেরিফিকেশন কোড পাঠানো হয়েছে",
                  )}{" "}
                  <span className="font-bold text-gray-900">
                    {phoneOrEmail}
                  </span>
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  {t("4-Digit SMS Verification Code", "৪ ডিজিট ভেরিফিকেশন কোড")}
                </label>
                <input
                  type="text"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  placeholder="••••"
                  maxLength={6}
                  className="w-full text-center tracking-widest text-xl font-bold py-2 border-2 border-green-300 rounded-lg focus:outline-none focus:border-[#16a34a]"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#16a34a] hover:bg-[#15803d] text-white font-bold py-2.5 rounded-lg text-sm transition-colors shadow-md shadow-green-600/20 cursor-pointer disabled:opacity-50"
              >
                {loading
                  ? t("Verifying...", "যাচাই করা হচ্ছে...")
                  : t("Verify & Continue", "যাচাই করে এগিয়ে যান")}
              </button>
            </form>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3.5">
              {isRegister && (
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    {t("Full Name", "পুরো নাম")}
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder={t(
                        "Enter your full name",
                        "আপনার পুরো নাম লিখুন",
                      )}
                      autoComplete="name"
                      className="w-full pl-9 pr-3 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:border-[#16a34a]"
                      required
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  {t("Phone Number or Email", "ফোন নম্বর অথবা ইমেইল")}
                </label>
                <div className="relative">
                  <Smartphone className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={phoneOrEmail}
                    onChange={(e) => setPhoneOrEmail(e.target.value)}
                    placeholder={t(
                      "Enter phone or email",
                      "ফোন নম্বর অথবা ইমেইল দিন",
                    )}
                    autoComplete="username"
                    className="w-full pl-9 pr-3 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:border-[#16a34a]"
                    required
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-gray-700">
                    {t("Password", "পাসওয়ার্ড")}
                  </label>
                  {!isRegister && (
                    <span className="text-[11px] text-[#16a34a]">
                      {t("Secure Login", "সুরক্ষিত লগইন")}
                    </span>
                  )}
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={t("Enter your password", "পাসওয়ার্ড দিন")}
                    autoComplete={
                      isRegister ? "new-password" : "current-password"
                    }
                    className="w-full pl-9 pr-3 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:border-[#16a34a]"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#16a34a] hover:bg-[#15803d] text-white font-bold py-2.5 rounded-lg text-xs sm:text-sm transition-colors shadow-md shadow-green-600/20 mt-2 cursor-pointer disabled:opacity-50"
              >
                {loading
                  ? t("Processing...", "প্রসেসিং হচ্ছে...")
                  : isRegister
                    ? t("SIGN UP", "সাইন আপ করুন")
                    : t("SIGN IN", "লগইন করুন")}
              </button>

              <div className="text-center pt-3 border-t border-gray-100">
                <p className="text-xs text-gray-600">
                  {isRegister
                    ? t("Already have an account?", "ইতিমধ্যে একাউন্ট আছে?")
                    : t("Don't have an account?", "কোনো একাউন্ট নেই?")}{" "}
                  <button
                    type="button"
                    onClick={() => setIsRegister(!isRegister)}
                    className="text-[#16a34a] font-bold hover:underline cursor-pointer"
                  >
                    {isRegister
                      ? t("Login Here", "লগইন করুন")
                      : t("Sign Up Free", "ফ্রি সাইন আপ")}
                  </button>
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export const LocationModal: React.FC = () => {
  const {
    isLocationModalOpen,
    setIsLocationModalOpen,
    activeLocation,
    setActiveLocation,
    showToast,
    t,
  } = useApp();

  const DIVISIONS = [
    {
      name: "Dhaka",
      cities: [
        "Dhaka North - Gulshan",
        "Dhaka North - Uttara",
        "Dhaka South - Dhanmondi",
        "Dhaka South - Mirpur",
        "Gazipur",
        "Narayanganj",
        "Savar",
      ],
    },
    {
      name: "Chittagong",
      cities: [
        "Chattogram City - Agrabad",
        "Chattogram - Nasirabad",
        "Cox’s Bazar",
        "Comilla",
      ],
    },
    {
      name: "Sylhet",
      cities: [
        "Sylhet Sadar - Zindabazar",
        "Moulvibazar",
        "Habiganj",
        "Sunamganj",
      ],
    },
    {
      name: "Rajshahi",
      cities: ["Rajshahi City - Shaheb Bazar", "Bogra Sadar", "Pabna"],
    },
    {
      name: "Khulna",
      cities: ["Khulna City - Sonadanga", "Jessore Sadar", "Kushtia"],
    },
    {
      name: "Barishal",
      cities: ["Barishal Sadar - Band Road", "Patuakhali", "Bhola"],
    },
    {
      name: "Rangpur",
      cities: ["Rangpur City - Jahaj Company Mor", "Dinajpur"],
    },
    {
      name: "Mymensingh",
      cities: ["Mymensingh City - Ganginarpar", "Jamalpur"],
    },
  ];

  const [selectedDiv, setSelectedDiv] = useState(
    activeLocation.division || "Dhaka",
  );

  if (!isLocationModalOpen) return null;

  const currentDivObj =
    DIVISIONS.find((d) => d.name === selectedDiv) || DIVISIONS[0];

  const handleSelectCity = (city: string) => {
    setActiveLocation({ division: selectedDiv, city });
    setIsLocationModalOpen(false);
    showToast(
      `${t("Delivery address changed to", "ডেলিভারি লোকেশন পরিবর্তন করা হয়েছে:")} ${city}`,
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full overflow-hidden relative border border-gray-100 animate-in fade-in zoom-in-95 duration-200">
        <div className="bg-[#16a34a] text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            <h3 className="font-bold text-base">
              {t(
                "Choose Your Delivery Location",
                "ডেলিভারি এলাকা নির্বাচন করুন",
              )}
            </h3>
          </div>
          <button
            onClick={() => setIsLocationModalOpen(false)}
            className="p-1 text-white/80 hover:text-white rounded-full hover:bg-white/10 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5">
          <p className="text-xs text-gray-500 mb-3">
            {t(
              "Select your Division and City / Thana to check accurate delivery speed & fees in Bangladesh.",
              "সঠিক ডেলিভারি চার্জ ও সময় দেখতে আপনার বিভাগ ও থানা নির্বাচন করুন।",
            )}
          </p>

          <div className="flex gap-4 min-h-[260px]">
            {/* Division list */}
            <div className="w-1/3 border-r border-gray-200 pr-2 space-y-1">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                {t("Division", "বিভাগ")}
              </span>
              {DIVISIONS.map((div) => (
                <button
                  key={div.name}
                  onClick={() => setSelectedDiv(div.name)}
                  className={`w-full text-left px-2.5 py-1.5 rounded text-xs font-semibold transition-colors flex items-center justify-between cursor-pointer ${
                    selectedDiv === div.name
                      ? "bg-green-50 text-[#16a34a] border-l-4 border-[#16a34a]"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <span>{div.name}</span>
                  <span className="text-gray-400 text-xs">›</span>
                </button>
              ))}
            </div>

            {/* City / Thana list */}
            <div className="flex-1 pl-1 space-y-1 overflow-y-auto max-h-[280px]">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                {t("City / Area in", "এলাকা/থানা -")} {selectedDiv}
              </span>
              <div className="grid grid-cols-1 gap-1.5">
                {currentDivObj.cities.map((city) => (
                  <button
                    key={city}
                    onClick={() => handleSelectCity(city)}
                    className={`w-full text-left px-3 py-2 rounded-lg border text-xs font-medium transition-colors flex items-center justify-between cursor-pointer ${
                      activeLocation.city === city
                        ? "border-[#16a34a] bg-green-50/60 text-[#16a34a] font-bold"
                        : "border-gray-200 hover:border-green-300 text-gray-700 hover:bg-green-50/20"
                    }`}
                  >
                    <span>{city}</span>
                    {activeLocation.city === city && (
                      <CheckCircle className="w-4 h-4 text-[#16a34a]" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const GlobalToast: React.FC = () => {
  const { toast } = useApp();

  if (!toast) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 fade-in duration-200">
      <div className="bg-gray-900 text-white px-4 py-3 rounded-lg shadow-2xl flex items-center gap-2.5 text-xs sm:text-sm font-semibold border border-gray-700">
        <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
        <span>{toast}</span>
      </div>
    </div>
  );
};
