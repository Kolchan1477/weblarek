import { Component } from '../base/Component';
import { IProduct } from '../../types';
import { CDN_URL, categoryMap } from '../../utils/constants';

export abstract class Card<T extends IProduct> extends Component<T> {
    protected titleElement: HTMLElement;
    protected priceElement: HTMLElement;
    protected imageElement: HTMLImageElement;

    constructor(container: HTMLElement) {
        super(container);

        this.titleElement = container.querySelector('.card__title') as HTMLElement;
        this.priceElement = container.querySelector('.card__price') as HTMLElement;
        this.imageElement = container.querySelector('.card__image') as HTMLImageElement;
    }

    /**
     * Устанавливает название товара.
     */
    set title(value: string) {
        this.titleElement.textContent = value;
    }

    /**
     * Устанавливает цену товара. Если null — «Недоступно».
     */
    set price(value: number | null) {
        this.priceElement.textContent = value === null
            ? 'Недоступно'
            : `${value} синапсов`;
    }

    /**
     * Устанавливает изображение товара.
     */
    set image(value: string) {
        this.setImage(this.imageElement, CDN_URL + value, this.titleElement.textContent ?? '');
    }

    /**
     * Устанавливает категорию и соответствующий CSS-модификатор.
     * Реализуется в наследниках, где есть элемент категории.
     */
    protected setCategory(value: string, element: HTMLElement): void {
        element.textContent = value;
        element.className = `card__category ${categoryMap[value as keyof typeof categoryMap] ?? ''}`;
    }
}