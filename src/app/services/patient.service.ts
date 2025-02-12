import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Observable} from 'rxjs';
import {Laboratoire} from './laboratoire.service';


export interface patient{
  idPatient:number;
  nomComplet:string;
  dateNaissance:Date;
  lieuDeNaissance:string;
  sexe:string;
  numPieceIdentite:string;
  adresse:string;
  numTel:string;
  email:string;
  visible_pour:string;
  fkIdLaboratoire:number;
}

@Injectable({
  providedIn: 'root',
})
export class PatientService {

  private apiUrlPatient = 'http://localhost:8088/patients'

  constructor(private http: HttpClient) {
  }


  getPatient(fkIdPatient: number): Observable<patient> {
    return this.http.get<patient>(`${this.apiUrlPatient}/public/${fkIdPatient}`);
  }

  getAllPatients(): Observable<patient[]> {
    return this.http.get<patient[]>(`${this.apiUrlPatient}`);
  }



  deletePatient(idPatient: number):Observable<void> {
    return this.http.delete<void>(`${this.apiUrlPatient}/${idPatient}`);}

  addPatient(PatientData: patient): Observable<patient> {
    return this.http.post<patient>(`${this.apiUrlPatient}`, PatientData);
  }

  updatePatient(idPatient: number, patientData: FormData): Observable<patient> {
    return this.http.put<patient>(`${this.apiUrlPatient}/${idPatient}`, patientData);
  }


}
