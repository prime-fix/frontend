import {BaseApi} from '@shared/infrastructure/http/base-api';
import {Injectable} from '@angular/core';
import {ExpectedVisitsApiEndpoint} from '@diagnosis/infrastructure/expected-visits-api-endpoint';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {ExpectedVisit} from '@diagnosis/domain/model/expected-visit.entity';
import {DiagnosticsApiEndpoint} from '@diagnosis/infrastructure/diagnostics-api-endpoint';
import {Diagnostic} from '@diagnosis/domain/model/diagnostic.entity';

@Injectable({
  providedIn: 'root',
})
/**
 * API service for managing diagnoses and expected visits.
 */
export class DiagnosisApi extends BaseApi {
  /**
   * API endpoint for expected visits.
   * @private
   * @readonly
   */
  private readonly expectedVisitsEndpoint: ExpectedVisitsApiEndpoint;

  /**
   * API endpoint for diagnostics.
   * @private
   */
  private readonly diagnosticsEndpoint: DiagnosticsApiEndpoint;

  /**
   * Constructs a new instance of the DiagnosisApi.
   * @param http - The HttpClient used for making HTTP requests.
   */
  constructor(http: HttpClient) {
    super();
    this.expectedVisitsEndpoint = new ExpectedVisitsApiEndpoint(http);
    this.diagnosticsEndpoint = new DiagnosticsApiEndpoint(http);
  }

  /**
   * Fetches all expected visits from the backend.
   * @returns An Observable emitting an array of ExpectedVisit entities.
   */
  getExpectedVisits(): Observable<ExpectedVisit[]> {
    return this.expectedVisitsEndpoint.getAll();
  }

  /**
   * Fetches a specific expected visit by its ID.
   * @param id - The ID of the expected visit to fetch.
   * @returns An Observable emitting the ExpectedVisit entity.
   */
  getExpectedVisitById(id: number): Observable<ExpectedVisit> {
    return this.expectedVisitsEndpoint.getById(id);
  }

  /**
   * Creates a new expected visit in the backend.
   * @param expectedVisit - The ExpectedVisit entity to create.
   * @returns An Observable emitting the created ExpectedVisit entity.
   */
  createExpectedVisit(expectedVisit: ExpectedVisit): Observable<ExpectedVisit> {
    return this.expectedVisitsEndpoint.create(expectedVisit);
  }

  /**
   * Updates an existing expected visit in the backend.
   * @param expectedVisit - The ExpectedVisit entity to update.
   * @returns An Observable emitting the updated ExpectedVisit entity.
   */
  updateExpectedVisit(expectedVisit: ExpectedVisit): Observable<ExpectedVisit> {
    return this.expectedVisitsEndpoint.update(expectedVisit, expectedVisit.id);
  }

  /**
   * Deletes an expected visit by its ID.
   * @param id - The ID of the expected visit to delete.
   * @returns An Observable emitting void upon successful deletion.
   */
  deleteExpectedVisit(id: number): Observable<void> {
    return this.expectedVisitsEndpoint.delete(id);
  }

  getDiagnostics(): Observable<Diagnostic[]> {
    return this.diagnosticsEndpoint.getAll();
  }

  getDiagnosticById(id: number): Observable<Diagnostic> {
    return this.diagnosticsEndpoint.getById(id);
  }

  createDiagnostic(diagnostic: Diagnostic): Observable<Diagnostic> {
    return this.diagnosticsEndpoint.create(diagnostic);
  }

  updateDiagnostic(diagnostic: Diagnostic): Observable<Diagnostic> {
    return this.diagnosticsEndpoint.update(diagnostic, diagnostic.id);
  }

  deleteDiagnostic(id: number): Observable<void> {
    return this.diagnosticsEndpoint.delete(id);
  }
}
