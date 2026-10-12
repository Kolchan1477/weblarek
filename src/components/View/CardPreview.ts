import { Card } from './Card';
import { IProduct } from '../../types';
import { IEvents } from '../base/Events';
import { EVENTS } from '../../utils/constants';

interface ICardPreviewState {
    isInCart: boolean;
}

// Расширяем IProduct состоянием кнопки
interface ICardPreviewData extends IProduct {
    state: ICardPreviewState;
}

export class CardPreview extends Card<ICardPreviewData> {
    protected categoryElement: HTMLElement;
    protected descriptionElement: HTMLElement;
    protected buttonElement: HTMLButtonElement;
    protected events: IEvents;
    protected currentId: string | null = null;
    protected currentPrice: number | null = null;

    constructor(container: HTMLElement, events: IEvents) {
        super(container);
        this.events = events;

        this.categoryElement = container.querySelector('.card__category') as HTMLElement;
        this.descriptionElement = container.querySelector('.card__text') as HTMLElement;
        this.buttonElement = container.querySelector('.card__button') as HTMLButtonElement;

        this.buttonElement.addEventListener('click', () => {
            if (this.currentId === null || this.currentPrice === null) return;

            if (this.buttonElement.textContent === 'В корзину') {
                this.events.emit(EVENTS.CARD_BUY, { id: this.currentId });
            } else {
                this.events.emit(EVENTS.CARD_REMOVE, { id: this.currentId });
            }
        });
    }

    set category(value: string) {
        this.setCategory(value, this.categoryElement);
    }

    set description(value: string) {
        this.descriptionElement.textContent = value;
    }

    set id(value: string) {
        this.currentId = value;
    }

    /**
     * Обновляет состояние кнопки в зависимости от наличия товара в корзине
     * и наличия цены.
     */
    set state({ isInCart }: ICardPreviewState) {
        if (this.currentPrice === null) {
            this.buttonElement.textContent = 'Недоступно';
            this.buttonElement.disabled = true;
            return;
        }
        this.buttonElement.disabled = false;
        this.buttonElement.textContent = isInCart ? 'Удалить из корзины' : 'В корзину';
    }

    /**
     * Запоминаем цену и обновляем её отображение.
     * Не используем super.price, потому что это не вызывает родительский сеттер.
     */
    set price(value: number | null) {
        this.currentPrice = value;
        this.priceElement.textContent = value === null
            ? 'Недоступно'
            : `${value} синапсов`;
    }
}