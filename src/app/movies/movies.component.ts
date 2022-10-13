import { Component, OnInit } from '@angular/core';
import { ThemoviedbService } from '../services/themoviedb.service';
import { Router } from '@angular/router';
import { EventEmitterService } from '../event-emitter.service';  

@Component({
  selector: 'app-movies',
  templateUrl: './movies.component.html',
  styleUrls: ['./movies.component.css']
})
export class MoviesComponent implements OnInit {
  movies:any;
  page:any;
  limit:any;
  term:any;
  constructor(private callApiRest:ThemoviedbService,  public router: Router, private eventEmitterService: EventEmitterService  ) {
    this.page=1;
    this.limit=30;
    this.term='';
  }

  ngOnInit(): void {
    var params={module:'',
      method:'getCatalogo',
      limit:this.limit,
      page:this.page,
      idUser:this.callApiRest.getToken()
    };
    this.callApiRest.getMovies(params).subscribe(moviesRes => (this.movies = moviesRes));
  }

  public movieDetails(item:any):void{
    this.eventEmitterService.onFirstComponentButtonClick(item);
    $('#modalLayoutItem').show();
  }

  searchMovies():void{
    this.limit=$('#slimit').val();
    this.term=$('#stitulo').val();
    var params={module:'',
      method:'getCatalogo',
      limit:this.limit,
      page:this.page,
      title:this.term,
      idUser:this.callApiRest.getToken()
    };
    this.callApiRest.getMovies(params).subscribe(moviesRes => (this.movies = moviesRes));
  }

}
