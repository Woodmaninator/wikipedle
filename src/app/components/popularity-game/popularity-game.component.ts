import { Component } from '@angular/core';
import { wikiArticles } from 'src/app/data/wiki-article-data';
import { WikiArticle } from 'src/app/domain/wiki-article';
import { WikipediaApiService } from 'src/app/services/wikipedia-api.service';

@Component({
  selector: 'wp-popularity-game',
  templateUrl: './popularity-game.component.html',
  styles: [
  ]
})
export class PopularityGameComponent {

  option1?: WikiArticle = undefined;
  option2?: WikiArticle = undefined;
  
  notificationText: string = 'Which article is more popular?';
  score: number = 0;
  over = false;

  constructor(private apiService: WikipediaApiService) {
    this.initializeOptions();
  }

  option1Clicked() {
    if(this.option1 != undefined && this.option2 != undefined) {
      if(this.option1.averageViews >= this.option2.averageViews) {
        this.notificationText = 'Correct!';
        this.score++;
      } else {
        this.notificationText = 'Game Over! You scored ' + this.score + ' points.';
        this.score = 0;
      }
      this.over = true;
    }
  }

  option2Clicked() {
    if(this.option1 != undefined && this.option2 != undefined) {
      if(this.option2.averageViews >= this.option1.averageViews) {
        this.notificationText = 'Correct!';
        this.score++;
      } else {
        this.notificationText = 'Game Over! You scored ' + this.score + ' points.';
        this.score = 0;
      }
      this.over = true;
    }
  }

  initializeOptions() {
    this.option1 = undefined;
    this.option2 = undefined;

    let articles = wikiArticles;

    let randomIndex1 = Math.floor(Math.random() * articles.length);
    let randomIndex2 = Math.floor(Math.random() * articles.length);

    while(randomIndex1 == randomIndex2) {
      randomIndex2 = Math.floor(Math.random() * articles.length);
    }

    this.option1 = articles[randomIndex1];
    this.option2 = articles[randomIndex2];

    this.over = false;
    this.notificationText = 'Which article is more popular?';
  }
}
