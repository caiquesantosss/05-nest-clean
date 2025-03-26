import {
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Post,
  UsePipes,
} from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { hash } from 'bcryptjs'
import { z } from 'zod'
import { ZodValidationPipe } from 'src/pipes/zod-validation-pipe'

const CreateAccountBodySchema = z.object({
  name: z.string(), 
  email: z.string().email(), 
  password: z.string().min(4)
})

type CreateAccountBodySchema = z.infer<typeof CreateAccountBodySchema>

@Controller('/account')
export class CreateAccountController {
  constructor(private prisma: PrismaService) {}

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(CreateAccountBodySchema))
  async handle(@Body() body: CreateAccountBodySchema) {
    const { name, email, password } = body

    const userWithSameEmail = await this.prisma.user.findUnique({
      where: {
        email,
      },
    })

    if (userWithSameEmail) {
      throw new ConflictException('User with same email alredy exists!')
    }

    const passwordHashed = await hash(password, 8)

    await this.prisma.user.create({
      data: {
        name,
        email,
        password: passwordHashed,
      },
    })
  }
}
