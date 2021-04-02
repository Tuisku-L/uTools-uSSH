export function exec_ssh_connect(user: string, address: string, port?: number, pemFile?: string) {
    let cmd = `ssh ${user}@${address}`;
    if (port && port !== 22) {
        cmd += ` -p ${port}`;
    }
    if (pemFile && pemFile !== "") {
        cmd += ` -i ${pemFile}`;
    }

    execShell(`./${window.__dirname}/run.aspt '${cmd}'`);
}

export function execShell(cmd: string) {
    const exec = window.execShell.exec(cmd);

    exec.stderr.on("data", (data: any) => {
        window.utools.showNotification(`无法执行连接操作: ${data}`);
    });
}
