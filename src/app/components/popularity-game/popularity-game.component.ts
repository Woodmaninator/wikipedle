import { Component } from '@angular/core';
import { forkJoin, map } from 'rxjs';
import { wikiArticles } from 'src/app/data/wiki-article-data';
import { WikiArticle } from 'src/app/domain/wiki-article';
import { HighscoreService } from 'src/app/services/highscore.service';
import { WikipediaApiService } from 'src/app/services/wikipedia-api.service';

@Component({
  selector: 'wp-popularity-game',
  templateUrl: './popularity-game.component.html',
  styleUrls: ['./popularity-game.component.css'],
})
export class PopularityGameComponent {
  option1?: WikiArticle = undefined;
  option2?: WikiArticle = undefined;

  chosenOption: number = 0;
  correctOption: number = 0;

  notificationText: string = 'Which article is more popular?';
  score: number = 0;
  highscore: number = 0;
  over = false;

  showShare = false;
  shareText = '';

  constructor(
    private apiService: WikipediaApiService,
    private highscoreService: HighscoreService
  ) {
    this.initializeOptions();
    this.initializeHighscore();
  }

  optionClicked(
    chosenOption: number,
    option1?: WikiArticle,
    option2?: WikiArticle
  ) {
    if (!this.over && option1 != undefined && option2 != undefined) {
      this.chosenOption = chosenOption;
      let correctOption: number;
      if (chosenOption === 1) {
        correctOption = option1.averageViews >= option2.averageViews ? 1 : 2;
      } else {
        correctOption = option2.averageViews >= option1.averageViews ? 2 : 1;
      }

      if (this.chosenOption === correctOption) {
        this.notificationText = 'Correct!';
        this.score++;
      } else {
        this.notificationText =
          'Game Over! You scored ' + this.score + ' points.';
        this.setShareText(this.score);
        this.score = 0;
        this.showShare = true;
      }
      this.correctOption = correctOption;
      this.updateHighscore(this.score);
      this.over = true;
    }
  }

  option1Clicked() {
    this.optionClicked(1, this.option1, this.option2);
  }

  option2Clicked() {
    this.optionClicked(2, this.option1, this.option2);
  }

  initializeOptions() {
    this.showShare = false;
    this.option1 = undefined;
    this.option2 = undefined;

    this.chosenOption = 0;
    this.correctOption = 0;

    let articles = wikiArticles;

    let randomIndex1 = Math.floor(Math.random() * articles.length);
    let randomIndex2 = Math.floor(Math.random() * articles.length);

    let tempOption1 = articles[randomIndex1];
    let tempOption2 = articles[randomIndex2];

    while (
      randomIndex1 == randomIndex2 ||
      Math.abs(tempOption1.averageViews - tempOption2.averageViews) < 500
    ) {
      randomIndex2 = Math.floor(Math.random() * articles.length);

      tempOption2 = articles[randomIndex2];
    }

    let observables = [
      this.apiService.fillWikiArticleWithActualInformation(tempOption1),
      this.apiService.fillWikiArticleWithActualInformation(tempOption2),
    ];

    forkJoin(observables)
      .pipe(
        map(([o1, o2]) => {
          return {
            option1: o1,
            option2: o2,
          };
        })
      )
      .subscribe((res: any) => {
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
    if (score > currentHighscore) {
      this.highscoreService.setHighscore(score);
      this.highscore = score;
    }
  }

  private setShareText(score: number) {
    if (score == 1)
      this.shareText =
        'I scored ' +
        this.score +
        ' point in Wikipedle! https://woodmaninator.github.io/wikipedle';
    else
      this.shareText =
        'I scored ' +
        this.score +
        ' points in Wikipedle! https://woodmaninator.github.io/wikipedle';
  }

  share() {
    //Copy the a text to the clipboard
    navigator.clipboard.writeText(this.shareText);
  }
}
