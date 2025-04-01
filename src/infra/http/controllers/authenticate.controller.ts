import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Post,
  UnauthorizedException,
  UsePipes,
} from '@nestjs/common'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { z } from 'zod'
import { AuthenticateStudentsUseCase } from '@/domain/forum/application/use-cases/authenticate-student'
import { WrongCredentialsError } from '@/domain/forum/application/use-cases/errors/wrong-credentials-error'
import { Public } from '@/infra/auth/public'

const AuthenticateBodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(4),
})

type AuthenticateBodySchema = z.infer<typeof AuthenticateBodySchema>

@Controller('/sessions')
@Public()
export class AuthenticateController {
  constructor(private authenticateStudent: AuthenticateStudentsUseCase) {}

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(AuthenticateBodySchema))
  async handle(@Body() body: AuthenticateBodySchema) {
    const { email, password } = body

    const result = await this.authenticateStudent.execute({
      email,
      password,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case WrongCredentialsError:
          throw new UnauthorizedException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }

    const { acessToken } = result.value

    return {
      acess_token: acessToken,
    }
  }
}
