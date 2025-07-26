/**
 * Shared code between client and server
 * Useful to share types between client and server
 * and/or small pure JS functions that can be used on both client and server
 */

/**
 * Example response type for /api/demo
 */
export interface DemoResponse {
  message: string;
}

/**
 * User data sync API types
 */
export interface UserDataResponse {
  success: boolean;
  data?: any;
  error?: string;
  lastModified?: string;
}

export interface UserDataExistsResponse {
  success: boolean;
  exists: boolean;
  lastModified?: string;
  error?: string;
}

export interface UserDataSaveRequest {
  userData: any;
}

export interface UserDataUpdateRequest {
  updates: any;
}
