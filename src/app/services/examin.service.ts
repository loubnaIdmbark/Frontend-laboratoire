import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http' ;
import {Observable} from 'rxjs';
import {epreuve} from './epreuve.service';

export interface examin{
  id:number;
  fkIdEpreuve:number;
  fkIdTestAnalyse:number;
  resultat:number;
  fkNumDossier:number;

}
@Injectable({
  providedIn: 'root',
})
export class serviceExamin{
  private ApiUrl = 'http://localhost:8086/Examin';
  constructor(private http: HttpClient) {
  }

  getExamins(): Observable<examin[]> {
    return this.http.get<examin[]>(`${this.ApiUrl}`);
  }

  addExamin(examinData: { fkIdEpreuve: any; fkNumDossier: number; resultat: any; fkIdAnalyse: any }): Observable<examin> {
    return this.http.post<examin>(`${this.ApiUrl}`, examinData);
  }
  deleteExamin(id:number):Observable<void> {
    return this.http.delete<void>(`${this.ApiUrl}/${id}`);
  }
}
