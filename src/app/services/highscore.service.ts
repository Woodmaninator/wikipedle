import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HighscoreService {

  constructor() { }

  getHighscore(): number {
    return parseInt(localStorage.getItem('highscore') ?? "0")
  }

  setHighscore(highscore: number) {
    localStorage.setItem('highscore', highscore.toString())
  }
}
