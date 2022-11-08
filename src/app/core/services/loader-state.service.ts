import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, skip } from 'rxjs/operators';
import { HeaderName } from 'src/app/shared/enums';
import { LoaderHeader } from 'src/app/shared/models';

type LoaderKeyTimeoutState = { [uniqueKey: string]: number };

// todo:
//  - navigation & tab change
//  - ngb-nav

@Injectable({
  providedIn: 'root',
})
export class LoaderStateService {
  //#region Class properties

  private readonly maxRequestLength = 61_000; // [ms];

  private mainLoaderState$ = new BehaviorSubject<LoaderKeyTimeoutState>({});
  private dedicatedLoaderState$ = new BehaviorSubject<LoaderKeyTimeoutState>(
    {}
  );

  //#endregion

  //#region Getters for main/dedicated loader

  public get showMainLoader$(): Observable<boolean> {
    return this.mainLoaderState$.asObservable().pipe(
      skip(1), // we're not interested in the default state
      map(
        (currentState: LoaderKeyTimeoutState) =>
          Object.keys(currentState).length !== 0
      )
    );
  }

  public get dedicatedLoaders$(): Observable<LoaderKeyTimeoutState> {
    return this.dedicatedLoaderState$.asObservable();
  }

  public dedicatedLoaderFor(key: string): Observable<boolean> {
    return this.dedicatedLoaders$.pipe(
      map((state: LoaderKeyTimeoutState) => key in state)
    );
  }

  //#endregion

  //#region Toggling methods

  public showMain(key?: string): string {
    if (!key) {
      key = this.generateUniqueKey();
    }
    this.modifyStateViaAdd(this.mainLoaderState$, key, 'main');

    return key;
  }

  public hideMain(key: string): void {
    this.modifyStateViaRmv(this.mainLoaderState$, key);
  }

  public showDedicatedFor(key: string): void {
    this.modifyStateViaAdd(this.dedicatedLoaderState$, key, 'dedicated');
  }

  public hideDedicatedFor(key: string): void {
    this.modifyStateViaRmv(this.dedicatedLoaderState$, key);
  }

  //#endregion

  //#region Header utility methods

  public generateHeaderFor(names: HeaderName[]): LoaderHeader {
    const output: LoaderHeader = {};

    const nonDefaultValues = new Map<HeaderName, string>([
      [HeaderName.showDedicatedLoader, this.generateUniqueKey()],
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

  //#region State utility methods

  private modifyStateViaAdd(
    state$: BehaviorSubject<LoaderKeyTimeoutState>,
    key: string,
    state: 'main' | 'dedicated' = 'main'
  ): LoaderKeyTimeoutState {
    const current = state$.getValue();

    current[key] = window.setTimeout(
      () =>
        state === 'main' ? this.hideMain(key) : this.hideDedicatedFor(key),
      this.maxRequestLength
    );

    state$.next(current);

    return current;
  }

  private modifyStateViaRmv(
    state$: BehaviorSubject<LoaderKeyTimeoutState>,
    key: string
  ): LoaderKeyTimeoutState {
    const current = state$.getValue();

    if (current[key]) {
      window.clearTimeout(current[key]);
      delete current[key];

      state$.next(current);
    }

    return current;
  }

  //#endregion

  //#region Utility methods

  public generateUniqueKey(): string {
    return `present-and-unique-key-${Date.now() + Math.random()}`;
  }

  //#endregion
}
