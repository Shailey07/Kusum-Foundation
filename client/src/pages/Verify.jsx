import React, { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Copy,
  Share2,
  CheckCircle,
  AlertCircle,
  CalendarDays,
} from "lucide-react";

const fmtDate = (d) =>
  d
    ? new Date(d).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "—";

const Verify = () => {
  const { registrationNumber } = useParams();
  const decodedRegNumber = decodeURIComponent(registrationNumber);

  const [type, setType] = useState(null);
  const [person, setPerson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);

  const shareMenuRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/verify/${encodeURIComponent(
            decodedRegNumber
          )}`
        );
        if (!response.ok) {
          setError(true);
          return;
        }
        const data = await response.json();
        setType(data.type);
        setPerson(data.data);
      } catch (err) {
        console.error("Verification request failed:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [decodedRegNumber]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        shareMenuRef.current &&
        !shareMenuRef.current.contains(event.target)
      ) {
        setShowShareMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Copy failed:", err);
    }
  };

  const handleShare = (platform) => {
    const url = window.location.href;
    const text = person?.fullName
      ? `Verification for ${person.fullName} — Kusum Foundation`
      : "Kusum Foundation Verification";
    const encodedUrl = encodeURIComponent(url);
    const encodedText = encodeURIComponent(text);

    const links = {
      whatsapp: `https://wa.me/?text=${encodedText}%20${encodedUrl}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    };

    if (links[platform]) {
      window.open(links[platform], "_blank", "noopener,noreferrer");
    }
    setShowShareMenu(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-gray-300 border-t-gray-900 rounded-full mx-auto mb-4" />
          <p className="text-sm text-gray-600">Verifying…</p>
        </div>
      </div>
    );
  }

  if (error || !person) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white border border-gray-200 rounded-lg p-8 max-w-md w-full text-center">
          <AlertCircle size={42} className="mx-auto text-red-500 mb-4" />
          <h1 className="text-xl font-semibold text-gray-900">
            Record Not Found
          </h1>
          <p className="text-sm text-gray-600 mt-2">
            We could not verify this registration number.
          </p>
          <p className="text-xs text-gray-400 mt-3 break-all">
            {decodedRegNumber}
          </p>
          <Link
            to="/"
            className="inline-block mt-6 bg-gray-900 text-white px-5 py-3 rounded-md text-sm font-medium"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const roleLabel =
    type === "volunteer"
      ? "Volunteer"
      : type === "intern"
      ? "Intern"
      : "Member";

  const details = [
    { label: "Full Name", value: person.fullName },
    { label: "Role", value: roleLabel },
    {
      label: "Registration Number",
      value: person.registrationNumber || decodedRegNumber,
    },
    { label: "Department", value: person.department || "General" },
    { label: "Email", value: person.email },
  ];

  if (type === "intern") {
    details.push({ label: "College", value: person.college });
    details.push({ label: "Course", value: person.course });
  } else {
    details.push({ label: "Occupation", value: person.occupation });
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3">
            <CheckCircle size={28} className="text-green-600" />
            <div>
              <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900">
                Verified by Kusum Foundation
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                This {roleLabel.toLowerCase()} record is genuine and
                registered with Kusum Foundation.
              </p>
            </div>
          </div>
        </motion.div>

        {/* ENGAGEMENT PERIOD */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="bg-gray-900 text-white rounded-lg p-6 mb-6"
        >
          <div className="flex items-center gap-2 text-gray-300 text-xs uppercase tracking-wider mb-3">
            <CalendarDays size={15} />
            {roleLabel} Engagement Period
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
            <div>
              <p className="text-xs text-gray-400">From</p>
              <p className="text-lg font-semibold">
                {fmtDate(person.startDate)}
              </p>
            </div>
            <div className="hidden sm:block text-gray-500 text-xl">→</div>
            <div>
              <p className="text-xs text-gray-400">To</p>
              <p className="text-lg font-semibold">
                {fmtDate(person.endDate)}
              </p>
            </div>
          </div>
        </motion.div>

        {/* DETAILS */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white border border-gray-200 rounded-lg p-6 mb-6"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {details.map((d) => (
              <div key={d.label}>
                <p className="text-xs uppercase tracking-wider text-gray-500">
                  {d.label}
                </p>
                <p className="text-sm font-semibold text-gray-900 mt-1 break-words">
                  {d.value || "—"}
                </p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ACTIONS */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <button
            onClick={handleCopy}
            className="bg-white border border-gray-300 text-gray-700 px-5 py-3 rounded-md text-sm font-medium hover:bg-gray-50 transition flex items-center justify-center gap-2"
          >
            <Copy size={16} />
            {copied ? "Copied!" : "Copy Verification Link"}
          </button>

          <div className="relative" ref={shareMenuRef}>
            <button
              onClick={() => setShowShareMenu(!showShareMenu)}
              className="bg-white border border-gray-300 text-gray-700 px-5 py-3 rounded-md text-sm font-medium hover:bg-gray-50 transition flex items-center justify-center gap-2 w-full"
            >
              <Share2 size={16} />
              Share
            </button>
            {showShareMenu && (
              <div className="absolute mt-2 bg-white rounded-md border border-gray-200 shadow-lg p-1 w-44 z-50">
                {[
                  { key: "linkedin", label: "LinkedIn" },
                  { key: "twitter", label: "Twitter" },
                  { key: "facebook", label: "Facebook" },
                  { key: "whatsapp", label: "WhatsApp" },
                ].map((item) => (
                  <button
                    key={item.key}
                    onClick={() => handleShare(item.key)}
                    className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded text-sm text-gray-700"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* BACK */}
        <div className="text-center">
          <Link
            to="/"
            className="text-xs text-gray-500 hover:text-gray-900 transition"
          >
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Verify;
