import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MoviesComponent } from './movies/movies.component';
import { CookieService } from 'ngx-cookie-service';
import { MovieDetailsComponent } from './movie-details/movie-details.component';
import { EventEmitterService } from './event-emitter.service';
import { LoginComponent } from './login/login.component';

@NgModule({
  declarations: [
    AppComponent,
    MoviesComponent,
    MovieDetailsComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],   
  providers: [CookieService,EventEmitterService],
  bootstrap: [AppComponent]
})
export class AppModule { }
