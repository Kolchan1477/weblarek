import './scss/styles.scss';
import { Products } from './components/Models/Products';
import { Cart } from './components/Models/Cart';
import { Customer } from './components/Models/Customer';
import { apiProducts } from './utils/data';
import { Api } from './components/base/Api';
import { WebLarekApi } from './components/api/WebLarekApi';
import { API_URL } from './utils/constants';

// --- Проверка модели Products ---
const productsModel = new Products();
productsModel.setItems(apiProducts.items);

console.log('Массив товаров из каталога:', productsModel.getItems());
console.log('Товар по id (первый):', productsModel.getItem(apiProducts.items[0].id));
console.log('Товар по несуществующему id:', productsModel.getItem('nonexistent'));
productsModel.setPreview(productsModel.getItems()[0]);
console.log('Товар для детального просмотра:', productsModel.getPreview());

// --- Проверка модели Cart ---
const cartModel = new Cart();
const firstProduct = apiProducts.items[0];
const secondProduct = apiProducts.items[1];

cartModel.addItem(firstProduct);
cartModel.addItem(secondProduct);

console.log('Товары в корзине:', cartModel.getItems());
console.log('Количество товаров в корзине:', cartModel.getCount());
console.log('Общая стоимость:', cartModel.getTotalPrice());
console.log('Есть ли первый товар в корзине:', cartModel.hasItem(firstProduct.id));

cartModel.removeItem(firstProduct.id);
console.log('После удаления первого товара:', cartModel.getItems());
console.log('Количество товаров после удаления:', cartModel.getCount());
console.log('Общая стоимость после удаления:', cartModel.getTotalPrice());

cartModel.clear();
console.log('После очистки корзины:', cartModel.getItems());

// --- Проверка модели Customer ---
const customerModel = new Customer();

console.log('Ошибки валидации (пустые данные):', customerModel.validateBuyer());

customerModel.setPayment('card');
customerModel.setAddress('Spb Vosstania 1');
console.log('Ошибки валидации (частично заполнено):', customerModel.validateBuyer());

customerModel.setEmail('test@test.ru');
customerModel.setPhone('+71234567890');
console.log('Ошибки валидации (все поля заполнены):', customerModel.validateBuyer());
console.log('Данные покупателя:', customerModel.getData());

customerModel.clear();
console.log('После очистки данных покупателя:', customerModel.getData());

// --- Проверка слоя коммуникации (Шаг 4) ---
const api = new Api(API_URL);
const weblarekApi = new WebLarekApi(api);

weblarekApi.getProducts()
    .then((data) => {
        console.log('Ответ сервера (товары):', data);
        productsModel.setItems(data.items);
        console.log('Каталог после сохранения:', productsModel.getItems());
    })
    .catch((error) => {
        console.error('Ошибка при получении товаров:', error);
    });