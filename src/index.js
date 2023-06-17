import './css/styles.css';
import SlimSelect from 'slim-select';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import '../node_modules/slim-select/dist/slimselect.css';
import {
  fetchBreeds,
  renderBreeds,
  fetchCatByBreed,
  renderCat,
} from './js/cat-api';

// Доступ к контейнеру, содержащему выбор породы кошки.
const selectContainerEl = document.querySelector('.select-container');
// Доступ к выпадающему списку выбора породы кошки.
const selectEl = document.querySelector('#selectElement');
// Доступ к контейнеру, где будет отображаться информация о кошке.
const catInfoEl = document.querySelector('.cat-info');

// Отображение ошибки
function showError(error) {
  console.log(error);
  selectContainerEl.classList.add('js-visually-hidden');// Добавляем класс для скрытия контейнера с выбором
  Notify.failure(`Oops! Something went wrong! Try reloading the page!`, { // Отображаем уведомление об ошибке
    position: 'center-center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    clickToClose: true,
    timeout: 10000,
    width: '260px',
  });
}

// Получение списка пород кошек
fetchBreeds()
  .then(data => {
    // Вставляем HTML-код списка пород в элемент selectEl
    selectEl.insertAdjacentHTML('beforeend', renderBreeds(data));
    // Удаляем класс "js-visually-hidden" у элемента selectContainerEl, чтобы отобразить контейнер выбора породы
    selectContainerEl.classList.remove('js-visually-hidden');
    // Создаем новый экземпляр SlimSelect для выпадающего списка
    new SlimSelect({
      select: '#selectElement',
      settings: {
        allowDeselect: true,
        placeholderText: `Select cat's breed ...`,
      },
      events: {
        // При изменении выбранного значения
        afterChange: newVal => {
          // Очищаем содержимое элемента catInfoEl
          catInfoEl.innerHTML = '';
          // Если выбрано новое значение
          if (newVal.length !== 0) {
            // Получаем информацию о кошке по выбранной породе
            fetchCatByBreed(newVal[0].value)
              .then(data => {
                // Отображаем информацию о кошке в элементе catInfoEl
                catInfoEl.innerHTML = renderCat(data);
              })
              .catch(err => {
                // В случае ошибки отображаем сообщение об ошибке
                showError(err);
              });
          }
        },
      },
    });
  })
  .catch(err => {
    // В случае ошибки отображаем сообщение об ошибке
    showError(err);
  });

