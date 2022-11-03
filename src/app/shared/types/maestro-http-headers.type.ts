import { HttpHeaders, HttpParams } from '@angular/common/http';

export type MaestroHttpHeaders =
  | HttpHeaders
  | {
      [header: string]: string | string[];
    };

export type MaestroHttpParams =
  | HttpParams
  | {
      [param: string]: string | string[];
    };

export type MaestroHttpOptions = {
  headers?: MaestroHttpHeaders;
  params?: MaestroHttpParams;
};
