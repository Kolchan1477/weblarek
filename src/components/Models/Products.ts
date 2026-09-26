import { IProduct } from '../../types';

export class Products {
    private items: IProduct[] = []; // Приватное поле для хранения массива товаров

    /**
     * Сохраняет массив товаров в модель.
     * @param items - массив товаров
     */
    setItems(items: IProduct[]): void {
        this.items = items;
    }

    /**
     * Возвращает массив всех товаров.
     */
    getItems(): IProduct[] {
        return this.items;
    }

    /**
     * Возвращает товар по его id.
     * @param id - идентификатор товара
     */
    getItem(id: string): IProduct | undefined {
        return this.items.find(item => item.id === id);
    }
}