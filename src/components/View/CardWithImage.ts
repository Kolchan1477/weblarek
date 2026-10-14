import { Card } from './Card';
import { IProduct } from '../../types';
import { CDN_URL } from '../../utils/constants';

/**
 * Промежуточный класс для карточек, у которых есть изображение.
 * Наследуется от Card и добавляет функционал работы с картинкой.
 * Используется как базовый для CardCatalog и CardPreview.
 */
export abstract class CardWithImage<T extends IProduct> extends Card<T> {
    protected imageElement: HTMLImageElement;

    constructor(container: HTMLElement) {
        super(container);

        this.imageElement = container.querySelector('.card__image') as HTMLImageElement;
    }

    /**
     * Устанавливает изображение товара.
     */
    set image(value: string) {
        this.setImage(
            this.imageElement,
            CDN_URL + value,
            this.titleElement.textContent ?? ''
        );
    }
}