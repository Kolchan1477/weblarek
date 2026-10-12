import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { EVENTS } from '../../utils/constants';

export class Header extends Component<{ counter: number }> {
    protected basketButton: HTMLButtonElement;
    protected counterElement: HTMLElement;
    protected events: IEvents;

    constructor(container: HTMLElement, events: IEvents) {
        super(container);
        this.events = events;

        this.basketButton = container.querySelector('.header__basket') as HTMLButtonElement;
        this.counterElement = container.querySelector('.header__basket-counter') as HTMLElement;

        this.basketButton.addEventListener('click', () => {
            this.events.emit(EVENTS.BASKET_OPEN);
        });
    }

    set counter(value: number) {
        this.counterElement.textContent = String(value);
    }
}