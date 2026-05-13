import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import { useExchangeStore } from "../store/exchangeStore";
import { useAuthStore } from "../store/authStore";
import LoadingSpinner from "../components/LoadingSpinner";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Lock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  QrCode,
  MessageSquare,
  User
} from "lucide-react";

const ExchangeDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const {
    currentExchange,
    getExchangeById,
    updateExchangeStatus,
    makeCounterOffer,
    negotiateExchange,
    completeExchange,
    openDispute,
    generateHandshakeToken,
    regenerateHandshakeToken,
    verifyHandshake,
    isLoading
  } = useExchangeStore();

  const [counterOfferText, setCounterOfferText] = useState("");
  const [counterOfferListing, setCounterOfferListing] = useState("");
  const [counterOfferNote, setCounterOfferNote] = useState("");
  const [cancelReason, setCancelReason] = useState("");
  const [meetingLocation, setMeetingLocation] = useState("");
  const [meetingTime, setMeetingTime] = useState("");
  const [negotiationNotes, setNegotiationNotes] = useState("");
  const [disputeReason, setDisputeReason] = useState("");
  const [handshakeToken, setHandshakeToken] = useState("");
  const [showDisputeForm, setShowDisputeForm] = useState(false);
  const [showCounterOfferForm, setShowCounterOfferForm] = useState(false);

  useEffect(() => {
    fetchExchange();
  }, [id]);

  useEffect(() => {
    if (currentExchange) {
      setMeetingLocation(currentExchange.meetingDetails?.location || "");
      setMeetingTime(currentExchange.meetingDetails?.time ? new Date(currentExchange.meetingDetails.time).toISOString().slice(0, 16) : "");
      setNegotiationNotes(currentExchange.negotiationNotes || "");
    }
  }, [currentExchange]);

  const fetchExchange = async () => {
    try {
      await getExchangeById(id);
    } catch (error) {
      toast.error("Failed to load exchange");
    }
  };

  const handleAccept = async () => {
    try {
      await updateExchangeStatus(id, { status: "accepted" });
      toast.success("Exchange accepted!");
      fetchExchange();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to accept");
    }
  };

  const handleReject = async () => {
    try {
      await updateExchangeStatus(id, { status: "rejected" });
      toast.success("Exchange rejected");
      navigate("/my-exchanges");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to reject");
    }
  };

  const handleCancel = async () => {
    if (!cancelReason.trim()) {
      toast.error("Cancellation reason is required");
      return;
    }
    try {
      await updateExchangeStatus(id, { status: "cancelled", cancelReason });
      toast.success("Exchange cancelled");
      navigate("/my-exchanges");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to cancel");
    }
  };

  const handleSubmitCounterOffer = async () => {
    if (!counterOfferText.trim() && !counterOfferListing) {
      toast.error("Please provide offered items or listing");
      return;
    }
    try {
      await makeCounterOffer(id, {
        offeredItems: counterOfferText,
        offeredListingId: counterOfferListing || undefined,
        note: counterOfferNote
      });
      toast.success("Counter-offer sent!");
      setShowCounterOfferForm(false);
      setCounterOfferText("");
      setCounterOfferListing("");
      setCounterOfferNote("");
      fetchExchange();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to make counter-offer");
    }
  };

  const handleNegotiate = async () => {
    try {
      await negotiateExchange(id, {
        meetingLocation,
        meetingTime,
        negotiationNotes
      });
      toast.success("Meeting details updated!");
      fetchExchange();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update");
    }
  };

  const handleLockMeeting = async () => {
    try {
      await negotiateExchange(id, {
        meetingLocation,
        meetingTime,
        negotiationNotes,
        isLocked: true
      });
      toast.success("Meeting details locked!");
      fetchExchange();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to lock");
    }
  };

  const handleComplete = async () => {
    try {
      const result = await completeExchange(id);
      if (result.data.status === "fully_completed") {
        toast.success("🎉 Exchange fully completed! +50 EcoPoints earned!");
      } else {
        toast.success("Completion confirmed. Waiting for other party.");
      }
      fetchExchange();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to complete");
    }
  };

  const handleOpenDispute = async () => {
    if (!disputeReason.trim()) {
      toast.error("Dispute reason is required");
      return;
    }
    try {
      await openDispute(id, disputeReason);
      toast.success("Dispute opened. Admin will review.");
      setShowDisputeForm(false);
      setDisputeReason("");
      fetchExchange();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to open dispute");
    }
  };

  const handleGenerateQR = async () => {
    try {
      const result = await generateHandshakeToken(id);
      setHandshakeToken(result.token);
      toast.success(`QR code generated! Share with buyer. (Regeneration #${result.regenerationCount || 1})`);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to generate QR");
    }
  };

  const handleRegenerateQR = async () => {
    if (!window.confirm("This will invalidate the previous token. Are you sure you want to generate a new one?")) {
      return;
    }
    try {
      const result = await regenerateHandshakeToken(id);
      setHandshakeToken(result.token);
      toast.success(`✅ New token generated! Previous token is now invalid. (${result.remainingAttempts} attempts remaining)`);
      fetchExchange();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to regenerate QR");
    }
  };

  const handleVerifyQR = async () => {
    if (!handshakeToken.trim()) {
      toast.error("Please enter the verification code");
      return;
    }
    try {
      await verifyHandshake(id, handshakeToken);
      toast.success("🎉 Handshake verified! Exchange completed!");
      fetchExchange();
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid code");
    }
  };

  if (isLoading || !currentExchange) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  const isBuyer = currentExchange.buyerId?._id === user?._id;
  const isSeller = currentExchange.sellerId?._id === user?._id;
  const canAct = isBuyer || isSeller;

  const StatusBadge = () => {
    const statusColors = {
      pending: "bg-yellow-500",
      counter_offered: "bg-orange-500",
      accepted: "bg-blue-500",
      fully_completed: "bg-green-500",
      disputed: "bg-red-600",
      cancelled: "bg-gray-500",
      expired: "bg-gray-600"
    };
    return (
      <span className={`px-4 py-2 rounded-full text-sm font-bold text-white ${statusColors[currentExchange.status] || "bg-gray-500"}`}>
        {currentExchange.status.replace("_", " ").toUpperCase()}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-background text-white py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <button
            onClick={() => navigate("/my-exchanges")}
            className="flex items-center gap-2 text-gray-400 hover:text-white mb-4 transition"
          >
            <ArrowLeft size={20} />
            Back to Exchanges
          </button>
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-4xl font-bold mb-2">Exchange Details</h1>
              <p className="text-gray-400">
                {isBuyer ? "You are the buyer" : "You are the seller"}
              </p>
            </div>
            <StatusBadge />
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Listing Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-800 rounded-xl border border-gray-700 p-6"
            >
              <h2 className="text-2xl font-bold mb-4">Listing Information</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-400 text-sm">Title</p>
                  <p className="font-semibold">{currentExchange.listingId?.title || "N/A"}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Price</p>
                  <p className="font-semibold text-green-400">${currentExchange.listingId?.price || "0"}</p>
                </div>
              </div>
            </motion.div>

            {/* Offer Details */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gray-800 rounded-xl border border-gray-700 p-6"
            >
              <h2 className="text-2xl font-bold mb-4">Offer Details</h2>
              <div className="space-y-3">
                <div>
                  <p className="text-gray-400 text-sm">Offered Items</p>
                  <p className="font-semibold">{currentExchange.offeredItems || "No items specified"}</p>
                </div>
                {currentExchange.offeredListingId && (
                  <div>
                    <p className="text-gray-400 text-sm">Offered Listing</p>
                    <p className="font-semibold text-green-400">
                      {currentExchange.offeredListingId.title} - ${currentExchange.offeredListingId.price}
                    </p>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Counter-Offers History */}
            {currentExchange.counterOffers && currentExchange.counterOffers.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-gray-800 rounded-xl border border-gray-700 p-6"
              >
                <h2 className="text-2xl font-bold mb-4">Negotiation History</h2>
                <div className="space-y-4">
                  {currentExchange.counterOffers.map((offer, idx) => (
                    <div key={idx} className="bg-gray-700 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-sm text-gray-400">
                          {offer.proposedBy === user?._id ? "You" : "Other party"} offered:
                        </span>
                        <span className="text-xs text-gray-500">
                          {new Date(offer.createdAt).toLocaleString()}
                        </span>
                      </div>
                      <p className="font-semibold">{offer.offeredItems}</p>
                      {offer.note && <p className="text-sm text-gray-400 mt-2">Note: {offer.note}</p>}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Meeting Details */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gray-800 rounded-xl border border-gray-700 p-6"
            >
              <h2 className="text-2xl font-bold mb-4">Meeting Details</h2>
              {currentExchange.status === "accepted" && !currentExchange.meetingDetails?.isLocked && canAct && (
                <div className="mb-4 space-y-3">
                  <input
                    type="text"
                    placeholder="Meeting location"
                    value={meetingLocation}
                    onChange={(e) => setMeetingLocation(e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white"
                  />
                  <input
                    type="datetime-local"
                    value={meetingTime}
                    onChange={(e) => setMeetingTime(e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white"
                  />
                  <textarea
                    placeholder="Negotiation notes..."
                    value={negotiationNotes}
                    onChange={(e) => setNegotiationNotes(e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white"
                    rows="3"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleNegotiate}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition"
                    >
                      Update Details
                    </button>
                    <button
                      onClick={handleLockMeeting}
                      className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition flex items-center gap-2"
                    >
                      <Lock size={16} />
                      Lock Meeting
                    </button>
                  </div>
                </div>
              )}
              <div className="space-y-2">
                {currentExchange.meetingDetails?.location && (
                  <p className="flex items-center gap-2">
                    <MapPin size={16} className="text-green-400" />
                    <span className="font-semibold">{currentExchange.meetingDetails.location}</span>
                    {currentExchange.meetingDetails.isLocked && (
                      <Lock size={14} className="text-red-400" />
                    )}
                  </p>
                )}
                {currentExchange.meetingDetails?.time && (
                  <p className="flex items-center gap-2">
                    <Calendar size={16} className="text-green-400" />
                    <span className="font-semibold">
                      {new Date(currentExchange.meetingDetails.time).toLocaleString()}
                    </span>
                  </p>
                )}
                {currentExchange.negotiationNotes && (
                  <p className="text-gray-400 text-sm">Notes: {currentExchange.negotiationNotes}</p>
                )}
              </div>
            </motion.div>

            {/* QR Handshake Section */}
            {(currentExchange.status === "accepted" || currentExchange.status.startsWith("completed_by")) && canAct && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-gray-800 rounded-xl border border-green-700 p-6"
              >
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <QrCode size={24} className="text-green-400" />
                  Digital Handshake
                </h2>
                
                {isSeller && (
                  <div className="space-y-4">
                    {!currentExchange.handshakeToken && (
                      <button
                        onClick={handleGenerateQR}
                        className="w-full px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg transition font-bold"
                      >
                        Generate QR Code for Buyer
                      </button>
                    )}
                    
                    {currentExchange.handshakeToken && (
                      <div className="space-y-4">
                        <div className="bg-gray-900 rounded-lg p-6 text-center">
                          <p className="text-gray-400 mb-3">Current verification code:</p>
                          <p className="text-5xl font-bold text-green-400 tracking-widest mb-3">{handshakeToken || currentExchange.handshakeToken}</p>
                          <div className="flex justify-center gap-4 text-sm">
                            <span className="text-gray-500">
                              Expires: {new Date(currentExchange.handshakeExpiresAt).toLocaleTimeString()}
                            </span>
                            {currentExchange.handshakeRegenerated > 0 && (
                              <span className="text-blue-400">
                                Regenerated: {currentExchange.handshakeRegenerated}x
                              </span>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex gap-3">
                          <button
                            onClick={handleRegenerateQR}
                            disabled={currentExchange.handshakeRegenerated >= 5}
                            className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg transition font-semibold flex items-center justify-center gap-2"
                          >
                            <QrCode size={18} />
                            {currentExchange.handshakeRegenerated >= 5 
                              ? "Max Regenerations Reached" 
                              : `Regenerate Token (${5 - (currentExchange.handshakeRegenerated || 0)} left)`}
                          </button>
                          <button
                            onClick={handleGenerateQR}
                            className="flex-1 px-4 py-3 bg-green-600 hover:bg-green-700 rounded-lg transition font-semibold"
                          >
                            Show Current Token
                          </button>
                        </div>
                        
                        <div className="bg-yellow-900/30 border border-yellow-700 rounded-lg p-3">
                          <p className="text-sm text-yellow-300">
                            <strong>⚠️ Important:</strong> Regenerating will invalidate the previous token. 
                            The buyer will need to use the new code.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
                
                {isBuyer && (
                  <div className="space-y-3">
                    {currentExchange.handshakeToken ? (
                      <>
                        <p className="text-sm text-gray-400">
                          Enter the 6-digit code shown by the seller:
                        </p>
                        <input
                          type="text"
                          placeholder="Enter 6-digit code"
                          value={handshakeToken}
                          onChange={(e) => setHandshakeToken(e.target.value)}
                          maxLength="6"
                          className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-2xl text-center tracking-widest"
                        />
                        <button
                          onClick={handleVerifyQR}
                          className="w-full px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg transition font-bold"
                        >
                          Verify & Complete Exchange
                        </button>
                      </>
                    ) : (
                      <div className="bg-blue-900/30 border border-blue-700 rounded-lg p-4 text-center">
                        <p className="text-blue-300">
                          ⏳ Waiting for seller to generate verification code...
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-gray-800 rounded-xl border border-gray-700 p-6"
            >
              <h3 className="text-xl font-bold mb-4">Actions</h3>
              <div className="space-y-3">
                {currentExchange.status === "pending" && isSeller && (
                  <>
                    <button
                      onClick={handleAccept}
                      className="w-full px-4 py-3 bg-green-600 hover:bg-green-700 rounded-lg transition flex items-center justify-center gap-2"
                    >
                      <CheckCircle size={20} />
                      Accept Exchange
                    </button>
                    <button
                      onClick={handleReject}
                      className="w-full px-4 py-3 bg-red-600 hover:bg-red-700 rounded-lg transition flex items-center justify-center gap-2"
                    >
                      <XCircle size={20} />
                      Reject
                    </button>
                    <button
                      onClick={() => setShowCounterOfferForm(!showCounterOfferForm)}
                      className="w-full px-4 py-3 bg-orange-600 hover:bg-orange-700 rounded-lg transition flex items-center justify-center gap-2"
                    >
                      <MessageSquare size={20} />
                      Counter Offer
                    </button>
                  </>
                )}

                {currentExchange.status === "counter_offered" && isBuyer && (
                  <button
                    onClick={handleAccept}
                    className="w-full px-4 py-3 bg-green-600 hover:bg-green-700 rounded-lg transition flex items-center justify-center gap-2"
                  >
                    <CheckCircle size={20} />
                    Accept Counter Offer
                  </button>
                )}

                {(currentExchange.status === "pending" || currentExchange.status === "counter_offered") && canAct && (
                  <button
                    onClick={() => document.getElementById("cancelSection")?.classList.toggle("hidden")}
                    className="w-full px-4 py-3 bg-gray-600 hover:bg-gray-700 rounded-lg transition flex items-center justify-center gap-2"
                  >
                    <XCircle size={20} />
                    Cancel Exchange
                  </button>
                )}

                {currentExchange.status === "accepted" && canAct && (
                  <button
                    onClick={handleComplete}
                    className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition flex items-center justify-center gap-2"
                  >
                    <CheckCircle size={20} />
                    Mark as Complete
                  </button>
                )}

                {(currentExchange.status === "accepted" || currentExchange.status.startsWith("completed_by")) && canAct && (
                  <button
                    onClick={() => setShowDisputeForm(!showDisputeForm)}
                    className="w-full px-4 py-3 bg-red-700 hover:bg-red-800 rounded-lg transition flex items-center justify-center gap-2"
                  >
                    <AlertTriangle size={20} />
                    Open Dispute
                  </button>
                )}
              </div>

              {/* Cancel Form */}
              <div id="cancelSection" className="hidden mt-4 pt-4 border-t border-gray-700">
                <textarea
                  placeholder="Cancellation reason (required)"
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white mb-2"
                  rows="3"
                />
                <button
                  onClick={handleCancel}
                  className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition"
                >
                  Confirm Cancel
                </button>
              </div>

              {/* Counter Offer Form */}
              {showCounterOfferForm && (
                <div className="mt-4 pt-4 border-t border-gray-700 space-y-3">
                  <textarea
                    placeholder="Your offer (e.g., 'Brake Pads + $75')"
                    value={counterOfferText}
                    onChange={(e) => setCounterOfferText(e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white"
                    rows="2"
                  />
                  <input
                    type="text"
                    placeholder="Offered listing ID (optional)"
                    value={counterOfferListing}
                    onChange={(e) => setCounterOfferListing(e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white"
                  />
                  <textarea
                    placeholder="Note to buyer (optional)"
                    value={counterOfferNote}
                    onChange={(e) => setCounterOfferNote(e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white"
                    rows="2"
                  />
                  <button
                    onClick={handleSubmitCounterOffer}
                    className="w-full px-4 py-2 bg-orange-600 hover:bg-orange-700 rounded-lg transition"
                  >
                    Send Counter Offer
                  </button>
                </div>
              )}

              {/* Dispute Form */}
              {showDisputeForm && (
                <div className="mt-4 pt-4 border-t border-gray-700">
                  <textarea
                    placeholder="Reason for dispute..."
                    value={disputeReason}
                    onChange={(e) => setDisputeReason(e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white mb-2"
                    rows="4"
                  />
                  <button
                    onClick={handleOpenDispute}
                    className="w-full px-4 py-2 bg-red-700 hover:bg-red-800 rounded-lg transition"
                  >
                    Submit Dispute
                  </button>
                </div>
              )}
            </motion.div>

            {/* Participants */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gray-800 rounded-xl border border-gray-700 p-6"
            >
              <h3 className="text-xl font-bold mb-4">Participants</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <User size={20} className="text-green-400" />
                  <div>
                    <p className="text-sm text-gray-400">Buyer</p>
                    <p className="font-semibold">{currentExchange.buyerId?.name || "Unknown"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <User size={20} className="text-blue-400" />
                  <div>
                    <p className="text-sm text-gray-400">Seller</p>
                    <p className="font-semibold">{currentExchange.sellerId?.name || "Unknown"}</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* History */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gray-800 rounded-xl border border-gray-700 p-6"
            >
              <h3 className="text-xl font-bold mb-4">Activity History</h3>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {currentExchange.history?.map((entry, idx) => (
                  <div key={idx} className="text-sm border-l-2 border-green-500 pl-3 py-2">
                    <p className="font-semibold capitalize">{entry.action.replace(/_/g, " ")}</p>
                    <p className="text-gray-500 text-xs">
                      {new Date(entry.at).toLocaleString()}
                    </p>
                    {entry.note && <p className="text-gray-400 text-xs mt-1">{entry.note}</p>}
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExchangeDetailPage;
