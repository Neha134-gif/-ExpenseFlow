// fetch exchange rate
export async function fetchExchangeRate() {

    try {

        const response = await fetch(
            "https://api.frankfurter.app/latest?from=INR&to=USD"
        );


        if (!response.ok) {
            throw new Error("Failed to fetch exchange rate");
        }


        const data = await response.json();

        return data.rates.USD;

    } catch (error) {

        console.log("API Error:", error);

        return null;
    }
}