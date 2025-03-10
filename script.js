document.addEventListener("DOMContentLoaded", () => {
    const fetchCountryBtn = document.getElementById('fetch-country-btn');
    const countryInfo = document.getElementById('country-info');
    const borderingCountries = document.getElementById('bordering-countries');

    fetchCountryBtn.addEventListener('click', () => {
        const countryInput = document.getElementById('country-input').value.trim();
        countryInfo.innerHTML = ''; // Clear previous results
        borderingCountries.innerHTML = ''; // Clear previous bordering countries

        if (countryInput) {
            fetchCountryByName(countryInput);
        } else {
            countryInfo.innerHTML = `<p>Please enter a valid country name.</p>`;
        }
    });

    async function fetchCountryByName(country) {
        try {
            const res = await fetch(`https://restcountries.com/v3.1/name/${country}`);
            if (!res.ok) throw new Error('Country not found');
            const data = await res.json();
            displayCountryInfo(data[0]); // Display only the first match
        } catch (error) {
            countryInfo.innerHTML = `<p>Error: ${error.message}</p>`;
            borderingCountries.innerHTML = '';
        }
    }

    function displayCountryInfo(country) {
        countryInfo.innerHTML = `
            <div id="country-info">
                <img src="${country.flags.png}" alt="${country.name.common} flag">
                <div id="country-details">
                    <h2>${country.name.common}</h2>
                    <p><strong>Capital:</strong> ${country.capital ? country.capital[0] : "N/A"}</p>
                    <p><strong>Population:</strong> ${country.population.toLocaleString()}</p>
                    <p><strong>Region:</strong> ${country.region}</p>
                </div>
            </div>
        `;

        // Display bordering countries
        if (country.borders) {
            borderingCountries.innerHTML = '<h3>Bordering Countries:</h3>';
            country.borders.forEach(async (border) => {
                const borderRes = await fetch(`https://restcountries.com/v3.1/alpha/${border}`);
                const borderData = await borderRes.json();
                const neighbor = borderData[0];

                borderingCountries.innerHTML += `
                    <div class="border-country">
                        <img src="${neighbor.flags.png}" alt="${neighbor.name.common} flag">
                        <p>${neighbor.name.common}</p>
                    </div>
                `;
            });
        } else {
            borderingCountries.innerHTML = '<p>No bordering countries found.</p>';
        }
    }
});
