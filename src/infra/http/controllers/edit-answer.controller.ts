import {
    BadRequestException,
    Body,
    Controller,
    HttpCode,
    Param,
    Put,
  } from '@nestjs/common'
  import { CurrentUser } from '@/infra/auth/current-user-decorator'
  import { UserPayload } from '@/infra/auth/jwt.strategy'
  import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
  import { z } from 'zod'
  import { EditAnswerUseCase } from '@/domain/forum/application/use-cases/edit-answer-use-case'
  
  const editAnswerBodySchema = z.object({
    content: z.string(),
  })
  
  const bodyValidationPipe = new ZodValidationPipe(editAnswerBodySchema)
  
  type EditAnswerBodySchema = z.infer<typeof editAnswerBodySchema>
  
  @Controller('/answers')
  export class EditAnswerController {
    constructor(private editAnswer: EditAnswerUseCase) {}
  
    @Put('/:id')
    @HttpCode(204)
    async handle(
      @Body(bodyValidationPipe) body: EditAnswerBodySchema,
      @CurrentUser() user: UserPayload,
      @Param('id') answerId: string
    ) {
      const { content } = body
      const authorId = user.sub
  
      const result = await this.editAnswer.execute({
        content,
        authorId,
        attachmentsIds: [],
        answerId,
      })
  
      if (result.isLeft()) {
        throw new BadRequestException()
      }
    }
  }
  