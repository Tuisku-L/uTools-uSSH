export function exec_ssh_connect(user: string, address: string, port?: number, pemFile?: string, termType: "Terminal" | "iTerm" | "cmd" | "PowerShell" = "iTerm") {
    let cmd = `ssh ${user}@${address}`;
    if (port && port !== 22) {
        cmd += ` -p ${port}`;
    }
    if (pemFile && pemFile !== "") {
        cmd += ` -i ${pemFile}`;
    }

    if (window.utools.isMacOs()) {
        if (termType === "iTerm") {
            window.execShell.exec(`chmod +x ${window.__dirname}/run.aspt`);
            execShellWithiTerm(cmd);
        } else {
            execShellWithTerminal(cmd);
        }
    }

    if (window.utools.isWindows()) {
        if (termType === "cmd") {
            execShellWithCmd(cmd);
        } else {
            execShellWithPowerSehll(cmd);
        }
    }
};

export function execShellWithiTerm(cmd: string) {
    const shell = `./${window.__dirname}/run.aspt '${cmd}'`;

    const exec = window.execShell.exec(shell);
    exec.stderr.on("data", (data: any) => {
        window.utools.showNotification(`无法执行连接操作: ${data}`);
    });
};

export function execShellWithTerminal(cmd: string) {
    const shell = `osascript -e 'tell application "Terminal" to do script "${cmd}"'`;

    const exec = window.execShell.exec(shell);
    exec.stderr.on("data", (data: any) => {
        window.utools.showNotification(`无法执行连接操作: ${data}`);
    });
};

export function execShellWithCmd(cmd: string) {
    const shell = `cmd.exe /k start cmd.exe /k ${cmd}`;
    const exec = window.execShell.exec(shell);
    exec.stderr.on("data", (data: any) => {
        window.utools.showNotification(`无法执行连接操作: ${data}`);
    });
};

export function execShellWithPowerSehll(cmd: string) {
    const shell = `cmd.exe /k start PowerShell -NoExit -Command "${cmd}"`;
    const exec = window.execShell.exec(shell);
    exec.stderr.on("data", (data: any) => {
        console.info(`${data}`);
        window.utools.showNotification(`无法执行连接操作: ${data}`);
    });
};