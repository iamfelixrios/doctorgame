import { Injectable } from '@angular/core';
import { Headers, Http, Response } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { driveUrl } from './app.globals';

@Injectable()
export class DataService {

  datos = [];
  categorias = ['Todos'];
  generos = ['Todos'];

  constructor(private http: Http) { }

  getGames(): Promise<Array<Object>> {
    return this.http
      .get(driveUrl)
      .toPromise()
      .then((response) => {
        this.datos = response.json().feed.entry;
        // Collect categories
        for (var juego of this.datos) {
          if (juego.gsx$categoria.$t && this.categorias.indexOf(juego.gsx$categoria.$t) < 0)
            this.categorias.push(juego.gsx$categoria.$t);
        }
        this.categorias.sort();

        // Collect genres
        for (var juego of this.datos) {
          if (juego.gsx$mecanica1.$t && this.generos.indexOf(juego.gsx$mecanica1.$t) < 0)
            this.generos.push(juego.gsx$mecanica1.$t);
          if (juego.gsx$mecanica2.$t && this.generos.indexOf(juego.gsx$mecanica2.$t) < 0)
            this.generos.push(juego.gsx$mecanica2.$t);
          if (juego.gsx$mecanica3.$t && this.generos.indexOf(juego.gsx$mecanica3.$t) < 0)
            this.generos.push(juego.gsx$mecanica3.$t);
        }
        this.generos.sort();
      })
      .catch(this.handleError);
  }

  getGenres() {
    return this.generos;
  }

  getCategories() {
    return this.categorias;
  }

  searchGames(genre, category, age, duration, numPlayers) {
    let resultado = [];
    for (var juego of this.datos) {
      let doesMatch = true;
      // generos
      if (genre && genre !== 'Todos') {
        if (juego.gsx$mecanica1.$t !== genre && juego.gsx$mecanica2.$t !== genre && juego.gsx$mecanica3.$t !== genre)
          doesMatch = false;
      }
      // category
      if (category && category !== 'Todos') {
        if (juego.gsx$categoria.$t !== category)
          doesMatch = false;
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
