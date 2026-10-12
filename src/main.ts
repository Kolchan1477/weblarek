import './scss/styles.scss';
import { Products } from './components/Models/Products';
import { Cart } from './components/Models/Cart';
import { Customer } from './components/Models/Customer';
import { apiProducts } from './utils/data';
import { EVENTS } from './utils/constants';
import { EventEmitter } from './components/base/Events';
import { Modal } from './components/View/Modal';
import { Success } from './components/View/Success';
import { Header } from './components/View/Header';
import { Gallery } from './components/View/Gallery';
import { CardCatalog } from './components/View/CardCatalog';
import { CardPreview } from './components/View/CardPreview';
import { CardBasket } from './components/View/CardBasket';
import { Basket } from './components/View/Basket';
import { OrderForm } from './components/View/OrderForm';
import { ContactsForm } from './components/View/ContactsForm';
import { ICustomer } from './types';

// ============================================================
// ВАЖНО: Слой коммуникации временно отключён.
// API-сервер larek-api.nomoreparties.co недоступен (сбой инфраструктуры).
//
// Когда сервер восстановится:
//   1. Раскомментируйте импорты Api, WebLarekApi и API_URL ниже.
//   2. Создайте экземпляры api и weblarekApi.
//   3. Замените блок «ЗАГРУЗКА ТОВАРОВ» на weblarekApi.getProducts().
//   4. В обработчике CONTACTS_SUBMIT замените эмуляцию на weblarekApi.sendOrder().
// ============================================================

// import { Api } from './components/base/Api';
// import { WebLarekApi } from './components/api/WebLarekApi';
// import { API_URL } from './utils/constants';

// ============================================================
// 1. ИНИЦИАЛИЗАЦИЯ МОДЕЛЕЙ ДАННЫХ
// ============================================================

const productsModel = new Products();
const cartModel = new Cart();
const customerModel = new Customer();

// ============================================================
// 2. ИНИЦИАЛИЗАЦИЯ СЛОЯ КОММУНИКАЦИИ
// ============================================================
// Временно закомментировано: API-сервер недоступен.
// Раскомментировать вместе с блоком «ЗАГРУЗКА ТОВАРОВ».

// const api = new Api(API_URL);
// const weblarekApi = new WebLarekApi(api);

// ============================================================
// 3. ИНИЦИАЛИЗАЦИЯ БРОКЕРА СОБЫТИЙ
// ============================================================

const events = new EventEmitter();

// ============================================================
// 4. ИНИЦИАЛИЗАЦИЯ КОМПОНЕНТОВ VIEW
// ============================================================

const modalContainer = document.querySelector('#modal-container') as HTMLElement;
const modal = new Modal(modalContainer, events);

const headerContainer = document.querySelector('.header') as HTMLElement;
const header = new Header(headerContainer, events);

const galleryContainer = document.querySelector('.gallery') as HTMLElement;
const gallery = new Gallery(galleryContainer);

const successTemplate = document.querySelector('#success') as HTMLTemplateElement;
const successElement = successTemplate.content.firstElementChild!.cloneNode(true) as HTMLElement;
const success = new Success(successElement, events);

const basketTemplate = document.querySelector('#basket') as HTMLTemplateElement;
const basketElement = basketTemplate.content.firstElementChild!.cloneNode(true) as HTMLElement;
const basket = new Basket(basketElement, events);

const orderTemplate = document.querySelector('#order') as HTMLTemplateElement;
const orderElement = orderTemplate.content.firstElementChild!.cloneNode(true) as HTMLElement;
const orderForm = new OrderForm(orderElement, events);

const contactsTemplate = document.querySelector('#contacts') as HTMLTemplateElement;
const contactsElement = contactsTemplate.content.firstElementChild!.cloneNode(true) as HTMLElement;
const contactsForm = new ContactsForm(contactsElement, events);

const cardCatalogTemplate = document.querySelector('#card-catalog') as HTMLTemplateElement;
const cardPreviewTemplate = document.querySelector('#card-preview') as HTMLTemplateElement;
const cardBasketTemplate = document.querySelector('#card-basket') as HTMLTemplateElement;

// ============================================================
// 5. ПРЕЗЕНТЕР — ОБРАБОТЧИКИ СОБЫТИЙ
// ============================================================

// --- Каталог загружен ---
events.on(EVENTS.ITEMS_CHANGED, () => {
    const cards = productsModel.getItems().map((item) => {
        const cardElement = cardCatalogTemplate.content.firstElementChild!.cloneNode(true) as HTMLElement;
        const card = new CardCatalog(cardElement, events);
        return card.render({
            id: item.id,
            title: item.title,
            price: item.price,
            image: item.image,
            category: item.category,
        });
    });
    gallery.render({ items: cards });
});

// --- Клик по карточке каталога ---
events.on(EVENTS.CARD_SELECT, (data: { id: string }) => {
    const product = productsModel.getItem(data.id);
    if (!product) return;

    productsModel.setPreview(product);

    const isInCart = cartModel.hasItem(product.id);

    const previewElement = cardPreviewTemplate.content.firstElementChild!.cloneNode(true) as HTMLElement;
    const cardPreview = new CardPreview(previewElement, events);

    cardPreview.render({
        price: product.price,
        id: product.id,
        title: product.title,
        image: product.image,
        category: product.category,
        description: product.description,
        state: { isInCart },
    });

    modal.render({ content: cardPreview.render() });
});

// --- Добавление товара в корзину ---
events.on(EVENTS.CARD_BUY, (data: { id: string }) => {
    const product = productsModel.getItem(data.id);
    if (!product) return;

    cartModel.addItem(product);
    events.emit(EVENTS.BASKET_CHANGED);
    modal.close();
});

// --- Удаление товара из корзины (из превью) ---
events.on(EVENTS.CARD_REMOVE, (data: { id: string }) => {
    cartModel.removeItem(data.id);
    events.emit(EVENTS.BASKET_CHANGED);
    modal.close();
});

// --- Корзина изменилась — обновляем счётчик в шапке ---
events.on(EVENTS.BASKET_CHANGED, () => {
    header.render({ counter: cartModel.getCount() });
});

// --- Открытие корзины ---
events.on(EVENTS.BASKET_OPEN, () => {
    const items = cartModel.getItems().map((item, index) => {
        const cardElement = cardBasketTemplate.content.firstElementChild!.cloneNode(true) as HTMLElement;
        const card = new CardBasket(cardElement, events);
        return card.render({
            price: item.price,
            id: item.id,
            title: item.title,
            image: item.image,
            category: item.category,
            description: item.description,
            index: index + 1,
        });
    });

    basket.render({
        items,
        total: cartModel.getTotalPrice(),
        isEmpty: cartModel.getCount() === 0,
    });

    modal.render({ content: basket.render() });
});

// --- Удаление товара из корзины (из списка) ---
events.on(EVENTS.BASKET_REMOVE, (data: { id: string }) => {
    cartModel.removeItem(data.id);
    events.emit(EVENTS.BASKET_CHANGED);
    events.emit(EVENTS.BASKET_OPEN);
});

// --- Открытие формы оформления ---
events.on(EVENTS.ORDER_OPEN, () => {
    orderForm.render({ payment: '', address: '' });
    modal.render({ content: orderForm.render() });
});

// --- Изменение данных на первом шаге формы ---
events.on(EVENTS.ORDER_CHANGE, (data: Partial<ICustomer>) => {
    if (data.payment !== undefined) customerModel.setPayment(data.payment);
    if (data.address !== undefined) customerModel.setAddress(data.address);

    const errors = customerModel.validateBuyer();
    const step1Errors: string[] = [];
    if (errors.payment) step1Errors.push(errors.payment);
    if (errors.address) step1Errors.push(errors.address);

    orderForm.render({
        payment: customerModel.getData().payment,
        address: customerModel.getData().address,
    });
    orderForm.errors = step1Errors;
    orderForm.buttonState = step1Errors.length === 0;
});

// --- Отправка первого шага ---
events.on(EVENTS.ORDER_SUBMIT, () => {
    contactsForm.render({ email: '', phone: '' });
    modal.render({ content: contactsForm.render() });
});

// --- Изменение данных на втором шаге формы ---
events.on(EVENTS.CONTACTS_CHANGE, (data: Partial<ICustomer>) => {
    if (data.email !== undefined) customerModel.setEmail(data.email);
    if (data.phone !== undefined) customerModel.setPhone(data.phone);

    const errors = customerModel.validateBuyer();
    const step2Errors: string[] = [];
    if (errors.email) step2Errors.push(errors.email);
    if (errors.phone) step2Errors.push(errors.phone);

    contactsForm.render({
        email: customerModel.getData().email,
        phone: customerModel.getData().phone,
    });
    contactsForm.errors = step2Errors;
    contactsForm.buttonState = step2Errors.length === 0;
});

// --- Отправка заказа ---
events.on(EVENTS.CONTACTS_SUBMIT, () => {
    const orderData = {
        ...customerModel.getData(),
        total: cartModel.getTotalPrice(),
        items: cartModel.getItems().map((item) => item.id),
    };

    // Эмуляция успешной отправки, так как API-сервер недоступен.
    // Когда сервер восстановится — замените на:
    //
    // weblarekApi.sendOrder(orderData)
    //     .then(() => {
    //         events.emit(EVENTS.ORDER_SUCCESS, { total: orderData.total });
    //     })
    //     .catch((error) => console.error('Ошибка оформления заказа:', error));
    //
    events.emit(EVENTS.ORDER_SUCCESS, { total: orderData.total });
});

// --- Успешное оформление заказа ---
events.on(EVENTS.ORDER_SUCCESS, (data: { total: number }) => {
    cartModel.clear();
    customerModel.clear();
    events.emit(EVENTS.BASKET_CHANGED);

    modal.render({ content: success.render({ total: data.total }) });
});

// --- Закрытие сообщения об успехе ---
events.on(EVENTS.SUCCESS_CLOSE, () => {
    modal.close();
});

// ============================================================
// 6. ЗАГРУЗКА ТОВАРОВ И СТАРТ ПРИЛОЖЕНИЯ
// ============================================================

// Временно используется локальный источник данных (apiProducts),
// так как API-сервер недоступен.
//
// Когда сервер восстановится — замените этот блок на:
//
// weblarekApi.getProducts()
//     .then((data) => {
//         productsModel.setItems(data.items);
//         events.emit(EVENTS.ITEMS_CHANGED);
//     })
//     .catch((error) => console.error('Ошибка загрузки товаров:', error));
//
// Пока используем тестовые данные:
productsModel.setItems(apiProducts.items);
events.emit(EVENTS.ITEMS_CHANGED);

// Инициализация счётчика в шапке
header.render({ counter: cartModel.getCount() });