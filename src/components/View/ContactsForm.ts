import { Form } from './Form';
import { ICustomer } from '../../types';
import { IEvents } from '../base/Events';
import { EVENTS } from '../../utils/constants';

export class ContactsForm extends Form<ICustomer> {
    protected emailInput: HTMLInputElement;
    protected phoneInput: HTMLInputElement;

    constructor(container: HTMLElement, events: IEvents) {
        super(container, events);

        this.emailInput = container.querySelector('input[name="email"]') as HTMLInputElement;
        this.phoneInput = container.querySelector('input[name="phone"]') as HTMLInputElement;

        this.emailInput.addEventListener('input', () => {
            this.events.emit(EVENTS.CONTACTS_CHANGE, { email: this.emailInput.value });
        });

        this.phoneInput.addEventListener('input', () => {
            this.events.emit(EVENTS.CONTACTS_CHANGE, { phone: this.phoneInput.value });
        });
    }

    set email(value: string) {
        this.emailInput.value = value;
    }

    set phone(value: string) {
        this.phoneInput.value = value;
    }

    protected onSubmit(): void {
        this.events.emit(EVENTS.CONTACTS_SUBMIT);
    }
}