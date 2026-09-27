import { ICustomer, PaymentMethod, TErrors } from '../../types';

export class Customer {
    private payment: PaymentMethod = '';
    private address: string = '';
    private email: string = '';
    private phone: string = '';

    /**
     * Устанавливает способ оплаты.
     */
    setPayment(method: PaymentMethod): void {
        this.payment = method;
    }

    /**
     * Устанавливает адрес доставки.
     */
    setAddress(address: string): void {
        this.address = address;
    }

    /**
     * Устанавливает email покупателя.
     */
    setEmail(email: string): void {
        this.email = email;
    }

    /**
     * Устанавливает телефон покупателя.
     */
    setPhone(phone: string): void {
        this.phone = phone;
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
     * Если все поля заполнены — возвращает пустой объект.
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
     */
    clear(): void {
        this.payment = '';
        this.address = '';
        this.email = '';
        this.phone = '';
    }
}