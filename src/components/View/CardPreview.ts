import { CardWithImage } from './CardWithImage';
import { IProduct } from '../../types';

interface ICardPreviewState {
    isInCart: boolean;
}

interface ICardPreviewData extends IProduct {
    state: ICardPreviewState;
}

export class CardPreview extends CardWithImage<ICardPreviewData> {
    protected categoryElement: HTMLElement;
    protected descriptionElement: HTMLElement;
    protected buttonElement: HTMLButtonElement;
    protected onAction: () => void;

    constructor(container: HTMLElement, onAction: () => void) {
        super(container);

        this.onAction = onAction;
        this.categoryElement = container.querySelector('.card__category') as HTMLElement;
        this.descriptionElement = container.querySelector('.card__text') as HTMLElement;
        this.buttonElement = container.querySelector('.card__button') as HTMLButtonElement;

        this.buttonElement.addEventListener('click', () => {
            this.onAction();
        });
    }

    set category(value: string) {
        this.setCategory(value, this.categoryElement);
    }

    set description(value: string) {
        this.descriptionElement.textContent = value;
    }

    /**
     * Управляет состоянием кнопки: «Бесценно», «В корзину» или «Удалить из корзины».
     */
    set state({ isInCart }: ICardPreviewState) {
        if (this.priceElement.textContent === 'Бесценно') {
            this.buttonElement.textContent = 'Бесценно';
            this.buttonElement.disabled = true;
            return;
        }
        this.buttonElement.disabled = false;
        this.buttonElement.textContent = isInCart ? 'Удалить из корзины' : 'В корзину';
    }
}