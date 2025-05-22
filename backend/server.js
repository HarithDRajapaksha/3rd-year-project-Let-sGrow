//Backend Connection
//Import required modules
const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
require("dotenv").config();
const bycrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const multer = require("multer");
const path = require("path");

//Initialize the app
const app = express();

//Middleware
app.use(cors());
app.use(bodyParser.json());

//Define a port
const PORT = process.env.PORT || 3000;

//db connection
const db = mysql.createConnection({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "lets-grow"
});

//Connect to the database
db.connect((err) => {
    if (err) {
        console.error("Error connecting to the database: ", err);
        process.exit(1);
    } else {
        console.log("Connected to the database");
    }
});


// Submit or update a rating
app.post("/api/submit-rating", (req, res) => {
    const { email, rating, comment } = req.body;

    // Validate input
    if (!email || !rating) {
        return res.status(400).json({ message: "Email and rating are required." });
    }

    if (rating < 1 || rating > 5) {
        return res.status(400).json({ message: "Rating must be between 1 and 5." });
    }

    // Check if the user has already submitted a rating
    const checkQuery = `SELECT * FROM ratings WHERE email = ?`;
    db.query(checkQuery, [email.trim()], (err, results) => {
        if (err) {
            console.error("Error checking existing rating:", err);
            return res.status(500).json({ message: "Error checking existing rating." });
        }

        if (results.length > 0) {
            // Update the existing rating
            const updateQuery = `
                UPDATE ratings
                SET rating = ?, comment = ?
                WHERE email = ?
            `;
            db.query(updateQuery, [rating, comment ? comment.trim() : null, email.trim()], (err, result) => {
                if (err) {
                    console.error("Error updating rating:", err);
                    return res.status(500).json({ message: "Error updating rating." });
                }
                res.status(200).json({ message: "Rating updated successfully." });
            });
        } else {
            // Insert a new rating
            const insertQuery = `
                INSERT INTO ratings (email, rating, comment)
                VALUES (?, ?, ?)
            `;
            db.query(insertQuery, [email.trim(), rating, comment ? comment.trim() : null], (err, result) => {
                if (err) {
                    console.error("Error inserting rating:", err);
                    return res.status(500).json({ message: "Error submitting rating." });
                }
                res.status(200).json({ message: "Rating submitted successfully." });
            });
        }
    });
});

// Get aggregated ratings
app.get("/api/ratings", (req, res) => {
    const query = `
        SELECT 
            SUM(CASE WHEN rating = 5 THEN 1 ELSE 0 END) AS excellent,
            SUM(CASE WHEN rating = 4 THEN 1 ELSE 0 END) AS veryGood,
            SUM(CASE WHEN rating = 3 THEN 1 ELSE 0 END) AS average,
            SUM(CASE WHEN rating = 2 THEN 1 ELSE 0 END) AS poor,
            SUM(CASE WHEN rating = 1 THEN 1 ELSE 0 END) AS terrible,
            COUNT(*) AS totalRatings
        FROM ratings
    `;

    db.query(query, (err, results) => {
        if (err) {
            console.error("Error fetching ratings:", err);
            return res.status(500).json({ message: "Error fetching ratings." });
        }
        res.status(200).json(results[0]);
    });
});

//Endpoint to handle user registration
app.post("/register", (req, res) => {
    const {firstName, lastName, phoneNumber, email, password, role, pricerange, catergories } = req.body;

    //hash the password
    const hashepassword = bycrypt.hashSync(password, 10);

    const query =
    `INSERT INTO users (first_name, last_name, phone_number, email, password, role, price_range, categories)
    VALUES (?,?,?,?,?,?,?,?)`;

    db.query(query, [firstName, lastName, phoneNumber, email, hashepassword, role, pricerange, catergories], (err, result) => {
        if (err) {
            console.error("Error inserting data: ", err);
            res.status(500).json({ message: "Error inserting data" });
        } else {
            res.status(200).json({ message: "User registered successfully" });
        }
    });
})

// Endpoint to handle user login
app.post("/login", (req, res) => {
    const { email, password } = req.body;

    const query = `SELECT * FROM users WHERE email = ?`;
    db.query(query, [email], (err, results) => {
        if (err) {
            console.error("Error fetching user: ", err);
            res.status(500).json({ message: "Error fetching user" });
        } else if (results.length === 0) {
            res.status(401).json({ message: "Invalid email or password" });
        } else {
            const user = results[0];
            const isPasswordValid = bycrypt.compareSync(password, user.password);
            if (!isPasswordValid) {
                res.status(401).json({ message: "Invalid email or password" });
            } else {
                res.status(200).json({ message: "Login successful", user: { id: user.id, email: user.email, role: user.role } });
            }
        }
    });
});

//Temporary OTP storage
const otpStore = {};

//Create a transporter for nodemailer
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "12345letsgrow@gmail.com",
        pass: "lzjj mgtr vinl bixl",
    },
});

// Endpoint to request OTP
app.post("/api/request-otp", (req, res) => {
    const { email } = req.body;

    // Check if the email exists in the database
    const query = "SELECT * FROM users WHERE email = ?";
    db.query(query, [email], (err, results) => {
        if (err) {
            console.error("Error checking email:", err);
            return res.status(500).json({ message: "Database error." });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: "Email not found in our records." });
        }

        // Generate a 6-digit OTP
        const otp = Math.floor(10000 + Math.random() * 90000).toString(); // Generate a 6-digit OTP
        const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

        otpStore[email] = { otp, expiresAt };

        // Send OTP via email
        transporter.sendMail({
            from: "12345letsgrow@gmail.com",
            to: email,
            subject: "Password Reset OTP",
            text: `Your OTP for password reset is ${otp}. It is valid for 10 minutes.`,
        }, (err, info) => {
            if (err) {
                console.error("Error sending email:", err);
                return res.status(500).json({ message: "Failed to send OTP." });
            }
            res.status(200).json({ message: "OTP sent successfully." });
        });
    });
});
// Endpoint to verify OTP
app.post("/api/verify-otp", (req, res) => {
    const { email, otp } = req.body;

    if (!otpStore[email] || otpStore[email].otp !== otp || otpStore[email].expiresAt < Date.now()) {
        return res.status(400).json({ message: "Invalid or expired OTP." });
    }

    // OTP is valid, allow password reset
    delete otpStore[email]; // Clear OTP after successful verification
    res.status(200).json({ message: "OTP verified successfully." });
});

// Endpoint to reset password
app.post("/api/reset-password", (req, res) => {
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
        return res.status(400).json({ message: "Email and new password are required." });
    }

    const hashedPassword = bycrypt.hashSync(newPassword, 10);

    const query = `UPDATE users SET password = ? WHERE email = ?`;
    db.query(query, [hashedPassword, email], (err, result) => {
        if (err) {
            console.error("Error updating password:", err);
            return res.status(500).json({ message: "Failed to reset password." });
        }
        res.status(200).json({ message: "Password reset successfully." });
    });
});

// Endpoint to fetch investors
app.get('/api/investors', (req, res) => {
  const query = 'SELECT id, first_name AS name, profile_image as image, categories FROM users WHERE role = "investor"';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching investors:', err);
      res.status(500).json({ message: 'Error fetching investors' });
    } else {
      res.status(200).json(results);
    }
  });
});

// Endpoint to fetch profile owner
app.get('/api/profile-owner/:id', (req, res) => {
  const userId = req.params.id;

  const query = `
    SELECT 
      id,
      first_name, 
      last_name, 
      phone_number, 
      email,
      address, 
      role, 
      categories,
      profile_image, 
      created_at AS date 
    FROM users 
    WHERE id = ?
  `;

  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error('Error fetching profile owner:', err);
      res.status(500).json({ message: 'Error fetching profile owner' });
    } else if (results.length === 0) {
      res.status(404).json({ message: 'Profile owner not found' });
    } else {
      res.status(200).json(results[0]);
    }
  });
});

// Endpoint to fetch a user's profile by ID
app.get('/api/profile/:id', (req, res) => {
    const userId = req.params.id;
    const query = 'SELECT * FROM users WHERE id = ?';
    db.query(query, [userId], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        if (results.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        // You may want to format the result as needed
        res.json(results[0]);
    });
});

// Set up multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/"); // Make sure this folder exists
    },
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname);
        cb(null, "profile_" + Date.now() + ext);
    }
});
const upload = multer({ storage: storage });

// Create uploads folder if not exists
const fs = require("fs");
if (!fs.existsSync("uploads")) {
    fs.mkdirSync("uploads");
}

// Update user profile endpoint
app.put("/api/profile/:id", upload.single("profile_image"), async (req, res) => {
    const userId = req.params.id;
    const {
        first_name,
        last_name,
        phone_number,
        categories,
        price_range,
        email,
        address,
        password // Include password in the request body
    } = req.body;

    let profile_image = req.file ? `/uploads/${req.file.filename}` : undefined;

    // Build update query dynamically
    let fields = [];
    let values = [];

    if (first_name) { fields.push("first_name = ?"); values.push(first_name); }
    if (last_name) { fields.push("last_name = ?"); values.push(last_name); }
    if (phone_number) { fields.push("phone_number = ?"); values.push(phone_number); }
    if (categories) { fields.push("categories = ?"); values.push(categories); }
    if (price_range) { fields.push("price_range = ?"); values.push(price_range); }
    if (email) { fields.push("email = ?"); values.push(email); }
    if (address) { fields.push("address = ?"); values.push(address); }
    if (profile_image) { fields.push("profile_image = ?"); values.push(profile_image); }

    // Hash the password if it exists
    if (password) {
        const bcrypt = require("bcrypt");
        const hashedPassword = await bcrypt.hash(password, 10);
        fields.push("password = ?");
        values.push(hashedPassword);
    }

    if (fields.length === 0) {
        return res.status(400).json({ message: "No fields to update." });
    }

    values.push(userId);

    const query = `UPDATE users SET ${fields.join(", ")} WHERE id = ?`;

    db.query(query, values, (err, result) => {
        if (err) {
            console.error("Error updating profile:", err);
            return res.status(500).json({ message: "Failed to update profile." });
        }
        res.status(200).json({ message: "Profile updated successfully." });
    });
});

// Serve uploaded images statically
app.use("/uploads", express.static("uploads"));

// Multer config for gig images
const gigStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/");
    },
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname);
        cb(null, "gig_" + Date.now() + ext);
    }
});
const gigUpload = multer({ storage: gigStorage });


//deleye user profile
app.delete("/api/profile/:id", (req, res) => {
  const userId = req.params.id;

  const query = "DELETE FROM users WHERE id = ?";
  db.query(query, [userId], (err, result) => {
    if (err) {
      console.error("Error deleting profile:", err);
      return res.status(500).json({ message: "Failed to delete profile." });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "User not found." });
    }
    res.status(200).json({ message: "Profile deleted successfully." });
  });
});

// Create a new gig
app.post("/api/gigs", gigUpload.single("image"), (req, res) => {
    const {
        Startup_name, Industry, Location, founder_name, Website, Contact_Number,
        problemStatement, solutionDescription, valueProposition, targetMarket,
        revenueStreams, pricingStrategy, currentStage, investmentType, equityOffered, user_id
    } = req.body;

    const image_path = req.file ? `/uploads/${req.file.filename}` : null;

    const query = `
        INSERT INTO gigs (
            user_id, startup_name, industry, location, founder_name, website, contact_number,
            problem_statement, solution_description, value_proposition, target_market,
            revenue_streams, pricing_strategy, current_stage, investment_type, equity_offered, image_path
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(query, [
        user_id, Startup_name, Industry, Location, founder_name, Website, Contact_Number,
        problemStatement, solutionDescription, valueProposition, targetMarket,
        revenueStreams, pricingStrategy, currentStage, investmentType, equityOffered, image_path
    ], (err, result) => {
        if (err) {
            console.error("Error inserting gig:", err);
            res.status(500).json({ message: "Error creating gig" });
        } else {
            res.status(200).json({ message: "Gig created successfully" });
        }
    });
});

// Get all gigs for a user (replace :userId with actual user id)
app.get("/api/gigs/:userId", (req, res) => {
    const userId = req.params.userId;
    db.query("SELECT * FROM gigs WHERE user_id = ?", [userId], (err, results) => {
        if (err) {
            console.error("Error fetching gigs:", err);
            res.status(500).json({ message: "Error fetching gigs" });
        } else {
            res.status(200).json(results);
        }
    });
});

// Get a single gig by its ID
app.get("/api/gig/:id", (req, res) => {
    const gigId = req.params.id;
    db.query("SELECT * FROM gigs WHERE id = ?", [gigId], (err, results) => {
        if (err) {
            console.error("Error fetching gig:", err);
            res.status(500).json({ message: "Error fetching gig" });
        } else if (results.length === 0) {
            res.status(404).json({ message: "Gig not found" });
        } else {
            res.status(200).json(results[0]);
        }
    });
});

// Update a gig by its ID
app.put("/api/gig/:id", (req, res) => {
    const gigId = req.params.id;
    const {
        startup_name, industry, location, founder_name, website, contact_number,
        problem_statement, solution_description, value_proposition, target_market,
        revenue_streams, pricing_strategy, current_stage, investment_type, equity_offered, image_path
    } = req.body;

    const query = `
        UPDATE gigs SET
            startup_name = ?, industry = ?, location = ?, founder_name = ?, website = ?, contact_number = ?,
            problem_statement = ?, solution_description = ?, value_proposition = ?, target_market = ?,
            revenue_streams = ?, pricing_strategy = ?, current_stage = ?, investment_type = ?, equity_offered = ?
            ${image_path ? ', image_path = ?' : ''}
        WHERE id = ?
    `;

    const values = [
        startup_name, industry, location, founder_name, website, contact_number,
        problem_statement, solution_description, value_proposition, target_market,
        revenue_streams, pricing_strategy, current_stage, investment_type, equity_offered
    ];
    if (image_path) values.push(image_path);
    values.push(gigId);

    db.query(query, values, (err, result) => {
        if (err) {
            console.error("Error updating gig:", err);
            res.status(500).json({ message: "Error updating gig" });
        } else {
            // Return the updated gig
            db.query("SELECT * FROM gigs WHERE id = ?", [gigId], (err2, results) => {
                if (err2 || results.length === 0) {
                    res.status(200).json({ message: "Gig updated, but could not fetch updated data." });
                } else {
                    res.status(200).json({ message: "Gig updated successfully", gig: results[0] });
                }
            });
        }
    });
});

// Endpoint to upload/update gig image
app.post("/api/gig/:id/upload-image", gigUpload.single("image"), (req, res) => {
    const gigId = req.params.id;
    if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
    }
    const image_path = `/uploads/${req.file.filename}`;
    // Optionally update the gig's image_path in the database
    db.query(
        "UPDATE gigs SET image_path = ? WHERE id = ?",
        [image_path, gigId],
        (err, result) => {
            if (err) {
                console.error("Error updating gig image:", err);
                return res.status(500).json({ message: "Error updating gig image" });
            }
            res.json({ image_path });
        }
    );
});

// Endpoint to fetch startups by category
app.get('/api/startups', (req, res) => {
  const query = 'SELECT id, first_name AS name, profile_image as image, categories FROM users WHERE role = "startup"';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching startups:', err);
      res.status(500).json({ message: 'Error fetching startups' });
    } else {
      res.status(200).json(results);
    }
  });
});

// create blog
app.post("/api/create-blog", upload.single("image"), (req, res) => {
    const { investorId, title, content } = req.body;

    if (!investorId || !title || !content) {
        return res.status(400).json({ error: "All fields are required" });
    }

    let image = null;
    if (req.file) {
        image = req.file.filename;
    }

    const sql = "INSERT INTO blogs (investor_id, title, content, image) VALUES (?, ?, ?, ?)";
    db.query(sql, [investorId, title, content, image], (err, result) => {
        if (err) {
            console.error("Error creating blog:", err);
            return res.status(500).json({ error: "Database error" });
        }
        res.status(201).json({ message: "Blog created successfully" });
    });
});

// Get all blogs by a specific user
app.get("/api/blog/:id", (req, res) => {
    const blogId = req.params.id;
    db.query("SELECT * FROM blogs WHERE id = ?", [blogId], (err, results) => {
        if (err) {
            console.error("Error fetching blog:", err);
            res.status(500).json({ message: "Error fetching blog" });
        } else if (results.length === 0) {
            res.status(404).json({ message: "Blog not found" });
        } else {
            res.status(200).json(results[0]);
        }
    });
});

// Endpoint to fetch all blogs for a specific user
app.get("/api/blogs/:userId", (req, res) => {
    const userId = req.params.userId;

    const query = `
        SELECT 
            id, 
            title, 
            content, 
            image, 
            created_at 
        FROM blogs 
        WHERE investor_id = ?
    `;

    db.query(query, [userId], (err, results) => {
        if (err) {
            console.error("Error fetching blogs:", err);
            res.status(500).json({ message: "Error fetching blogs" });
        } else if (results.length === 0) {
            res.status(404).json({ message: "No blogs found for this user" });
        } else {
            res.status(200).json(results);
        }
    });
});

// Update a blog by its ID
app.put("/api/blog/:id", upload.single("image"), (req, res) => {
    const blogId = req.params.id;
    const { title, content } = req.body;
    let image = null;

    if (req.file) {
        image = req.file.filename;
    }

    // Construct the query dynamically
    const query = `
        UPDATE blogs 
        SET title = ?, content = ? ${image ? ", image = ?" : ""}
        WHERE id = ?
    `;

    const values = [title, content];
    if (image) values.push(image);
    values.push(blogId);

    db.query(query, values, (err, result) => {
        if (err) {
            console.error("Error updating blog:", err);
            res.status(500).json({ message: "Error updating blog" });
        } else {
            res.status(200).json({ message: "Blog updated successfully" });
        }
    });
});

// Delete a blog by its ID
app.delete("/api/blog/:id", (req, res) => {
    const blogId = req.params.id;

    const query = "DELETE FROM blogs WHERE id = ?";
    db.query(query, [blogId], (err, result) => {
        if (err) {
            console.error("Error deleting blog:", err);
            res.status(500).json({ message: "Error deleting blog" });
        } else {
            res.status(200).json({ message: "Blog deleted successfully" });
        }
    });
});

// Update investor profile endpoint
app.put("/api/investor-profile/:id", upload.single("profile_image"), async (req, res) => {
    const investorId = req.params.id;
    const {
        first_name,
        last_name,
        phone_number,
        categories,
        price_range,
        email,
        address,
        password // Include password in the request body
    } = req.body;

    let profile_image = req.file ? `/uploads/${req.file.filename}` : undefined;

    // Build update query dynamically
    let fields = [];
    let values = [];

    if (first_name) { fields.push("first_name = ?"); values.push(first_name); }
    if (last_name) { fields.push("last_name = ?"); values.push(last_name); }
    if (phone_number) { fields.push("phone_number = ?"); values.push(phone_number); }
    if (categories) { fields.push("categories = ?"); values.push(categories); }
    if (price_range) { fields.push("price_range = ?"); values.push(price_range); }
    if (email) { fields.push("email = ?"); values.push(email); }
    if (address) { fields.push("address = ?"); values.push(address); }
    if (profile_image) { fields.push("profile_image = ?"); values.push(profile_image); }

    // Hash the password if it exists
    if (password) {
        const bcrypt = require("bcrypt");
        const hashedPassword = await bcrypt.hash(password, 10);
        fields.push("password = ?");
        values.push(hashedPassword);
    }

    if (fields.length === 0) {
        return res.status(400).json({ message: "No fields to update." });
    }

    values.push(investorId);

    const query = `UPDATE users SET ${fields.join(", ")} WHERE id = ?`;

    db.query(query, values, (err, result) => {
        if (err) {
            console.error("Error updating profile:", err);
            return res.status(500).json({ message: "Failed to update profile." });
        }
        res.status(200).json({ message: "Profile updated successfully." });
    });
});

// Endpoint to fetch all blogs
app.get("/api/blogs", (req, res) => {
    const query = `
        SELECT 
            id, 
            title, 
            content, 
            image, 
            created_at 
        FROM blogs
    `;

    db.query(query, (err, results) => {
        if (err) {
            console.error("Error fetching blogs:", err);
            res.status(500).json({ message: "Error fetching blogs" });
        } else {
            res.status(200).json(results);
        }
    });
});

app.get("/api/gigs-by-category/:userId", (req, res) => {
    const userId = req.params.userId;

    // Fetch the profile owner's category
    const userCategoryQuery = `SELECT categories FROM users WHERE id = ?`;

    db.query(userCategoryQuery, [userId], (err, userResults) => {
        if (err) {
            console.error("Error fetching user category:", err);
            return res.status(500).json({ message: "Error fetching user category" });
        }

        if (userResults.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        const userCategory = userResults[0].categories;

        if (!userCategory) {
            return res.status(400).json({ message: "User has no category defined" });
        }

        // Fetch gigs matching the user's category
        const gigsQuery = `
            SELECT * 
            FROM gigs 
            WHERE user_id IN (
                SELECT id 
                FROM users 
                WHERE FIND_IN_SET(?, categories)
            )
        `;

        db.query(gigsQuery, [userCategory], (err, gigResults) => {
            if (err) {
                console.error("Error fetching gigs:", err);
                return res.status(500).json({ message: "Error fetching gigs" });
            }

            res.status(200).json(gigResults);
        });
    });
});

//Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});