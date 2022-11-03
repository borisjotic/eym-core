import { HttpClient } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { Observable } from 'rxjs';
import { LoaderStateServiceService } from '../core/services/loader-state.service';
import { HeaderName } from '../shared/enums';
import { LoaderHeader } from '../shared/models';

@Component({
  selector: 'app-loader-test',
  templateUrl: './loader-test.component.html',
  styleUrls: ['./loader-test.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoaderTestComponent implements OnInit {
  public loader$ = this.loaderStateService.showMainLoader$;
  public dedicatedLoader$: Observable<boolean>;

  private dedicatedHeader: LoaderHeader;

  constructor(
    private httpClient: HttpClient,
    private loaderStateService: LoaderStateServiceService,
    private cdr: ChangeDetectorRef
  ) {}
  //http://dev.qposoft.com:4082/api/users

  ngOnInit(): void {
    // just test loaders
    setTimeout(() => this.initFakeLoaders(), 1_500);

    // test main loader
    setTimeout(() => this.initMainLoader(), 3_000);

    // test dedicated loader
    setTimeout(
      () => this.initDedicatedHeaderLoader().initDedicatedLoader(),
      3_500
    );

    // test w/o loader
    setTimeout(() => this.initRequestWithoutLoader(), 4_500);
  }

  private initFakeLoaders(): this {
    const dedicatedLoaderKey = 'lorem-ipsum';

    this.loaderStateService.showMain();
    this.loaderStateService.showDedicatedFor(dedicatedLoaderKey);
    this.dedicatedLoader$ =
      this.loaderStateService.dedicatedLoaderFor(dedicatedLoaderKey);

    setTimeout(() => {
      this.loaderStateService.hideMain();
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
    this.httpClient
      .get('http://dev.qposoft.com:4082/api/users', {
        headers: this.dedicatedHeader,
      })
      .subscribe(console.log);

    return this;
  }

  private initDedicatedHeaderLoader(): this {
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
      .get('http://dev.qposoft.com:4082/api/users')
      .subscribe(console.log);

    return this;
  }
}
