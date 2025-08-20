export interface ActionResponse {
    id?: number
    type: string
    message: string 
    sum: number
    date: Date
    category_id: number
    category_name?: string 
    category_color?: string
}