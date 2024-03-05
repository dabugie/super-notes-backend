import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class TokenInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest();
    const authToken = request.headers.authorization;

    // Attach the token to the request object
    request.authToken = authToken ? authToken.replace('Bearer ', '') : null;

    return next.handle();
  }
}
