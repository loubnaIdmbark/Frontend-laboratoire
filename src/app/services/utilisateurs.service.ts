import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {map, Observable} from 'rxjs';
import {Laboratoire} from './laboratoire.service';



export interface utilisateur{
  id:number,
  email:string,
  fkIdLaboratoire:number,
  nomComplet:string,
  profession:string;
  numTel:number,
  signature:string,
  role:string,
  password:string,
}
@Injectable({
  providedIn: 'root',
})
export class UtilisateurService {
  private apiUrl = 'http://localhost:8088/utilisateurs';

  constructor(private http: HttpClient) {
  }

  getUtilisateurs(): Observable<utilisateur[]> {
    return this.http.get<utilisateur[]>(this.apiUrl);
  }

  addUtilisateurs(utilisateurData: utilisateur): Observable<utilisateur> {
    return this.http.post<utilisateur>(`${this.apiUrl}`, utilisateurData);
  }

  deleteUser(email: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${email}`);
  }

  updateUtilisateur(email: string ,user: FormData): Observable<utilisateur> {
    return this.http.put<utilisateur>(`${this.apiUrl}/${email}`, user);
  }
  getUtilisateurByEmail(email:string):Observable<utilisateur> {
    return this.http.get<utilisateur>(`${this.apiUrl}/${email}`);
  }
}
