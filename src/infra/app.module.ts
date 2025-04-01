import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { envSchema } from './env/env'
import { AuthModule } from './auth/auth.module'
import { httpModule } from './http/http.module'
import { EnvService } from './env/env.service'
import { envModule } from './env/env.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: (env) => envSchema.parse(env),
    }),
    httpModule,
    AuthModule,
    envModule
  ],
  providers: [EnvService],
})
export class AppModule {}
