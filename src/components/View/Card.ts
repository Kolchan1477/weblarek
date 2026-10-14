import { Component } from '../base/Component';
import { IProduct } from '../../types';
import { categoryMap } from '../../utils/constants';

/**
 * Базовый класс для всех карточек товара.
 * Содержит только те поля и методы, которые есть у всех наследников:
 * название и цену.
 */
export abstract class Card<T extends IProduct> extends Component<T> {
    protected titleElement: HTMLElement;
    protected priceElement: HTMLElement;

    constructor(container: HTMLElement) {
        super(container);

        this.titleElement = container.querySelector('.card__title') as HTMLElement;
        this.priceElement = container.querySelector('.card__price') as HTMLElement;
    }

    /**
     * Устанавливает название товара.
     */
    set title(value: string) {
        this.titleElement.textContent = value;
    }

    /**
     * Устанавливает цену товара.
     * Если цена отсутствует — выводится «Бесценно».
     */
    set price(value: number | null) {
        this.priceElement.textContent = value === null
            ? 'Бесценно'
            : `${value} синапсов`;
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