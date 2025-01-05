import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http' ;
import {Observable} from 'rxjs';
import {epreuve} from './epreuve.service';

export interface examin{
  fkIdEpreuve:number;
  fkIdTestAnalyse:number;
  resultat:number;
  fkNumDossier:Date;

}
@Injectable({
  providedIn: 'root',
})
export class serviceExamin{
  private ApiUrl = 'http://localhost:8086/examins';
  constructor(private http: HttpClient) {
  }
  getExamins(): Observable<examin[]> {
    return this.http.get<examin[]>(this.ApiUrl);
  }

  addExamin(examinData: { fkIdEpreuve: any; resultat: any; fkIdTestAnalyse: any }): Observable<examin> {
    return this.http.post<examin>(`${this.ApiUrl}`, examinData);
  }
}
