import { Injectable } from '@angular/core';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

//TODO: It's necessary to inject a service (or any other mechanism) that could display error messages on UI.

//TODO: It's necessary to add a logic for all methods that are not completed, based on system requirements.

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
  constructor() {}

  /**
   * The interceptor method.
   *
   * @param req - Current request.
   * @param next - HttpHandler.
   */
  public intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        const errorStatus = error.status;
        // classify by code
        const isClientError = errorStatus % 400 <= 99;
        const isServerError = errorStatus % 500 <= 99;

        if (isClientError) {
          this.handleClientError(error);
        } else if (isServerError) {
          this.handleServerError(error);
        } else {
          this.defaultErrorHandler(error);
        }

        return throwError(error.message);
      })
    );
  }

  /**
   * Will simply load notify.
   *
   * @param error - Error ocurred.
   */
  private defaultErrorHandler(error: HttpErrorResponse) {
    throw new Error('Method not implemented.');
  }

  /**
   * Handle all server errors (5xx).
   *
   * @param error - Error ocurred.
   */
  private handleServerError(error: HttpErrorResponse) {
    throw new Error('Method not implemented.');
  }

  /**
   * Handle all client errors (4xx).
   *
   * @param error - Error ocurred.
   */
  private handleClientError(error: HttpErrorResponse) {
    const errorStatus = error.status;
    switch (errorStatus) {
      case 400:
        this.handleValidationError(error);
        break;
      case 401:
        this.handleAuthError(error);
        break;
      case 403:
        this.handleUnauthorizedError(error);
        break;
      case 422:
        this.handleValidationError(error);
        break;
      default:
        this.defaultErrorHandler(error);
        break;
    }
  }

  /**
   * Authorization error.
   *
   * @param error - Error ocurred.
   */
  private handleAuthError(error: HttpErrorResponse) {
    throw new Error('Method not implemented.');
  }

  /**
   * Not authorized.
   *
   * @param error Error that ocurred.
   */
  private handleUnauthorizedError(error: HttpErrorResponse) {
    throw new Error('Method not implemented.');
  }

  /**
   * Form Validation error method, here we'll iterate through each validation message in response
   *
   * @param error - Error ocurred.
   */
  private handleValidationError(error: HttpErrorResponse) {
    throw new Error('Method not implemented.');
  }
}
