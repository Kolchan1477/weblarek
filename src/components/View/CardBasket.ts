import { Card } from './Card';
import { IProduct } from '../../types';
import { IEvents } from '../base/Events';
import { EVENTS } from '../../utils/constants';

// Расширяем IProduct индексом позиции в корзине
interface ICardBasketData extends IProduct {
    index: number;
}

export class CardBasket extends Card<ICardBasketData> {
    protected indexElement: HTMLElement;
    protected deleteButton: HTMLButtonElement;
    protected events: IEvents;
    protected currentId: string | null = null;

    constructor(container: HTMLElement, events: IEvents) {
        super(container);
        this.events = events;

        this.indexElement = container.querySelector('.basket__item-index') as HTMLElement;
        this.deleteButton = container.querySelector('.basket__item-delete') as HTMLButtonElement;

        this.deleteButton.addEventListener('click', () => {
            if (this.currentId !== null) {
                this.events.emit(EVENTS.BASKET_REMOVE, { id: this.currentId });
            }
        });
    }

    set index(value: number) {
        this.indexElement.textContent = String(value);
    }

    set id(value: string) {
        this.currentId = value;
    }
}