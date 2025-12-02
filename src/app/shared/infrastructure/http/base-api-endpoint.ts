import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { BaseEntity } from './base-entity';
import { BaseResource, BaseResponse } from './base-response';
import { BaseAssembler } from './base-assembler';
import { BaseApiConfig } from '@shared/infrastructure/http/base-api-config';
import { environment } from '@env/environment';

/**
 * Base class for API endpoint operations with generic CRUD functionality.
 * Supports configuration for path parameters or query parameters.
 * Implements automatic fallback from AWS (primary) to Supabase (fallback) on errors.
 * @template TEntity - The entity type, which must extend BaseEntity.
 * @template TResource - The resource type, must extend BaseResource.
 * @template TResponse - The response type, must extend BaseResponse.
 * @template TAssembler - The assembler type implementing BaseAssembler with matching generics.
 */
@Injectable()
export abstract class BaseApiEndpoint<
  TEntity extends BaseEntity,
  TResource extends BaseResource,
  TResponse extends BaseResponse,
  TAssembler extends BaseAssembler<TEntity, TResource, TResponse>
> {
  protected abstract readonly idQueryParamKey: string;
  protected readonly endpointPath: string;

  protected constructor(
    protected http: HttpClient,
    protected endpointUrl: string,
    protected assembler: TAssembler,
    protected config: BaseApiConfig
  ) {
    // Extract the endpoint path from the full URL for fallback construction
    const awsBase = environment.primeFixProviderApiBaseUrlAWS;
    this.endpointPath = endpointUrl.replace(awsBase, '');
  }

  /**
   * Builds the fallback URL using Supabase base URL
   * @private
   */
  private getFallbackUrl(): string {
    return `${environment.primeFixProviderApiBaseUrlSupabase}${this.endpointPath}`;
  }

  /**
   * Checks if the error should trigger a fallback to Supabase
   * @param error - The HTTP error
   * @private
   */
  private shouldFallback(error: HttpErrorResponse): boolean {
    if (!this.config.enableFallback) return false;
    // Fallback on 401 (unauthorized), 5xx errors, or network errors
    return error.status === 401 || error.status === 0 || error.status >= 500;
  }

  /**
   * Retrieves all entities from the API, handling both response objects and arrays.
   * Supports configuration for path parameters or query parameters.
   * Implements automatic fallback from AWS to Supabase on failure.
   * @returns An Observable for an array of entities.
   */
  getAll(): Observable<TEntity[]> {
    let params = new HttpParams();
    if (!this.config.usePathParams) {
      params = params.set('select', '*');
    }
    const options = {
      params: params,
    }
    return this.http.get<TResponse | TResource[]>(this.endpointUrl, options).pipe(
      map(response => {
        console.log(response);
        if (Array.isArray(response)) {
          return response.map(resource => this.assembler.toEntityFromResource(resource));
        }
        return this.assembler.toEntitiesFromResponse(response as TResponse);
      }),
      catchError((error: HttpErrorResponse) => {
        if (this.shouldFallback(error)) {
          console.warn(`Primary API failed, falling back to Supabase for getAll`, error);
          const fallbackUrl = this.getFallbackUrl();
          const fallbackParams = new HttpParams().set('select', '*');
          return this.http.get<TResource[]>(fallbackUrl, { params: fallbackParams }).pipe(
            map(resources => resources.map(resource => this.assembler.toEntityFromResource(resource))),
            catchError(this.handleError('Failed to fetch entities from fallback'))
          );
        }
        return this.handleError('Failed to fetch entities')(error);
      })
    );
  }

  /**
   * Retrieves a single entity by ID.
   * Supports configuration for path parameters or query parameters.
   * Implements automatic fallback from AWS to Supabase on failure.
   * @param id - The ID of the entity.
   * @returns An Observable of the entity.
   */
  getById(id: number | string): Observable<TEntity> {
    let url: string;
    let paramsConfig: { params?: HttpParams } = {};
    const idString = id.toString();

    if (this.config.usePathParams) {
      url = `${this.endpointUrl}/${idString}`;
    } else {
      url = this.endpointUrl;
      let params = new HttpParams();
      params = params.set(this.idQueryParamKey, `eq.${idString}`);
      paramsConfig = { params };
    }

    return this.http.get<TResource>(url, paramsConfig).pipe(
      map(resource => this.assembler.toEntityFromResource(resource)),
      catchError((error: HttpErrorResponse) => {
        if (this.shouldFallback(error)) {
          console.warn(`Primary API failed, falling back to Supabase for getById`, error);
          const fallbackUrl = this.getFallbackUrl();
          const fallbackParams = new HttpParams().set(this.idQueryParamKey, `eq.${idString}`);
          return this.http.get<TResource>(fallbackUrl, { params: fallbackParams }).pipe(
            map(resource => this.assembler.toEntityFromResource(resource)),
            catchError(this.handleError('Failed to fetch entity from fallback'))
          );
        }
        return this.handleError('Failed to fetch entity')(error);
      })
    );
  }

  /**
   * Creates a new entity.
   * Supports configuration for path parameters or query parameters.
   * @param entity - The entity to create.
   * @returns An Observable of the created entity.
   */
  create(entity: TEntity): Observable<TEntity> {
    const resource = this.assembler.toResourceFromEntity(entity);

    if (this.config.usePathParams) {
      return this.http.post<TResource>(this.endpointUrl, resource).pipe(
        map(created => this.assembler.toEntityFromResource(created)),
        catchError(this.handleError('Failed to create entity'))
      );
    }

    const headers = new HttpHeaders().set('Prefer', 'return=representation');
    return this.http.post<TResource | TResource[]>(this.endpointUrl, resource, { headers }).pipe(
      map((body) => {
        const res = Array.isArray(body) ? body[0] : body;
        return this.assembler.toEntityFromResource(res);
      }),
      catchError(this.handleError('Failed to create entity'))
    );
  }

  /**
   * Updates an existing entity.
   * Supports configuration for path parameters or query parameters.
   * @param entity - The entity to update.
   * @param id - The ID of the entity.
   * @returns An Observable of the updated entity.
   */
  update(entity: TEntity, id: number | string): Observable<TEntity> {
    const resource = this.assembler.toResourceFromEntity(entity);
    const idString = id.toString();

    if (this.config.usePathParams) {
      return this.http.put<TResource>(`${this.endpointUrl}/${idString}`, resource).pipe(
        map(updated => this.assembler.toEntityFromResource(updated)),
        catchError(this.handleError('Failed to update entity'))
      );
    }

    const params = new HttpParams()
      .set(this.idQueryParamKey, `eq.${idString}`)
      .set('select', '*');
    const headers = new HttpHeaders()
      .set('Prefer', 'return=representation');

    return this.http.patch<TResource | TResource[]>(this.endpointUrl, resource, { params, headers }).pipe(
      map((body) => {
        const res = Array.isArray(body) ? body[0] : body;
        return this.assembler.toEntityFromResource(res);
      }),
      catchError(this.handleError('Failed to update entity'))
    );
  }

  /**
   * Deletes an entity by ID.
   * Supports configuration for path parameters or query parameters.
   * @param id - The ID of the entity to delete.
   * @returns An Observable of void.
   */
  delete(id: number | string): Observable<void> {
    const idString = id.toString();

    if (this.config.usePathParams) {
      return this.http.delete<void>(`${this.endpointUrl}/${idString}`).pipe(
        catchError(this.handleError('Failed to delete entity'))
      );
    }

    const params = new HttpParams().set(this.idQueryParamKey, `eq.${idString}`);
    return this.http.delete<void>(this.endpointUrl, { params }).pipe(
      catchError(this.handleError('Failed to delete entity'))
    );
  }

  /**
   * Handles HTTP errors and returns a user-friendly error message.
   * @param operation - The operation that failed.
   * @returns A function that transforms an error into an Observable.
   */
  protected handleError(operation: string) {
    return (error: HttpErrorResponse): Observable<never> => {
      let errorMessage = operation;
      if (error.status === 404) {
        errorMessage = `${operation}: Resource not found`;
      } else if (error.error instanceof ErrorEvent) {
        errorMessage = `${operation}: ${error.error.message}`;
      } else {
        errorMessage = `${operation}: ${error.statusText || 'Unexpected error'}`;
      }
      return throwError(() => new Error(errorMessage));
    };
  }
}
