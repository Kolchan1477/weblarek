import { Form } from './Form';
import { ICustomer, PaymentMethod } from '../../types';

export class OrderForm extends Form<ICustomer> {
    protected paymentButtons: HTMLButtonElement[];
    protected addressInput: HTMLInputElement;
    protected changeCallback: (data: Partial<ICustomer>) => void;
    protected submitCallback: () => void;

    constructor(
        container: HTMLElement,
        onChange: (data: Partial<ICustomer>) => void,
        onSubmit: () => void
    ) {
        super(container);

        this.changeCallback = onChange;
        this.submitCallback = onSubmit;
        this.paymentButtons = Array.from(container.querySelectorAll('.order__buttons .button'));
        this.addressInput = container.querySelector('input[name="address"]') as HTMLInputElement;

        this.paymentButtons.forEach((button) => {
            button.addEventListener('click', () => {
                this.changeCallback({ payment: button.name as PaymentMethod });
            });
        });

        this.addressInput.addEventListener('input', () => {
            this.changeCallback({ address: this.addressInput.value });
        });
    }

    set payment(value: PaymentMethod) {
        this.paymentButtons.forEach((button) => {
            button.classList.toggle('button_alt-active', button.name === value);
        });
    }

    set address(value: string) {
        this.addressInput.value = value;
    }

    protected onSubmit(): void {
        this.submitCallback();
    }
}