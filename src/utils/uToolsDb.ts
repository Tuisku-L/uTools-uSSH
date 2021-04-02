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

export function removeHost(hostId: string) {
    const result = window.utools.db.remove(hostId);
    return result.ok;
};

export function GetGroups(): Array<Group> {
    return window.utools.db.allDocs<Group>("group");
};

export function GetGroup(id: string): Group {
    return window.utools.db.get<Group>(id);
};

export function createOrUpdateGroup(group: Group): boolean {
    const result = window.utools.db.put(group);
    return result.ok;
};

export function removeGroup(groupId: string) {
    const result = window.utools.db.remove(groupId);
    return result.ok;
};
