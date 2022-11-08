import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DedicatedLoaderDirective } from './core/directives';
import { HttpLoaderInterceptor } from './core/interceptors';
import { LoaderTestComponent } from './loader-test/loader-test.component';

@NgModule({
  declarations: [AppComponent, LoaderTestComponent, DedicatedLoaderDirective],
  imports: [BrowserModule, AppRoutingModule, HttpClientModule],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpLoaderInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
