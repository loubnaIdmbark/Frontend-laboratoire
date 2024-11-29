import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {map, Observable} from 'rxjs';



export interface utilisateur{
  id:number,
  email:string,
  fkIdLaboratoire:number,
  nomComplet:string,
  profession:string;
  numTel:number,
  signature:string,
  role:string,
}
@Injectable({
  providedIn: 'root',
})
export class UtilisateurService {
  private apiUrl = 'http://localhost:8088/utilisateurs';

constructor(private http: HttpClient) {}

  getUtilisateurs(): Observable<utilisateur[]> {
    return this.http.get<utilisateur[]>(this.apiUrl);
  }
}
