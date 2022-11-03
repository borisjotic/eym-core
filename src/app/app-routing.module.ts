import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoaderTestComponent } from './loader-test/loader-test.component';

const routes: Routes = [
  {
    path: 'feat/loader-interceptor-service',
    component: LoaderTestComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
