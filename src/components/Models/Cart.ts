import { IProduct } from '../../types';
import { IEvents } from '../base/Events';
import { EVENTS } from '../../utils/constants';

export class Cart {
    private items: IProduct[] = [];
    protected events: IEvents;

    constructor(events: IEvents) {
        this.events = events;
    }

    /**
     * Добавляет товар в корзину и эмитит событие.
     */
    addItem(item: IProduct): void {
        this.items.push(item);
        this.events.emit(EVENTS.BASKET_CHANGED);
    }

    /**
     * Удаляет товар из корзины по id и эмитит событие.
     */
    removeItem(id: string): void {
        this.items = this.items.filter(item => item.id !== id);
        this.events.emit(EVENTS.BASKET_CHANGED);
    }

    /**
     * Возвращает массив товаров в корзине.
     */
    getItems(): IProduct[] {
        return this.items;
    }

    /**
     * Возвращает количество товаров в корзине.
     */
    getCount(): number {
        return this.items.length;
    }

    /**
     * Возвращает общую стоимость товаров в корзине.
     */
    getTotalPrice(): number {
        return this.items.reduce((sum, item) => sum + (item.price || 0), 0);
    }

    /**
     * Очищает корзину и эмитит событие.
     */
    clear(): void {
        this.items = [];
        this.events.emit(EVENTS.BASKET_CHANGED);
    }

    /**
     * Проверяет наличие товара в корзине по id.
     */
    hasItem(id: string): boolean {
        return this.items.some(item => item.id === id);
    }
}