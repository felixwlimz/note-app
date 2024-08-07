import { Type } from "class-transformer"


export class Note {

    id: string

    title: string

    body: string

    @Type(() => Date)
    createdAt: Date

    archived: boolean
}