import React, { useState, useEffect } from 'react';
import "./ratingPage.css";

export default function RatingPage() {
    const [ratings, setRatings] = useState({
        excellent: 0,
        veryGood: 0,
        average: 0,
        poor: 0,
        terrible: 0,
    });
    const [email, setEmail] = useState('');
    const [selectedRating, setSelectedRating] = useState(0);
    const [comment, setComment] = useState('');
    const [totalRatings, setTotalRatings] = useState(0);

    // Calculate average rating
    const averageRating =
        totalRatings > 0
            ? (
                (5 * ratings.excellent +
                    4 * ratings.veryGood +
                    3 * ratings.average +
                    2 * ratings.poor +
                    1 * ratings.terrible) /
                totalRatings
            ).toFixed(1)
            : "0.0";

    // Calculate fill width for rating bars
    const calculateFillWidth = (count) => {
        return totalRatings > 0 ? `${(count / totalRatings) * 100}%` : "0%";
    };

    // Fetch ratings from the backend
    useEffect(() => {
        const fetchRatings = async () => {
            try {
                const response = await fetch("http://localhost:3000/api/ratings");
                if (response.ok) {
                    const data = await response.json();
                    setRatings({
                        excellent: data.excellent,
                        veryGood: data.veryGood,
                        average: data.average,
                        poor: data.poor,
                        terrible: data.terrible,
                    });
                    setTotalRatings(data.totalRatings); 
                } else {
                    console.error("Failed to fetch ratings");
                }
            } catch (error) {
                console.error("Error fetching ratings:", error);
            }
        };

        fetchRatings();
    }, []);

    // Handle rating submission
    const handleRatingSubmit = async () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!email.trim() || selectedRating === 0) {
            alert("Please provide your email and select a rating.");
            return;
        }

        if (!emailRegex.test(email.trim())) {
            alert("Please enter a valid email address.");
            return;
        }

        // Send data to the backend
        try {
            const response = await fetch("http://localhost:3000/api/submit-rating", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: email.trim(),
                    rating: selectedRating,
                    comment: comment.trim(),
                }),
            });

            if (response.ok) {
                alert("Thank you for your feedback!");
                setEmail('');
                setSelectedRating(0);
                setComment('');
                // Re-fetch ratings after submission
                const updatedRatings = await fetch("http://localhost:3000/api/ratings");
                if (updatedRatings.ok) {
                    const data = await updatedRatings.json();
                    setRatings({
                        excellent: data.excellent,
                        veryGood: data.veryGood,
                        average: data.average,
                        poor: data.poor,
                        terrible: data.terrible,
                    });
                    setTotalRatings(data.totalRatings);
                }
            } else {
                const errorData = await response.json();
                alert(`Error: ${errorData.message}`);
            }
        } catch (error) {
            console.error("Error submitting rating:", error);
            alert("An error occurred while submitting your rating.");
        }
    };

    return (
        <div>
            <div id="rating-page-content">
                {/* Top section */}
                <div id="rating-page-top-section">
                    <h1 id="rating-page-top-title">RATE FOR US !</h1>
                    <h5 id="rating-page-top-details">
                        We've found that customer reviews are very helpful in keeping our
                        business thriving. We would truly appreciate a review from you!
                        Leave a review or comment.
                    </h5>
                </div>

                {/* Middle Section */}
                <div id="rating-page-middle-section">
                    {/* Left Section */}
                    <div id="rating-page-middle-section-left">
                        <div id="rate-us-rating">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <span
                                    key={star}
                                    onClick={() => setSelectedRating(star)}
                                    style={{
                                        cursor: "pointer",
                                        color: selectedRating >= star ? "gold" : "gray",
                                    }}
                                >
                                    &#9733;
                                </span>
                            ))}
                        </div>
                        <div id="rating-us-comment-section">
                            <textarea
                                id="rating-page-comment"
                                placeholder="Write a comment..."
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                            ></textarea>
                        </div>
                        <input
                            type="email"
                            id="rating-page-email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <button id="submit-rating-button" onClick={handleRatingSubmit}>
                            SUBMIT
                        </button>
                    </div>

                    {/* Right Section */}
                    <div id="rating-page-middle-section-right">
                        <div id="rate-us-rate-details">
                            <div id="rate-us-count-details">
                                <h1 id="rate-us-value">{averageRating}</h1>
                            </div>
                            <div id="rate-us-rating-view">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <span
                                        key={star}
                                        style={{
                                            color: star <= Math.round(averageRating) ? "gold" : "gray",
                                        }}
                                    >
                                        &#9733;
                                    </span>
                                ))}
                            </div>
                        </div>

                        {["Excellent", "Very Good", "Average", "Poor", "Terrible"].map(
                            (label, index) => {
                                const count =
                                    index === 0
                                        ? ratings.excellent
                                        : index === 1
                                        ? ratings.veryGood
                                        : index === 2
                                        ? ratings.average
                                        : index === 3
                                        ? ratings.poor
                                        : index === 4
                                        ? ratings.terrible
                                        : 0;

                                return (
                                    <div className="rating-bar" key={label}>
                                        <div className="label">{label}</div>
                                        <div className="bar">
                                            <div
                                                className="fill"
                                                style={{ width: calculateFillWidth(count) }}
                                            ></div>
                                        </div>
                                        <div className="count">{count}</div>
                                    </div>
                                );
                            }
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}