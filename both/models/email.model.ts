import { CollectionObject } from "./collection-object.model";

export interface Email extends CollectionObject {
    ownerId: string;
    title: string;
    heading: string;
    summary: string;
    contents: string;
    active: boolean;
    deleted: boolean;
    createdAt: Date;
    modifiedAt: Date;
}