import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable} from 'rxjs';
import {analyse} from './analyse.service';

export interface TestAnalyse {
  id: number;
  nomTest: string;
  sousEpreuve: string;
  intervalMinDeReference: number;
  intervalMaxDeReference: number;
  uniteDeReference: string;
  details: string | null;
}

export interface epreuve {
  id: number;
  nom: string;
  testAnalyse?: TestAnalyse; // Ajout de la propriété testAnalyse
}
@Injectable({
  providedIn: 'root',
})

export class epreuveService{
  private apiUrl = 'http://localhost:8085/epreuve';
  constructor(private http: HttpClient) {
  }

  getepreuve(): Observable<epreuve[]> {
    return this.http.get<epreuve[]>(this.apiUrl);
  }
  getAllEpreuvesByIdAnalyse(id:number): Observable<epreuve[]> {
    return this.http.get<epreuve[]>(`${this.apiUrl}/byAnalyse/${id}`);
  }


  addepreuve(epreuveData: epreuve): Observable<epreuve> {
    return this.http.post<epreuve>(`${this.apiUrl}`, epreuveData);
  }

}
