import {
    BadRequestException,
    Controller,
    Get,
    Param
} from '@nestjs/common'
import { QuestionPresenter } from '../presenters/question-presenter'
import { GetQuestionBySlugUseCase } from '@/domain/forum/application/use-cases/get-question-by-slug'

@Controller('/question/:slug')
export class GetQuestionBySlugController {
  constructor(private GetQuestionBySlug: GetQuestionBySlugUseCase) {}

  @Get()
  async handle(@Param('slug') slug: string) {
    const result = await this.GetQuestionBySlug.execute({
      slug,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    return { question: QuestionPresenter.toHttp(result.value.question) }
  }
}
