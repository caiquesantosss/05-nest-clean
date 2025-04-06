import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  HttpCode,
  Param,
} from '@nestjs/common'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { DeleteAnswerUseCase } from '@/domain/forum/application/use-cases/delete-answer-use-case'


@Controller('/answers')
export class DeleteAnswerController {
  constructor(private deleteAnswer: DeleteAnswerUseCase) {}

  @Delete('/:id')
  @HttpCode(204)
  async handle(
    @CurrentUser() user: UserPayload,
    @Param('id') answerId: string
  ) {
    const userId = user.sub

    const result = await this.deleteAnswer.execute({
        answerId, 
        authorId: userId
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
