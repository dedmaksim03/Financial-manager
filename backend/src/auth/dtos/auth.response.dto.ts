export class AuthResponseDto {
    token: string
    refresh_token: string

    constructor(
        token: string, 
        refresh_token: string )
    {
        this.refresh_token = refresh_token
        this.token = token
    }
}