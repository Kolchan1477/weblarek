// src/types/index.ts

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

// Ответ сервера: список товаров
export interface IProductListResponse {
    total: number;
    items: IProduct[];
}

// Запрос на создание заказа
export interface IOrderRequest {
    payment: PaymentMethod;
    email: string;
    phone: string;
    address: string;
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