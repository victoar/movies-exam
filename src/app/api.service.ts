import {EventEmitter, Injectable, Output} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  @Output() reload: EventEmitter<any> = new EventEmitter<any>();

  constructor(private http: HttpClient) { }

  public getAllGenresElements() {
    return this.http.get('http://192.168.56.1:2305/genres');
  }

  public getMoviesElements(elem: any) {
    return this.http.get('http://192.168.56.1:2305/movies/' + elem);
  }

  public getAllElements() {
    return this.http.get('http://192.168.56.1:2305/all');
  }

  public addElement(elem: any): Observable<object> {
    return this.http.post('http://192.168.56.1:2305/movie', elem);
  }

  // public reserveElement(id: any): Observable<object> {
  //   // TODO: check if it has to be string, number, etc
  //   return this.http.post('http://localhost:2305/take', { id: id });
  // }

  // public updateElement(elem: any): Observable<object> {
  //   return this.http.put('http://localhost:8080/courses/' + elem.id, elem);
  // }

  public deleteElement(id: any): Observable<object> {
    return this.http.delete('http://192.168.56.1:2305/movie/' + id);
  }

  public reloadElements() {
    this.reload.emit();
  }
}
