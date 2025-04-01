import {
  BadRequestException,
  Controller,
  Get,
  HttpCode,
  Query
} from '@nestjs/common'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { z } from 'zod'
import { FetchRecentQuestionUseCaseUseCase } from '@/domain/forum/application/use-cases/fetch-recent-questions-use-case'
import { QuestionPresenter } from '../presenters/question-presenter'

const PageQueryParamsSchema = z
  .string()
  .optional()
  .default('1')
  .transform(Number)
  .pipe(z.number().min(1))

const QueryValidationPipe = new ZodValidationPipe(PageQueryParamsSchema)

type PageParamsSchema = z.infer<typeof PageQueryParamsSchema>

@Controller('/questions')
export class FetchRecentQuestionsController {
  constructor(private fetchRecentQuestion: FetchRecentQuestionUseCaseUseCase) {}

  @Get()
  @HttpCode(200)
  async handle(@Query('page', QueryValidationPipe) page: PageParamsSchema) {
    const result = await this.fetchRecentQuestion.execute({
      page,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    const questions = result.value.questions

    return { questions: questions.map(QuestionPresenter.toHttp) }
  }
}
