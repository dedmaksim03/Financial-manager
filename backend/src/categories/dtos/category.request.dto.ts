export class CategoryRequestDto {
    id? : number
    name: string
    color: string

    constructor(
        name: string, 
        color: string,
        id? : number)
    {
        this.name = name
        this.color = color
        this.id = id
    }
}