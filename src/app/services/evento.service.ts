import { Evento } from './../models/evento';
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { ToastrService } from 'ngx-toastr';



@Injectable({
  providedIn: 'root'
})
export class EventoService {
  private baseUrl: string;
  constructor(private httpClient: HttpClient, private toastr: ToastrService) {
    this.baseUrl = environment.url + 'api/Evento';
    this.type['text'] = 'text';
  }
  type = {};
  // Headers
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    responseType: 'Text'
  }


  getEventos(): Observable<Evento[]> {
    return this.httpClient.get<Evento[]>(this.baseUrl)
      .pipe(
        // retry(2),
        catchError( err => {
          this.toastMessage(err);
          return this.handleError(err);
        }))
  }


  getEventoById(id: number): Observable<Evento> {
    return this.httpClient.get<Evento>(this.baseUrl + '/' + id)
      .pipe(
        // retry(2),
        catchError( err => {
          this.toastMessage(err);
          return this.handleError(err);
        })
      )
  }

  saveEvento(evento: Evento) {
    return this.httpClient.post(this.baseUrl, JSON.stringify(evento), {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }), responseType: this.type['text']
    } )
      .pipe(
        // retry(2),
        catchError( err => {
          this.toastMessage(err);
          return this.handleError(err);
        })
      )
  }


  updateEvento(evento: Evento) {
    return this.httpClient.put(this.baseUrl, JSON.stringify(evento), {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }), responseType: this.type['text']
    } )
      .pipe(
        // retry(1),
        catchError( err => {
          this.toastMessage(err);
          return this.handleError(err);
        })
      )
  }

  deleteEvento(evento: Evento) {
    return this.httpClient.delete(this.baseUrl + '/' + evento.id, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }), responseType: this.type['text']
    } )
      .pipe(
        // retry(1),
        catchError( err => {
          this.toastMessage(err);
          return this.handleError(err);
        })
      )
  }


  handleError(error: HttpErrorResponse) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Erro ocorreu no lado do client
      errorMessage = error.error.message;
    } else {
      // Erro ocorreu no lado do servidor
      errorMessage = `Código do erro: ${error.status}, ` + `mensagem: ${error.error}`;
    }
    console.log(errorMessage);
    return throwError(errorMessage);
  }

  toastMessage(error: HttpErrorResponse) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Erro ocorreu no lado do client
      errorMessage = error.error.message;
    } else {
      // Erro ocorreu no lado do servidor
      errorMessage = error.error;
    }
    this.toastr[error.status === 400 ? 'warning' : 'error'](errorMessage);
  }
}
