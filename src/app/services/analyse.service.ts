import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {map, Observable} from 'rxjs';
import {utilisateur} from './utilisateurs.service';
import {epreuve} from './epreuve.service';

export interface analyse{
  id:number,
  description:string,
  fkIdLaboratoire:number,
  nom:string,

}

@Injectable({
  providedIn: 'root',
})
export class AnalyseService {
  private apiUrl = 'http://localhost:8085/Analyse';

  constructor(private http: HttpClient) {
  }
  getAnalyses(): Observable<analyse[]> {
    return this.http.get<analyse[]>(this.apiUrl);
  }
getAnalyseById(id:number):Observable<epreuve[]> {
  return this.http.get<epreuve[]>(`${this.apiUrl}?id=${id}`);

}
  addanalyse(analyseData: analyse): Observable<analyse> {
    return this.http.post<analyse>(`${this.apiUrl}`, analyseData);
  }
  deteleanalyse(id:number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
