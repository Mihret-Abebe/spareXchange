import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import { useReviewStore } from "../store/reviewStore";
import LoadingSpinner from "../components/LoadingSpinner";
import toast from "react-hot-toast";
import {
	Star,
	ArrowLeft,
	User,
	Calendar
} from "lucide-react";

const ReviewPage = () => {
	const { userId } = useParams();
	const navigate = useNavigate();
	const { reviews, loading, getUserReviews, createReview } = useReviewStore();
	const [showReviewForm, setShowReviewForm] = useState(false);
	const [rating, setRating] = useState(0);
	const [comment, setComment] = useState("");
	const [hoveredRating, setHoveredRating] = useState(0);
	const [exchangeId, setExchangeId] = useState("");

	useEffect(() => {
		fetchReviews();
	}, [userId]);

	const fetchReviews = async () => {
		try {
			await getUserReviews(userId);
		} catch (error) {
			toast.error("Failed to load reviews");
		}
	};

	const handleSubmitReview = async (e) => {
		e.preventDefault();
		
		if (rating === 0) {
			toast.error("Please select a rating");
			return;
		}

		if (!exchangeId) {
			toast.error("Exchange ID is required");
			return;
		}

		try {
			await createReview(userId, exchangeId, rating, comment);
			toast.success("Review submitted successfully!");
			setShowReviewForm(false);
			setRating(0);
			setComment("");
			setExchangeId("");
			fetchReviews();
		} catch (error) {
			toast.error(error.response?.data?.message || "Failed to submit review");
		}
	};

	const calculateAverageRating = () => {
		if (reviews.length === 0) return 0;
		const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
		return (sum / reviews.length).toFixed(1);
	};

	const renderStars = (rating, interactive = false, onRate = null) => {
		return (
			<div className="flex gap-1">
				{[1, 2, 3, 4, 5].map((star) => (
					<Star
						key={star}
						className={`w-5 h-5 ${
							star <= (interactive ? hoveredRating || rating : rating)
								? "fill-yellow-400 text-yellow-400"
								: "text-gray-300 dark:text-gray-600"
						} ${interactive ? "cursor-pointer hover:scale-110 transition-transform" : ""}`}
						onClick={() => interactive && onRate && onRate(star)}
						onMouseEnter={() => interactive && setHoveredRating(star)}
						onMouseLeave={() => interactive && setHoveredRating(0)}
					/>
				))}
			</div>
		);
	};

	if (loading && reviews.length === 0) {
		return (
			<div className="flex justify-center items-center min-h-screen">
				<LoadingSpinner />
			</div>
		);
	}

	return (
		<div className="max-w-4xl mx-auto px-4 py-8">
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
			>
				{/* Header */}
				<div className="mb-6">
					<div className="flex items-center justify-between mb-4">
						<div className="flex items-center gap-4">
							<button
								onClick={() => navigate(-1)}
								className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
							>
								<ArrowLeft className="w-6 h-6" />
							</button>
							<h1 className="text-3xl font-bold">Reviews & Ratings</h1>
						</div>
						<button
							onClick={() => setShowReviewForm(!showReviewForm)}
							className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
						>
							{showReviewForm ? "Cancel" : "Write a Review"}
						</button>
					</div>

					{/* Rating Summary */}
					<div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
						<div className="flex items-center gap-6">
							<div className="text-center">
								<div className="text-5xl font-bold text-green-500">
									{calculateAverageRating()}
								</div>
								<div className="mt-2">
									{renderStars(parseFloat(calculateAverageRating()))}
								</div>
								<p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
									{reviews.length} review{reviews.length !== 1 ? "s" : ""}
								</p>
							</div>
						</div>
					</div>
				</div>

				{/* Review Form */}
				{showReviewForm && (
					<motion.div
						initial={{ opacity: 0, height: 0 }}
						animate={{ opacity: 1, height: "auto" }}
						exit={{ opacity: 0, height: 0 }}
						className="mb-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6"
					>
						<h2 className="text-xl font-semibold mb-4">Write a Review</h2>
						<form onSubmit={handleSubmitReview} className="space-y-4">
							<div>
								<label className="block text-sm font-medium mb-2">Exchange ID *</label>
								<input
									type="text"
									value={exchangeId}
									onChange={(e) => setExchangeId(e.target.value)}
									placeholder="Enter exchange ID"
									className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500"
									required
								/>
							</div>

							<div>
								<label className="block text-sm font-medium mb-2">Rating *</label>
								<div className="flex items-center gap-2">
									{renderStars(rating, true, setRating)}
									<span className="text-sm text-gray-600 dark:text-gray-400 ml-2">
										{rating > 0 ? `${rating} star${rating > 1 ? "s" : ""}` : "Select rating"}
									</span>
								</div>
							</div>

							<div>
								<label className="block text-sm font-medium mb-2">Comment</label>
								<textarea
									value={comment}
									onChange={(e) => setComment(e.target.value)}
									placeholder="Share your experience..."
									rows="4"
									className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500"
								/>
							</div>

							<button
								type="submit"
								className="w-full px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors font-semibold"
							>
								Submit Review
							</button>
						</form>
					</motion.div>
				)}

				{/* Reviews List */}
				<div className="space-y-4">
					{reviews.length === 0 ? (
						<div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-16 text-center">
							<User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
							<h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
								No reviews yet
							</h3>
							<p className="text-gray-500 dark:text-gray-400">
								Be the first to leave a review!
							</p>
						</div>
					) : (
						reviews.map((review, index) => (
							<motion.div
								key={review._id}
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: index * 0.05 }}
								className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6"
							>
								<div className="flex items-start gap-4">
									{review.reviewerId?.profilePicture ? (
										<img
											src={review.reviewerId.profilePicture}
											alt={review.reviewerId.name}
											className="w-12 h-12 rounded-full object-cover"
										/>
									) : (
										<div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center text-white font-semibold">
											{review.reviewerId?.name?.charAt(0).toUpperCase() || "U"}
										</div>
									)}

									<div className="flex-1">
										<div className="flex items-center justify-between mb-2">
											<h3 className="font-semibold text-lg">
												{review.reviewerId?.name || "Anonymous"}
											</h3>
											<div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
												<Calendar className="w-4 h-4" />
												<span>{new Date(review.createdAt).toLocaleDateString()}</span>
											</div>
										</div>

										<div className="mb-2">
											{renderStars(review.rating)}
										</div>

										{review.comment && (
											<p className="text-gray-700 dark:text-gray-300 mt-2">
												{review.comment}
											</p>
										)}
									</div>
								</div>
							</motion.div>
						))
					)}
				</div>
			</motion.div>
		</div>
	);
};

export default ReviewPage;
