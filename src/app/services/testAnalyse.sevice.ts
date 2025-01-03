import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {map, Observable} from 'rxjs';
import {analyse} from './analyse.service';
export interface testAnalyse {
  id: number;
  nomTest: string;
  sousEpreuve: string;
  intervalMinDeReference: number;
  intervalMaxDeReference: number;
  uniteDeReference: string;
  details?: string;
  analyseId: number;
  epreuveId:number;
}
@Injectable({
  providedIn: 'root',
})

export class testAnalyse{
  private apiUrl = 'http://localhost:8085/testAnalyse';
  constructor(private http: HttpClient) {
  }

  gettestAnalyses(): Observable<testAnalyse[]> {
    return this.http.get<testAnalyse[]>(this.apiUrl);
  }

  addtestdanalyse(testAnalyseData: testAnalyse): Observable<testAnalyse> {
    return this.http.post<testAnalyse>(`${this.apiUrl}`, testAnalyseData);
  }

}
