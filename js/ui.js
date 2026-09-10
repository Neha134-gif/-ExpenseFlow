// render transactions
export function renderTransactions(transactionList) {

    const transactionContainer =
        document.getElementById("transaction-list");

    transactionContainer.innerHTML = "";


    transactionList.forEach(function(transaction) {

        const sign = transaction.type === "income" ? "+" : "-";


        const transactionHTML = `
            <div class="transaction-item">

                <div class="transaction-info">
                    <h3>${transaction.description}</h3>
                    <p>${transaction.category}</p>
                    <small>${transaction.date}</small>
                </div>

                <div class="transaction-amount">
                    <span>
                        ${sign} ₹${transaction.amount}
                    </span>
                </div>

                <div class="transaction-actions">

                    <button
                        type="button"
                        class="edit-btn"
                        data-id="${transaction.id}">
                        Edit
                    </button>

                    <button
                        type="button"
                        class="delete-btn"
                        data-id="${transaction.id}">
                        Delete
                    </button>

                </div>

            </div>
        `;


        transactionContainer.innerHTML += transactionHTML;
    });
}


// update dashboard
export function updateDashboard(totals) {

    const totalBalanceElement =
        document.getElementById("total-balance");

    const totalIncomeElement =
        document.getElementById("total-income");

    const totalExpensesElement =
        document.getElementById("total-expenses");


    totalBalanceElement.textContent =
        `₹${totals.balance.toFixed(2)}`;

    totalIncomeElement.textContent =
        `₹${totals.totalIncome.toFixed(2)}`;

    totalExpensesElement.textContent =
        `₹${totals.totalExpenses.toFixed(2)}`;
}


// chart type
let chartType = "pie";

// update analytics
export function updateAnalytics(categoryTotals) {
    const spendingList = document.getElementById("spending-list");

    const categories = Object.keys(categoryTotals);
    const amounts = Object.values(categoryTotals);

    // no expenses
    if (categories.length === 0) {
        spendingList.innerHTML = `
            <div class="analytics-empty">
                <span>📊</span>
                <h3>Your spending insights will appear here</h3>
                <p>Add some expenses to see your category-wise spending.</p>
            </div>
        `;
        return;
    }

    const totalExpenses = amounts.reduce(function(total, amount) {
        return total + amount;
    }, 0);

    // colors
    const colors = [
        "#3478e5",
        "#f45b69",
        "#7c5cff",
        "#f5a623",
        "#20b486",
        "#ef7d32"
    ];

    // category details
    const categoryHTML = categories.map(function(category, index) {
        const amount = categoryTotals[category];
        const percentage = ((amount / totalExpenses) * 100).toFixed(1);
        const color = colors[index % colors.length];

        return `
            <div class="analytics-category">

                <div class="category-top">

                    <div class="category-name">
                        <span
                            class="category-dot"
                            style="background:${color};"
                        ></span>

                        <strong>${category}</strong>
                    </div>

                    <div class="category-amount">
                        <strong>₹${amount.toFixed(2)}</strong>
                        <span>${percentage}%</span>
                    </div>

                </div>

                <div class="progress-bg">
                    <div
                        class="progress-fill"
                        style="
                            width:${percentage}%;
                            background:${color};
                        "
                    ></div>
                </div>

            </div>
        `;
    }).join("");

    // biggest category
    let biggestCategory = categories[0];

    categories.forEach(function(category) {
        if (categoryTotals[category] > categoryTotals[biggestCategory]) {
            biggestCategory = category;
        }
    });

    const biggestPercentage = (
        (categoryTotals[biggestCategory] / totalExpenses) * 100
    ).toFixed(1);

    // pie chart
    let currentPercentage = 0;

    const gradientParts = categories.map(function(category, index) {
        const percentage =
            (categoryTotals[category] / totalExpenses) * 100;

        const start = currentPercentage;
        const end = currentPercentage + percentage;

        currentPercentage = end;

        return `${colors[index % colors.length]} ${start}% ${end}%`;
    });

    const gradient = gradientParts.join(", ");

    // pie labels
    currentPercentage = 0;

    const pieLabelsHTML = categories.map(function(category, index) {
        const percentage =
            (categoryTotals[category] / totalExpenses) * 100;

        const middle = currentPercentage + percentage / 2;

        currentPercentage += percentage;

        const angle = middle * 3.6 - 90;

        const radius = 115;

        const x = Math.cos(angle * Math.PI / 180) * radius;
        const y = Math.sin(angle * Math.PI / 180) * radius;

        return `
            <span
                class="pie-label"
                style="
                    transform:
                    translate(calc(-50% + ${x}px),
                    calc(-50% + ${y}px));
                "
            >
                ${percentage.toFixed(1)}%
            </span>
        `;
    }).join("");

    // bar chart
    const barChartHTML = categories.map(function(category, index) {
        const amount = categoryTotals[category];

        const percentage = (amount / totalExpenses) * 100;

        const color = colors[index % colors.length];

        return `
            <div class="bar-item">

                <div class="bar-header">
                    <strong>${category}</strong>
                    <span>₹${amount.toFixed(2)}</span>
                </div>

                <div class="bar-bg">
                    <div
                        class="bar-fill"
                        style="
                            width:${percentage}%;
                            background:${color};
                        "
                    ></div>
                </div>

                <span class="bar-percentage">
                    ${percentage.toFixed(1)}%
                </span>

            </div>
        `;
    }).join("");

    // chart
    let chartHTML = "";

    if (chartType === "pie") {
        chartHTML = `
            <div class="pie-chart-wrapper">

                <div
                    class="pie-chart"
                    style="background: conic-gradient(${gradient});"
                >

                    ${pieLabelsHTML}

                    <div class="pie-center">
                        <span>Total Expenses</span>
                        <strong>₹${totalExpenses.toFixed(2)}</strong>
                    </div>

                </div>

            </div>
        `;
    } else {
        chartHTML = `
            <div class="bar-chart">
                ${barChartHTML}
            </div>
        `;
    }

    // complete analytics
    spendingList.innerHTML = `

        <div class="analytics-header">

            <div class="analytics-heading">

                <span class="analytics-label">
                    UNDERSTAND YOUR SPENDING
                </span>

                <h2>Spending Overview</h2>

                <p>
                    See how your expenses are distributed
                    across different categories.
                </p>

            </div>

            <div class="chart-toggle">

                <button
                    id="pie-chart-btn"
                    class="${chartType === "pie" ? "active" : ""}"
                >
                    Pie Chart
                </button>

                <button
                    id="bar-chart-btn"
                    class="${chartType === "bar" ? "active" : ""}"
                >
                    Bar Chart
                </button>

            </div>

        </div>


        <div class="analytics-content">

            <div class="chart-area">
                ${chartHTML}
            </div>


            <div class="analytics-side">

                <div class="category-card">
                    ${categoryHTML}
                </div>

                <div class="analytics-insight">

                    <span class="insight-icon">💡</span>

                    <p>
                        <strong>${biggestCategory}</strong>
                        takes up
                        <strong>${biggestPercentage}%</strong>
                        of your total expenses.
                    </p>

                </div>

            </div>

        </div>
    `;

    // pie button
    document
        .getElementById("pie-chart-btn")
        .addEventListener("click", function() {
            chartType = "pie";
            updateAnalytics(categoryTotals);
        });

    // bar button
    document
        .getElementById("bar-chart-btn")
        .addEventListener("click", function() {
            chartType = "bar";
            updateAnalytics(categoryTotals);
        });
}