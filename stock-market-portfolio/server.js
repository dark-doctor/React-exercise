require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyparser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyparser.json());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB connected successfully"))
.catch(err => console.error("❌ MongoDB connection error:", err));

// Schemas
const stockSchema = new mongoose.Schema({
  company: String,
  description: String,
  initial_price: Number,
  price_2002: Number,
  price_2007: Number,
  symbol: String,
});

const watchlistSchema = new mongoose.Schema({
  company: String,
  description: String,
  initial_price: Number,
  price_2002: Number,
  price_2007: Number,
  symbol: String,
});

const Stock = mongoose.model("Stock", stockSchema);
const Watchlist = mongoose.model("Watchlist", watchlistSchema);

// Routes
app.get("/api/stocks", async (req, res) => {
  try {
    const stocks = await Stock.find();
    res.json(stocks);
  } catch (error) {
    console.error("Error fetching stocks:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/api/watchlist", async (req, res) => {
  try {
    const watchlist = await Watchlist.find();
    res.json(watchlist);
  } catch (error) {
    console.error("Error fetching watchlist:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/api/watchlist", async (req, res) => {
  try {
    const stockData = req.body;
    const exists = await Watchlist.findOne({ symbol: stockData.symbol });

    if (exists) {
      return res.status(400).json({ message: "Stock already in watchlist" });
    }

    const newStock = new Watchlist(stockData);
    await newStock.save();
    res.json({ message: "Stock added to watchlist successfully" });
  } catch (error) {
    console.error("Error adding stock:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});