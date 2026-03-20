const Review = require("../models/Review");
const User = require("../models/User");

// Create review
exports.createReview = async (req, res) => {
  try {
    const { bookingId, toUserId, rating, comment } = req.body;
    const fromUser = await User.findOne({ clerkId: req.auth.userId });

    if (!fromUser) return res.status(404).json({ error: "User not found" });

    const review = await Review.create({
      booking: bookingId,
      fromUser: fromUser._id,
      toUser: toUserId,
      rating,
      comment
    });

    // Update the provider's average reliability score
    const reviews = await Review.find({ toUser: toUserId });
    const totalScore = reviews.reduce((acc, curr) => acc + curr.rating, 0);
    const avgScore = totalScore / reviews.length;

    await User.findByIdAndUpdate(toUserId, {
      reliabilityScore: avgScore,
      totalReviews: reviews.length
    });

    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get reviews for a provider
exports.getProviderReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ toUser: req.params.providerId })
      .populate("fromUser", "name avatar");
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
