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

import { FetchQuestionCommentUseCase } from '@/domain/forum/application/use-cases/fetch-question-comment-use-case'
import { CommentsPresenter } from '../presenters/comments-presenters'

const PageQueryParamsSchema = z
  .string()
  .optional()
  .default('1')
  .transform(Number)
  .pipe(z.number().min(1))

const QueryValidationPipe = new ZodValidationPipe(PageQueryParamsSchema)

type PageParamsSchema = z.infer<typeof PageQueryParamsSchema>

@Controller('/questions')
export class FetchQuestionsCommentsController {
  constructor(private fetchQuestionsComments: FetchQuestionCommentUseCase) {}

  @Get('/:questionId/comments')
  @HttpCode(200)
  async handle(
    @Query('page', QueryValidationPipe) page: PageParamsSchema,
    @Param('questionId') questionId: string
  ) {
    const result = await this.fetchQuestionsComments.execute({
      page,
      questionId,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    const questionComments = result.value.questionsComments

    return { questionComments: questionComments.map(CommentsPresenter.toHttp) }
  }
}
