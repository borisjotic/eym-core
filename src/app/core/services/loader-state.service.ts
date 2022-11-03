import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, skip } from 'rxjs/operators';
import { HeaderName } from 'src/app/shared/enums';
import { LoaderHeader } from 'src/app/shared/models';

@Injectable({
  providedIn: 'root',
})
export class LoaderStateServiceService {
  private mainLoaderState$ = new BehaviorSubject<number>(0);
  private dedicatedLoaderState$ = new BehaviorSubject<string[]>([]);

  //#region Getters for main/dedicated loader

  public get showMainLoader$(): Observable<boolean> {
    return this.mainLoaderState$.asObservable().pipe(
      skip(1), // we're not interested in the default state
      map((currentState: number) => currentState !== 0)
    );
  }

  public get dedicatedLoaders$(): Observable<string[]> {
    return this.dedicatedLoaderState$.asObservable();
  }

  public dedicatedLoaderFor(key: string): Observable<boolean> {
    return this.dedicatedLoaders$.pipe(
      map((keys: string[]) => keys.indexOf(key) !== -1)
    );
  }

  //#endregion

  //#region Toggling methods

  public showMain(): void {
    let current = this.mainLoaderState$.getValue();

    this.mainLoaderState$.next(++current);
  }

  public hideMain(): void {
    let current = this.mainLoaderState$.getValue();

    this.mainLoaderState$.next(--current);
  }

  public showDedicatedFor(key: string): void {
    let current = this.dedicatedLoaderState$.getValue();

    this.dedicatedLoaderState$.next([...current, key]);
  }

  public hideDedicatedFor(key: string): void {
    let current = this.dedicatedLoaderState$.getValue();

    const index = current.indexOf(key);
    current.splice(index, 1);

    this.dedicatedLoaderState$.next(current);
  }

  //#endregion

  //#region Header utility methods

  public generateHeaderFor(names: HeaderName[]): LoaderHeader {
    const output: LoaderHeader = {};

    const nonDefaultValues = new Map<HeaderName, string>([
      [
        HeaderName.showDedicatedLoader,
        `present-and-unique-key-${Math.random()}`, // @ervin: maybe Math.random() isn't unique enough?
      ],
    ]);

    for (let headerName of names) {
      output[headerName] = nonDefaultValues.get(headerName) ?? 'present';
    }

    return output;
  }

  public initLoaderForDedicatedHeader(): [LoaderHeader, Observable<boolean>] {
    const header = this.generateHeaderFor([HeaderName.showDedicatedLoader]);

    return [
      header,
      this.dedicatedLoaderFor(header[HeaderName.showDedicatedLoader]),
    ];
  }

  //#endregion
}
