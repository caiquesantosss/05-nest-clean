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
import { DeleteAnswerCommentUseCase } from '@/domain/forum/application/use-cases/delete-answer-comment-use-case'

@Controller('/answer/comments/')
export class DeleteAnswerCommentController {
  constructor(private deleteAnswerComment: DeleteAnswerCommentUseCase) {}

  @Delete('/:id')
  @HttpCode(204)
  async handle(
    @CurrentUser() user: UserPayload,
    @Param('id') answerCommentId: string
  ) {
    const userId = user.sub

    const result = await this.deleteAnswerComment.execute({ 
        authorId: userId, 
        answerCommentId
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
