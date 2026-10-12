/* Константа для получения полного пути для сервера. Для выполнения запроса 
необходимо к API_URL добавить только ендпоинт. */
export const API_URL = `${import.meta.env.VITE_API_ORIGIN}/api/weblarek`; 

/* Константа для формирования полного пути к изображениям карточек. 
Для получения полной ссылки на картинку необходимо к CDN_URL добавить только название файла изображения,
которое хранится в объекте товара. */
export const CDN_URL = `${import.meta.env.VITE_API_ORIGIN}/content/weblarek`;

/* Константа соответствий категорий товара модификаторам, используемым для отображения фона категории. */
export const categoryMap = {
  'софт-скил': 'card__category_soft',
  'хард-скил': 'card__category_hard',
  'кнопка': 'card__category_button',
  'дополнительное': 'card__category_additional',
  'другое': 'card__category_other',
};

export const settings = {

};

/* Константы событий приложения. Используются для связи Model, View и Presenter. */
export const EVENTS = {
    // Каталог
    ITEMS_CHANGED: 'items:changed',
    CARD_SELECT: 'card:select',
    PREVIEW_CHANGED: 'preview:changed',

    // Действия с товаром
    CARD_BUY: 'card:buy',
    CARD_REMOVE: 'card:remove',

    // Корзина
    BASKET_OPEN: 'basket:open',
    BASKET_CHANGED: 'basket:changed',
    BASKET_REMOVE: 'basket:remove',

    // Оформление заказа
    ORDER_OPEN: 'order:open',
    ORDER_CHANGE: 'order:change',
    ORDER_SUBMIT: 'order:submit',
    CONTACTS_CHANGE: 'contacts:change',
    CONTACTS_SUBMIT: 'contacts:submit',
    ORDER_SUCCESS: 'order:success',

    // Модальное окно
    MODAL_OPEN: 'modal:open',
    MODAL_CLOSE: 'modal:close',

    // Успех
    SUCCESS_CLOSE: 'success:close',
} as const;
