import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { PopularityGameComponent } from './components/popularity-game/popularity-game.component';
import { LoadingIndicatorComponent } from './loading/loading-indicator/loading-indicator.component';
import { DisplayLoadingIfUndefinedDirective } from './directives/display-loading-if-undefined.directive';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    PopularityGameComponent,
    LoadingIndicatorComponent,
    DisplayLoadingIfUndefinedDirective
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
