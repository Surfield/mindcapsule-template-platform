import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class LockGuard implements CanActivate {
  constructor(private configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const lockHeader = request.headers['lock'];
    const expectedLock = this.configService.get<string>('CALLS_LOCK_SECRET');

    if (!lockHeader || lockHeader !== expectedLock) {
      throw new UnauthorizedException('Invalid lock header');
    }

    return true;
  }
}
