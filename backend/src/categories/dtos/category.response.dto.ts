export class CategoryResponseDto {
    id: number
    name: string
    color: string 
    sum: number

    constructor(
        id: number,
        name: string, 
        color: string,
        sum: number )
    {
        this.id = id
        this.name = name
        this.color = color 
        this.sum = sum
    }
}