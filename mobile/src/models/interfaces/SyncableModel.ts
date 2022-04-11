export const isSyncableModel = (model: any): model is SyncableModel => {
    return "getBriefIdentifier" in model;
};

export interface SyncableModel {
    getBriefIdentifier: () => Promise<string> | string;
}
