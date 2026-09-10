// add transaction
export function addTransaction(transactions, transaction) {
    transactions.push(transaction);
}

// find transaction
export function findTransaction(transactions, id) {
    return transactions.find(function(transaction) {
        return transaction.id === id;
    });
}

// delete transaction
export function deleteTransaction(transactions, id) {

    const index = transactions.findIndex(function(transaction) {
        return transaction.id === id;
    });

    if (index !== -1) {
        transactions.splice(index, 1);
    }
}

// calculate totals
export function calculateTotals(transactions) {

    const totalIncome = transactions.reduce(function(total, transaction) {

        if (transaction.type === "income") {
            return total + transaction.amount;
        }

        return total;

    }, 0);


    const totalExpenses = transactions.reduce(function(total, transaction) {

        if (transaction.type === "expense") {
            return total + transaction.amount;
        }

        return total;

    }, 0);


    const balance = totalIncome - totalExpenses;

    return {
        totalIncome,
        totalExpenses,
        balance
    };
}

// category analytics
export function calculateAnalytics(transactions) {

    const expenses = transactions.filter(function(transaction) {
        return transaction.type === "expense";
    });


    const categoryTotals = expenses.reduce(function(totals, transaction) {

        if (totals[transaction.category]) {
            totals[transaction.category] += transaction.amount;
        } else {
            totals[transaction.category] = transaction.amount;
        }

        return totals;

    }, {});


    return categoryTotals;
}