import { NoUserExistsWithEmalException } from '@super-notes/authentication/exceptions/NoUserExistsException';
import { GetUserByEmail } from '@super-notes/authentication/features/get-user-by-email';
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  NotFoundException,
} from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { Observable, from, switchMap, catchError, throwError } from 'rxjs';

@Injectable()
export class UserIdInterceptor implements NestInterceptor {
  constructor(private queryBus: QueryBus) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    //Check if in the request params there is a "me" value
    //If there is, replace it with the user id from the token
    //If there isn't, just return the next handler

    const request = context.switchToHttp().getRequest();
    const userId = request.params.userId;

    if (userId === 'me' || userId === undefined) {
      const base64Token = request.headers.authorization
        .split(' ')[1]
        .split('.');

      const token = JSON.parse(
        Buffer.from(base64Token[1], 'base64').toString(),
      );
      const email = token.upn;
      const userQuery = new GetUserByEmail.Query(email);

      return from(this.queryBus.execute(userQuery)).pipe(
        switchMap((user) => {
          // Replace 'userId' param with the actual user ID from the query result
          request.params.userId = user.id;

          // Continue with the next handler
          return next.handle();
        }),
        catchError((err) => {
          if (err instanceof NoUserExistsWithEmalException) {
            return throwError(() => new NotFoundException(err.message));
          }
        }),
      );
    }

    return next.handle();
  }
}
