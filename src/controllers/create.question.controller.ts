import {
  Controller,
  HttpCode,
  Post,
  UseGuards,
} from '@nestjs/common'
import { CurrentUser } from 'src/auth/current-user-decorator'
import { JwtAuthGuard } from 'src/auth/jwt.AuthGuard'
import { UserPayload } from 'src/auth/jwt.strategy'

@Controller('/questions')
@UseGuards(JwtAuthGuard)
export class CreateQuestionController {
  constructor() {}

  @Post()
  @HttpCode(201)
  async handle(@CurrentUser() user: UserPayload) {
    console.log(user.sub)

    return "ok"
  }
}
