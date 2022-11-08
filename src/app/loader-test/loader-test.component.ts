import { HttpClient } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { Observable } from 'rxjs';
import { LoaderStateService } from '../core/services/loader-state.service';
import { HeaderName } from '../shared/enums';
import { LoaderHeader } from '../shared/models';

@Component({
  selector: 'app-loader-test',
  templateUrl: './loader-test.component.html',
  styleUrls: ['./loader-test.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoaderTestComponent implements OnInit {
  //#region Don't do this at home
  public mainState$ = this.loaderStateService['mainLoaderState$'];
  public dedicatedState$ = this.loaderStateService['dedicatedLoaderState$'];
  //#endregion

  public loader$ = this.loaderStateService.showMainLoader$;
  public dedicatedLoader$: Observable<boolean>;

  private dedicatedHeader: LoaderHeader;

  constructor(
    private httpClient: HttpClient,
    private loaderStateService: LoaderStateService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // just test loaders
    // setTimeout(() => this.initFakeLoaders(), 1_500);

    // test main loader
    // setTimeout(() => this.initMainLoader(), 3_000);

    // test dedicated loader
    // setTimeout(
    //   () => this.initDedicatedHeaderLoader().initDedicatedLoader(),
    //   3_500
    // );

    // test w/o loader
    // setTimeout(() => this.initRequestWithoutLoader(), 4_500);
  }

  //#region Init methods

  private initFakeLoaders(): this {
    const dedicatedLoaderKey = 'lorem-ipsum';
    const mainLoaderKey = 'aaaaaa';

    this.loaderStateService.showMain(mainLoaderKey);
    this.loaderStateService.showDedicatedFor(dedicatedLoaderKey);
    this.dedicatedLoader$ =
      this.loaderStateService.dedicatedLoaderFor(dedicatedLoaderKey);

    setTimeout(() => {
      this.loaderStateService.hideMain(mainLoaderKey);
    }, 500);
    setTimeout(
      () => this.loaderStateService.hideDedicatedFor(dedicatedLoaderKey),
      700
    );

    return this;
  }

  private initRequestWithoutLoader(): this {
    this.dedicatedHeader = this.loaderStateService.generateHeaderFor([
      HeaderName.userIgnoredLoader,
    ]);

    this.httpClient
      .get('http://dev.qposoft.com:4082/api/users', {
        headers: this.dedicatedHeader,
      })
      .subscribe(console.log);

    return this;
  }

  private initDedicatedLoader(): this {
    const uniqueId = this.loaderStateService.generateUniqueKey();
    this.dedicatedLoader$ =
      this.loaderStateService.dedicatedLoaderFor(uniqueId);

    this.httpClient
      // .get('http://dev.qposoft.com:4082/api/users', {
      .get('http://dev.qposoft.com:4082/api/sleep/3', {
        headers: {
          [HeaderName.showDedicatedLoader]: uniqueId,
        },
      })
      .subscribe(console.log);

    return this;
  }

  private initDedicatedHeaderLoader(): this {
    return this;
    [this.dedicatedHeader, this.dedicatedLoader$] =
      this.loaderStateService.initLoaderForDedicatedHeader();

    /**
     * HEADS UP:
     * Because of the "changeDetection: ChangeDetectionStrategy.OnPush"
     * inside component decorator, above line is updated property that
     * is used inside tpl, and we need to manually trigger update.
     * When we remove OnPush this isn't the case.
     * But, IMHO there is no need to worry about this code, because,
     * as Nebojsa suggested, we should create directive for dedicated loader,
     * so this piece of code will be part only of that directive, and it should
     * receive as @input value for showing/hiding dedicated loader.
     */
    this.cdr.detectChanges();

    return this;
  }

  private initMainLoader(): this {
    this.httpClient
      .get('http://dev.qposoft.com:4082/api/sleep/5')
      .subscribe(console.log);

    return this;
  }

  //#endregion

  //#region UI events

  public async onTestMainLoader(): Promise<void> {
    this.initMainLoader();
  }

  //#endregion

  //#region Ad-hock dedicated loaders testing

  public dedicatedLoader1$: Observable<boolean>;
  public dedicatedLoader2$: Observable<boolean>;
  public async onTestDedicatedLoader(id: string): Promise<void> {
    const uniqueId = this.loaderStateService.generateUniqueKey() + id;
    if (id === '1') {
      this.dedicatedLoader1$ =
        this.loaderStateService.dedicatedLoaderFor(uniqueId);
    } else {
      this.dedicatedLoader2$ =
        this.loaderStateService.dedicatedLoaderFor(uniqueId);
    }

    this.httpClient
      // .get('http://dev.qposoft.com:4082/api/users', {
      .get('http://dev.qposoft.com:4082/api/sleep/3', {
        headers: {
          [HeaderName.showDedicatedLoader]: uniqueId,
        },
      })
      .subscribe(console.log);
  }

  //#endregion

  //#region Proposals on how to use dedicated loader

  public dedicatedLoaderVisible$: Observable<boolean>;

  public async onDedicatedLoaderEventProposal1(): Promise<void> {
    // prepare unique id
    const uniqueId = this.loaderStateService.generateUniqueKey();
    // prepare loader visibility Observable
    this.dedicatedLoaderVisible$ =
      this.loaderStateService.dedicatedLoaderFor(uniqueId);
    // make call
    this.httpClient
      .get('http://dev.qposoft.com:4082/api/sleep/3', {
        headers: {
          [HeaderName.showDedicatedLoader]: uniqueId,
        },
      })
      .subscribe(console.log);
  }

  public async onDedicatedLoaderEventProposal2(): Promise<void> {
    // prepare unique id
    const uniqueId = `some-random-and-unique-id-${Date.now()}`;
    // prepare loader visibility Observable
    this.dedicatedLoaderVisible$ =
      this.loaderStateService.dedicatedLoaderFor(uniqueId);
    // make call
    this.httpClient
      .get('http://dev.qposoft.com:4082/api/sleep/3', {
        headers: {
          [HeaderName.showDedicatedLoader]: uniqueId,
        },
      })
      .subscribe(console.log);
  }

  public async onDedicatedLoaderEventProposal3(): Promise<void> {
    // prepare header and unique id
    const headers = this.loaderStateService.generateHeaderFor([
      HeaderName.showDedicatedLoader,
    ]);
    // prepare visibility Observable
    this.dedicatedLoaderVisible$ = this.loaderStateService.dedicatedLoaderFor(
      headers[HeaderName.showDedicatedLoader]
    );
    // make call
    this.httpClient
      .get('http://dev.qposoft.com:4082/api/sleep/3', {
        headers,
      })
      .subscribe(console.log);
  }

  public async onDedicatedLoaderEventProposal4(): Promise<void> {
    // prepare header, unique id and visibility Observable
    let headers = {};
    [headers, this.dedicatedLoaderVisible$] =
      this.loaderStateService.initLoaderForDedicatedHeader();
    // make call
    this.httpClient
      .get('http://dev.qposoft.com:4082/api/sleep/3', {
        headers,
      })
      .subscribe(console.log);
  }

  //#endregion
}
