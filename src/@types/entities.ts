export interface Host extends utools.db.DbObject {
    alias: string;
    user: string;
    address: string;
    port: number;
    pemFile: string;
    loginType: LoginType;
    isFixed: boolean;
    GroupId: string;
    Group: Group;
    createDate: number;
}

export enum LoginType {
    // 正常登陆, 输入密码或使用远端服务器保存的公钥
    Normal = 0,
    // 证书登录, 使用本地的证书文件登录, -i 参数
    Pem = 1
}

export interface Group extends utools.db.DbObject {
    name: string;
    password: string;
    Hosts?: Array<Host>;
    createDate: number;
}
