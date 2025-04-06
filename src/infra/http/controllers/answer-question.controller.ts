import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Param,
  Post
} from '@nestjs/common'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { JwtAuthGuard } from '@/infra/auth/jwt.AuthGuard'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { z } from 'zod'
import { AnswerQuestionUseCase } from '@/domain/forum/application/use-cases/answer-question'

const answerQuestionBodySchema = z.object({
  content: z.string(),
})

const bodyValidationPipe = new ZodValidationPipe(answerQuestionBodySchema)

type AnswerQuestionBodySchema = z.infer<typeof answerQuestionBodySchema>

@Controller('/questions')
export class AnswerQuestionController {
  constructor(private answerQuestion: AnswerQuestionUseCase) {}

  @Post('/:questionId/answers')
  @HttpCode(201)
  async handle(
    @Body(bodyValidationPipe) body: AnswerQuestionBodySchema,
    @CurrentUser() user: UserPayload,
    @Param('questionId') questionId: string
  ) {
    const { content } = body
    const userId = user.sub

    const result = await this.answerQuestion.execute({
      content,
      authorId: userId, 
      questionId, 
      attachmentsIds: []
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
