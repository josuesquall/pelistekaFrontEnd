import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { CookieService } from "ngx-cookie-service";
import { Movie } from '../movie';
import { Observable, Subscriber } from "rxjs";
import { subscribeOn } from 'rxjs-compat/operator/subscribeOn';


@Injectable({
  providedIn: 'root'
})
export class ThemoviedbService {
  
  constructor(private http: HttpClient, private cookies: CookieService) {
  }

  callService(params: any):Observable<any>{
    const httpOptions = {
      headers: new HttpHeaders({
          'Authorization': 'Basic my-token' ,
          'Content-Type':'application/json',
          'Access-Control-Allow-Origin':'*'
      })
    };
    var subs:Observable<any>;
    var script='https://pelisteka.nirvaria';
    var datos='';
    subs=this.http.get<any>(script+datos);
    params.requestMethod = params.requestMethod || 'POST';
    params.module = params.module || '';
    if(params.requestMethod=='GET'){
			var datos = jQuery.param(params);
      subs=this.http.get<any>(script+datos);
		} 
		if(params.requestMethod=='POST'){
			var datos = JSON.stringify(params);
      subs=this.http.post<any>(script,datos,{});
		}
    return subs;
  }
  public getMovies(params: any): Observable<Movie> {
    var script='https://pelisteka.nirvaria';
    var datos='';
    var datos = JSON.stringify(params);
    return this.http.post<Movie>(script,datos,{});
  }

  setToken(user:any) {
    this.cookies.set("token", user.idUser);
  }
  getToken() {
    return this.cookies.get("token");
  }
  deleteToken(){
    this.cookies.delete("token");
  }
}
