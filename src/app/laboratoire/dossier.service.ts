import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Observable} from 'rxjs';

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



}
