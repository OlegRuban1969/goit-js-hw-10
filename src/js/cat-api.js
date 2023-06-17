import { Loading } from 'notiflix/build/notiflix-loading-aio';

const ACCESS_KEY =
  'live_nUkXrkD8fu4U8v9kEZGbIevImu0hKuhlPcYUJJPcjyrXttGk5RfrmCsfTldceaHF';

  // Функция для отображения индикатора загрузки
const showLoading = () => {
  // Вызов метода `hourglass` из модуля `Loading` с текстом загрузки и настройками
  return Loading.hourglass('Loading data, please wait ...', {
    svgSize: '50px',
    messageFontSize: '22px',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  });
};

// Загрузка пород кошек
export function fetchBreeds() {
  showLoading();
  return fetch(`https://api.thecatapi.com/v1/breeds?api-key=${ACCESS_KEY}`).then(
    response => {
      Loading.remove();  // Удаляем индикатор загрузки
      if (!response.ok) {
        throw new Error(response.status);
      }
      return response.json();
    }
  );
}

// Генерация списка пород кошек
export function renderBreeds(array) {
  return array.map(
    item => `<option value="${item.reference_image_id}">${item.name}</option>`
  ); // принимает массив пород кошек и возвращает массив HTML-опций
}

// Запрос к API для получения информации о кошке по выбранной породе
export function fetchCatByBreed(breedId) {
  showLoading();
  return fetch(`https://api.thecatapi.com/v1/images/${breedId}`).then(
    response => {
      Loading.remove();
      if (!response.ok) {
        throw new Error(response.status);
      }
      return response.json();
    }
  );
}

// Генерация информации о кошке
export function renderCat(cat) {
  return `<img src="${cat.url}" alt="${cat.breeds[0].name} photo" width="300" />
      <div class="text-wraper">
        <h2 class="breed-title">${cat.breeds[0].name}</h2>
        <p class="description">
          ${cat.breeds[0].description}
        </p>
        <p class="temperament">
          <b>Temperament:</b> ${cat.breeds[0].temperament}
        </p>
      </div>`;
}
