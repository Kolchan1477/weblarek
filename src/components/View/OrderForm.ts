import { Form } from './Form';
import { ICustomer, PaymentMethod } from '../../types';
import { IEvents } from '../base/Events';
import { EVENTS } from '../../utils/constants';

export class OrderForm extends Form<ICustomer> {
    protected paymentButtons: HTMLButtonElement[];
    protected addressInput: HTMLInputElement;

    constructor(container: HTMLElement, events: IEvents) {
        super(container, events);

        this.paymentButtons = Array.from(container.querySelectorAll('.order__buttons .button'));
        this.addressInput = container.querySelector('input[name="address"]') as HTMLInputElement;

        this.paymentButtons.forEach((button) => {
            button.addEventListener('click', () => {
                const method = button.name as PaymentMethod;
                this.events.emit(EVENTS.ORDER_CHANGE, { payment: method });
            });
        });

        this.addressInput.addEventListener('input', () => {
            this.events.emit(EVENTS.ORDER_CHANGE, { address: this.addressInput.value });
        });
    }

    /**
     * Подсвечивает активный способ оплаты.
     */
    set payment(value: PaymentMethod) {
        this.paymentButtons.forEach((button) => {
            button.classList.toggle('button_alt-active', button.name === value);
        });
    }

    /**
     * Устанавливает значение поля адреса.
     */
    set address(value: string) {
        this.addressInput.value = value;
    }

    /**
     * Обработчик отправки формы.
     */
    protected onSubmit(): void {
        this.events.emit(EVENTS.ORDER_SUBMIT);
    }
}