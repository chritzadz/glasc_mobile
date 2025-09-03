class UserSingleton {
    private static instance: UserSingleton;
    private userId: string = '';

    private constructor(userId: string)
    {
        this.userId = userId;
    }

    public static initialize(userId: string): void {
        if (!UserSingleton.instance) {
            UserSingleton.instance = new UserSingleton(userId);
        } else {
            console.warn("Singleton instance already initialized.");
        }
    }

    public static getInstance(): UserSingleton {
        if (!UserSingleton.instance) {
            throw new Error("Singleton not initialized. Call initialize() first.");
        }
        return UserSingleton.instance;
    }
};