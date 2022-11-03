import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MaestroHttpHeaders, MaestroHttpOptions } from 'src/app/shared/types';
import { CoreHttpService } from './core-http.service';

@Injectable({
  providedIn: 'root',
})
export class FileHttpService extends CoreHttpService {
  constructor(protected http: HttpClient) {
    super(http);
  }

  // #region Download methods

  public downloadFileViaGet(
    slug: string,
    options?: MaestroHttpOptions
  ): Observable<Blob> {
    if (!options) {
      options = {} as MaestroHttpOptions;
    }
    options.headers = this.prepareGetHeaders(options.headers);
    return this.get<Blob>(slug, options);
  }

  private prepareGetHeaders(headers: MaestroHttpHeaders) {
    return new HttpHeaders({
      'Content-Type': 'application/octet-stream',
      Accept: 'application/octet-stream',
      ...headers,
    });
  }

  public downloadFileViaPost(slug: string, body: unknown): Observable<Blob> {
    const options = {} as MaestroHttpOptions;
    options.headers = { 'Content-Type': 'application/json; charset=utf-8' };
    return this.post<Blob>(slug, body, options);
  }

  // #endregion

  // #region Upload methods

  public uploadFileViaPost(
    slug: string,
    body: FormData,
    options: MaestroHttpOptions = null
  ): Observable<Blob> {
    return this.post<Blob>(slug, body, options);
  }

  public uploadFileViaPut(
    slug: string,
    body: FormData,
    headers: MaestroHttpHeaders
  ): Observable<Blob> {
    //TODO: Check the return type, based on usage of legacy methods (method "putFileFromApi")
    const options = {} as MaestroHttpOptions;
    options.headers = headers;
    return this.put<Blob>(slug, body, options);
  }

  public uploadFileViaPatch(slug: string, body: unknown): Observable<Blob> {
    const options = {} as MaestroHttpOptions;
    options.headers = { 'Content-Type': 'application/json; charset=utf-8' };
    return this.patch(slug, body, options);
  }

  // #endregion

  // #region Legacy

  //TODO: REFACTOR WHOLE THIS REGION!

  getExportFileWithCustomName(data: HttpResponse<Blob>) {
    const defaultExportName = 'Maestro Document';

    const blob = new Blob([data.body], { type: data.body.type });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    document.body.appendChild(a);
    a.href = url;

    if (data.headers.get('content-disposition')) {
      const filename = data.headers
        .get('content-disposition')
        .split('filename=')[1];
      const regExp = /^"/;
      if (filename) {
        if (regExp.test(filename)) {
          a.download = data.headers
            .get('content-disposition')
            .split('filename="')[1]
            .split('"')[0];
        } else {
          a.download = data.headers
            .get('content-disposition')
            .split('filename=')[1]
            .split(';')[0];
        }
      }
    } else {
      a.download = defaultExportName;
    }

    a.click();

    setTimeout(() => {
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    }, 0);
  }

  getExportFileURL(data: HttpResponse<Blob>, includeToolbar?: boolean) {
    const blob = new Blob([data.body], { type: data.body.type });
    let processedBlob = URL.createObjectURL(blob);

    if (!includeToolbar) {
      processedBlob += '#toolbar=1';
    }

    return processedBlob;
  }

  // #endregion
}
