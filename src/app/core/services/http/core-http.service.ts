import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { MaestroHttpOptions } from 'src/app/shared/types';

@Injectable({
  providedIn: 'root',
})
export abstract class CoreHttpService {
  public readonly WEB_SERVICE_ADDRESS = environment.apiPath;

  constructor(protected http: HttpClient) {}

  /**
   * Generic Get method, will return single element of type T.
   *
   * @param url - Path for a requested resource.
   * @param options - http request options.
   * @param apiVersion - API version.
   *
   * @returns an Observable<T>
   */
  protected get<T>(
    url: string,
    options?: MaestroHttpOptions,
    apiVersion: string = null
  ): Observable<T> {

    return this.http.get<T>(this.generateApiUrl(url, apiVersion), { ...options });
  }

  /**
   * Post method.
   * @param url - url for requested resource.
   * @param body - Body for requested resource.
   * @param options - http request options.
   * @param apiVersion - API version.
   *
   * @returns an Observable<T>
   */
  protected post<T>(
    url: string,
    body: unknown = null,
    options?: MaestroHttpOptions,
    apiVersion: string = null
  ): Observable<T> {
    return this.http.post<T>(this.generateApiUrl(url, apiVersion), body, { ...options });
  }

  /**
   * Generic Put method.
   *
   * @param url - url for requested resource.
   * @param body - Body for requested resource.
   * @param options - http request options.
   * @param apiVersion - API version.
   *
   * @returns an Observable<T>
   */
  protected put<T>(
    url: string,
    body: unknown = null,
    options?: MaestroHttpOptions,
    apiVersion: string = null
  ): Observable<T> {
    return this.http.put<T>(this.generateApiUrl(url, apiVersion), body, { ...options });
  }

  /**
   * Generic Patch method.
   *
   * @param url - url for requested resource.
   * @param body - Body for requested resource.
   * @param options - http request options.
   * @param apiVersion - API version.
   *
   * @returns an Observable<T>
   */
  protected patch<T>(
    url: string,
    body: unknown = null,
    options?: MaestroHttpOptions,
    apiVersion: string = null
  ): Observable<T> {
    return this.http.patch<T>(this.generateApiUrl(url, apiVersion), body, { ...options });
  }

  /**
   * Generic Delete method.
   *
   * @param url - url for requested resource.
   * @param options - http request options.
   * @param apiVersion - API version.
   *
   * @returns an Observable<Object>
   */
  protected delete(
    url: string,
    options?: MaestroHttpOptions,
    apiVersion: string = null
  ): Observable<Object> {
    return this.http.delete(this.generateApiUrl(url, apiVersion), { ...options });
  }


  /**
   * Generate complete API path.
   *
   * @param url url for the requested resource.
   * @param apiVersion API version e.g. "v2"
   *
   * @returns Complete API path.
   */
  private generateApiUrl(url: string, apiVersion?: string): string {
    let apiUrl: string = this.WEB_SERVICE_ADDRESS + url;
    if (apiVersion) {
      apiUrl = apiUrl.replace(/\/v\d+\/*/, `/${apiVersion}/`);
    }
    return apiUrl;
  }
}
