const fetchCountryBtn = document.getElementById('fetch-country-btn');
const countryInfo = document.getElementById('country-info');
const borderingCountries = document.getElementById('bordering-countries');

async function fetchCountryByName(countryName) {
    try {
        const res = await fetch(`https://restcountries.com/v3.1/name/${countryName}`);
        if (!res.ok) throw new Error('Country not found.');
        const data = await res.json();
        displayCountryInfo(data[0]);
    } catch (error) {
        countryInfo.innerHTML = `<p>Error: ${error.message}</p>`;
        borderingCountries.innerHTML = '';
    }
}

async function displayCountryInfo(country) {
    const capital = country.capital ? country.capital[0] : 'N/A';

    countryInfo.innerHTML = `
        <h2>${country.name.common}</h2>
        <p><strong>Capital:</strong> ${capital}</p>
        <p><strong>Population:</strong> ${country.population.toLocaleString()}</p>
        <p><strong>Region:</strong> ${country.region}</p>
        <img src="${country.flags.png}" alt="${country.name.common} flag">
    `;

    if (country.borders) {
        borderingCountries.innerHTML = '<h3>Bordering Countries:</h3>';
        
        for (const border of country.borders) {
            const borderRes = await fetch(`https://restcountries.com/v3.1/alpha/${border}`);
            const borderData = await borderRes.json();
            const neighbor = borderData[0];

            borderingCountries.innerHTML += `
                <div>
                    <p>${neighbor.name.common}</p>
                    <img src="${neighbor.flags.png}" alt="${neighbor.name.common} flag">
                </div>
            `;
        }
    } else {
        borderingCountries.innerHTML = '<p>No bordering countries found.</p>';
    }
}

fetchCountryBtn.addEventListener('click', () => {
    const countryInput = document.getElementById('country-input').value.trim();
    countryInfo.innerHTML = '';
    borderingCountries.innerHTML = '';
    if(countryInput) fetchCountryByName(countryInput);
});
