import { TestBed } from '@angular/core/testing';

import { LoaderStateServiceService } from './loader-state.service';

describe('LoaderStateServiceService', () => {
  let service: LoaderStateServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoaderStateServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
