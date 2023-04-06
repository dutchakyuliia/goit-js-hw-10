import './css/styles.css';
import Notiflix from 'notiflix';
import debounce from 'lodash.debounce';
import { fetchCountries } from './fetchCountries';

const DEBOUNCE_DELAY = 300;
const inputEl = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

let nameCountry = '';

inputEl.addEventListener(
  'input',
  debounce(e => {
    countryInfo.innerHTML = '';
    countryList.innerHTML = '';
    handleInputCountry(e);
  }, DEBOUNCE_DELAY)
);

function handleInputCountry(e) {
  nameCountry = e.target.value.trim();
  if (nameCountry !== '') {
    fetchCountries(nameCountry)
      .then(data => {
        verifyResponse(data);
        return data;
      })
      .catch(error => {
        if (error.message === '404') {
          Notiflix.Notify.failure('Oops, there is no country with that name');
        }
        console.log(error);
      });
  }
}

function verifyResponse(data) {
  if (data.length > 10) {
    Notiflix.Notify.info(
      'Too many matches found. Please enter a more specific name.'
    );
    return;
  }
  if (data.length === 1) {
    createCountry(data);
    return;
  } else {
    createListCountry(data);
  }
}

function createCountry(data) {
  const [
    {
      name: { official },
      capital,
      population,
      flags: { svg, alt },
      languages,
    },
  ] = data;

  const lang = Object.values(languages);

  countryInfo.innerHTML = `<img src=${svg} alt=${alt} width="50" height="50">
<h1>${official}</h1>
<p><span class="title">Capital:</span> ${capital}</p>
<p><span class="title">Population:</span> ${population}</p>
<p><span class="title">Languages:</span> ${lang.join(', ')}</p>`;
}

function createListCountry(data) {
  data.forEach(element => {
    const countryListEl = `<li>
  <img src=${element.flags.svg} alt=${element.flags.alt} width="50" height="50">
  <p>${element.name.official}</p>
  </li>`;

    countryList.insertAdjacentHTML('beforeend', countryListEl);
  });
}
