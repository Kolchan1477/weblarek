import { ICustomer, PaymentMethod, TErrors } from '../../types';
import { IEvents } from '../base/Events';
import { EVENTS } from '../../utils/constants';

export class Customer {
    private payment: PaymentMethod = '';
    private address: string = '';
    private email: string = '';
    private phone: string = '';
    protected events: IEvents;

    constructor(events: IEvents) {
        this.events = events;
    }

    /**
     * Устанавливает способ оплаты и эмитит событие изменения данных заказа.
     */
    setPayment(method: PaymentMethod): void {
        this.payment = method;
        this.events.emit(EVENTS.ORDER_CHANGE);
    }

    /**
     * Устанавливает адрес и эмитит событие изменения данных заказа.
     */
    setAddress(address: string): void {
        this.address = address;
        this.events.emit(EVENTS.ORDER_CHANGE);
    }

    /**
     * Устанавливает email и эмитит событие изменения контактов.
     */
    setEmail(email: string): void {
        this.email = email;
        this.events.emit(EVENTS.CONTACTS_CHANGE);
    }

    /**
     * Устанавливает телефон и эмитит событие изменения контактов.
     */
    setPhone(phone: string): void {
        this.phone = phone;
        this.events.emit(EVENTS.CONTACTS_CHANGE);
    }

    /**
     * Возвращает объект с данными покупателя.
     */
    getData(): ICustomer {
        return {
            payment: this.payment,
            address: this.address,
            email: this.email,
            phone: this.phone
        };
    }

    /**
     * Проверяет данные покупателя и возвращает объект с ошибками валидации.
     */
    validateBuyer(): TErrors {
        const errors: TErrors = {};
        if (!this.payment) {
            errors.payment = 'Необходимо выбрать способ оплаты';
        }
        if (!this.email) {
            errors.email = 'Необходимо указать email';
        }
        if (!this.phone) {
            errors.phone = 'Необходимо указать телефон';
        }
        if (!this.address) {
            errors.address = 'Необходимо указать адрес';
        }
        return errors;
    }

    /**
     * Очищает данные покупателя.
     * Событие не эмитится, так как этот метод вызывается только после успешного заказа.
     */
    clear(): void {
        this.payment = '';
        this.address = '';
        this.email = '';
        this.phone = '';
    }
}