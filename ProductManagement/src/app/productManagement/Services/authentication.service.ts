import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { environment } from '../../environment';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Register } from '../Models/Register';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  public showPasswordModal: EventEmitter<void> = new EventEmitter<void>();

  private clientId = "Ov23liz8SmTtSszQFs1Q";
  private redirectUri = "http://localhost:4200/login";
  private apiUrl = `${environment.baseApiUrl}`;
  private token: string | null = null; 

  constructor(private httpClient: HttpClient, private router: Router) {
    this.token = this.getToken();
   }

   private setHeaders(): { headers: HttpHeaders } {
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.token}`
      })
    };
  }

  getToken(): string | null {
    if (typeof window !== 'undefined' && window.localStorage) {
      return localStorage.getItem('access_token');
    }
    return null; // Or handle this case as necessary
  }

  redirectToGitHubLogin() {
    const state = this.generateRandomState();
    sessionStorage.setItem('oauth_state', state);

    const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${this.clientId}&redirect_uri=${this.redirectUri}&scope=user:email&state=${state}`;
    window.location.href = githubAuthUrl;
  }

  handleAuthCallback(code: string): Observable<any> {
    const state = new URLSearchParams(window.location.search).get('state');
    const storedState = sessionStorage.getItem('oauth_state');

    if (state !== storedState) {
      console.log("State parameter mismatch");
      return new Observable(observer => {
        observer.error("State parameter mismatch");
        observer.complete();
      });
    }

    return this.httpClient.post(`${this.apiUrl}Authentication/Login`, { code: code }, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  loginWithEmailPassword(email: string, password: string) {
    return this.httpClient.post(`${this.apiUrl}Authentication/LoginWithEmail`, { email, password }, this.setHeaders());
  }

  setPassword(userId: number, password: string) {
    return this.httpClient.post(`${this.apiUrl}Authentication/SetPassword`, { userId, password }, this.setHeaders());
  }

  register(details: Register){
    return this.httpClient.post<Register>(`${this.apiUrl}Authentication/Register`, details, this.setHeaders())
  }


  logout(){
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_name');
    sessionStorage.removeItem('oauth_state');
    localStorage.removeItem('role');
  }
  
  private generateRandomState(): string {
    return Math.random().toString(36).substring(2) + Math.random().toString(36).substring(2);
  }


  getUserByEmail(email: string): Observable<any>{
    return this.httpClient.get<any>(`${this.apiUrl}Authentication/GetUserById/${email}`);
  }

}
