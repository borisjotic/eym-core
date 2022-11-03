import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoaderTestComponent } from './loader-test.component';

describe('LoaderTestComponent', () => {
  let component: LoaderTestComponent;
  let fixture: ComponentFixture<LoaderTestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoaderTestComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoaderTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
