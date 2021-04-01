export { };

declare global {
    interface Window {
        setLoading(isLoading: boolean): void;
    }
}
