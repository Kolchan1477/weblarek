import { Component } from '../base/Component';

export abstract class Form<T extends object> extends Component<T> {
    protected submitButton: HTMLButtonElement;
    protected errorsElement: HTMLElement;

    constructor(container: HTMLElement) {
        super(container);

        this.submitButton = container.querySelector('button[type="submit"]') as HTMLButtonElement;
        this.errorsElement = container.querySelector('.form__errors') as HTMLElement;

        this.container.addEventListener('submit', (event) => {
            event.preventDefault();
            this.onSubmit();
        });
    }

    /**
     * Управляет состоянием кнопки отправки.
     */
    set buttonState(isEnabled: boolean) {
        this.submitButton.disabled = !isEnabled;
    }

    /**
     * Выводит сообщения об ошибках.
     * Для очистки ошибок передайте пустой массив.
     */
    set errors(errors: string[]) {
        this.errorsElement.textContent = errors.join('; ');
    }

    /**
     * Абстрактный метод отправки формы — реализуется в дочерних классах.
     */
    protected abstract onSubmit(): void;
}