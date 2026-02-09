import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthGuard, AuthModule } from '@thallesp/nestjs-better-auth';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { auth } from './auth';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule.forRoot({ auth }),
  ],
  controllers: [AppController],
  providers: [AppService, {
    provide: 'APP_GUARD',
    useClass: AuthGuard,
  }],
})
export class AppModule {}
