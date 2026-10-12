import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { EVENTS } from '../../utils/constants';

interface ISuccessData {
    total: number;
}

export class Success extends Component<ISuccessData> {
    protected descriptionElement: HTMLElement;
    protected closeButton: HTMLButtonElement;
    protected events: IEvents;

    constructor(container: HTMLElement, events: IEvents) {
        super(container);
        this.events = events;

        this.descriptionElement = container.querySelector('.order-success__description') as HTMLElement;
        this.closeButton = container.querySelector('.order-success__close') as HTMLButtonElement;

        this.closeButton.addEventListener('click', () => {
            this.events.emit(EVENTS.SUCCESS_CLOSE);
        });
    }

    /**
     * Устанавливает сумму заказа в описании.
     */
    set total(value: number) {
        this.descriptionElement.textContent = `Списано ${value} синапсов`;
    }
}