const express = require("express");
const router = express.Router();

const {
    getAllReviews,
    getReviewById,
} = require("../controllers/reviewController");

// Get all reviews
router.get("/", getAllReviews);

// Get review by ID
router.get("/:id", getReviewById);

module.exports = router;