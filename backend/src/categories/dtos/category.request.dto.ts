export class CategoryRequestDto {
    id? : number
    name: string
    color: string
    type: string

    constructor(
        name: string, 
        color: string,
        type: string, 
        id? : number)
    {
        this.name = name
        this.color = color
        this.type = type
        this.id = id
    }
}