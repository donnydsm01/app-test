import { Injectable } from '@angular/core';
import { InMemoryDbService, RequestInfo } from 'angular-in-memory-web-api';
import { Observable } from 'rxjs';
import { Hero } from './heros/hero'; 

@Injectable({
  providedIn: 'root'
})
export class InMemoryDataService implements InMemoryDbService {

  constructor() { }
  createDb(){
    const heroes = [
      { id :12, name :'Dr. Nice' },
      { id :13, name :'Dr Doom' },
      { id :14, name :'Iron Man' },
      { id :15, name :'Natacha Romanov' },
      { id :16, name :'Captain America' },
      { id :17, name :'The Winter Soldier' },
      { id :18, name :'Falcon' },
      { id :19, name :'Black Panther' },
      { id :20, name :'Thor lord of thunders' },
    ];
    return {heroes};
  }

  genId(heroes :Hero[]):number{
    return heroes.length > 0 ? Math.max(...heroes.map(hero => hero.id)) +1 : 11;
  }
}
