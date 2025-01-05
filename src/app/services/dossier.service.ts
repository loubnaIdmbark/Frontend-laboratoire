import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Observable} from 'rxjs';
import {patient} from './patient.service';

export interface dossier{
  numDossier:number;
  fkEmailUtilisateur:string;
  fkIdPatient:number;
  date:Date;

}


@Injectable({
  providedIn: 'root',
})
export class DossierService {
  private dossierApiUrl = 'http://localhost:8086/dossiers';
  private epreuveApiUrl = 'http://localhost:8085/epreuve';
  private testAnalyseApiUrl = 'http://localhost:8085/testAnalyse';

  constructor(private http: HttpClient) {
  }
  getDossiers(): Observable<dossier[]> {
    return this.http.get<dossier[]>(this.dossierApiUrl);
  }

  addDossier(DossierData: { date: string; fkIdPatient: number; fkEmailUtilisateur: string | null }):Observable<dossier> {
    return this.http.post<dossier>(`${this.dossierApiUrl}`, DossierData);
  }

  getDossierByCode(id: string): Observable<dossier> {
    return this.http.get<dossier>(`${this.dossierApiUrl}/public/byUniqueId/${id}`);
  }

  getEpreuvesByDossier(id: string): Observable<any> {
    return this.http.get<any>(`${this.epreuveApiUrl}/public/${id}`);
  }

  getTestAnalyseByEpreuve(id: string): Observable<any> {
    return this.http.get<any>(`${this.testAnalyseApiUrl}/public/${id}`);
  }



}
