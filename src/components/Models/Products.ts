import { IProduct } from '../../types';
import { IEvents } from '../base/Events';
import { EVENTS } from '../../utils/constants';

export class Products {
    private items: IProduct[] = [];
    private preview: IProduct | null = null;
    protected events: IEvents;

    constructor(events: IEvents) {
        this.events = events;
    }

    /**
     * Сохраняет массив товаров и эмитит событие об изменении каталога.
     */
    setItems(items: IProduct[]): void {
        this.items = items;
        this.events.emit(EVENTS.ITEMS_CHANGED);
    }

    /**
     * Возвращает массив всех товаров.
     */
    getItems(): IProduct[] {
        return this.items;
    }

    /**
     * Возвращает товар по его id.
     */
    getItem(id: string): IProduct | undefined {
        return this.items.find(item => item.id === id);
    }

    /**
     * Сохраняет товар для детального просмотра и эмитит событие.
     */
    setPreview(item: IProduct): void {
        this.preview = item;
        this.events.emit(EVENTS.PREVIEW_CHANGED);
    }

    /**
     * Возвращает товар, выбранный для детального просмотра.
     */
    getPreview(): IProduct | null {
        return this.preview;
    }
}