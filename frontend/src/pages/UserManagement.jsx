import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { 
  Users, 
  Search, 
  Filter, 
  Ban, 
  CheckCircle, 
  XCircle, 
  Eye,
  UserCheck,
  AlertTriangle
} from "lucide-react";
import { useAdminStore } from "../store/adminStore";
import LoadingSpinner from "../components/LoadingSpinner";
import toast from "react-hot-toast";

const UserManagement = () => {
  const { 
    getAllUsers, 
    getPendingVerifications,
    verifyUser,
    verifyUserEmail,
    toggleUserBan,
    users,
    pendingVerifications,
    isLoading 
  } = useAdminStore();

  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [verificationNote, setVerificationNote] = useState("");
  const [activeTab, setActiveTab] = useState("all"); // 'all' or 'pending'

  useEffect(() => {
    fetchUsers();
    fetchPendingVerifications();
  }, []);

  const fetchUsers = async () => {
    try {
      const filters = {};
      if (filterType !== "all") filters.userType = filterType;
      if (searchTerm) filters.search = searchTerm;
      await getAllUsers(filters);
    } catch (error) {
      toast.error("Failed to load users");
    }
  };

  const fetchPendingVerifications = async () => {
    try {
      await getPendingVerifications();
    } catch (error) {
      console.error("Failed to load pending verifications");
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchUsers();
  };

  const handleVerifyUser = async (userId, status) => {
    try {
      await verifyUser(userId, status, verificationNote);
      toast.success(`User ${status === "verified" ? "verified" : "rejected"} successfully`);
      setShowVerificationModal(false);
      setVerificationNote("");
      setSelectedUser(null);
      fetchUsers();
      fetchPendingVerifications();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update user");
    }
  };

  const handleBanUser = async (userId) => {
    if (!window.confirm("Are you sure you want to toggle ban status for this user?")) {
      return;
    }
    try {
      await toggleUserBan(userId);
      toast.success("User ban status updated");
      fetchUsers();
    } catch (error) {
      toast.error("Failed to update ban status");
    }
  };

  const handleVerifyEmail = async (userId) => {
    if (!window.confirm("Are you sure you want to verify this user's email?")) {
      return;
    }
    try {
      await verifyUserEmail(userId);
      toast.success("User email verified successfully");
      fetchUsers();
    } catch (error) {
      toast.error("Failed to verify user email");
    }
  };

  const openVerificationModal = (user) => {
    setSelectedUser(user);
    setShowVerificationModal(true);
    setVerificationNote("");
  };

  const filteredUsers = users.filter(user => {
    if (activeTab === "pending") {
      return user.roleStatus === "pending";
    }
    return true;
  });

  if (isLoading && users.length === 0) {
    return (
      <div className='min-h-screen bg-background flex items-center justify-center'>
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gradient-to-b from-gray-900 via-green-900 to-emerald-900 text-white py-8'>
      <div className='container mx-auto px-4 max-w-7xl'>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className='mb-8'
        >
          <h1 className='text-4xl font-bold mb-2 bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text flex items-center'>
            <Users size={40} className='mr-3' />
            User Management
          </h1>
          <p className='text-gray-400'>Manage users, approve verifications, and monitor activity</p>
        </motion.div>

        {/* Tabs */}
        <div className='flex gap-4 mb-6'>
          <button
            onClick={() => setActiveTab("all")}
            className={`px-6 py-3 rounded-lg font-semibold transition ${
              activeTab === "all"
                ? "bg-green-600 text-white"
                : "bg-gray-800 text-gray-400 hover:bg-gray-700"
            }`}
          >
            All Users ({users.length})
          </button>
          <button
            onClick={() => setActiveTab("pending")}
            className={`px-6 py-3 rounded-lg font-semibold transition flex items-center gap-2 ${
              activeTab === "pending"
                ? "bg-yellow-600 text-white"
                : "bg-gray-800 text-gray-400 hover:bg-gray-700"
            }`}
          >
            <AlertTriangle size={18} />
            Pending Verifications ({pendingVerifications.length})
          </button>
        </div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className='mb-6 bg-gray-800 bg-opacity-80 backdrop-filter backdrop-blur-lg rounded-xl border border-gray-700 p-6'
        >
          <form onSubmit={handleSearch} className='flex flex-col md:flex-row gap-4'>
            <div className='flex-1 relative'>
              <Search size={20} className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400' />
              <input
                type='text'
                placeholder='Search by name or email...'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className='w-full pl-10 pr-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:border-green-500'
              />
            </div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className='px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:border-green-500'
            >
              <option value='all'>All Types</option>
              <option value='individual'>Individual</option>
              <option value='garage'>Garage</option>
              <option value='repair-shop'>Repair Shop</option>
              <option value='recycler'>Recycler</option>
              <option value='technician'>Technician</option>
              <option value='admin'>Admin</option>
            </select>
            <button
              type='submit'
              className='px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg font-semibold transition flex items-center gap-2'
            >
              <Filter size={18} />
              Apply Filters
            </button>
          </form>
        </motion.div>

        {/* Users Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className='bg-gray-800 bg-opacity-80 backdrop-filter backdrop-blur-lg rounded-xl border border-gray-700 overflow-hidden'
        >
          <div className='overflow-x-auto'>
            <table className='w-full'>
              <thead className='bg-gray-900 border-b border-gray-700'>
                <tr>
                  <th className='px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase'>User</th>
                  <th className='px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase'>Type</th>
                  <th className='px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase'>Email Status</th>
                  <th className='px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase'>Role Verification</th>
                  <th className='px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase'>Joined</th>
                  <th className='px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase'>Actions</th>
                </tr>
              </thead>
              <tbody className='divide-y divide-gray-700'>
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan='6' className='px-6 py-12 text-center text-gray-400'>
                      <Users size={48} className='mx-auto mb-4 opacity-50' />
                      <p className='text-lg'>No users found</p>
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user._id} className='hover:bg-gray-700/50 transition'>
                      <td className='px-6 py-4'>
                        <div className='flex items-center gap-3'>
                          <div className='w-10 h-10 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 flex items-center justify-center font-bold'>
                            {user.name?.charAt(0).toUpperCase() || "U"}
                          </div>
                          <div>
                            <p className='font-semibold'>{user.name}</p>
                            <p className='text-sm text-gray-400'>{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className='px-6 py-4'>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          user.userType === "admin" ? "bg-red-900/50 text-red-400" :
                          user.userType === "technician" ? "bg-blue-900/50 text-blue-400" :
                          user.userType === "recycler" ? "bg-green-900/50 text-green-400" :
                          "bg-gray-700 text-gray-300"
                        }`}>
                          {user.userType}
                        </span>
                      </td>
                      <td className='px-6 py-4'>
                        <div className='flex items-center gap-2'>
                          {user.isBanned ? (
                            <span className='px-3 py-1 rounded-full text-xs font-semibold bg-red-900/50 text-red-400 flex items-center gap-1'>
                              <Ban size={12} /> Banned
                            </span>
                          ) : user.isVerified ? (
                            <span className='px-3 py-1 rounded-full text-xs font-semibold bg-green-900/50 text-green-400 flex items-center gap-1'>
                              <CheckCircle size={12} /> Verified
                            </span>
                          ) : (
                            <span className='px-3 py-1 rounded-full text-xs font-semibold bg-yellow-900/50 text-yellow-400 flex items-center gap-1'>
                              <AlertTriangle size={12} /> Not Verified
                            </span>
                          )}
                        </div>
                      </td>
                      <td className='px-6 py-4'>
                        {user.roleStatus === "pending" ? (
                          <span className='px-3 py-1 rounded-full text-xs font-semibold bg-yellow-900/50 text-yellow-400 flex items-center gap-1'>
                            <AlertTriangle size={12} /> Pending
                          </span>
                        ) : user.roleStatus === "verified" ? (
                          <span className='px-3 py-1 rounded-full text-xs font-semibold bg-green-900/50 text-green-400 flex items-center gap-1'>
                            <UserCheck size={12} /> Verified
                          </span>
                        ) : (
                          <span className='text-gray-500 text-sm'>N/A</span>
                        )}
                      </td>
                      <td className='px-6 py-4 text-sm text-gray-400'>
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className='px-6 py-4'>
                        <div className='flex gap-2'>
                          {user.roleStatus === "pending" && user.userType !== "admin" && (
                            <button
                              onClick={() => openVerificationModal(user)}
                              className='p-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition'
                              title='Review Verification'
                            >
                              <Eye size={16} />
                            </button>
                          )}
                          {!user.isVerified && user.userType !== "admin" && (
                            <button
                              onClick={() => handleVerifyEmail(user._id)}
                              className='p-2 bg-green-600 hover:bg-green-700 rounded-lg transition'
                              title='Verify Email'
                            >
                              <UserCheck size={16} />
                            </button>
                          )}
                          {user.userType !== "admin" && (
                            <button
                              onClick={() => handleBanUser(user._id)}
                              className={`p-2 rounded-lg transition ${
                                user.isBanned 
                                  ? "bg-green-600 hover:bg-green-700" 
                                  : "bg-red-600 hover:bg-red-700"
                              }`}
                              title={user.isBanned ? "Unban User" : "Ban User"}
                            >
                              {user.isBanned ? <CheckCircle size={16} /> : <Ban size={16} />}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Verification Modal */}
        {showVerificationModal && selectedUser && (
          <div className='fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4'>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className='bg-gray-800 rounded-xl border border-gray-700 max-w-2xl w-full max-h-[90vh] overflow-y-auto'
            >
              <div className='p-6'>
                <h2 className='text-2xl font-bold mb-4 flex items-center gap-2'>
                  <UserCheck size={28} className='text-green-400' />
                  Review Verification Request
                </h2>

                <div className='space-y-4 mb-6'>
                  <div className='bg-gray-900/50 p-4 rounded-lg'>
                    <p className='text-sm text-gray-400 mb-1'>User Name</p>
                    <p className='font-semibold'>{selectedUser.name}</p>
                  </div>
                  <div className='bg-gray-900/50 p-4 rounded-lg'>
                    <p className='text-sm text-gray-400 mb-1'>Email</p>
                    <p className='font-semibold'>{selectedUser.email}</p>
                  </div>
                  <div className='bg-gray-900/50 p-4 rounded-lg'>
                    <p className='text-sm text-gray-400 mb-1'>Requested Role</p>
                    <p className='font-semibold capitalize'>{selectedUser.userType}</p>
                  </div>
                  {selectedUser.expertise && (
                    <div className='bg-gray-900/50 p-4 rounded-lg'>
                      <p className='text-sm text-gray-400 mb-1'>Expertise</p>
                      <p className='font-semibold'>{selectedUser.expertise}</p>
                    </div>
                  )}
                  {selectedUser.verificationDocs && selectedUser.verificationDocs.length > 0 && (
                    <div className='bg-gray-900/50 p-4 rounded-lg'>
                      <p className='text-sm text-gray-400 mb-2'>Verification Documents ({selectedUser.verificationDocs.length})</p>
                      <div className='space-y-3'>
                        {selectedUser.verificationDocs.map((doc, index) => {
                          const isPDF = doc.includes('.pdf') || doc.includes('raw/upload');
                          const isCloudinary = doc.includes('res.cloudinary.com');
                          
                          return (
                            <div key={index} className='bg-gray-800 rounded-lg overflow-hidden'>
                              {/* Document Preview */}
                              <div className='p-3 border-b border-gray-700'>
                                <div className='flex items-center justify-between mb-2'>
                                  <span className='text-sm font-semibold text-white'>
                                    {isPDF ? '📄' : '🖼️'} Document {index + 1}
                                  </span>
                                  <span className='text-xs text-gray-400'>
                                    {isCloudinary ? 'Cloudinary' : 'Local Storage'}
                                  </span>
                                </div>
                                
                                {/* Image Preview */}
                                {!isPDF && isCloudinary && (
                                  <div className='mb-2 rounded overflow-hidden'>
                                    <img 
                                      src={doc} 
                                      alt={`Verification document ${index + 1}`}
                                      className='w-full h-auto max-h-64 object-contain bg-gray-900'
                                      onError={(e) => {
                                        e.target.style.display = 'none';
                                        e.target.nextSibling.style.display = 'block';
                                      }}
                                    />
                                    <div className='hidden p-4 text-center text-gray-400 text-sm'>
                                      Failed to load image preview
                                    </div>
                                  </div>
                                )}
                                
                                {/* PDF Preview Notice */}
                                {isPDF && (
                                  <div className='mb-2 p-3 bg-blue-900/30 border border-blue-700 rounded text-sm text-blue-300'>
                                    📋 PDF Document - Click to view in new tab
                                  </div>
                                )}
                              </div>
                              
                              {/* Action Buttons */}
                              <div className='p-3 flex gap-2'>
                                <a
                                  href={doc}
                                  target='_blank'
                                  rel='noopener noreferrer'
                                  className='flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-white text-sm font-semibold transition flex items-center justify-center gap-2'
                                >
                                  🔍 View Full Size
                                </a>
                                <button
                                  onClick={() => window.open(doc, '_blank')}
                                  className='px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white text-sm font-semibold transition'
                                  title='Download'
                                >
                                  ⬇️
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      <p className='text-xs text-gray-500 mt-3'>
                        💡 Tip: Click "View Full Size" to examine documents in detail before approving/rejecting
                      </p>
                    </div>
                  )}
                  <div className='bg-gray-900/50 p-4 rounded-lg'>
                    <label className='text-sm text-gray-400 mb-2 block'>Moderator Note (Optional)</label>
                    <textarea
                      value={verificationNote}
                      onChange={(e) => setVerificationNote(e.target.value)}
                      placeholder='Add a note about this verification decision...'
                      className='w-full p-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-green-500 resize-none'
                      rows='3'
                    />
                  </div>
                </div>

                <div className='flex gap-3'>
                  <button
                    onClick={() => handleVerifyUser(selectedUser._id, "verified")}
                    className='flex-1 px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg font-semibold transition flex items-center justify-center gap-2'
                  >
                    <CheckCircle size={20} />
                    Approve Verification
                  </button>
                  <button
                    onClick={() => handleVerifyUser(selectedUser._id, "rejected")}
                    className='flex-1 px-6 py-3 bg-red-600 hover:bg-red-700 rounded-lg font-semibold transition flex items-center justify-center gap-2'
                  >
                    <XCircle size={20} />
                    Reject Verification
                  </button>
                  <button
                    onClick={() => {
                      setShowVerificationModal(false);
                      setSelectedUser(null);
                      setVerificationNote("");
                    }}
                    className='px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-semibold transition'
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserManagement;
