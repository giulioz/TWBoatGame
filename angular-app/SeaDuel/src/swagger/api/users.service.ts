/**
 * SeaDuelServer
 * SeaDuelServer
 *
 * OpenAPI spec version: 1.0.0
 *
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 */
/* tslint:disable:no-unused-variable member-ordering */

import { Inject, Injectable, Optional } from "@angular/core";
import {
  HttpClient,
  HttpHeaders,
  HttpParams,
  HttpResponse,
  HttpEvent
} from "@angular/common/http";
import { CustomHttpUrlEncodingCodec } from "../encoder";

import { Observable } from "rxjs";

import { NewUser } from "../model/newUser";
import { User } from "../model/user";

import { BASE_PATH, COLLECTION_FORMATS } from "../variables";
import { Configuration } from "../configuration";

@Injectable()
export class UsersService {
  protected basePath = "https://localhost/api/v1";
  public defaultHeaders = new HttpHeaders();
  public configuration = new Configuration();

  constructor(
    protected httpClient: HttpClient,
    @Optional()
    @Inject(BASE_PATH)
    basePath: string,
    @Optional() configuration: Configuration
  ) {
    if (basePath) {
      this.basePath = basePath;
    }
    if (configuration) {
      this.configuration = configuration;
      this.basePath = basePath || configuration.basePath || this.basePath;
    }
  }

  /**
   * @param consumes string[] mime-types
   * @return true: consumes contains 'multipart/form-data', false: otherwise
   */
  private canConsumeForm(consumes: string[]): boolean {
    const form = "multipart/form-data";
    for (const consume of consumes) {
      if (form === consume) {
        return true;
      }
    }
    return false;
  }

  /**
   *
   * Delete an user
   * @param id The id of the user to delete
   * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
   * @param reportProgress flag to report request and response progress.
   */
  public usersByIdIdDelete(
    id: string,
    observe?: "body",
    reportProgress?: boolean
  ): Observable<any>;
  public usersByIdIdDelete(
    id: string,
    observe?: "response",
    reportProgress?: boolean
  ): Observable<HttpResponse<any>>;
  public usersByIdIdDelete(
    id: string,
    observe?: "events",
    reportProgress?: boolean
  ): Observable<HttpEvent<any>>;
  public usersByIdIdDelete(
    id: string,
    observe: any = "body",
    reportProgress: boolean = false
  ): Observable<any> {
    if (id === null || id === undefined) {
      throw new Error(
        "Required parameter id was null or undefined when calling usersByIdIdDelete."
      );
    }

    let headers = this.defaultHeaders;

    // authentication (Bearer) required
    if (this.configuration.apiKeys["Authorization"]) {
      headers = headers.set(
        "Authorization",
        this.configuration.apiKeys["Authorization"]
      );
    }

    // to determine the Accept header
    const httpHeaderAccepts: string[] = ["application/json"];
    const httpHeaderAcceptSelected:
      | string
      | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
    if (httpHeaderAcceptSelected !== undefined) {
      headers = headers.set("Accept", httpHeaderAcceptSelected);
    }

    // to determine the Content-Type header
    const consumes: string[] = ["application/json"];

    return this.httpClient.delete<any>(
      `${this.basePath}/users/byId/${encodeURIComponent(String(id))}`,
      {
        withCredentials: this.configuration.withCredentials,
        headers: headers,
        observe: observe,
        reportProgress: reportProgress
      }
    );
  }

  /**
   *
   * Get info about an user
   * @param id The id of the user to retrieve
   * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
   * @param reportProgress flag to report request and response progress.
   */
  public usersByIdIdGet(
    id: string,
    observe?: "body",
    reportProgress?: boolean
  ): Observable<User>;
  public usersByIdIdGet(
    id: string,
    observe?: "response",
    reportProgress?: boolean
  ): Observable<HttpResponse<User>>;
  public usersByIdIdGet(
    id: string,
    observe?: "events",
    reportProgress?: boolean
  ): Observable<HttpEvent<User>>;
  public usersByIdIdGet(
    id: string,
    observe: any = "body",
    reportProgress: boolean = false
  ): Observable<any> {
    if (id === null || id === undefined) {
      throw new Error(
        "Required parameter id was null or undefined when calling usersByIdIdGet."
      );
    }

    let headers = this.defaultHeaders;

    // authentication (Bearer) required
    if (this.configuration.apiKeys["Authorization"]) {
      headers = headers.set(
        "Authorization",
        this.configuration.apiKeys["Authorization"]
      );
    }

    // to determine the Accept header
    const httpHeaderAccepts: string[] = ["application/json"];
    const httpHeaderAcceptSelected:
      | string
      | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
    if (httpHeaderAcceptSelected !== undefined) {
      headers = headers.set("Accept", httpHeaderAcceptSelected);
    }

    // to determine the Content-Type header
    const consumes: string[] = ["application/json"];

    return this.httpClient.get<User>(
      `${this.basePath}/users/byId/${encodeURIComponent(String(id))}`,
      {
        withCredentials: this.configuration.withCredentials,
        headers: headers,
        observe: observe,
        reportProgress: reportProgress
      }
    );
  }

  /**
   *
   * Update user info
   * @param id The id of the user to update
   * @param body The fields to update, leave password empty to not edit
   * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
   * @param reportProgress flag to report request and response progress.
   */
  public usersByIdIdPut(
    id: string,
    body: User,
    observe?: "body",
    reportProgress?: boolean
  ): Observable<any>;
  public usersByIdIdPut(
    id: string,
    body: User,
    observe?: "response",
    reportProgress?: boolean
  ): Observable<HttpResponse<any>>;
  public usersByIdIdPut(
    id: string,
    body: User,
    observe?: "events",
    reportProgress?: boolean
  ): Observable<HttpEvent<any>>;
  public usersByIdIdPut(
    id: string,
    body: User,
    observe: any = "body",
    reportProgress: boolean = false
  ): Observable<any> {
    if (id === null || id === undefined) {
      throw new Error(
        "Required parameter id was null or undefined when calling usersByIdIdPut."
      );
    }
    if (body === null || body === undefined) {
      throw new Error(
        "Required parameter body was null or undefined when calling usersByIdIdPut."
      );
    }

    let headers = this.defaultHeaders;

    // authentication (Bearer) required
    if (this.configuration.apiKeys["Authorization"]) {
      headers = headers.set(
        "Authorization",
        this.configuration.apiKeys["Authorization"]
      );
    }

    // to determine the Accept header
    const httpHeaderAccepts: string[] = ["application/json"];
    const httpHeaderAcceptSelected:
      | string
      | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
    if (httpHeaderAcceptSelected !== undefined) {
      headers = headers.set("Accept", httpHeaderAcceptSelected);
    }

    // to determine the Content-Type header
    const consumes: string[] = ["application/json"];
    const httpContentTypeSelected:
      | string
      | undefined = this.configuration.selectHeaderContentType(consumes);
    if (httpContentTypeSelected !== undefined) {
      headers = headers.set("Content-Type", httpContentTypeSelected);
    }

    return this.httpClient.put<any>(
      `${this.basePath}/users/byId/${encodeURIComponent(String(id))}`,
      body,
      {
        withCredentials: this.configuration.withCredentials,
        headers: headers,
        observe: observe,
        reportProgress: reportProgress
      }
    );
  }

  /**
   *
   * Get the users in contact with the logged in user
   * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
   * @param reportProgress flag to report request and response progress.
   */
  public usersContactsGet(
    observe?: "body",
    reportProgress?: boolean
  ): Observable<Array<User>>;
  public usersContactsGet(
    observe?: "response",
    reportProgress?: boolean
  ): Observable<HttpResponse<Array<User>>>;
  public usersContactsGet(
    observe?: "events",
    reportProgress?: boolean
  ): Observable<HttpEvent<Array<User>>>;
  public usersContactsGet(
    observe: any = "body",
    reportProgress: boolean = false
  ): Observable<any> {
    let headers = this.defaultHeaders;

    // authentication (Bearer) required
    if (this.configuration.apiKeys["Authorization"]) {
      headers = headers.set(
        "Authorization",
        this.configuration.apiKeys["Authorization"]
      );
    }

    // to determine the Accept header
    const httpHeaderAccepts: string[] = ["application/json"];
    const httpHeaderAcceptSelected:
      | string
      | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
    if (httpHeaderAcceptSelected !== undefined) {
      headers = headers.set("Accept", httpHeaderAcceptSelected);
    }

    // to determine the Content-Type header
    const consumes: string[] = ["application/json"];

    return this.httpClient.get<Array<User>>(`${this.basePath}/users/contacts`, {
      withCredentials: this.configuration.withCredentials,
      headers: headers,
      observe: observe,
      reportProgress: reportProgress
    });
  }

  /**
   *
   * Find user by the start of user id
   * @param id The start of the user id to find
   * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
   * @param reportProgress flag to report request and response progress.
   */
  public usersFindIdIdGet(
    id: string,
    observe?: "body",
    reportProgress?: boolean
  ): Observable<Array<User>>;
  public usersFindIdIdGet(
    id: string,
    observe?: "response",
    reportProgress?: boolean
  ): Observable<HttpResponse<Array<User>>>;
  public usersFindIdIdGet(
    id: string,
    observe?: "events",
    reportProgress?: boolean
  ): Observable<HttpEvent<Array<User>>>;
  public usersFindIdIdGet(
    id: string,
    observe: any = "body",
    reportProgress: boolean = false
  ): Observable<any> {
    if (id === null || id === undefined) {
      throw new Error(
        "Required parameter id was null or undefined when calling usersFindIdIdGet."
      );
    }

    let headers = this.defaultHeaders;

    // authentication (Bearer) required
    if (this.configuration.apiKeys["Authorization"]) {
      headers = headers.set(
        "Authorization",
        this.configuration.apiKeys["Authorization"]
      );
    }

    // to determine the Accept header
    const httpHeaderAccepts: string[] = ["application/json"];
    const httpHeaderAcceptSelected:
      | string
      | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
    if (httpHeaderAcceptSelected !== undefined) {
      headers = headers.set("Accept", httpHeaderAcceptSelected);
    }

    // to determine the Content-Type header
    const consumes: string[] = ["application/json"];

    return this.httpClient.get<Array<User>>(
      `${this.basePath}/users/findId/${encodeURIComponent(String(id))}`,
      {
        withCredentials: this.configuration.withCredentials,
        headers: headers,
        observe: observe,
        reportProgress: reportProgress
      }
    );
  }

  /**
   *
   * Get the list of all the users
   * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
   * @param reportProgress flag to report request and response progress.
   */
  public usersGet(
    observe?: "body",
    reportProgress?: boolean
  ): Observable<Array<User>>;
  public usersGet(
    observe?: "response",
    reportProgress?: boolean
  ): Observable<HttpResponse<Array<User>>>;
  public usersGet(
    observe?: "events",
    reportProgress?: boolean
  ): Observable<HttpEvent<Array<User>>>;
  public usersGet(
    observe: any = "body",
    reportProgress: boolean = false
  ): Observable<any> {
    let headers = this.defaultHeaders;

    // authentication (Bearer) required
    if (this.configuration.apiKeys["Authorization"]) {
      headers = headers.set(
        "Authorization",
        this.configuration.apiKeys["Authorization"]
      );
    }

    // to determine the Accept header
    const httpHeaderAccepts: string[] = ["application/json"];
    const httpHeaderAcceptSelected:
      | string
      | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
    if (httpHeaderAcceptSelected !== undefined) {
      headers = headers.set("Accept", httpHeaderAcceptSelected);
    }

    // to determine the Content-Type header
    const consumes: string[] = ["application/json"];

    return this.httpClient.get<Array<User>>(`${this.basePath}/users`, {
      withCredentials: this.configuration.withCredentials,
      headers: headers,
      observe: observe,
      reportProgress: reportProgress
    });
  }

  /**
   *
   * Create a new user
   * @param body The user to create
   * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
   * @param reportProgress flag to report request and response progress.
   */
  public usersPost(
    body: NewUser,
    observe?: "body",
    reportProgress?: boolean
  ): Observable<any>;
  public usersPost(
    body: NewUser,
    observe?: "response",
    reportProgress?: boolean
  ): Observable<HttpResponse<any>>;
  public usersPost(
    body: NewUser,
    observe?: "events",
    reportProgress?: boolean
  ): Observable<HttpEvent<any>>;
  public usersPost(
    body: NewUser,
    observe: any = "body",
    reportProgress: boolean = false
  ): Observable<any> {
    if (body === null || body === undefined) {
      throw new Error(
        "Required parameter body was null or undefined when calling usersPost."
      );
    }

    let headers = this.defaultHeaders;

    // to determine the Accept header
    const httpHeaderAccepts: string[] = ["application/json"];
    const httpHeaderAcceptSelected:
      | string
      | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
    if (httpHeaderAcceptSelected !== undefined) {
      headers = headers.set("Accept", httpHeaderAcceptSelected);
    }

    // to determine the Content-Type header
    const consumes: string[] = ["application/json"];
    const httpContentTypeSelected:
      | string
      | undefined = this.configuration.selectHeaderContentType(consumes);
    if (httpContentTypeSelected !== undefined) {
      headers = headers.set("Content-Type", httpContentTypeSelected);
    }

    return this.httpClient.post<any>(`${this.basePath}/users`, body, {
      withCredentials: this.configuration.withCredentials,
      headers: headers,
      observe: observe,
      reportProgress: reportProgress
    });
  }

  /**
   *
   * Get the top 10 users
   * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
   * @param reportProgress flag to report request and response progress.
   */
  public usersTopGet(
    observe?: "body",
    reportProgress?: boolean
  ): Observable<Array<User>>;
  public usersTopGet(
    observe?: "response",
    reportProgress?: boolean
  ): Observable<HttpResponse<Array<User>>>;
  public usersTopGet(
    observe?: "events",
    reportProgress?: boolean
  ): Observable<HttpEvent<Array<User>>>;
  public usersTopGet(
    observe: any = "body",
    reportProgress: boolean = false
  ): Observable<any> {
    let headers = this.defaultHeaders;

    // authentication (Bearer) required
    if (this.configuration.apiKeys["Authorization"]) {
      headers = headers.set(
        "Authorization",
        this.configuration.apiKeys["Authorization"]
      );
    }

    // to determine the Accept header
    const httpHeaderAccepts: string[] = ["application/json"];
    const httpHeaderAcceptSelected:
      | string
      | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
    if (httpHeaderAcceptSelected !== undefined) {
      headers = headers.set("Accept", httpHeaderAcceptSelected);
    }

    // to determine the Content-Type header
    const consumes: string[] = ["application/json"];

    return this.httpClient.get<Array<User>>(`${this.basePath}/users/top`, {
      withCredentials: this.configuration.withCredentials,
      headers: headers,
      observe: observe,
      reportProgress: reportProgress
    });
  }

  /**
   *
   * Get random users waiting to play
   * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
   * @param reportProgress flag to report request and response progress.
   */
  public usersWaitingGet(
    observe?: "body",
    reportProgress?: boolean
  ): Observable<Array<User>>;
  public usersWaitingGet(
    observe?: "response",
    reportProgress?: boolean
  ): Observable<HttpResponse<Array<User>>>;
  public usersWaitingGet(
    observe?: "events",
    reportProgress?: boolean
  ): Observable<HttpEvent<Array<User>>>;
  public usersWaitingGet(
    observe: any = "body",
    reportProgress: boolean = false
  ): Observable<any> {
    let headers = this.defaultHeaders;

    // authentication (Bearer) required
    if (this.configuration.apiKeys["Authorization"]) {
      headers = headers.set(
        "Authorization",
        this.configuration.apiKeys["Authorization"]
      );
    }

    // to determine the Accept header
    const httpHeaderAccepts: string[] = ["application/json"];
    const httpHeaderAcceptSelected:
      | string
      | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
    if (httpHeaderAcceptSelected !== undefined) {
      headers = headers.set("Accept", httpHeaderAcceptSelected);
    }

    // to determine the Content-Type header
    const consumes: string[] = ["application/json"];

    return this.httpClient.get<Array<User>>(`${this.basePath}/users/waiting`, {
      withCredentials: this.configuration.withCredentials,
      headers: headers,
      observe: observe,
      reportProgress: reportProgress
    });
  }
}