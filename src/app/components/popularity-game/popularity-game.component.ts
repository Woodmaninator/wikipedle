import { Component } from '@angular/core';
import { WikipediaApiService } from 'src/app/services/wikipedia-api.service';

@Component({
  selector: 'wp-popularity-game',
  templateUrl: './popularity-game.component.html',
  styles: [
  ]
})
export class PopularityGameComponent {
  constructor(private apiService: WikipediaApiService) {
    this.apiService.getRandomArticles(50).subscribe(res => {
      console.log(res);

      let articleIds: number[] = [];
      res.forEach(article => {
        articleIds.push(article.id);
      });

      this.apiService.getPageViewsForArticles(articleIds, 30).subscribe(res2 => {
        console.log(res2);
      });
    });	
  }
}
