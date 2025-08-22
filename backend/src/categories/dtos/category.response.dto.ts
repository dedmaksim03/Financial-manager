export class CategoryResponseDto {
    id: number
    name: string
    color: string 
    sum: number
    type: string

    constructor(
        id: number,
        name: string, 
        color: string,
        sum: number,
        type: string)
    {
        this.id = id
        this.name = name
        this.color = color 
        this.sum = sum
        this.type = type
    }
}