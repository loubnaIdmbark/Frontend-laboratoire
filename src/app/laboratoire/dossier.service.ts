import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Observable} from 'rxjs';
import {patient} from './patient.service';

export interface dossier{
  id:number;
  fkEmailUtilisateur:string;
  fkIdPatient:number;
  date:Date;

}


@Injectable({
  providedIn: 'root',
})
export class DossierService {
  private apiUrl = 'http://localhost:8086/dossiers';

  constructor(private http: HttpClient) {
  }
  getDossiers(): Observable<dossier[]> {
    return this.http.get<dossier[]>(this.apiUrl);
  }

  addDossier(DossierData: { date: string; fkIdPatient: any; fkEmailUtilisateur: string }):Observable<dossier> {
    return this.http.post<dossier>(`${this.apiUrl}`, DossierData);
  }



}
