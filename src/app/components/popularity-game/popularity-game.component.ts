import { Component } from '@angular/core';
import { forkJoin, map } from 'rxjs';
import { wikiArticles } from 'src/app/data/wiki-article-data';
import { WikiArticle } from 'src/app/domain/wiki-article';
import { HighscoreService } from 'src/app/services/highscore.service';
import { WikipediaApiService } from 'src/app/services/wikipedia-api.service';

@Component({
  selector: 'wp-popularity-game',
  templateUrl: './popularity-game.component.html',
  styleUrls: ['./popularity-game.component.css']
})
export class PopularityGameComponent {

  option1?: WikiArticle = undefined;
  option2?: WikiArticle = undefined;

  option1Chosen = false;
  option2Chosen = false;
  
  notificationText: string = 'Which article is more popular?';
  score: number = 0;
  highscore: number = 0;
  over = false;

  constructor(
    private apiService: WikipediaApiService,
    private highscoreService: HighscoreService) {
    this.initializeOptions();
    this.initializeHighscore();
  }

  option1Clicked() {
    if(!this.over && this.option1 != undefined && this.option2 != undefined) {
      this.option1Chosen = true;
      if(this.option1.averageViews >= this.option2.averageViews) {
        this.notificationText = 'Correct!';
        this.score++;
      } else {
        this.notificationText = 'Game Over! You scored ' + this.score + ' points.';
        this.score = 0;
      }
      this.updateHighscore(this.score);
      this.over = true;
    }
  }

  option2Clicked() {
    if(!this.over && this.option1 != undefined && this.option2 != undefined) {
      this.option2Chosen = true;
      if(this.option2.averageViews >= this.option1.averageViews) {
        this.notificationText = 'Correct!';
        this.score++;
      } else {
        this.notificationText = 'Game Over! You scored ' + this.score + ' points.';
        this.score = 0;
      }
      this.updateHighscore(this.score);
      this.over = true;
    }
  }

  initializeOptions() {
    this.option1 = undefined;
    this.option2 = undefined;

    this.option1Chosen = false;
    this.option2Chosen = false;

    let articles = wikiArticles;

    let randomIndex1 = Math.floor(Math.random() * articles.length);
    let randomIndex2 = Math.floor(Math.random() * articles.length);

    let tempOption1 = articles[randomIndex1];
    let tempOption2 = articles[randomIndex2];

    while(randomIndex1 == randomIndex2 || Math.abs(tempOption1.averageViews - tempOption2.averageViews) < 500) {
      randomIndex2 = Math.floor(Math.random() * articles.length);
    
      tempOption2 = articles[randomIndex2];
    }

    let observables = [
      this.apiService.fillWikiArticleWithActualInformation(tempOption1),
      this.apiService.fillWikiArticleWithActualInformation(tempOption2)
    ];

    forkJoin(observables).pipe(map(([o1, o2]) => {
      return {
        option1: o1,
        option2: o2
      };
    })).subscribe((res: any) => {
      this.option1 = res.option1;
      this.option2 = res.option2;
      this.over = false;
      this.notificationText = 'Which article is more popular?';
    });
  }

  private initializeHighscore() {
    this.highscore = this.highscoreService.getHighscore();
  }

  private updateHighscore(score: number) {
    const currentHighscore = this.highscoreService.getHighscore();
    if(score > currentHighscore) {
      this.highscoreService.setHighscore(score);
      this.highscore = score;
    }
  }
}
