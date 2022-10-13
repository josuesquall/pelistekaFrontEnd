import { Component, OnInit } from '@angular/core';
import { ThemoviedbService } from '../services/themoviedb.service';
import { Router } from '@angular/router';
declare var core: any;
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  user:any;
  constructor(private callApiRest:ThemoviedbService,  public router: Router) { 
    this.user=callApiRest.getToken();
  }

  ngOnInit(): void {
    this.user=this.callApiRest.getToken();
    console.warn(this.user);
  }

/** login */
GetLogin(){  
  $( "#formLogIn" ).submit(function( event ) {
    event.preventDefault();
  });   
  var params=core.uritojson($('#formLogIn').serialize());
  params.module='';
  params.method='login';
  if(params.email.length>0 && params.password.length>0){
    $('.modalLoading').show();
    this.callApiRest.callService(params).subscribe(moviesRes => (this.loginRes(moviesRes)));
  }
}
DownLogin(){
  if(this.user>0){
    this.callApiRest.deleteToken();
    window.location.reload();
    this.CloseLogIn();
  }
}
  
OpenLogIn(){
  $('#modalLayoutLogin').show();
  $('#contentFormLogIn').show();
}
CloseLogIn(){
  $('#modalLayoutLogin').hide();
  $('#contentFormLogIn').hide();
}
loginRes(res: any){
  console.warn(this);
  $('.modalLoading').hide();
  if(res.code==1){
    this.callApiRest.setToken(res.user);
    window.location.reload();
    this.CloseLogIn();
  } else {
    $('#resLoginMsj').html(res.msj);
  }	
}
OpenRegistro(){
  $('#modalLayoutRegistro').show();
  $('#contentFormRegistro').show();
}
CloseRegistro(){
  $('#modalLayoutRegistro').hide();
  $('#contentFormRegistro').hide();
}

}
