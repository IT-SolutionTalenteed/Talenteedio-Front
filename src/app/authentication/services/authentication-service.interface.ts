import { Observable } from 'rxjs';
import { AuthenticationResponse } from '../types/authentication-response.interface';
import { Credentials } from '../types/credentials.interface';

export interface AuthenticationServiceInterface {
    logIn(credentials: Credentials): Observable<AuthenticationResponse>;
    refreshToken(credentials: string): Observable<AuthenticationResponse>;
}
