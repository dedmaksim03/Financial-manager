export class ActionDto {
    id?: number
    message: string 
    sum: number
    date: string
    category_id: number
    category_name?: string 
    category_color?: string
    category_type?: string

    constructor(
        message: string,
        sum: number,
        date: string,
        category_id: number,
        id?: number,
        category_name?: string,
        category_color?: string,
        category_type?: string
    )
    {
        this.id = id
        this.message = message 
        this.sum = sum
        this.date = date
        this.category_id = category_id
        this.category_name = category_name
        this.category_color = category_color
        this.category_type = category_type
    }
}