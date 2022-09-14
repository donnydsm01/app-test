import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { 
    catchError, 
    map, 
    tap } from 'rxjs/operators';

import { Hero } from './heros/hero';
import { HEROES } from './mock-heroes';
import { MessageService } from './message.service';


@Injectable({
  providedIn: 'root'
})
export class HeroService {

  private heroesUrl = 'api/heroes';

  constructor(private messageService : MessageService, private http : HttpClient) { }

      // this function allows to get all heroes
      // the function is now async because of the Observable.
      // These data come from the mock-heroes file , not from a server.

      getHeroes():Observable <Hero[]> {
        const heroes = of(HEROES);
        this.messageService.add('HeroService : fecthed heroes');
        return heroes; 
      }

      // Here data are coming from a "server", a fake database.

      getHeros() :Observable<Hero[]>{
        return this.http.get<Hero[]>(this.heroesUrl)
        .pipe(
          tap(_ => this.log('fetched heroes')),
          catchError(this.handleError<Hero[]>('getHeros',[]))
        );
      }

      private handleError<T>(operation = 'operation', result?: T) {
        return (error: any): Observable<T> => {
          console.error(error); 
          this.log(`${operation} failed: ${error.message}`);
          return of(result as T);
        };
      }

      // This function allows to get a single hero and it's an async function as well.
      
      /*getHero(id :number):Observable<Hero>{
        const hero = HEROES.find(h => h.id === id)!
        this.messageService.add(`HeroService : fetched hero id=${id}`);
        return of(hero);
      }*/

      // This function allows to get a single data from the server and not the mock heroes file

      getHero(id: number): Observable<Hero> {
        const url = `${this.heroesUrl}/${id}`;
        return this.http.get<Hero>(url).pipe(
          tap(_ => this.log(`fetched hero id=${id}`)),
          catchError(this.handleError<Hero>(`getHero id=${id}`))
        );
      }

    /** PUT: update the hero on the server */
    updateHero(hero: Hero): Observable<any> {
      return this.http.put(this.heroesUrl, hero, this.httpOptions).pipe(
        tap(_ => this.log(`updated hero id=${hero.id}`)),
        catchError(this.handleError<any>('updateHero'))
      );
    }

    httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    private log(message : string){
        this.messageService.add(`HeroService : ${message}`);
    }


    addHero(hero: Hero): Observable<Hero> {
      return this.http.post<Hero>(this.heroesUrl, hero, this.httpOptions).pipe(
        tap((newHero: Hero) => this.log(`added hero w/ id=${newHero.id}`)),
        catchError(this.handleError<Hero>('addHero'))
      );
    }

    deleteHero(id: number) : Observable<Hero> {
      
      const url = `${this.heroesUrl}/${id}`;

      return this.http.delete<Hero>(url,this.httpOptions)
      .pipe(
        tap(_ => this.log(`deleted hero id=${id}`)),
        catchError(this.handleError<Hero>('deleteHero'))
      );
    }

    searchHeroes(term : string): Observable<Hero[]>{
      if(!term.trim()){
        return of([]);
      }
      return this.http.get<Hero[]>(`${this.heroesUrl}/?name=${term}`).pipe(
        tap(x => x.length ?
           this.log(`found heroes matching "${term}"`) :
           this.log(`no heroes matching "${term}"`)),
        catchError(this.handleError<Hero[]>('searchHeroes', []))
      );
    }
}
