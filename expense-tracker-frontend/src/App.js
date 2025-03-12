import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaTrash, FaMoon, FaSun } from "react-icons/fa";
import "./index.css";

export default function ExpenseTracker() {
    const [expenses, setExpenses] = useState([]);
    const [title, setTitle] = useState("");
    const [amount, setAmount] = useState("");
    const [category, setCategory] = useState("");
    const [darkMode, setDarkMode] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchExpenses();
    }, []);

    useEffect(() => {
        if (darkMode) {
            document.body.classList.add("dark-mode");
        } else {
            document.body.classList.remove("dark-mode");
        }
    }, [darkMode]);

    const fetchExpenses = async () => {
        try {
            const res = await axios.get("http://localhost:5000/expenses");
            console.log("Fetched expenses:", res.data); // Debugging log
            setExpenses(res.data);
        } catch (error) {
            console.error("Error fetching expenses:", error);
        }
    };

    const addExpense = async () => {
        if (isNaN(amount) || amount === "") {
            setError("Amount must be a number");
            return;
        }
        setError("");

        const newExpense = { title, amount, category };
        try {
            await axios.post("http://localhost:5000/add-expense", newExpense);
            console.log("Added expense:", newExpense); // Debugging log
            fetchExpenses();
            // Clear the input fields
            setTitle("");
            setAmount("");
            setCategory("");
        } catch (error) {
            console.error("Error adding expense:", error);
        }
    };

    const deleteExpense = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/expense/${id}`);
            console.log("Deleted expense with id:", id); // Debugging log
            fetchExpenses();
        } catch (error) {
            console.error("Error deleting expense:", error);
        }
    };

    return (
        <div className="container">
            <div className="header">
                <h1>Expense Tracker</h1>
                <button onClick={() => setDarkMode(!darkMode)}>
                    {darkMode ? <FaSun /> : <FaMoon />}
                </button>
            </div>
            <div className="form">
                <input
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                <input
                    placeholder="Amount"
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                />
                <input
                    placeholder="Category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                />
                <button onClick={addExpense}>Add Expense</button>
                {error && <p style={{ color: "red" }}>{error}</p>}
            </div>
            <ul className="expense-list">
                {expenses.map((exp) => (
                    <li key={exp._id} className="expense-item">
                        <span>{exp.title} - ₹{exp.amount} ({exp.category})</span>
                        <button onClick={() => deleteExpense(exp._id)}>
                            <FaTrash />
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}
