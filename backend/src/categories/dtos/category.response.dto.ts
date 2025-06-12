export class CategoryDto {
    name: string
    color: string 
    sum: number

    constructor(
        name: string, 
        color: string,
        sum: number )
    {
        this.name = name
        this.color = color 
        this.sum = sum
    }
}