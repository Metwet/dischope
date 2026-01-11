import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * JwtAuthGuard - guard для защиты роутов с помощью JWT
 * Наследуется от AuthGuard('jwt') из @nestjs/passport
 *
 * Использование:
 * @UseGuards(JwtAuthGuard)
 * @Get('protected-route')
 * getProtectedData() { ... }
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
