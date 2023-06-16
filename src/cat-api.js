import Notiflix from 'notiflix'; // Импорт библиотеки Notiflix для показа оповещений

const apiKey = 'live_BDUQDV8HY3i08rTgBKJvKu2hAwIJ1YwNgtbFndD88sBCrHmOZIsdE5tfke20GYAy'; 
// API-ключ для доступа к Cat API
const breedsUrl = `https://api.thecatapi.com/v1/breeds`; 
// URL для получения списка пород
const catImageUrl = `https://api.thecatapi.com/v1/images/search`; 
// URL для получения случайной картинки кота

function fetchData(url) {
  // Функция для выполнения GET-запроса на указанный URL и получения данных
  return fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .catch(error => {
      throw new Error(`Fetch error: ${error.message}`);
    });
}

export function loadBreeds() {
  // Функция для загрузки списка пород и добавления их в выпадающий список
  const loader = document.querySelector('.loader'); // Получение элемента загрузчика
  const breedSelect = new SlimSelect('.breed-select'); // Инициализация выпадающего списка с помощью SlimSelect
  loader.classList.remove('hidden'); // Удаление класса "hidden" для отображения загрузчика
  breedSelect.slim.clear(); // Очистка выпадающего списка

  fetchData(`${breedsUrl}?api_key=${apiKey}`)
    .then(breeds => {
      // Получение списка пород и добавление их в выпадающий список
      breeds.forEach(breed => {
        breedSelect.slim.add(breed.name, breed.id);
      });
      loader.classList.add('hidden'); // Добавление класса "hidden" для скрытия загрузчика
      breedSelect.slim.setData(); // Обновление данных в выпадающем списке
    })
    .catch(error => {
      console.error('Ошибка:', error);
      showError(); // Показ ошибки
    });
}

export function fetchCatByBreed(breedId) {
  // Функция для получения случайной картинки кота по выбранной породе
  const loader = document.querySelector('.loader'); // Получение элемента загрузчика
  loader.classList.remove('hidden'); // Удаление класса "hidden" для отображения загрузчика

  return fetchData(`${catImageUrl}?api_key=${apiKey}&breed_ids=${breedId}`)
    .then(cats => {
      loader.classList.add('hidden'); // Добавление класса "hidden" для скрытия загрузчика
      return cats;
    })
    .catch(error => {
      console.error('Ошибка:', error);
      showError(); // Показ ошибки
    });
}

function showError() {
  // Функция для показа сообщения об ошибке
  const error = document.querySelector('.error'); // Получение элемента с сообщением об ошибке
  error.classList.remove('hidden'); // Удаление класса "hidden" для отображения сообщения об ошибке
}

export function showCatInfo(cat) {
  // Функция для отображения информации о выбранном коте
  const catInfo = document.querySelector('.cat-info'); // Получение элемента с информацией о коте
  const catImage = document.querySelector('.cat-image'); // Получение элемента с изображением кота
  const catName = cat[0].breeds[0].name; // Имя кота
  const catDescription = cat[0].breeds[0].description; // Описание кота
  const catTemperament = cat[0].breeds[0].temperament; // Характер кота
  catImage.src = cat[0].url; // Установка источника изображения кота
  catInfo.innerHTML = `
    <h2>${catName}</h2>
    <p><strong>Description:</strong> ${catDescription}</p>
    <p><strong>Temperament:</strong> ${catTemperament}</p>
  `; // Установка информации о коте в HTML-элемент
  catInfo.classList.remove('hidden'); // Удаление класса "hidden" для отображения информации о коте
}

document.addEventListener('DOMContentLoaded', loadBreeds); 
// Загрузка списка пород при полной загрузке документа
