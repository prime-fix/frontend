/**
 * A base interface for API responses, allowing for extension with additional properties as needed.
 */
export interface BaseResponse {
}

/**
 * Defines a standard structure for API resources/DTOs with a unique identifier.
 */
export interface BaseResource {
  /**
   * The unique identifier for the resource.
   */
  id: number;
}
