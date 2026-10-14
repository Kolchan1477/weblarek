import './scss/styles.scss';
import { Products } from './components/Models/Products';
import { Cart } from './components/Models/Cart';
import { Customer } from './components/Models/Customer';
import { Api } from './components/base/Api';
import { WebLarekApi } from './components/api/WebLarekApi';
import { API_URL, EVENTS } from './utils/constants';
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


// ============================================================
// 1. ИНИЦИАЛИЗАЦИЯ БРОКЕРА СОБЫТИЙ
// ============================================================

const events = new EventEmitter();

// ============================================================
// 2. ИНИЦИАЛИЗАЦИЯ МОДЕЛЕЙ ДАННЫХ
// ============================================================

const productsModel = new Products(events);
const cartModel = new Cart(events);
const customerModel = new Customer(events);

// ============================================================
// 3. ИНИЦИАЛИЗАЦИЯ СЛОЯ КОММУНИКАЦИИ
// ============================================================

const api = new Api(API_URL);
const weblarekApi = new WebLarekApi(api);

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

const cardCatalogTemplate = document.querySelector('#card-catalog') as HTMLTemplateElement;
const cardPreviewTemplate = document.querySelector('#card-preview') as HTMLTemplateElement;
const cardBasketTemplate = document.querySelector('#card-basket') as HTMLTemplateElement;

// --- CardPreview создаётся однократно ---
const previewElement = cardPreviewTemplate.content.firstElementChild!.cloneNode(true) as HTMLElement;
const cardPreview = new CardPreview(previewElement, () => {
    // Колбэк действия: добавление/удаление товара из корзины.
    const product = productsModel.getPreview();
    if (!product) return;

    if (cartModel.hasItem(product.id)) {
        cartModel.removeItem(product.id);
    } else {
        cartModel.addItem(product);
    }
    modal.close();
});

// --- OrderForm ---
const orderTemplate = document.querySelector('#order') as HTMLTemplateElement;
const orderElement = orderTemplate.content.firstElementChild!.cloneNode(true) as HTMLElement;
const orderForm = new OrderForm(
    orderElement,
    (data) => {
        if (data.payment !== undefined) customerModel.setPayment(data.payment);
        if (data.address !== undefined) customerModel.setAddress(data.address);
    },
    () => {
        // Переход на второй шаг
        contactsForm.render();
        modal.render({ content: contactsForm.render() });
    }
);

// --- ContactsForm ---
const contactsTemplate = document.querySelector('#contacts') as HTMLTemplateElement;
const contactsElement = contactsTemplate.content.firstElementChild!.cloneNode(true) as HTMLElement;
const contactsForm = new ContactsForm(
    contactsElement,
    (data) => {
        if (data.email !== undefined) customerModel.setEmail(data.email);
        if (data.phone !== undefined) customerModel.setPhone(data.phone);
    },
    () => {
        // Отправка заказа
        const orderData = {
            ...customerModel.getData(),
            total: cartModel.getTotalPrice(),
            items: cartModel.getItems().map((item) => item.id),
        };

        weblarekApi.sendOrder(orderData)
            .then((response) => {
                events.emit(EVENTS.ORDER_SUCCESS, { total: response.total });
            })
            .catch((error) => console.error('Ошибка оформления заказа:', error));
    }
);

// ============================================================
// 5. ПРЕЗЕНТЕР — ОБРАБОТЧИКИ СОБЫТИЙ
// ============================================================

// --- Каталог загружен ---
events.on(EVENTS.ITEMS_CHANGED, () => {
    const cards = productsModel.getItems().map((item) => {
        const cardElement = cardCatalogTemplate.content.firstElementChild!.cloneNode(true) as HTMLElement;
        const card = new CardCatalog(cardElement, (id) => {
            const product = productsModel.getItem(id);
            if (product) productsModel.setPreview(product);
        });
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

// --- Превью изменено ---
events.on(EVENTS.PREVIEW_CHANGED, () => {
    const product = productsModel.getPreview();
    if (!product) return;

    const isInCart = cartModel.hasItem(product.id);

    cardPreview.render({
        price: product.price,
        title: product.title,
        image: product.image,
        category: product.category,
        description: product.description,
        state: { isInCart },
    });

    modal.render({ content: cardPreview.render() });
});

// --- Корзина изменилась ---
events.on(EVENTS.BASKET_CHANGED, () => {
    header.render({ counter: cartModel.getCount() });

    const items = cartModel.getItems().map((item, index) => {
        const cardElement = cardBasketTemplate.content.firstElementChild!.cloneNode(true) as HTMLElement;
        const card = new CardBasket(cardElement, (id) => {
            cartModel.removeItem(id);
        });
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
});

// --- Открытие корзины ---
events.on(EVENTS.BASKET_OPEN, () => {
    modal.render({ content: basket.render() });
});

// --- Открытие формы оформления ---
events.on(EVENTS.ORDER_OPEN, () => {
    modal.render({ content: orderForm.render() });
});

// --- Изменение данных формы заказа (эмит от Customer) ---
events.on(EVENTS.ORDER_CHANGE, () => {
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

// --- Изменение данных формы контактов (эмит от Customer) ---
events.on(EVENTS.CONTACTS_CHANGE, () => {
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

// --- Успешное оформление заказа ---
events.on(EVENTS.ORDER_SUCCESS, (data: { total: number }) => {
    cartModel.clear();
    customerModel.clear();

    modal.render({ content: success.render({ total: data.total }) });
});

// --- Закрытие сообщения об успехе ---
events.on(EVENTS.SUCCESS_CLOSE, () => {
    modal.close();
});

// ============================================================
// 6. ЗАГРУЗКА ТОВАРОВ И СТАРТ ПРИЛОЖЕНИЯ
// ============================================================

weblarekApi.getProducts()
    .then((data) => {
        productsModel.setItems(data.items);
    })
    .catch((error) => console.error('Ошибка загрузки товаров:', error));

// Инициализация счётчика в шапке
header.render({ counter: cartModel.getCount() });