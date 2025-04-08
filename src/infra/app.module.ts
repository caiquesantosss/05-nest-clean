import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { envSchema } from './env/env'
import { AuthModule } from './auth/auth.module'
import { httpModule } from './http/http.module'
import { EnvService } from './env/env.service'
import { envModule } from './env/env.module'
import { StorageModule } from './storage/storage.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: (env) => envSchema.parse(env),
    }),
    httpModule,
    AuthModule,
    envModule,
    StorageModule
  ],
  providers: [EnvService],
})
export class AppModule {}
