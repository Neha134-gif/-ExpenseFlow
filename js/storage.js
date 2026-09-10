// save transactions
export function saveTransactions(transactions) {
    localStorage.setItem("transactions", JSON.stringify(transactions));
}

// load transactions
export function loadTransactions() {
    const savedTransactions = localStorage.getItem("transactions");

    if (!savedTransactions) {
        return [];
    }

    try {
        const data = JSON.parse(savedTransactions);

        if (!Array.isArray(data)) {
            return [];
        }

        return data;

    } catch (error) {
        console.log("Could not load saved transactions:", error);
        return [];
    }
}