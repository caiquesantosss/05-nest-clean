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
import { DeleteQuestionCommentUseCase } from '@/domain/forum/application/use-cases/delete-question-comment-use-case'

@Controller('/questions/comments/')
export class DeleteQuestionCommentController {
  constructor(private deleteQuestionComment: DeleteQuestionCommentUseCase) {}

  @Delete('/:id')
  @HttpCode(204)
  async handle(
    @CurrentUser() user: UserPayload,
    @Param('id') questionCommentId: string
  ) {
    const userId = user.sub

    const result = await this.deleteQuestionComment.execute({ 
        authorId: userId, 
        questionCommentId
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
