import { IApi, IProductListResponse, IOrderRequest, IOrderResponse } from '../../types';

export class WebLarekApi {
    private api: IApi;

    constructor(api: IApi) {
        this.api = api;
    }

    /**
     * Получает с сервера список товаров.
     * GET /product/
     */
    getProducts(): Promise<IProductListResponse> {
        return this.api.get<IProductListResponse>('/product/');
    }

    /**
     * Отправляет данные о заказе на сервер.
     * POST /order/
     */
    sendOrder(data: IOrderRequest): Promise<IOrderResponse> {
        return this.api.post<IOrderResponse>('/order/', data);
    }
}