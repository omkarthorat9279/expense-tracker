const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();
const app = express();

app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

// Expense Schema
const ExpenseSchema = new mongoose.Schema({
    title: String,
    amount: Number,
    category: String,
    date: { type: Date, default: Date.now }
});

const Expense = mongoose.model("Expense", ExpenseSchema);

// Routes
app.post("/add-expense", async (req, res) => {
    const { title, amount, category } = req.body;

    // Validate amount
    if (isNaN(amount)) {
        return res.status(400).send({ error: "Amount must be a number" });
    }

    const expense = new Expense({ title, amount, category });
    await expense.save();
    res.send(expense);
});

app.get("/expenses", async (req, res) => {
    const expenses = await Expense.find();
    res.send(expenses);
});

app.delete("/expense/:id", async (req, res) => {
    await Expense.findByIdAndDelete(req.params.id);
    res.send({ message: "Deleted Successfully" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
