import { Form } from './Form';
import { ICustomer } from '../../types';

export class ContactsForm extends Form<ICustomer> {
    protected emailInput: HTMLInputElement;
    protected phoneInput: HTMLInputElement;
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
        this.emailInput = container.querySelector('input[name="email"]') as HTMLInputElement;
        this.phoneInput = container.querySelector('input[name="phone"]') as HTMLInputElement;

        this.emailInput.addEventListener('input', () => {
            this.changeCallback({ email: this.emailInput.value });
        });

        this.phoneInput.addEventListener('input', () => {
            this.changeCallback({ phone: this.phoneInput.value });
        });
    }

    set email(value: string) {
        this.emailInput.value = value;
    }

    set phone(value: string) {
        this.phoneInput.value = value;
    }

    protected onSubmit(): void {
        this.submitCallback();
    }
}