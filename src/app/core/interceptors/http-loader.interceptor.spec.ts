import { TestBed } from '@angular/core/testing';

import { HttPLoaderInterceptor } from './http-loader.interceptor';

describe('HttLoaderInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      HttPLoaderInterceptor
      ]
  }));

  it('should be created', () => {
    const interceptor: HttPLoaderInterceptor = TestBed.inject(HttPLoaderInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
