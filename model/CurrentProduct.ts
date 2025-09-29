export default class CurrentProduct {
    private static instance: CurrentProduct | null = null;
    private product_name: string | null = null;
    private product_id: string | null = null;
    private product_url: string | null = null;

    private constructor(){}

    public static getInstance(): CurrentProduct {
        if (CurrentProduct.instance === null) {
            CurrentProduct.instance = new CurrentProduct();
        }
        return CurrentProduct.instance;
    }

    public setProductName(product_name: string): void {
        this.product_name = product_name;
    }

    public setProductId(product_id: string): void {
        this.product_id = product_id;
    }

    public setProductUrl(product_url: string): void {
        this.product_url = product_url;
    }

    public getProductName(): string | null {
        return this.product_name;
    }

    public getProductId(): string | null {
        return this.product_id;
    }

    public getProductUrl(): string | null {
        return this.product_url;
    }
};