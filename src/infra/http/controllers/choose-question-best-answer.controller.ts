import {
    BadRequestException, Controller,
    HttpCode,
    Param,
    Patch
} from '@nestjs/common'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { ChooseQuestionBestAnswerUseCase } from '@/domain/forum/application/use-cases/choose-question-best-answer'

@Controller('/answers')
export class ChooseQuestionBestAnswerController {
  constructor(
    private chooseQuestionBestAnswer: ChooseQuestionBestAnswerUseCase
  ) {}

  @Patch('/:answerId/choose-as-best')
  @HttpCode(204)
  async handle(
    @CurrentUser() user: UserPayload,
    @Param('answerId') AnswerId: string
  ) {
    const userId = user.sub

    const result = await this.chooseQuestionBestAnswer.execute({
      AuthorId: userId,
      AnswerId,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
