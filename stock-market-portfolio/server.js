const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyparser = require("body-parser");
const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors());
app.use(bodyparser.json());
app.use(express.json());
mongoose.connect(
  "mongodb+srv://codestranger095_db_user:s1LJPPlViU7BmnAn@cluster0.jbwxeqd.mongodb.net/stockdb?retryWrites=true&w=majority&appName=Cluster0",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
)
.then(() => console.log("✅ MongoDB connected successfully"))
.catch(err => console.error("❌ MongoDB connection error:", err));

const stockSchema = new mongoose.Schema({
    company:String,
    description:String,
    initial_price:Number,
    price_2002:Number,
    price_2007:Number,
    symbol:String,
});
const Stock = new mongoose.model("Stock", stockSchema);
app.get("/api/stocks", async (req, res) => {
    try{
        const stocks = await Stock.find();
        res.json(stocks);
    } catch(error){
        console.error("Error fetching stocks:", error);
        res.status(500).json({error: "Internal Server Error"});
    }
});
app.post("/api/watchlist", async (req, res) => {
    try{
        const {
            company,
            description,
            initial_price,
            price_2002,
            price_2007,
            symbol,
        } = req.body;
        const stock = new Stock({
            company,
            description,
            initial_price,
            price_2002,
            price_2007,
            symbol,
        }
        );
        await stock.save();
        res.json({message: "Stock added to watchlist successfully"});
        //const saved = await stock.save();
        //res.status(201).json(saved);
    } catch(error){
        console.error("Error adding stock:", error);
        res.status(500).json({error: "Internal Server Error"});
    }
});
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});