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

import { CommentsPresenter } from '../presenters/comments-presenters'
import { FetchAnswerCommentUseCase } from '@/domain/forum/application/use-cases/fetch-answer-comment-use-case'

const PageQueryParamsSchema = z
  .string()
  .optional()
  .default('1')
  .transform(Number)
  .pipe(z.number().min(1))

const QueryValidationPipe = new ZodValidationPipe(PageQueryParamsSchema)

type PageParamsSchema = z.infer<typeof PageQueryParamsSchema>

@Controller('/answer')
export class FetchAnswerCommentsController {
  constructor(private fetchAnswerComments: FetchAnswerCommentUseCase) {}

  @Get('/:answerId/comments')
  @HttpCode(200)
  async handle(
    @Query('page', QueryValidationPipe) page: PageParamsSchema,
    @Param('answerId') answerId: string
  ) {
    const result = await this.fetchAnswerComments.execute({
      page,
      answerId,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    const answerComments = result.value.answerComments

    return { answerComments: answerComments.map(CommentsPresenter.toHttp) }
  }
}
