import { useState, useEffect } from "react";
import { Pie } from "react-chartjs-2";
import { Chart, ArcElement, Tooltip, Legend } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
Chart.register(ArcElement, Tooltip, Legend, ChartDataLabels);
function App() {
  const [expenses, setExpenses] = useState(() => {
    const saved = localStorage.getItem("expenses");
    return saved ? JSON.parse(saved) : [];
  });

  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("General");
  const [darkMode, setDarkMode] = useState(false);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    localStorage.setItem("expenses", JSON.stringify(expenses));
  }, [expenses]);
    useEffect(() => {
  document.title = "Expense Analytics Dashboard";
}, []);
  const addExpense = (e) => {
    e.preventDefault();
    if (!title || !amount) return;

    const newExpense = {
      id: Date.now(),
      title,
      amount: parseFloat(amount),
      category,
    };

    setExpenses([...expenses, newExpense]);
    setTitle("");
    setAmount("");
    setCategory("General");
  };

  const deleteExpense = (id) => {
    setExpenses(expenses.filter((item) => item.id !== id));
  };

  const filteredExpenses =
    filter === "All"
      ? expenses
      : expenses.filter((e) => e.category === filter);

  const total = filteredExpenses.reduce(
    (sum, item) => sum + item.amount,
    0
  );

  const chartData = {
    labels: [...new Set(expenses.map((e) => e.category))],
    datasets: [
      {
        data: [...new Set(expenses.map((e) => e.category))].map(
          (cat) =>
            expenses
              .filter((e) => e.category === cat)
              .reduce((sum, e) => sum + e.amount, 0)
        ),
        backgroundColor: [
          "#3B82F6",
          "#EF4444",
          "#10B981",
          "#F59E0B",
          "#8B5CF6",
        ],
      },
    ],
  };

  return (
    <div
      className={`min-h-screen p-8 transition ${
        darkMode
          ? "bg-gray-900 text-white"
          : "bg-gradient-to-br from-gray-100 to-blue-100 text-gray-800"
      }`}
    >
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">
            Expense Analytics Dashboard
          </h1>

          <button
            onClick={() => setDarkMode(!darkMode)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:scale-105 transition"
          >
            {darkMode ? "Light Mode" : "Dark Mode"}
          </button>
        </div>

        {/* Add Expense */}
        <form
          onSubmit={addExpense}
          className={`p-6 rounded-2xl shadow-lg mb-8 space-y-4 ${
            darkMode ? "bg-gray-800" : "bg-white"
          }`}
        >
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Expense Title"
              className="border p-3 rounded-lg flex-1 text-black"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <input
              type="number"
              placeholder="Amount"
              className="border p-3 rounded-lg w-32 text-black"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>

          <select
            className="border p-3 rounded-lg w-full text-black"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option>General</option>
            <option>Food</option>
            <option>Travel</option>
            <option>Shopping</option>
            <option>Bills</option>
          </select>

          <button className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-2 rounded-lg hover:scale-105 transition">
            Add Expense
          </button>
        </form>

        {/* Filter */}
        <div className="mb-6">
          <select
            className="border p-2 rounded text-black"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option>All</option>
            <option>General</option>
            <option>Food</option>
            <option>Travel</option>
            <option>Shopping</option>
            <option>Bills</option>
          </select>
        </div>

        {/* Total */}
        <div
          className={`p-6 rounded-2xl shadow-lg mb-8 ${
            darkMode ? "bg-gray-800" : "bg-white"
          }`}
        >
          <h2 className="text-2xl font-semibold">
            Total: ₹ {total}
          </h2>
        </div>

       {/* Premium Donut Chart */}
{expenses.length > 0 && (
  <div
    className={`p-6 rounded-2xl shadow-lg mb-8 ${
      darkMode ? "bg-gray-800" : "bg-white"
    }`}
  >
    <div className="flex justify-center">
      <div className="w-80 h-80 hover:scale-105 transition duration-300">
        <Pie
          data={chartData}
          options={{
            maintainAspectRatio: false,
            cutout: "60%", // Makes it donut style
            animation: {
              animateScale: true,
              animateRotate: true,
            },
            plugins: {
              legend: {
                position: "bottom",
                labels: {
                  color: darkMode ? "#ffffff" : "#000000",
                },
              },
              tooltip: {
                backgroundColor: darkMode ? "#1f2937" : "#ffffff",
                titleColor: darkMode ? "#ffffff" : "#000000",
                bodyColor: darkMode ? "#ffffff" : "#000000",
                borderColor: "#3B82F6",
                borderWidth: 1,
              },
              datalabels: {
                color: "#fff",
                font: {
                  weight: "bold",
                },
                formatter: (value, context) => {
                  const total = context.dataset.data.reduce(
                    (sum, val) => sum + val,
                    0
                  );
                  const percentage = ((value / total) * 100).toFixed(1) + "%";
                  return percentage;
                },
              },
            },
          }}
        />
      </div>
    </div>
  </div>
)}
        {/* Expense List */}
        <div
          className={`p-6 rounded-2xl shadow-lg ${
            darkMode ? "bg-gray-800" : "bg-white"
          }`}
        >
          {filteredExpenses.length === 0 && (
            <p>No expenses found.</p>
          )}

          {filteredExpenses.map((expense) => (
            <div
              key={expense.id}
              className="flex justify-between items-center border-b py-3"
            >
              <div>
                <p className="font-semibold">
                  {expense.title}
                </p>
                <span className="text-sm opacity-70">
                  {expense.category}
                </span>
              </div>

              <div className="flex items-center gap-4">
                <span className="font-bold text-blue-400">
                  ₹ {expense.amount}
                </span>
                <button
                  onClick={() =>
                    deleteExpense(expense.id)
                  }
                  className="text-red-500 hover:text-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

export default App;