import { Card } from './Card';
import { IProduct } from '../../types';
import { IEvents } from '../base/Events';
import { EVENTS } from '../../utils/constants';

export class CardCatalog extends Card<IProduct> {
    protected categoryElement: HTMLElement;
    protected events: IEvents;

    constructor(container: HTMLElement, events: IEvents) {
        super(container);
        this.events = events;

        this.categoryElement = container.querySelector('.card__category') as HTMLElement;

        this.container.addEventListener('click', () => {
            this.events.emit(EVENTS.CARD_SELECT, { id: (this.container as HTMLElement).dataset.id });
        });
    }

    set category(value: string) {
        this.setCategory(value, this.categoryElement);
    }

    set id(value: string) {
        this.container.dataset.id = value;
    }
}