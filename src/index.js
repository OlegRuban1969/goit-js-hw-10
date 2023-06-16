import { fetchCatByBreed } from './cat-api.js';
import Notiflix from 'notiflix';
import SlimSelect from 'slim-select';
import 'notiflix/dist/notiflix-3.2.6.min.css';
import 'modern-normalize/modern-normalize.css';
import '../node_modules/slim-select/dist/slimselect.css';

// Инициализация библиотеки Notiflix
Notiflix.Notify.init({ position: 'right-bottom' });

// Обработчик выбора породы кота
const breedSelect = new SlimSelect('.breed-select', {
  placeholder: 'Select a breed',
});

const loader = document.querySelector('.loader');
const error = document.querySelector('.error');
const catInfo = document.querySelector('.cat-info');

breedSelect.onChange = function(item) {
  const breedId = item.value();
  showLoader();

  fetchCatByBreed(breedId)
    .then(cat => {
      hideLoader();
      showCatInfo(cat);
    })
    .catch(error => {
      hideLoader();
      console.error('Ошибка:', error);
      showError();
    });
};

// Загрузка коллекции пород при загрузке страницы
window.addEventListener('DOMContentLoaded', () => {
  showLoader();

  fetchBreeds()
    .then(breeds => {
      hideLoader();
      populateBreedsSelect(breeds);
    })
    .catch(error => {
      hideLoader();
      console.error('Ошибка:', error);
      showError();
    });
});

// Заполняет селект опциями пород
function populateBreedsSelect(breeds) {
  breeds.forEach(breed => {
    breedSelect.slim.add(breed.name, breed.id);
  });
  breedSelect.slim.setData();
}

// Показывает загрузчик
function showLoader() {
  loader.style.display = 'block';
  loader.classList.add('lds-dual-ring');
}

// Скрывает загрузчик
function hideLoader() {
  loader.style.display = 'none';
  loader.classList.remove('lds-dual-ring');
}

// Показывает информацию о коте
function showCatInfo(cat) {
  const breedName = cat[0].breeds[0].name;
  const description = cat[0].breeds[0].description;
  const temperament = cat[0].breeds[0].temperament;

  const catImage = document.createElement('img');
  catImage.src = cat[0].url;

  const breedNameElement = document.createElement('p');
  breedNameElement.textContent = `Breed: ${breedName}`;

  const descriptionElement = document.createElement('p');
  descriptionElement.textContent = `Description: ${description}`;

  const temperamentElement = document.createElement('p');
  temperamentElement.textContent = `Temperament: ${temperament}`;

  catInfo.innerHTML = '';
  catInfo.appendChild(catImage);
  catInfo.appendChild(breedNameElement);
  catInfo.appendChild(descriptionElement);
  catInfo.appendChild(temperamentElement);
}

// Показывает ошибку
function showError() {
  error.style.display = 'block';
  Notiflix.Notify.failure('Oops! Something went wrong. Please try again.');
}




