import { Controller, Logger, UseGuards, Request, Get, Post, Res, Body, BadRequestException, Delete, Param } from "@nestjs/common";
import { JwtAuthGuard } from "src/jwt/jwt.auth.guard";
import { ActionService } from "./action.service";
import { ActionDto } from "./dtos/action.dto";

@Controller('api/actions')
@UseGuards(JwtAuthGuard)
export class ActionsController {
    private readonly logger = new Logger(ActionsController.name)    

    constructor (
        private readonly actionService: ActionService
    ){}

    @Get('get')
    async getAllActionsForUser (@Request() req): Promise<ActionDto[]> {
        this.logger.log(req.user)
        let actions = await this.actionService.getAllActionsByUser(req.user)
        this.logger.log(actions)
        return actions.map((action) => new ActionDto(
                action.type, 
                action.message, 
                action.sum,
                action.date,
                action.category.id,
                action.id,
                action.category.name,
                action.category.color
            )
        )
    }

    @Post('create')
    async createCategory (@Request() req, @Body() actionDto: ActionDto) {
        let saveResult = await this.actionService.createAction(actionDto)

        if (!saveResult) {
            this.logger.log('Error while creating action')
            return new BadRequestException()
        }
        return 
    }

    @Delete(':id')
    async deleteAction (@Request() req, @Param('id') actionId: number) {
        if (!actionId) {
            this.logger.log('Error while delete action')
            return new BadRequestException()
        }
        let deleteResult = await this.actionService.deleteAction(actionId)
        if (!deleteResult) {
            return new BadRequestException("Error delete action")
        }
        return 
    }
    

}