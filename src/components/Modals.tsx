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
  AlertCircle,
} from "lucide-react";

export const LoginModal: React.FC = () => {
  const { isLoginModalOpen, setIsLoginModalOpen, login, signup, t } = useApp();
  const [isRegister, setIsRegister] = useState(false);
  const [phoneOrEmail, setPhoneOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [registerPhone, setRegisterPhone] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isLoginModalOpen) return null;

  const handleToggleMode = () => {
    setIsRegister(!isRegister);
    setErrorMessage(null);
  };

  const handleClose = () => {
    setIsLoginModalOpen(false);
    setErrorMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setLoading(true);

    if (isRegister) {
      if (!fullName.trim()) {
        setErrorMessage(
          t("Please enter your full name", "অনুগ্রহ করে আপনার পুরো নাম লিখুন"),
        );
        setLoading(false);
        return;
      }
      if (!registerPhone.trim() && !registerEmail.trim()) {
        setErrorMessage(
          t(
            "Please enter phone number or email",
            "অনুগ্রহ করে ফোন নম্বর অথবা ইমেইল দিন",
          ),
        );
        setLoading(false);
        return;
      }
      if (!password.trim() || password.length < 4) {
        setErrorMessage(
          t(
            "Password must be at least 4 characters",
            "পাসওয়ার্ড কমপক্ষে ৪ অক্ষরের হতে হবে",
          ),
        );
        setLoading(false);
        return;
      }

      const res = await signup({
        name: fullName.trim(),
        email: registerEmail.trim(),
        phone: registerPhone.trim(),
        password: password.trim(),
      });

      setLoading(false);
      if (!res.success) {
        setErrorMessage(
          res.message || t("Signup failed", "রেজিস্ট্রেশন সম্পন্ন করা যায়নি"),
        );
      } else {
        setFullName("");
        setRegisterPhone("");
        setRegisterEmail("");
        setPassword("");
        setErrorMessage(null);
        setIsLoginModalOpen(false);
      }
      return;
    }

    // Login mode
    if (!phoneOrEmail.trim()) {
      setErrorMessage(
        t(
          "Please enter phone or email",
          "অনুগ্রহ করে ফোন নম্বর অথবা ইমেইল দিন",
        ),
      );
      setLoading(false);
      return;
    }
    if (!password.trim()) {
      setErrorMessage(
        t("Please enter your password", "অনুগ্রহ করে পাসওয়ার্ড দিন"),
      );
      setLoading(false);
      return;
    }

    const res = await login(phoneOrEmail.trim(), password.trim());
    setLoading(false);
    if (!res.success) {
      setErrorMessage(
        res.message ||
          t("Invalid credentials", "ভুল ফোন নম্বর/ইমেইল অথবা পাসওয়ার্ড"),
      );
    } else {
      setPhoneOrEmail("");
      setPassword("");
      setErrorMessage(null);
      setIsLoginModalOpen(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden relative border border-gray-100 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#16a34a] to-[#15803d] text-white p-5 flex items-center justify-between">
          <div>
            <h3 className="font-extrabold text-lg">
              {isRegister
                ? t("Create Ashaal Account", "আশাল একাউন্ট তৈরি করুন")
                : t("Welcome to Ashaal!", "আশালে স্বাগতম!")}
            </h3>
            <p className="text-xs text-green-100">
              {isRegister
                ? t(
                    "Sign up for personal token, rewards & isolated cart",
                    "সাইন আপ করে উপভোগ করুন পার্সোনাল টোকেন ও রিওয়ার্ড (+৫০০ কয়েন)",
                  )
                : t(
                    "Login with phone or email to load your data",
                    "আপনার ফোন নম্বর বা ইমেইল দিয়ে লগইন করুন",
                  )}
            </p>
          </div>
          <button
            onClick={handleClose}
            className="p-1 text-white/80 hover:text-white rounded-full hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Form */}
        <div className="p-6">
          {/* Error Message Banner */}
          {errorMessage && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700 text-xs font-semibold animate-in fade-in duration-200">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {isRegister ? (
              <>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    {t("Full Name", "পুরো নাম")}{" "}
                    <span className="text-red-500">*</span>
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

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    {t("Phone Number", "ফোন নম্বর")}
                  </label>
                  <div className="relative">
                    <Smartphone className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                    <input
                      type="tel"
                      value={registerPhone}
                      onChange={(e) => setRegisterPhone(e.target.value)}
                      placeholder={t("e.g. 01712345678", "যেমন: ০১৭১২৩৪৫৬৭৮")}
                      autoComplete="tel"
                      className="w-full pl-9 pr-3 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:border-[#16a34a]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    {t("Email Address", "ইমেইল অ্যাড্রেস")}
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                    <input
                      type="email"
                      value={registerEmail}
                      onChange={(e) => setRegisterEmail(e.target.value)}
                      placeholder={t(
                        "e.g. user@example.com",
                        "যেমন: user@example.com",
                      )}
                      autoComplete="email"
                      className="w-full pl-9 pr-3 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:border-[#16a34a]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    {t("Password", "পাসওয়ার্ড")}{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder={t(
                        "Enter secure password (min 4 characters)",
                        "কমপক্ষে ৪ অক্ষরের পাসওয়ার্ড দিন",
                      )}
                      autoComplete="new-password"
                      className="w-full pl-9 pr-3 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:border-[#16a34a]"
                      required
                    />
                  </div>
                </div>
              </>
            ) : (
              <>
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
                    <span className="text-[11px] text-[#16a34a]">
                      {t("Secure Login", "সুরক্ষিত লগইন")}
                    </span>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder={t("Enter your password", "পাসওয়ার্ড দিন")}
                      autoComplete="current-password"
                      className="w-full pl-9 pr-3 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:border-[#16a34a]"
                      required
                    />
                  </div>
                </div>
              </>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#16a34a] hover:bg-[#15803d] text-white font-bold py-2.5 rounded-lg text-xs sm:text-sm transition-colors shadow-md shadow-green-600/20 mt-2 cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <span>{t("Verifying...", "যাচাই করা হচ্ছে...")}</span>
              ) : isRegister ? (
                <span>
                  {t("SIGN UP (+500 COINS)", "সাইন আপ করুন (+৫০০ কয়েন)")}
                </span>
              ) : (
                <span>{t("SIGN IN", "লগইন করুন")}</span>
              )}
            </button>

            <div className="text-center pt-3 border-t border-gray-100">
              <p className="text-xs text-gray-600">
                {isRegister
                  ? t("Already have an account?", "ইতিমধ্যে একাউন্ট আছে?")
                  : t("Don't have an account?", "কোনো একাউন্ট নেই?")}{" "}
                <button
                  type="button"
                  onClick={handleToggleMode}
                  className="text-[#16a34a] font-bold hover:underline cursor-pointer"
                >
                  {isRegister
                    ? t("Login Here", "লগইন করুন")
                    : t("Sign Up Free", "ফ্রি সাইন আপ")}
                </button>
              </p>
            </div>
          </form>
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
