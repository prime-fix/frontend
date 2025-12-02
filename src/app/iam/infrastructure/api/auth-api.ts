import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '@env/environment';

/**
 * Sign-in request payload
 */
export interface SignInRequest {
  username: string;
  password: string;
}

/**
 * Sign-in response from AWS backend
 */
export interface SignInResponse {
  id: number;
  username: string;
  token: string;
}

/**
 * Sign-up request for vehicle owner
 * Creates User + UserAccount in one request
 */
export interface SignUpVehicleOwnerRequest {
  user: {
    name: string;
    lastName: string;
    dni: string;
    phoneNumber: string;
    department: string;
    district: string;
    address: string;
  };
  userAccount: {
    username: string;
    email: string;
    password: string;
  };
}

/**
 * Sign-up request for auto repair
 * Creates AutoRepair + Location + User + UserAccount
 */
export interface SignUpAutoRepairRequest {
  autoRepair: {
    name: string;
    ruc: string;
  };
  location: {
    department: string;
    district: string;
    address: string;
  };
  user: {
    name: string;
    lastName: string;
    dni: string;
    phoneNumber: string;
  };
  userAccount: {
    username: string;
    email: string;
    password: string;
  };
}

/**
 * Sign-up response from AWS backend
 */
export interface SignUpResponse {
  id: number;
  username: string;
  token: string;
}

/**
 * Authentication API service for AWS backend.
 * Handles sign-in and sign-up operations that return JWT tokens.
 */
@Injectable({
  providedIn: 'root'
})
export class AuthApi {
  private readonly baseUrl = environment.primeFixProviderApiBaseUrlAWS;
  private readonly signInPath = environment.primeFixProviderSignInEndpointPath;
  private readonly signUpVehicleOwnerPath = environment.primeFixProviderSignUpVehicleOwnerEndpointPath;
  private readonly signUpAutoRepairPath = environment.primeFixProviderSignUpAutoRepairEndpointPath;

  constructor(private http: HttpClient) {}

  /**
   * Sign in a user and receive JWT token
   * @param username - User's username or email
   * @param password - User's password
   * @returns Observable with user id, username, and JWT token
   */
  signIn(username: string, password: string): Observable<SignInResponse> {
    const url = `${this.baseUrl}${this.signInPath}`;
    const payload: SignInRequest = { username, password };

    return this.http.post<SignInResponse>(url, payload).pipe(
      catchError(this.handleError('Sign-in failed'))
    );
  }

  /**
   * Sign up a new vehicle owner
   * Creates User + UserAccount in the backend
   * @param request - Sign-up request data with user and userAccount
   * @returns Observable with user account id, username, and JWT token
   */
  signUpVehicleOwner(request: SignUpVehicleOwnerRequest): Observable<SignUpResponse> {
    const url = `${this.baseUrl}${this.signUpVehicleOwnerPath}`;

    return this.http.post<SignUpResponse>(url, request).pipe(
      catchError(this.handleError('Vehicle owner registration failed'))
    );
  }

  /**
   * Sign up a new auto repair workshop
   * Creates AutoRepair + Location + User + UserAccount in the backend
   * @param request - Sign-up request data with autoRepair, location, user, and userAccount
   * @returns Observable with user account id, username, and JWT token
   */
  signUpAutoRepair(request: SignUpAutoRepairRequest): Observable<SignUpResponse> {
    const url = `${this.baseUrl}${this.signUpAutoRepairPath}`;

    return this.http.post<SignUpResponse>(url, request).pipe(
      catchError(this.handleError('Auto repair registration failed'))
    );
  }

  /**
   * Handle HTTP errors
   * @param operation - The operation that failed
   * @returns Error handler function
   */
  private handleError(operation: string) {
    return (error: HttpErrorResponse): Observable<never> => {
      let errorMessage = operation;

      if (error.status === 401) {
        errorMessage = `${operation}: Invalid credentials`;
      } else if (error.status === 400) {
        errorMessage = `${operation}: ${error.error?.message || 'Invalid request'}`;
      } else if (error.error instanceof ErrorEvent) {
        errorMessage = `${operation}: ${error.error.message}`;
      } else {
        errorMessage = `${operation}: ${error.statusText || 'Unexpected error'}`;
      }

      return throwError(() => new Error(errorMessage));
    };
  }
}

