import { Body, Controller, HttpCode, Post, UnauthorizedException, UsePipes } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { compare } from 'bcryptjs'
import { ZodValidationPipe } from 'src/pipes/zod-validation-pipe'
import { PrismaService } from 'src/prisma/prisma.service'
import { z } from 'zod'

const AuthenticateBodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(4),
})

type AuthenticateBodySchema = z.infer<typeof AuthenticateBodySchema>

@Controller('/sessions')
export class AuthenticateController {
  constructor(private jwt: JwtService, private prisma: PrismaService) {}

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(AuthenticateBodySchema))
  async handle(@Body() body: AuthenticateBodySchema) {
    const { email, password } = body

    const user = await this.prisma.user.findUnique({
        where: {
            email
        }
    })

    if (!user) {
        throw new UnauthorizedException('User credentials do not match.')
    }

    const isPassword = await compare(password, user.password)

    if (!isPassword) {
        throw new UnauthorizedException('User credentials do not match.')
    }

    const acessToken = this.jwt.sign({ sub: user.id })

    return {
        acess_token: acessToken
    }
  }
}
