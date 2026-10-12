import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { EVENTS } from '../../utils/constants';

interface IBasketData {
    items: HTMLElement[];
    total: number;
    isEmpty: boolean;
}

export class Basket extends Component<IBasketData> {
    protected listElement: HTMLElement;
    protected priceElement: HTMLElement;
    protected orderButton: HTMLButtonElement;
    protected events: IEvents;

    constructor(container: HTMLElement, events: IEvents) {
        super(container);
        this.events = events;

        this.listElement = container.querySelector('.basket__list') as HTMLElement;
        this.priceElement = container.querySelector('.basket__price') as HTMLElement;
        this.orderButton = container.querySelector('.basket__button') as HTMLButtonElement;

        this.orderButton.addEventListener('click', () => {
            this.events.emit(EVENTS.ORDER_OPEN);
        });
    }

    /**
     * Устанавливает список карточек товаров в корзине.
     * Если товаров нет — выводит надпись «Корзина пуста».
     */
    set items(elements: HTMLElement[]) {
        if (elements.length === 0) {
            const emptyMessage = document.createElement('p');
            emptyMessage.textContent = 'Корзина пуста';
            this.listElement.replaceChildren(emptyMessage);
        } else {
            this.listElement.replaceChildren(...elements);
        }
    }

    /**
     * Устанавливает общую стоимость.
     */
    set total(value: number) {
        this.priceElement.textContent = `${value} синапсов`;
    }

    /**
     * Управляет состоянием кнопки «Оформить».
     */
    set isEmpty(value: boolean) {
        this.orderButton.disabled = value;
    }
}