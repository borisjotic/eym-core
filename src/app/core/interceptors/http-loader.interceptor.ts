import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { HeaderName } from 'src/app/shared/enums';
import { finalize } from 'rxjs/operators';
import { LoaderStateService } from '../services/loader-state.service';

@Injectable()
export class HttpLoaderInterceptor implements HttpInterceptor {
  /**
   * Array of requests that are ignored by default, e.g. login, logout, etc...
   */
  private readonly requestForIgnore = ['v1/login', 'v2/logut'];

  constructor(private loaderStateService: LoaderStateService) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    const req =
      this.handleIgnoredRequest(request, next) ||
      this.handleUserIgnoredRequest(request, next) ||
      this.handleDedicatedRequest(request, next) ||
      this.handleRequestWithLoader(request, next);

    return req;
  }

  private handleUserIgnoredRequest(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> | null {
    let output = null;

    if (request.headers.get(HeaderName.userIgnoredLoader)) {
      const req = request.clone({
        headers: request.headers.delete(HeaderName.userIgnoredLoader),
      });

      output = next.handle(req);
    }

    return output;
  }

  private handleDedicatedRequest(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> | null {
    let output = null;
    const key = request.headers.get(HeaderName.showDedicatedLoader);

    if (key) {
      const req = request.clone({
        headers: request.headers.delete(HeaderName.showDedicatedLoader),
      });

      this.loaderStateService.showDedicatedFor(key);
      output = next
        .handle(req)
        .pipe(finalize(() => this.loaderStateService.hideDedicatedFor(key)));
    }

    return output;
  }

  private handleIgnoredRequest(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> | null {
    let output = next.handle(request);
    const url = request.url.toLowerCase();

    const requestIgnored = !this.requestForIgnore.filter((ignoreReq) =>
      url.toLowerCase().endsWith(ignoreReq)
    ).length;

    if (requestIgnored) {
      output = null;
    }

    return output;
  }

  private handleRequestWithLoader(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    const uniqueKey = this.loaderStateService.showMain();

    return next
      .handle(request)
      .pipe(finalize(() => this.loaderStateService.hideMain(uniqueKey)));
  }
}
