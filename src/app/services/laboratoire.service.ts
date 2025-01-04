import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {map, Observable} from 'rxjs';

export interface Laboratoire {
  id: number;
  nom: string;
  logo: string;
  nrc: string;
  active: boolean;
  dateActivation: string;
 contacts:ContactLaboratoire[];
}

export interface ContactLaboratoire {
  id:number;
  numTel: string;
  fax: number;
  email: string;
  fkIdLaboratoire:number;
  fkIdAdresse:number;
}

export interface AdresseLaboratoire {
  id:number;
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
  private apiUrl = 'http://localhost:8087/laboratoire';
  private contactUrl = 'http://localhost:8087/contactLaboratoire';
  private adresseUrl = 'http://localhost:8087/adresse';

  constructor(private http: HttpClient) {}


  addLaboratoire(laboratoireData: Laboratoire): Observable<Laboratoire> {
    return this.http.post<Laboratoire>(`${this.apiUrl}`, laboratoireData);
  }

  // Récupération de tous les laboratoires
  getLaboratoire(): Observable<Laboratoire[]> {
    return this.http.get<Laboratoire[]>(this.apiUrl);
  }
  getLaboratoireById(id: number): Observable<Laboratoire> {
    return this.http.get<Laboratoire>(`${this.apiUrl}/${id}`);
  }

  publicGetLaboratoireById(id: number): Observable<Laboratoire> {
    return this.http.get<Laboratoire>(`${this.apiUrl}/public/${id}`);
  }

  getAdresse(): Observable<AdresseLaboratoire[]> {
    return this.http.get<AdresseLaboratoire[]>(this.adresseUrl);
  }
  getContact(): Observable<ContactLaboratoire[]> {

    return this.http.get<ContactLaboratoire[]>(this.contactUrl);

  }
  getContactsByLaboratoireId(laboratoireId: number): Observable<ContactLaboratoire[]> {

    return this.getContact().pipe(
      map((contacts) =>
        contacts.filter((contact) => contact.fkIdLaboratoire === laboratoireId)
      )
    );
  }



  // Mise à jour d'un laboratoire existant
  updateLaboratoroire(id: number, lab: FormData): Observable<Laboratoire> {
    return this.http.put<Laboratoire>(`${this.apiUrl}/${id}`, lab);
  }





  // Suppression d'un laboratoire par ID
  deleteLaboratory(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  deleteContact(id: number): Observable<void> {
    return this.http.delete<void>(`${this.contactUrl}/${id}`);
  }
  // Ajout d'une adresse pour un laboratoire
  addAdresseLaboratoire(adresseData: AdresseLaboratoire): Observable<AdresseLaboratoire> {
    return this.http.post<AdresseLaboratoire>(`${this.adresseUrl}`, adresseData);
  }

  // Ajout d'un contact pour un laboratoire
  addContactLaboratoire(contactData: ContactLaboratoire): Observable<ContactLaboratoire> {
    return this.http.post<ContactLaboratoire>(`${this.contactUrl}`, contactData);
  }
}
