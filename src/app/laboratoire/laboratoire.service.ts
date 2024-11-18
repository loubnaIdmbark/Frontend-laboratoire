import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Laboratoire {
  id: number;
  nom: string;
  logo: string;
  nrc: string;
  active: boolean;
  dateActivation: string;
}

export interface ContactLaboratoire {
  id:number;
  numTel: string;
  fax: string;
  email: string;
}

export interface AdresseLaboratoire {
  id?: number;
  numVoie: string;
  nomVoie: string;
  codePostal: string;
  ville: string;
  commune: string;
}

@Injectable({
  providedIn: 'root',
})
export class LaboratoireService {
  private apiUrl = 'http://localhost:8088/laboratoire';
  private contactUrl = 'http://localhost:8088/contactLaboratoire';
  private adresseUrl = 'http://localhost:8088/adresseLaboratoire';

  constructor(private http: HttpClient) {}

  // Ajout d'un laboratoire
  addLaboratoire(laboratoireData: Laboratoire): Observable<Laboratoire> {
    return this.http.post<Laboratoire>(`${this.apiUrl}/add`, laboratoireData);
  }

  // Récupération de tous les laboratoires
  getLaboratoire(): Observable<Laboratoire[]> {
    return this.http.get<Laboratoire[]>(this.apiUrl);
  }

  // Récupération d'un laboratoire par ID
  getLaboratoryById(id: number): Observable<Laboratoire> {
    return this.http.get<Laboratoire>(`${this.apiUrl}/${id}`);
  }

  // Mise à jour d'un laboratoire existant
  updateLaboratory(id: number, lab: Partial<Laboratoire>): Observable<Laboratoire> {
    return this.http.put<Laboratoire>(`${this.apiUrl}/${id}`, lab);
  }

  // Suppression d'un laboratoire par ID
  deleteLaboratory(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${id}`);
  }

  // Ajout d'une adresse pour un laboratoire
  addAdresseLaboratoire(adresseData: AdresseLaboratoire): Observable<AdresseLaboratoire> {
    return this.http.post<AdresseLaboratoire>(`${this.adresseUrl}/add`, adresseData);
  }

  // Ajout d'un contact pour un laboratoire
  addContactLaboratoire(contactData: ContactLaboratoire): Observable<ContactLaboratoire> {
    return this.http.post<ContactLaboratoire>(`${this.contactUrl}/add`, contactData);
  }
}
