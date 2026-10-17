import { CardWithImage } from './CardWithImage';
import { IProduct } from '../../types';

export class CardCatalog extends CardWithImage<IProduct> {
    protected categoryElement: HTMLElement;
    protected onSelect: () => void;

    constructor(container: HTMLElement, onSelect: () => void) {
        super(container);
        this.onSelect = onSelect;
        this.categoryElement = container.querySelector('.card__category') as HTMLElement;

        this.container.addEventListener('click', () => {
            this.onSelect();
        });
    }

    set category(value: string) {
        this.setCategory(value, this.categoryElement);
    }
}