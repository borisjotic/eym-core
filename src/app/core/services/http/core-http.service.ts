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
   * @param slug - Slug for requested resource.
   * @param options - http request options.
   * @param apiVersion - API version.
   *
   * @returns an Observable<T>
   */
  protected get<T>(
    slug: string,
    options?: MaestroHttpOptions,
    apiVersion: string = null
  ): Observable<T> {

    return this.http.get<T>(this.generateApiUrl(slug, apiVersion), { ...options });
  }

  /**
   * Post method.
   * @param slug - Slug for requested resource.
   * @param body - Body for requested resource.
   * @param options - http request options.
   * @param apiVersion - API version.
   *
   * @returns an Observable<T>
   */
  protected post<T>(
    slug: string,
    body: unknown = null,
    options?: MaestroHttpOptions,
    apiVersion: string = null
  ): Observable<T> {
    return this.http.post<T>(this.generateApiUrl(slug, apiVersion), body, { ...options });
  }

  /**
   * Generic Put method.
   *
   * @param slug - Slug for requested resource.
   * @param body - Body for requested resource.
   * @param options - http request options.
   * @param apiVersion - API version.
   *
   * @returns an Observable<T>
   */
  protected put<T>(
    slug: string,
    body: unknown = null,
    options?: MaestroHttpOptions,
    apiVersion: string = null
  ): Observable<T> {
    return this.http.put<T>(this.generateApiUrl(slug, apiVersion), body, { ...options });
  }

  /**
   * Generic Patch method.
   *
   * @param slug - Slug for requested resource.
   * @param body - Body for requested resource.
   * @param options - http request options.
   * @param apiVersion - API version.
   *
   * @returns an Observable<T>
   */
  protected patch<T>(
    slug: string,
    body: unknown = null,
    options?: MaestroHttpOptions,
    apiVersion: string = null
  ): Observable<T> {
    return this.http.patch<T>(this.generateApiUrl(slug, apiVersion), body, { ...options });
  }

  /**
   * Generic Delete method.
   *
   * @param slug - SLug for requested resource.
   * @param options - http request options.
   * @param apiVersion - API version.
   *
   * @returns an Observable<Object>
   */
  protected delete(
    slug: string,
    options?: MaestroHttpOptions,
    apiVersion: string = null
  ): Observable<Object> {
    return this.http.delete(this.generateApiUrl(slug, apiVersion), { ...options });
  }


  /**
   * Generate complete API path.
   *
   * @param slug Slug for the requested resource.
   * @param apiVersion API version e.g. "v2"
   *
   * @returns Complete API path.
   */
  private generateApiUrl(slug: string, apiVersion?: string): string {
    let apiUrl: string = this.WEB_SERVICE_ADDRESS + slug;
    if (apiVersion) {
      apiUrl = apiUrl.replace(/\/v\d+\/*/, `/${apiVersion}/`);
    }
    return apiUrl;
  }
}
