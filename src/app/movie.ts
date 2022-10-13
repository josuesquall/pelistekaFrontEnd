export interface Movie {
      idMovie:number;
      id:number;
      score:number;
      favorite:number;
      metaData:{
        adult: boolean;
        backdrop_path: string;
        genre_ids: Array<number>;
        id: number;
        original_language: string;
        original_title: string;
        overview: string;
        popularity: number;
        poster_path: string;
        release_date: string;
        title: string;
        video: boolean;
        vote_average: number;
        vote_count: number;
  }
}
export const movies = [
      {
            idMovie:1,
            id:1,
            score:1,
            favorite:0,
            metaData:{
              adult: true,
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
              vote_count: 1,
        }
      },{
            idMovie:1,
            id:1,
            score:1,
            favorite:0,
            metaData:{
              adult: true,
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
              vote_count: 1,
        }
      }
];