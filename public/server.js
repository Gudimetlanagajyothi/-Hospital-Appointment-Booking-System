require("dotenv").config({ path: "./.env" }); // Load .env variables

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const app = express();
const PORT = process.env.PORT || 5003;
const JWT_SECRET = process.env.JWT_SECRET || "ae1f88a588c8056fc035c388e8c2a1aa357da86f29acf3f78cec15e48b18e065b38a84bfa552bcf0cdcc1ec828c05b363034e74fdc422b0e8b2b64056b8361c6";

app.use(express.json());
app.use(cors());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/hospital_db", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log("✅ Connected to MongoDB"))
    .catch(err => {
        console.error("❌ MongoDB connection error:", err);
        process.exit(1);
    });

// Serve Static Files (Frontend)
app.use(express.static(path.join(__dirname)));

// **User Schema & Model**
const userSchema = new mongoose.Schema({
    fullName: String,
    email: { type: String, unique: true, required: true },
    password: String
});
const User = mongoose.model("User", userSchema);

// **Appointment Schema & Model**
const appointmentSchema = new mongoose.Schema({
    fullName: String,
    gender: String,
    age: Number,
    address: String,
    phone: String,
    appointmentDate: Date,
    appointmentTime: String,
    problem: String,
    description: String,
    createdAt: { type: Date, default: Date.now }
});
const Appointment = mongoose.model("Appointment", appointmentSchema);

// **Middleware to Verify JWT Token**
function verifyToken(req, res, next) {
    const token = req.headers.authorization?.split(" ")[1];
    console.log("Received Token in Backend:", token); 

    if (!token) {
        return res.status(401).json({ message: "No token provided" });
    }

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            console.error("Token Verification Failed:", err.message);
            return res.status(403).json({ message: "Invalid token" });
        }
        console.log("Decoded Token Data:", decoded); 
        req.user = decoded;
        next();
    });
}

// **User Registration (POST /api/register)**
app.post("/api/register", async (req, res) => {
    try {
        const { fullName, email, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists. Please login." });
        }

        // Validate password length
        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters long." });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = new User({ fullName, email, password: hashedPassword });
        await newUser.save();

        res.status(201).json({ message: "User registered successfully!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error registering user. Please try again." });
    }
});

// **User Login (POST /api/login)**
app.post("/api/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign({ userId: user._id, email: user.email }, JWT_SECRET, { expiresIn: "1h" });
        res.status(200).json({ message: "Login successful", token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error logging in. Please try again." });
    }
});

// **Book Appointment (Protected Route)**
app.post("/api/appointments", verifyToken, async (req, res) => {
    try {
        const newAppointment = new Appointment(req.body);
        await newAppointment.save();

        res.status(201).json({ message: "Appointment booked successfully!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error booking appointment. Please try again." });
    }
});

// **Get All Appointments (Protected Route)**
app.get("/api/appointments", verifyToken, async (req, res) => {
    try {
        const appointments = await Appointment.find();
        res.status(200).json(appointments);
    } catch (error) {
        res.status(500).json({ message: "Error fetching appointments. Please try again." });
    }
});


app.get("/api/user", verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select("fullName");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching user details" });
    }
});

// **Start Server**
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
