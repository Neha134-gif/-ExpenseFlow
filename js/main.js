import {
    addTransaction,
    findTransaction,
    deleteTransaction,
    calculateTotals,
    calculateAnalytics
} from "./transactions.js";

import {
    saveTransactions,
    loadTransactions
} from "./storage.js";

import {
    renderTransactions,
    updateDashboard,
    updateAnalytics
} from "./ui.js";

import {
    fetchExchangeRate
} from "./api.js";


let transactions = loadTransactions();
let editingTransactionId = null;
let chartType = "pie";

// form
const transactionForm =
    document.getElementById("transaction-form");


// ==========================================================
// ADD / EDIT
// ==========================================================

transactionForm.addEventListener("submit", function(event) {

    event.preventDefault();


    const description =
        document.getElementById("description").value;

    const amount =
        Number(document.getElementById("amount").value);

    const type =
        document.getElementById("type").value;

    const category =
        document.getElementById("category").value;

    const date =
        document.getElementById("date").value;


    // add
    if (editingTransactionId === null) {

        const transaction = {

            id: Date.now(),

            description: description,

            amount: amount,

            type: type,

            category: category,

            date: date
        };


        addTransaction(transactions, transaction);

    }

    // edit
    else {

        const transaction =
            findTransaction(
                transactions,
                editingTransactionId
            );


        if (transaction) {

            transaction.description = description;

            transaction.amount = amount;

            transaction.type = type;

            transaction.category = category;

            transaction.date = date;
        }


        editingTransactionId = null;
    }


    saveTransactions(transactions);

    refreshUI();

    transactionForm.reset();
});


// ==========================================================
// REFRESH UI
// ==========================================================

function refreshUI() {

    renderTransactions(transactions);

    const totals =
        calculateTotals(transactions);

    updateDashboard(totals);


    const categoryTotals =
        calculateAnalytics(transactions);
        

    updateAnalytics(categoryTotals);
}


// ==========================================================
// DELETE
// ==========================================================

function addDeleteEvents() {

    const deleteButtons =
        document.querySelectorAll(".delete-btn");


    deleteButtons.forEach(function(button) {

        button.addEventListener("click", function(event) {

            const id =
                Number(event.currentTarget.dataset.id);


            deleteTransaction(transactions, id);

            saveTransactions(transactions);

            refreshUI();
        });
    });
}


// ==========================================================
// EDIT
// ==========================================================

function addEditEvents() {

    const editButtons =
        document.querySelectorAll(".edit-btn");


    editButtons.forEach(function(button) {

        button.addEventListener("click", function(event) {

            const id =
                Number(event.currentTarget.dataset.id);


            const transaction =
                findTransaction(
                    transactions,
                    id
                );


            if (transaction) {

                editingTransactionId =
                    transaction.id;


                document.getElementById("description").value =
                    transaction.description;


                document.getElementById("amount").value =
                    transaction.amount;


                document.getElementById("type").value =
                    transaction.type;


                document.getElementById("category").value =
                    transaction.category;


                document.getElementById("date").value =
                    transaction.date;


                transactionForm.scrollIntoView({
                    behavior: "smooth",
                    block: "center"
                });
            }
        });
    });
}


// ==========================================================
// SEARCH & FILTER
// ==========================================================

const searchInput =
    document.getElementById("search");

const categoryFilter =
    document.getElementById("category-filter");

const typeFilter =
    document.getElementById("type-filter");

const sortFilter =
    document.getElementById("sort");


searchInput.addEventListener("input", function() {
    applyFilters();
});


categoryFilter.addEventListener("change", function() {
    applyFilters();
});


typeFilter.addEventListener("change", function() {
    applyFilters();
});


sortFilter.addEventListener("change", function() {
    applyFilters();
});


// ==========================================================
// FILTER
// ==========================================================

function applyFilters() {

    const searchText =
        searchInput.value.toLowerCase();

    const selectedCategory =
        categoryFilter.value;

    const selectedType =
        typeFilter.value;

    const selectedSort =
        sortFilter.value;


    const filteredTransactions =
        transactions.filter(function(transaction) {

            const matchesSearch =
                transaction.description
                    .toLowerCase()
                    .includes(searchText) ||

                transaction.category
                    .toLowerCase()
                    .includes(searchText);


            const matchesCategory =
                selectedCategory === "all" ||
                transaction.category === selectedCategory;


            const matchesType =
                selectedType === "all" ||
                transaction.type === selectedType;


            return (
                matchesSearch &&
                matchesCategory &&
                matchesType
            );
        });


    // sort
    filteredTransactions.sort(function(a, b) {

        if (selectedSort === "newest") {
            return new Date(b.date) - new Date(a.date);
        }


        if (selectedSort === "oldest") {
            return new Date(a.date) - new Date(b.date);
        }


        if (selectedSort === "highest") {
            return b.amount - a.amount;
        }


        if (selectedSort === "lowest") {
            return a.amount - b.amount;
        }
    });


    renderTransactions(filteredTransactions);

    addDeleteEvents();
    addEditEvents();
}


// ==========================================================
// API
// ==========================================================

async function loadExchangeRate() {

    const rate =
        await fetchExchangeRate();


    if (rate !== null) {

        console.log(
            `1 INR = ${rate} USD`
        );
    }
}


// ==========================================================
// START APP
// ==========================================================

refreshUI();

addDeleteEvents();

addEditEvents();

loadExchangeRate();