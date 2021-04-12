export { };

declare global {
    interface Window {
        setLoading(isLoading: boolean): void;
        execShell: { exec(cmd: string): { stdout: { on: Function }, stderr: { on: Function } } };
        __dirname: string;
        terminalType: "Terminal" | "iTerm" | "cmd" | "PowerShell";
    }
}
