export default class CurrentUser {
    private static instance: CurrentUser = new CurrentUser(-1);
    private userId: number;

    private constructor(userId: number)
    {
        this.userId = userId;
    }

    public static getInstance(): CurrentUser {
        return CurrentUser.instance;
    }

    public setId(userId: number): void {
        this.userId = userId;
    }

    public getId(): number {
        return this.userId;
    }
};