import { Component, OnInit } from '@angular/core';
import { EventEmitterService } from '../event-emitter.service';  
import { Movie } from '../movie'; 
import { ThemoviedbService } from '../services/themoviedb.service';

@Component({
  selector: 'app-movie-details',
  templateUrl: './movie-details.component.html',
  styleUrls: ['./movie-details.component.css']
})
export class MovieDetailsComponent implements OnInit {
  movie:Movie;
  comentarios:any;
  user:any;

  constructor(private eventEmitterService: EventEmitterService,private callApiRest:ThemoviedbService) { 
    this.movie={idMovie:0,id:0,score:1,favorite:0,metaData:{adult: true,
      backdrop_path: "",
      genre_ids: [1,2],
      id: 1,
      original_language: "",
      original_title: "",
      overview: "",
      popularity: 1,
      poster_path: "",
      release_date: "",
      title: "",
      video: true,
      vote_average: 1,
      vote_count: 1,}};
      this.user=callApiRest.getToken();
      this.comentarios=[];
  }
  ngOnInit(): void {
    this.eventEmitterService.subsVar = this.eventEmitterService.    
    invokeFirstComponentFunction.subscribe((_movie:any) => {    
      this.movie=_movie; 
      this.getComentarios(); 
    }); 
  }
  getComentarios():void{
    /** solicitar comentarios */
    if(this.movie.idMovie>0){
      var params={module:'',
        method:'getComments',
        idMovie:this.movie.idMovie
      };
      this.callApiRest.callService(params).subscribe(res => (this.comentarios=res));
    }
  }
  setScore():void{
    console.warn($('#selectScore').val());
    var params={module:'',
      method:'saveScore',
      idMovie:this.movie.idMovie,
      idUser:this.user,
      score:$('#selectScore').val()
    };
    this.callApiRest.callService(params).subscribe(res => (this.responseScore(res)));
  }  
  responseScore(res:any){
    if(res.code==1){
      this.movie.score=res.score;
    }
  }
  saveComment():void{
    $( "#formComment" ).submit(function( event ) {
      event.preventDefault();
    }); 
    console.warn($('#textComentario').val());
    var params={module:'',
      method:'saveComments',
      idMovie:this.movie.idMovie,
      idUser:this.user,
      text:$('#textComentario').val()
    };
    this.callApiRest.callService(params).subscribe(res => (this.responseComentario(res)));
  }
  responseComentario(res:any){
    if(res.code==1){
      this.comentarios.push(res);
    }
  }
  closeDetails():void{
    $('#modalLayoutItem').hide();
  }

  addFavorites():void{
    var params={module:'',
      method:'saveFavorite',
      idMovie:this.movie.idMovie,
      idUser:this.user
    };
    this.callApiRest.callService(params).subscribe(res => (this.responseFavorites(res)));
  }
  responseFavorites(res:any){
    if(res.code==1){
      this.movie.favorite=1;
    }
  }

}
