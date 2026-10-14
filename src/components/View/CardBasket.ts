import { Card } from './Card';
import { IProduct } from '../../types';

interface ICardBasketData extends IProduct {
    index: number;
}

export class CardBasket extends Card<ICardBasketData> {
    protected indexElement: HTMLElement;
    protected deleteButton: HTMLButtonElement;
    protected onDelete: (id: string) => void;
    protected currentId: string = '';

    constructor(container: HTMLElement, onDelete: (id: string) => void) {
        super(container);

        this.onDelete = onDelete;
        this.indexElement = container.querySelector('.basket__item-index') as HTMLElement;
        this.deleteButton = container.querySelector('.basket__item-delete') as HTMLButtonElement;

        this.deleteButton.addEventListener('click', () => {
            this.onDelete(this.currentId);
        });
    }

    set index(value: number) {
        this.indexElement.textContent = String(value);
    }

    set id(value: string) {
        this.currentId = value;
    }
}