import { Component } from '../base/Component';
import { IEvents } from '../base/Events';

export abstract class Form<T extends object> extends Component<T> {
    protected submitButton: HTMLButtonElement;
    protected errorsElement: HTMLElement;
    protected events: IEvents;

    constructor(container: HTMLElement, events: IEvents) {
        super(container);
        this.events = events;

        this.submitButton = container.querySelector('button[type="submit"]') as HTMLButtonElement;
        this.errorsElement = container.querySelector('.form__errors') as HTMLElement;

        this.container.addEventListener('submit', (event) => {
            event.preventDefault();
            this.onSubmit();
        });
    }

    /**
     * Устанавливает состояние кнопки отправки.
     */
    set buttonState(isEnabled: boolean) {
        this.submitButton.disabled = !isEnabled;
    }

    /**
     * Выводит сообщения об ошибках.
     */
    set errors(errors: string[]) {
        this.errorsElement.textContent = errors.join('; ');
    }

    /**
     * Очищает сообщения об ошибках.
     */
    protected clearErrors(): void {
        this.errorsElement.textContent = '';
    }

    /**
     * Абстрактный метод отправки формы — реализуется в дочерних классах.
     */
    protected abstract onSubmit(): void;
}