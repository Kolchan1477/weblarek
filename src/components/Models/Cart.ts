import { IProduct } from '../../types';

export class Cart {
    private items: IProduct[] = []; // Приватное поле для хранения товаров в корзине

    /**
     * Добавляет товар в корзину.
     * @param item - товар для добавления
     */
    addItem(item: IProduct): void {
        this.items.push(item);
    }

    /**
     * Удаляет товар из корзины по его id.
     * @param id - идентификатор товара
     */
    removeItem(id: string): void {
        this.items = this.items.filter(item => item.id !== id);
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
     * Очищает корзину.
     */
    clear(): void {
        this.items = [];
    }

    /**
     * Проверяет, есть ли товар в корзине по его id.
     * @param id - идентификатор товара
     */
    hasItem(id: string): boolean {
        return this.items.some(item => item.id === id);
    }
}