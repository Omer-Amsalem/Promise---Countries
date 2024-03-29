if(window.location.pathname === '/index.html'){
function getAllCountries() {
    const requestOptions = {
      method: "GET",
      redirect: "follow"
    };
  
    return fetch("https://restcountries.com/v3.1/all", requestOptions)
      .then((response) => response.json()) 
      .then((result) => {
        const container = document.querySelector('.countries-grid'); 

        result.forEach((country) => {
            const countryElement = document.createElement('a');
            countryElement.href = "details.html?data="+country.name.common.toString();
          countryElement.classList.add('country', 'scale-effect');
          countryElement.dataset.countryName = country.name.common;
          countryElement.innerHTML = `
            <div class="country-flag">
            <img src="${country.flags.svg}" alt="${country.name.common} Flag">
            </div>
            <div class="country-info"  >
            <h2 class="country-title">${country.name.common}</h2>
            <ul class="country-brief">
                <li><strong>Population: </strong>${country.population}</li>
                <li><strong>Region: </strong>${country.region}</li>
                <li><strong>Capital: </strong>${country.capital}</li>
            </ul>
            </div>
        `;

        

        // countryElement.addEventListener('click', function() {
        //     window.location.href = 'details.html';
        // });

      
        countryElement.addEventListener('click', function() {
            if( window.location.pathname === '/details.html'){
                displayCountryDetails(country);
            }
            
        });
    
        if(window.location.pathname != '/details.html'){
        container.appendChild(countryElement);
        }
        });
        
        return result; 
      })
      .catch((error) => console.error(error)); 
  }
  getAllCountries();

  
  document.addEventListener('DOMContentLoaded', function () {
    const searchInput = document.querySelector('.search-input');
    const regionFilterItems = document.querySelectorAll('.dropdown-body li');
    if (window.location.pathname != '/details.html'){
    searchInput.addEventListener('input', function () {
        const searchTerm = searchInput.value.toLowerCase();
        filterCountries(searchTerm);
    });
}

    regionFilterItems.forEach(function (item) {
        item.addEventListener('click', function () {
            const region = item.dataset.region;
            filterCountriesByRegion(region);
        });
    });
});

function filterCountries(searchTerm) {
    const countries = document.querySelectorAll('.country');
    countries.forEach(function (country) {
        const countryName = country.dataset.countryName.toLowerCase();
        if (countryName.includes(searchTerm)) {
            country.style.display = 'block';
        } else {
            country.style.display = 'none';
        }
    });
}

function filterCountriesByRegion(region) {
    const countries = document.querySelectorAll('.country');
    countries.forEach(function (country) {
        const countryRegion = country.getAttribute('data-region');
        if (region === 'all' || countryRegion === region) {
            country.style.display = 'block';
        } else {
            country.style.display = 'none';
        }
    });
}




function toggleTheme() {
    const body = document.body;
    const themeText = document.querySelector('.theme-text');
    const themeIcon = document.querySelector('.theme-icon');

    body.classList.toggle('dark-theme');

    if (body.classList.contains('dark-theme')) {
        themeText.textContent = 'Light Mode';
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
    } else {
        themeText.textContent = 'Dark Mode';
        themeIcon.classList.remove('fa-sun');
        themeIcon.classList.add('fa-moon');
    }
}




function getCountryByRegion(region) {
    const requestOptions = {
        method: 'GET',
        redirect: 'follow'
    };
    return fetch(`https://restcountries.com/v3.1/region/${region}`, requestOptions)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch countries by region');
            }
            return response.json();
        });
}


function filterCountriesByRegion(region) {
    if (region === 'all') {
        return getAllCountries();
    }
    getCountryByRegion(region)
        .then(countries => {
            const container = document.querySelector('.countries-grid');

            container.innerHTML = '';
            countries.forEach(country => {
                const countryElement = document.createElement('a');
                countryElement.href = 'details.html';
                countryElement.classList.add('country', 'scale-effect');
                countryElement.dataset.countryName = country.name.common;
                countryElement.innerHTML = `
                    <div class="country-flag">
                        <img src="${country.flags.svg}" alt="${country.name.common} Flag">
                    </div>
                    <div class="country-info">
                        <h2 class="country-title">${country.name.common}</h2>
                        <ul class="country-brief">
                            <li><strong>Population: </strong>${country.population}</li>
                            <li><strong>Region: </strong>${country.region}</li>
                            <li><strong>Capital: </strong>${country.capital}</li>
                        </ul>
                    </div>
                `;
                container.appendChild(countryElement);
            });
        })
        .catch(error => console.error(error));
}
}

if(window.location.pathname === '/details.html'){


    const urlParams = new URLSearchParams(window.location.search);
    const countryName = urlParams.get('data');
    getCountryDetails(countryName)
        .then(country => displayCountryDetails(country[0]))
        .catch(error => console.error(error));
}

function getCountryDetails(countryName) {
    const requestOptions = {
        method: 'GET',
        redirect: 'follow'
    };
    return fetch(`https://restcountries.com/v3.1/name/${countryName}`, requestOptions)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch country details');
            }
            return response.json();
        });
}

function displayCountryDetails(country) {
    const countryDetails = document.querySelector('.country-details');
    for (let currencyCode in country.currencies) {
        currencyName = country.currencies[currencyCode].name;
        break;
    }
    for (let native in country.name.nativeName) {
        nativeName = country.name.nativeName[native].common;
        break;
    }
    countryDetails.innerHTML = `
        <div class="country-flag">
            <img src="${country.flags.svg}" alt="${country.name.common} Flag">
        </div>
        <div class="country-info">
            <h1 class="country-title">${country.name.common}</h1>
            <ul class="country-brief">
                <li><strong>Native Name: </strong>${nativeName}</li>
                <li><strong>Population: </strong>${country.population}</li>
                <li><strong>Region: </strong>${country.region}</li>
                <li><strong>Sub Region: </strong>${country.subregion}</li>
                <li><strong>Capital: </strong>${country.capital}</li>
                <li><strong>Top Level Domain: </strong>${country.tld}</li>
                <li><strong>Currencies: </strong>${currencyName}</li>
                <li><strong>Languages: </strong>${Object.values(country.languages)}</li>
            </ul>
            <div class="country-borders">
            <strong>Border Countries: </strong>${country.borders}
            </div>
        </div>
    `;
    const borderCountries = document.querySelectorAll('.border-country');
    borderCountries.forEach(borderCountry => {
        borderCountry.addEventListener('click', function () {
            getCountryDetails(borderCountry.textContent)
                .then(country => displayCountryDetails(country[0]))
                .catch(error => console.error(error));
        });
    });
}

function toggleTheme() {
    const body = document.body;
    const themeText = document.querySelector('.theme-text');
    const themeIcon = document.querySelector('.theme-icon');

    body.classList.toggle('dark-theme');

    if (body.classList.contains('dark-theme')) {
        themeText.textContent = 'Light Mode';
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
    } else {
        themeText.textContent = 'Dark Mode';
        themeIcon.classList.remove('fa-sun');
        themeIcon.classList.add('fa-moon');
    }
}