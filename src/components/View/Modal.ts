import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { EVENTS } from '../../utils/constants';

interface IModalData {
    content: HTMLElement;
}

export class Modal extends Component<IModalData> {
    protected closeButton: HTMLButtonElement;
    protected contentElement: HTMLElement;   // ← поле переименовано
    protected events: IEvents;

    constructor(container: HTMLElement, events: IEvents) {
        super(container);
        this.events = events;

        this.closeButton = container.querySelector('.modal__close') as HTMLButtonElement;
        this.contentElement = container.querySelector('.modal__content') as HTMLElement;

        this.closeButton.addEventListener('click', () => this.close());

        this.container.addEventListener('click', (event) => {
            if (event.target === this.container) {
                this.close();
            }
        });
    }

    /**
     * Устанавливает содержимое модального окна.
     * Имя сеттера — content, совпадает с ключом в IModalData.
     */
    set content(value: HTMLElement) {
        this.contentElement.replaceChildren(value);
    }

    open(): void {
        this.container.classList.add('modal_active');
        this.events.emit(EVENTS.MODAL_OPEN);
    }

    close(): void {
        this.container.classList.remove('modal_active');
        this.contentElement.replaceChildren();
        this.events.emit(EVENTS.MODAL_CLOSE);
    }

    render(data: IModalData): HTMLElement {
        super.render(data);
        this.open();
        return this.container;
    }
}