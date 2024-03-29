import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { Observable, catchError, from, map, of, switchMap } from 'rxjs';
import { RandomArticle } from '../domain/random-article';
import { WikiArticle } from '../domain/wiki-article';

@Injectable({
  providedIn: 'root',
})
export class WikipediaApiService {
  constructor(private http: HttpClient) {}

  private errorHandler(error: Error | any): Observable<any> {
    console.log(error);
    return of(null);
  }

  getRandomArticles(numberOfArticles: number): Observable<RandomArticle[]> {
    return this.http
      .get(
        environment.wikipediaApiUrl +
          '?action=query&format=json&list=random&rnlimit=' +
          numberOfArticles +
          '&rnnamespace=0&origin=*'
      )
      .pipe(
        map<any, RandomArticle[]>((res) => {
          let randomArticles: RandomArticle[] = [];

          res.query.random.forEach((element: any) => {
            randomArticles.push(
              new RandomArticle(element.id, element.title, element.ns)
            );
          });

          return randomArticles;
        }),
        catchError(this.errorHandler)
      );
  }

  getPageViewsForArticles(
    articleIds: number[],
    recentDays: number
  ): Observable<any> {
    return this.http
      .get(
        environment.wikipediaApiUrl +
          '?action=query&format=json&prop=pageviews&origin=*&pageids=' +
          articleIds.join('|') +
          '&pvipdays=' +
          recentDays
      )
      .pipe(
        map<any, any>((res) => res),
        catchError(this.errorHandler)
      );
  }

  getDescriptionForPage(pageId: number): Observable<string> {
    return this.http
      .get(
        environment.wikipediaApiUrl +
          '?action=query&format=json&prop=extracts&exchars=200&exintro&explaintext&origin=*&pageids=' +
          pageId
      )
      .pipe(
        map<any, string>((res: any) => {
          return res.query.pages[pageId.toString()].extract;
        }),
        catchError(this.errorHandler)
      );
  }

  getImageForPage(pageId: number): Observable<string> {
    const imageWidth = 400;

    return this.http
      .get(
        environment.wikipediaApiUrl +
          '?action=query&format=json&prop=pageimages&origin=*&pithumbsize=' +
          imageWidth +
          '&pageids=' +
          pageId
      )
      .pipe(
        map<any, string>((res: any) => {
          if (res.query.pages[pageId.toString()].thumbnail) {
            return res.query.pages[pageId.toString()].thumbnail.source;
          } else {
            return '';
          }
        })
      );
  }

  fillWikiArticleWithActualInformation(
    wikiArticle: WikiArticle
  ): Observable<WikiArticle> {
    return this.getDescriptionForPage(wikiArticle.id)
      .pipe(
        map<string, WikiArticle>((description: string) => {
          wikiArticle.description = description;
          wikiArticle.imageUrl = '';
          return wikiArticle;
        })
      )
      .pipe(
        switchMap((wikiArticle: WikiArticle) => {
          return this.getImageForPage(wikiArticle.id).pipe(
            map<string, WikiArticle>((imageUrl: string) => {
              wikiArticle.imageUrl = imageUrl;
              return wikiArticle;
            })
          );
        })
      );
  }
}
