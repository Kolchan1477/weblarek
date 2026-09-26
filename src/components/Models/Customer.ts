import { ICustomer, PaymentMethod } from '../../types';

export class Customer {
    private payment: PaymentMethod = '';
    private address: string = '';
    private email: string = '';
    private phone: string = '';

    /**
     * Устанавливает способ оплаты.
     * @param method - способ оплаты ('card' | 'cash' | '')
     */
    setPayment(method: PaymentMethod): void {
        this.payment = method;
    }

    /**
     * Устанавливает адрес доставки.
     * @param address - адрес
     */
    setAddress(address: string): void {
        this.address = address;
    }

    /**
     * Устанавливает email.
     * @param email - электронная почта
     */
    setEmail(email: string): void {
        this.email = email;
    }

    /**
     * Устанавливает телефон.
     * @param phone - номер телефона
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
     * Проверяет корректность данных для первого шага оформления (оплата и адрес).
     */
    validateStep1(): boolean {
        return this.payment !== '' && this.address.trim() !== '';
    }

    /**
     * Проверяет корректность данных для второго шага оформления (email и телефон).
     */
    validateStep2(): boolean {
        return this.email.trim() !== '' && this.phone.trim() !== '';
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