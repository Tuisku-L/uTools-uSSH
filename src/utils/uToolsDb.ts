import { Group, Host } from "@/@types/entities";

export function getHost(id: string): Host {
    return window.utools.db.get<Host>(id);
};

export function createOrUpdateHost(host: Host): boolean {
    const result = window.utools.db.put(host);
    return result.ok;
}

export function GetHostsByGroupId(groupId: string): Array<Host> {
    return window.utools.db.allDocs<Host>(`host|${groupId}`);
};

export function GetGroups(): Array<Group> {
    return window.utools.db.allDocs<Group>("group");
};

export function createOrUpdateGroup(group: Group): boolean {
    const result = window.utools.db.put(group);
    return result.ok;
};
