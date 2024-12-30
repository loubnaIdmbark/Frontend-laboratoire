import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class consultationService {
  dossierApiURL = 'http://localhost:8086/dossiers';
  verificationApiURL = 'http://localhost:8088/patients';

  constructor(private http: HttpClient) {}

  // Validate the dossier code
  validateCodeDossier(codeDossier: string): Observable<any> {
    return this.http.get(`${this.dossierApiURL}/public/byUniqueId/${codeDossier}`);
  }

  // Send the verification code to the user's email
  sendVerificationCode(idPatient: string): Observable<any> {
    return this.http.get(`${this.verificationApiURL}/public/verify/${idPatient}`);
  }

  // Verify the verification code
  sendRecoveryCode(email: string): Observable<any> {
    return this.http.get(`${this.dossierApiURL}/public/recover/${email}`);
  }

}
