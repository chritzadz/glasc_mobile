export default class CurrentProduct {
    private static instance: CurrentProduct | null = null;
    private product_name: string | null = null;

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

    public getProductName(): string | null {
        return this.product_name;
    }
};