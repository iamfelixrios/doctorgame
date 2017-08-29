import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  searchGenre: string;
  searchAge: number;
  searchDuration: number;
  searchPlayers: number;

  isReady: boolean = false;
  genres = [];
  juegos = [];

  constructor(private dataService: DataService) { }

  ngOnInit() {
    this.dataService.getGames().then(
      () => { 
        this.genres = this.dataService.getGenres();
        this.isReady = true
        this.juegos = this.dataService.searchGames(undefined, undefined, undefined, undefined);
      }
    )
  }

  goSearch() {
    this.juegos = this.dataService.searchGames(this.searchGenre, this.searchAge, this.searchDuration, this.searchPlayers);
  }



}
