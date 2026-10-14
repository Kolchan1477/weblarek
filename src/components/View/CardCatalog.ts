import { CardWithImage } from './CardWithImage';
import { IProduct } from '../../types';

export class CardCatalog extends CardWithImage<IProduct> {
    protected categoryElement: HTMLElement;
    protected onSelect: (id: string) => void;
    protected currentId: string = '';

    constructor(container: HTMLElement, onSelect: (id: string) => void) {
        super(container);

        this.onSelect = onSelect;
        this.categoryElement = container.querySelector('.card__category') as HTMLElement;

        this.container.addEventListener('click', () => {
            this.onSelect(this.currentId);
        });
    }

    set category(value: string) {
        this.setCategory(value, this.categoryElement);
    }

    set id(value: string) {
        this.currentId = value;
    }
}