import {
  BadRequestException,
  Controller,
  Get,
  HttpCode,
  Param,
  Query,
} from '@nestjs/common'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { z } from 'zod'

import { FetchQuestionAnswerUseCase } from '@/domain/forum/application/use-cases/fetch-questions-answer-use-case'
import { QuestionPresenter } from '../presenters/question-presenter'
import { AnswerPresenter } from '../presenters/answer-presenter'

const PageQueryParamsSchema = z
  .string()
  .optional()
  .default('1')
  .transform(Number)
  .pipe(z.number().min(1))

const QueryValidationPipe = new ZodValidationPipe(PageQueryParamsSchema)

type PageParamsSchema = z.infer<typeof PageQueryParamsSchema>

@Controller('/questions')
export class FetchQuestionsAnswersController {
  constructor(private fetchQuestionsAnswers: FetchQuestionAnswerUseCase) {}

  @Get('/:questionId/answers')
  @HttpCode(200)
  async handle(
    @Query('page', QueryValidationPipe) page: PageParamsSchema,
    @Param('questionId') questionId: string
  ) {
    const result = await this.fetchQuestionsAnswers.execute({
      page,
      questionId,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    const answers = result.value.answers

    return { answers: answers.map(AnswerPresenter.toHttp) }
  }
}
