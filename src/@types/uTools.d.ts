declare namespace utools {

    export namespace db {
        interface DbObject {
            _id: string;
            _rev?: string;
        }

        interface AnonymousDbObject extends DbObject {
            [key: string]: any;
        }

        interface DbResult {
            id: string;
            ok: boolean;
            rev: string;
        }

        export function put<T extends DbObject>(doc: T): DbResult;
        export function get(id: string): AnonymousDbObject;
        export function get<T extends DbObject>(id: string): T;
        export function remove<T extends DbObject>(doc: string | T): DbResult;
        export function bulkDocs<T extends DbObject>(docs: Array<T extends DbObject ? T : any>): Array<DbResult>;
        export function allDocs(key?: string | Array<string>): Array<AnonymousDbObject>;
        export function allDocs<T extends DbObject>(key?: string | Array<string>): Array<T>;
        export function putAttachment(docId: string, attachmentId: string, rev: string | null, attachment: Buffer | Uint8Array, type: string): DbResult;
        export function getAttachment(docId: string, attachmentId: string): Uint8Array;
        export function removeAttachment(docId: string, attachmentId: string, rev: string): DbResult;
    }
}
