import { Component } from '@angular/core';
import { ThemoviedbService } from './services/themoviedb.service';
import { Router } from '@angular/router';
declare var core: any;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: []
})
export class AppComponent  {
  title = 'pelisteka';
  user:any;
  constructor(private callApiRest:ThemoviedbService,  public router: Router){
    this.user=callApiRest.getToken();
  }
  
  
  OpenLogIn(){
    $('#modalLayoutLogin').show();
    $('#contentFormLogIn').show();
  }
  CloseLogIn(){
    $('#modalLayoutLogin').hide();
    $('#contentFormLogIn').hide();
  }
  /** Sign In */
  SetSignIn(){
      $( "#formSetSignIn" ).submit(function( event ) {
        event.preventDefault();
      }); 
      var params=core.uritojson($('#formSetSignIn').serialize());
			params.method='singin';
      if(params.email.length>0 && params.password.length>0 && params.name.length>0){
          $('.modalLoading').show();
          this.callApiRest.callService(params).subscribe(moviesRes => (this.singinRes(moviesRes)));
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
  singinRes(res: any){
      console.warn(res);	
      $('.modalLoading').hide();
      if(res.code==1){
        $('#contentFormRegistro').html('<p>Hemos enviado un mensaje a su cuenta de correo, confirme su cuenta en el link que encontrara en el mensaje enviado para continuar, es importante que confirme mediante el link para terminar de activar la cuenta.</p>');
        this.CloseRegistro();
      } else {
        $('#resSignInMsj').html('<p>'+res.msj+'</p>'+'<p>Se han encontrado problemas para registrar estos datos, por favor contacta con soporte enviando un correo a soporte@nirvaria.com</p>');
      }	
  }

  politicasPrivacidad(){
    window.location.reload();
  }
  
}

