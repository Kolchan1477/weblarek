# Проектная работа «Веб-ларёк»

**Стек:** HTML, SCSS, TypeScript, Vite

«Веб-ларёк» — это интернет-магазин с товарами для веб-разработчиков. Пользователи могут просматривать каталог, добавлять товары в корзину и оформлять заказы. Приложение работает с API сервера: получает список товаров и отправляет данные о заказе.

---

## Структура проекта

```
  src/
├── components/
│   ├── base/                  # Базовые классы стартера
│   │   ├── Api.ts
│   │   ├── Component.ts
│   │   └── Events.ts
│   ├── api/                   # Слой коммуникации
│   │   └── WebLarekApi.ts
│   ├── Models/                # Модели данных
│   │   ├── Products.ts
│   │   ├── Cart.ts
│   │   └── Customer.ts
│   └── View/                  # Компоненты представления
│       ├── Modal.ts
│       ├── Form.ts
│       ├── Success.ts
│       ├── Header.ts
│       ├── Gallery.ts
│       ├── Card.ts
│       ├── CardCatalog.ts
│       ├── CardPreview.ts
│       ├── CardBasket.ts
│       ├── Basket.ts
│       ├── OrderForm.ts
│       └── ContactsForm.ts
├── types/
│   └── index.ts               # Типы и интерфейсы
├── utils/
│   ├── constants.ts           # Константы
│   └── data.ts                # Тестовые данные
├── scss/
│   └── styles.scss            # Корневой файл стилей
└── main.ts                    # Точка входа приложения
```

### Важные файлы
- `index.html` — HTML-файл главной страницы
- `src/types/index.ts` — типы и интерфейсы
- `src/main.ts` — точка входа приложения
- `src/scss/styles.scss` — корневой файл стилей
- `src/utils/constants.ts` — константы проекта
- `src/utils/data.ts` — тестовые данные

---

## Установка и запуск

```bash
npm install
npm run dev
```

или

```bash
yarn
yarn dev
```

## Сборка

```bash
npm run build
```

или

```bash
yarn build
```

---

## Архитектура приложения

Код разделён на слои согласно парадигме **MVP (Model-View-Presenter)**, что обеспечивает чёткое разделение ответственности.

- **Model** — слой данных. Отвечает за хранение и изменение данных.
- **View** — слой представления. Отвечает за отображение данных на странице.
- **Presenter** — связующее звено. Содержит основную логику приложения и связывает View и Model.

Взаимодействие между слоями построено на **событийно-ориентированном подходе**: модели и представления генерируют события при изменении данных или действиях пользователя, а презентер обрабатывает их, вызывая методы моделей и представлений.

---

## Базовый код

### Класс `Component`

Является базовым классом для всех компонентов интерфейса. Класс является дженериком и принимает в переменной `T` тип данных, которые могут быть переданы в метод `render` для отображения.

**Конструктор:**
- `constructor(container: HTMLElement)` — принимает ссылку на DOM-элемент, за отображение которого он отвечает.

**Поля класса:**
- `container: HTMLElement` — поле для хранения корневого DOM-элемента компонента.

**Методы класса:**
- `render(data?: Partial<T>): HTMLElement` — главный метод класса. Принимает данные, которые необходимо отобразить в интерфейсе, записывает эти данные в поля класса и возвращает ссылку на DOM-элемент. Предполагается, что в классах, которые будут наследоваться от `Component`, будут реализованы сеттеры для полей с данными, которые будут вызываться в момент вызова `render` и записывать данные в необходимые DOM-элементы.
- `setImage(element: HTMLImageElement, src: string, alt?: string): void` — утилитарный метод для модификации DOM-элементов `<img>`.

### Класс `Api`

Содержит в себе базовую логику отправки запросов.

**Конструктор:**
- `constructor(baseUrl: string, options: RequestInit = {})` — в конструктор передаётся базовый адрес сервера и опциональный объект с заголовками запросов.

**Поля класса:**
- `baseUrl: string` — базовый адрес сервера.
- `options: RequestInit` — объект с заголовками, которые будут использованы для запросов.

**Методы:**
- `get<T extends object>(uri: string): Promise<T>` — выполняет GET-запрос на переданный в параметрах эндпоинт и возвращает промис с объектом, которым ответил сервер.
- `post<T extends object>(uri: string, data: object, method: ApiPostMethods = 'POST'): Promise<T>` — принимает объект с данными, которые будут переданы в JSON в теле запроса, и отправляет эти данные на эндпоинт, переданный как параметр при вызове метода. По умолчанию выполняется `POST`-запрос, но метод запроса может быть переопределён заданием третьего параметра при вызове.
- `handleResponse<T>(response: Response): Promise<T>` — защищённый метод, проверяющий ответ сервера на корректность и возвращающий объект с данными, полученный от сервера, или отклонённый промис в случае некорректных данных.

### Класс `EventEmitter`

Брокер событий реализует паттерн «Наблюдатель», позволяющий отправлять события и подписываться на события, происходящие в системе. Класс используется для связи слоя данных и представления.

**Конструктор класса** не принимает параметров.

**Поля класса:**
- `_events: Map<string | RegExp, Set<Function>>` — хранит коллекцию подписок на события. Ключи коллекции — названия событий или регулярное выражение, значения — коллекция функций-обработчиков, которые будут вызваны при срабатывании события.

**Методы класса:**
- `on<T extends object>(event: EventName, callback: (data: T) => void): void` — подписка на событие, принимает название события и функцию-обработчик.
- `emit<T extends object>(event: string, data?: T): void` — инициализация события. При вызове события в метод передаётся название события и объект с данными, который будет использован как аргумент для вызова обработчика.
- `trigger<T extends object>(event: string, context?: Partial<T>): (data: T) => void` — возвращает функцию, при вызове которой инициализируется требуемое в параметрах событие с передачей в него данных из второго параметра.

---

## Слой данных (Model)

### Типы данных

#### Товар (`IProduct`)

| Поле | Тип | Описание |
|---|---|---|
| `id` | `string` | Уникальный идентификатор |
| `title` | `string` | Название товара |
| `image` | `string` | Путь к изображению |
| `category` | `string` | Категория |
| `price` | `number \| null` | Цена (`null` — товар недоступен) |
| `description` | `string` | Описание |

#### Покупатель (`ICustomer`)

| Поле | Тип | Описание |
|---|---|---|
| `payment` | `'card' \| 'cash' \| ''` | Способ оплаты |
| `address` | `string` | Адрес доставки |
| `email` | `string` | Email покупателя |
| `phone` | `string` | Телефон покупателя |

#### Запрос на создание заказа (`IOrderRequest`)

Интерфейс наследует все поля `ICustomer` и добавляет:

| Поле | Тип | Описание |
|---|---|---|
| `total` | `number` | Общая стоимость заказа |
| `items` | `string[]` | Массив идентификаторов товаров |

### Классы моделей

#### Класс `Products`

Хранит массив товаров каталога и товар, выбранный для детального просмотра.

**Конструктор класса** не принимает параметров.

**Поля класса:**
- `items: IProduct[]` — массив всех товаров каталога.
- `preview: IProduct | null` — товар, выбранный для детального просмотра (по умолчанию `null`).

**Методы класса:**
- `setItems(items: IProduct[]): void` — сохраняет массив товаров.
- `getItems(): IProduct[]` — возвращает массив всех товаров.
- `getItem(id: string): IProduct | undefined` — возвращает товар по его id.
- `setPreview(item: IProduct): void` — сохраняет товар, выбранный для детального просмотра.
- `getPreview(): IProduct | null` — возвращает товар, выбранный для детального просмотра.

#### Класс `Cart`

Хранит массив товаров, добавленных покупателем в корзину.

**Конструктор класса** не принимает параметров.

**Поля класса:**
- `items: IProduct[]` — массив товаров в корзине.

**Методы класса:**
- `addItem(item: IProduct): void` — добавляет товар в корзину.
- `removeItem(id: string): void` — удаляет товар из корзины по его id.
- `getItems(): IProduct[]` — возвращает массив товаров в корзине.
- `getCount(): number` — возвращает количество товаров в корзине.
- `getTotalPrice(): number` — возвращает общую стоимость товаров в корзине.
- `clear(): void` — очищает корзину.
- `hasItem(id: string): boolean` — проверяет наличие товара в корзине по его id.

#### Класс `Customer`

Хранит данные покупателя и предоставляет метод для их валидации.

**Конструктор класса** не принимает параметров.

**Поля класса:**
- `payment: PaymentMethod` — способ оплаты.
- `address: string` — адрес доставки.
- `email: string` — email покупателя.
- `phone: string` — телефон покупателя.

**Методы класса:**
- `setPayment(method: PaymentMethod): void` — устанавливает способ оплаты.
- `setAddress(address: string): void` — устанавливает адрес.
- `setEmail(email: string): void` — устанавливает email.
- `setPhone(phone: string): void` — устанавливает телефон.
- `getData(): ICustomer` — возвращает объект с данными покупателя.
- `validateBuyer(): TErrors` — проверяет данные покупателя и возвращает объект с ошибками валидации. Если все поля заполнены — возвращает пустой объект.
- `clear(): void` — очищает данные покупателя.

---

## Слой коммуникации

Отвечает за взаимодействие приложения с внешним API. Класс не хранит данные и не работает с вёрсткой — только выполняет HTTP-запросы через композицию с классом `Api`.

### Класс `WebLarekApi`

**Конструктор:**
- `constructor(api: IApi)` — принимает экземпляр класса, реализующего интерфейс `IApi`.

**Поля класса:**
- `api: IApi` — экземпляр API-клиента.

**Методы класса:**
- `getProducts(): Promise<IProductListResponse>` — получает с сервера объект с массивом товаров и их общим количеством. Использует метод `get` класса `Api` на эндпоинте `/product/`.
- `sendOrder(data: IOrderRequest): Promise<IOrderResponse>` — отправляет данные о заказе на сервер. Использует метод `post` класса `Api` на эндпоинте `/order/`.

---

## API-спецификация

**Базовый URL:** `http://localhost:3000/api/weblarek`

### 1. Получение списка товаров

- **Метод:** `GET`
- **Путь:** `/product/`
- **Ответ `200 OK`:**

```json
{
  "total": 10,
  "items": [ ... ]
}
```

### 2. Получение конкретного товара

- **Метод:** `GET`
- **Путь:** `/product/{id}`
- **Ответ `200 OK`:** объект товара.
- **Ошибка `404`:** `{ "error": "NotFound" }`

### 3. Создание заказа

- **Метод:** `POST`
- **Путь:** `/order/`
- **Тело запроса:**

```json
{
  "payment": "card",
  "email": "test@test.ru",
  "phone": "+71234567890",
  "address": "Spb Vosstania 1",
  "total": 2200,
  "items": ["id1", "id2"]
}
```

- **Ответ `200 OK`:**

```json
{
  "id": "28c57cb4-3002-4445-8aa1-2a06a5055ae5",
  "total": 2200
}
```

- **Возможные ошибки `400 Bad Request`:**
  - `{ "error": "Товар с id ... не найден" }`
  - `{ "error": "Неверная сумма заказа" }`
  - `{ "error": "Не указан адрес" }`

---

## Типы (`src/types/index.ts`)

```typescript
// === Типы для работы с API ===
export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export interface IApi {
    get<T extends object>(uri: string): Promise<T>;
    post<T extends object>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}

// === Типы данных приложения ===

// Способ оплаты
export type PaymentMethod = 'card' | 'cash' | '';

// Товар
export interface IProduct {
    id: string;
    title: string;
    image: string;
    category: string;
    price: number | null;
    description: string;
}

// Покупатель
export interface ICustomer {
    payment: PaymentMethod;
    address: string;
    email: string;
    phone: string;
}

// Тип для хранения ошибок валидации
export type TErrors = Partial<Record<keyof ICustomer, string>>;

// Ответ сервера: список товаров
export interface IProductListResponse {
    total: number;
    items: IProduct[];
}

// Запрос на создание заказа — наследует поля ICustomer
export interface IOrderRequest extends ICustomer {
    total: number;
    items: string[];
}

// Ответ сервера: созданный заказ
export interface IOrderResponse {
    id: string;
    total: number;
}

// Ответ сервера: ошибка
export interface IApiError {
    error: string;
}
```

---

## Слой представления (View)

Слой представления отвечает за отображение данных на странице и генерацию событий при действиях пользователя. Каждый компонент работает со своим блоком разметки и не зависит от других компонентов напрямую — взаимодействие идёт через брокер событий `EventEmitter`.

Все компоненты наследуются от абстрактного класса `Component<T>`.

### Класс `Modal`

Универсальное модальное окно. Отвечает за отображение содержимого, открытие и закрытие по клику на крестик или вне окна. Не имеет дочерних классов.

**Конструктор:**
- `constructor(container: HTMLElement, events: IEvents)` — принимает корневой элемент модального окна и брокер событий.

**Поля класса:**
- `closeButton: HTMLButtonElement` — кнопка закрытия.
- `contentElement: HTMLElement` — контейнер для содержимого.
- `events: IEvents` — брокер событий.

**Методы класса:**
- `open(): void` — открывает модальное окно, добавляя класс `modal_active`. Эмитит событие `modal:open`.
- `close(): void` — закрывает модальное окно, удаляя класс `modal_active` и очищая содержимое. Эмитит событие `modal:close`.
- `render(data: IModalData): HTMLElement` — рендерит окно с переданным содержимым и открывает его.

**Сеттеры:**
- `set content(value: HTMLElement)` — вставляет переданный элемент в `.modal__content`.

---

### Класс `Form<T>` (абстрактный)

Базовый класс для форм. Содержит общую логику: обработку отправки, управление состоянием кнопки, вывод ошибок.

**Конструктор:**
- `constructor(container: HTMLElement, events: IEvents)` — принимает корневой элемент формы и брокер событий.

**Поля класса:**
- `submitButton: HTMLButtonElement` — кнопка отправки формы.
- `errorsElement: HTMLElement` — контейнер для вывода ошибок.
- `events: IEvents` — брокер событий.

**Методы класса:**
- `set buttonState(isEnabled: boolean)` — управляет состоянием кнопки отправки.
- `set errors(errors: string[])` — выводит сообщения об ошибках.
- `protected clearErrors(): void` — очищает сообщения об ошибках.
- `protected abstract onSubmit(): void` — абстрактный метод отправки формы, реализуется в дочерних классах.

---

### Класс `Success`

Сообщение об успешном оформлении заказа.

**Конструктор:**
- `constructor(container: HTMLElement, events: IEvents)` — принимает корневой элемент и брокер событий.

**Поля класса:**
- `descriptionElement: HTMLElement` — текстовый блок с суммой.
- `closeButton: HTMLButtonElement` — кнопка закрытия.
- `events: IEvents` — брокер событий.

**Методы класса:**
- `set total(value: number)` — устанавливает сумму заказа в описании.

**События:**
- `success:close` — эмитится при клике на кнопку «За новыми покупками!».

---

### Класс `Header`

Шапка сайта с иконкой корзины и счётчиком товаров.

**Конструктор:**
- `constructor(container: HTMLElement, events: IEvents)` — принимает корневой элемент и брокер событий.

**Поля класса:**
- `basketButton: HTMLButtonElement` — иконка корзины.
- `counterElement: HTMLElement` — счётчик товаров.
- `events: IEvents` — брокер событий.

**Методы класса:**
- `set counter(value: number)` — устанавливает значение счётчика.

**События:**
- `basket:open` — эмитится при клике на иконку корзины.

---

### Класс `Gallery`

Каталог товаров на главной странице.

**Конструктор:**
- `constructor(container: HTMLElement)` — принимает корневой элемент.

**Поля класса:**
- `container: HTMLElement` — корневой элемент галереи.

**Методы класса:**
- `set items(elements: HTMLElement[])` — заменяет содержимое галереи переданным массивом карточек.

---

### Класс `Card<T>` (абстрактный)

Базовый класс для всех карточек товара. Содержит общий функционал: установку названия, цены, изображения, категории.

**Конструктор:**
- `constructor(container: HTMLElement)` — принимает корневой элемент.

**Поля класса:**
- `titleElement: HTMLElement` — элемент названия.
- `priceElement: HTMLElement` — элемент цены.
- `imageElement: HTMLImageElement` — элемент изображения.

**Методы класса:**
- `set title(value: string)` — устанавливает название.
- `set price(value: number | null)` — устанавливает цену или «Недоступно».
- `set image(value: string)` — устанавливает изображение, склеивая `CDN_URL` с путём.
- `protected setCategory(value: string, element: HTMLElement): void` — устанавливает категорию и соответствующий CSS-модификатор.

---

### Класс `CardCatalog`

Карточка товара в каталоге. Наследуется от `Card`.

**Конструктор:**
- `constructor(container: HTMLElement, events: IEvents)` — принимает корневой элемент и брокер событий.

**Поля класса:**
- `categoryElement: HTMLElement` — элемент категории.
- `events: IEvents` — брокер событий.

**Методы класса:**
- `set category(value: string)` — устанавливает категорию.
- `set id(value: string)` — сохраняет id товара в `dataset.id` контейнера.

**События:**
- `card:select` — эмитится при клике на карточку с `{ id: string }`.

---

### Класс `CardPreview`

Карточка товара в модальном окне. Наследуется от `Card`. Дополнительно показывает описание, цену и кнопку действия.

**Конструктор:**
- `constructor(container: HTMLElement, events: IEvents)` — принимает корневой элемент и брокер событий.

**Поля класса:**
- `categoryElement: HTMLElement` — элемент категории.
- `descriptionElement: HTMLElement` — элемент описания.
- `buttonElement: HTMLButtonElement` — кнопка действия.
- `events: IEvents` — брокер событий.
- `currentId: string | null` — id текущего товара.
- `currentPrice: number | null` — цена текущего товара.

**Методы класса:**
- `set category(value: string)` — устанавливает категорию.
- `set description(value: string)` — устанавливает описание.
- `set id(value: string)` — сохраняет id товара.
- `set state({ isInCart }: ICardPreviewState)` — управляет состоянием кнопки: «Недоступно», «В корзину» или «Удалить из корзины».
- `set price(value: number | null)` — устанавливает цену и запоминает её в `currentPrice`.

**События:**
- `card:buy` — эмитится при клике на «В корзину» с `{ id: string }`.
- `card:remove` — эмитится при клике на «Удалить из корзины» с `{ id: string }`.

---

### Класс `CardBasket`

Карточка товара в корзине. Наследуется от `Card`. Дополнительно показывает индекс позиции и кнопку удаления.

**Конструктор:**
- `constructor(container: HTMLElement, events: IEvents)` — принимает корневой элемент и брокер событий.

**Поля класса:**
- `indexElement: HTMLElement` — элемент индекса.
- `deleteButton: HTMLButtonElement` — кнопка удаления.
- `events: IEvents` — брокер событий.
- `currentId: string | null` — id товара.

**Методы класса:**
- `set index(value: number)` — устанавливает индекс позиции.
- `set id(value: string)` — сохраняет id товара.

**События:**
- `basket:remove` — эмитится при клике на кнопку удаления с `{ id: string }`.

---

### Класс `Basket`

Корзина с товарами. Отображает список, общую стоимость и кнопку оформления.

**Конструктор:**
- `constructor(container: HTMLElement, events: IEvents)` — принимает корневой элемент и брокер событий.

**Поля класса:**
- `listElement: HTMLElement` — контейнер списка товаров.
- `priceElement: HTMLElement` — элемент общей стоимости.
- `orderButton: HTMLButtonElement` — кнопка «Оформить».
- `events: IEvents` — брокер событий.

**Методы класса:**
- `set items(elements: HTMLElement[])` — устанавливает список карточек. Если массив пуст — выводит текст «Корзина пуста».
- `set total(value: number)` — устанавливает общую стоимость.
- `set isEmpty(value: boolean)` — управляет состоянием кнопки «Оформить».

**События:**
- `order:open` — эмитится при клике на «Оформить».

---

### Класс `OrderForm`

Первая форма оформления заказа: выбор способа оплаты и ввод адреса. Наследуется от `Form<ICustomer>`.

**Конструктор:**
- `constructor(container: HTMLElement, events: IEvents)` — принимает корневой элемент и брокер событий.

**Поля класса:**
- `paymentButtons: HTMLButtonElement[]` — кнопки выбора оплаты.
- `addressInput: HTMLInputElement` — поле ввода адреса.

**Методы класса:**
- `set payment(value: PaymentMethod)` — подсвечивает активный способ оплаты.
- `set address(value: string)` — устанавливает значение поля адреса.
- `protected onSubmit(): void` — эмитит событие отправки формы.

**События:**
- `order:change` — эмитится при изменении данных формы (выбор оплаты или ввод адреса) с `{ payment?, address? }`.
- `order:submit` — эмитится при отправке формы.

---

### Класс `ContactsForm`

Вторая форма оформления: email и телефон. Наследуется от `Form<ICustomer>`.

**Конструктор:**
- `constructor(container: HTMLElement, events: IEvents)` — принимает корневой элемент и брокер событий.

**Поля класса:**
- `emailInput: HTMLInputElement` — поле email.
- `phoneInput: HTMLInputElement` — поле телефона.

**Методы класса:**
- `set email(value: string)` — устанавливает email.
- `set phone(value: string)` — устанавливает телефон.
- `protected onSubmit(): void` — эмитит событие отправки формы.

**События:**
- `contacts:change` — эмитится при изменении данных формы с `{ email?, phone? }`.
- `contacts:submit` — эмитится при отправке формы.

---

## События приложения

Все события описаны в константе `EVENTS` в `src/utils/constants.ts`.

| Константа | Событие | Описание |
|---|---|---|
| `ITEMS_CHANGED` | `items:changed` | Каталог товаров загружен или обновлён |
| `CARD_SELECT` | `card:select` | Пользователь выбрал карточку в каталоге |
| `PREVIEW_CHANGED` | `preview:changed` | Превью товара обновлено |
| `CARD_BUY` | `card:buy` | Пользователь нажал «В корзину» |
| `CARD_REMOVE` | `card:remove` | Пользователь нажал «Удалить из корзины» |
| `BASKET_OPEN` | `basket:open` | Пользователь открыл корзину |
| `BASKET_CHANGED` | `basket:changed` | Корзина изменилась |
| `BASKET_REMOVE` | `basket:remove` | Пользователь удалил товар из корзины |
| `ORDER_OPEN` | `order:open` | Пользователь открыл форму оформления |
| `ORDER_CHANGE` | `order:change` | Данные формы оформления изменились |
| `ORDER_SUBMIT` | `order:submit` | Первая форма отправлена |
| `CONTACTS_CHANGE` | `contacts:change` | Данные формы контактов изменились |
| `CONTACTS_SUBMIT` | `contacts:submit` | Вторая форма отправлена |
| `ORDER_SUCCESS` | `order:success` | Заказ успешно оформлен |
| `MODAL_OPEN` | `modal:open` | Модальное окно открыто |
| `MODAL_CLOSE` | `modal:close` | Модальное окно закрыто |
| `SUCCESS_CLOSE` | `success:close` | Пользователь закрыл сообщение об успехе |

---

## План разработки

| Шаг | Этап | Статус |
|---|---|---|
| 0 | Анализ макета и стартового набора | ✅ |
| 1 | Проектирование архитектуры | ✅ |
| 2 | Документирование | ✅ |
| 3 | Реализация моделей данных | ✅ |
| 4 | Реализация слоя коммуникации | ✅ |
| 5 | Создание компонентов View | ✅ |
| 6 | Реализация Presenter и связывание слоёв | ✅ |