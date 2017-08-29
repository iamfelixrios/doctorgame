import { Injectable } from '@angular/core';
import { Headers, Http, Response } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { driveUrl } from './app.globals';

@Injectable()
export class DataService {

  datos = [];
  generos = ['Todos'];

  constructor(private http: Http) { }

  getGames(): Promise<Array<Object>> {
    return this.http
      .get(driveUrl)
      .toPromise()
      .then((response) => {
        this.datos = response.json().feed.entry;
        // Collect genres
        for (var juego of this.datos) {
          if (this.generos.indexOf(juego.gsx$tipo.$t) < 0)
            this.generos.push(juego.gsx$tipo.$t);
        }
      })
      .catch(this.handleError);
  }

  getGenres() {
    return this.generos;
  }

  searchGames(genre, age, duration, numPlayers) {
    let resultado = [];
    for (var juego of this.datos) {
      let doesMatch = true;
      // generos
      if (genre && genre !== 'Todos') {
        if (juego.gsx$tipo.$t !== genre) doesMatch = false;
      }
      // edad
      if (age) {
        if (age < Number(juego.gsx$edadmínima.$t)) doesMatch = false;
      }
      // duration
      if (duration) {
        if (duration < Number(juego.gsx$tiempominimo.$t)) doesMatch = false;
      }
      //num jugadores
      if (numPlayers) {
        if (numPlayers < juego.gsx$minimojugadores.$t || numPlayers > juego.gsx$maxjugadores.$t) doesMatch = false;
      }
      // Veredict?
      if (doesMatch) resultado.push(juego);
    }
    console.log(resultado);
    return resultado;
  }

  private handleError(error: any): Promise<any> {
    console.error('Error obteniendo data de Google Drive', error);
    return Promise.reject(error.message || error);
  }
}
