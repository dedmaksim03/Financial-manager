import { Controller, Logger, UseGuards, Request, Get, Post, Res, Body, BadRequestException, Delete, Param, Query } from "@nestjs/common";
import { JwtAuthGuard } from "src/jwt/jwt.auth.guard";
import { ActionService } from "./action.service";
import { ActionDto } from "./dtos/action.dto";
import { ActionDatefilterDto } from "./dtos/action.datefilter.dto";
import { Action } from "./action.entity";

@Controller('api/actions')
@UseGuards(JwtAuthGuard)
export class ActionsController {
    private readonly logger = new Logger(ActionsController.name)    

    constructor (
        private readonly actionService: ActionService
    ){}

    @Get('get')
    async getAllActionsForUser (@Request() req, @Query() actionDatefilterDto: ActionDatefilterDto): Promise<ActionDto[]> {
        this.logger.log(req.user)
        let actions: Action[]
        if (actionDatefilterDto?.dateFrom && actionDatefilterDto?.dateTo) { 
            actions = await this.actionService.getActionsByUser(req.user, actionDatefilterDto?.dateFrom, actionDatefilterDto?.dateTo)
        }
        else {
            actions = await this.actionService.getAllActionsByUser(req.user)
        }
        this.logger.log(actions)
        return actions.map((action) => new ActionDto(
                action.message, 
                action.sum,
                action.date,
                action.category.id,
                action.id,
                action.category.name,
                action.category.color,
                action.category.type
            )
        )
    }

    @Post('create')
    async createAction (@Request() req, @Body() actionDto: ActionDto) {
        let saveResult = await this.actionService.createAction(actionDto)

        if (!saveResult) {
            this.logger.log('Error while creating action')
            return new BadRequestException()
        }

        this.logger.log(`saveResult: ${saveResult.date}`)
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