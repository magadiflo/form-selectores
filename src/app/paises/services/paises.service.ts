import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { PaisSmall } from '../interfaces/paises.interface';

@Injectable({
  providedIn: 'root'
})
export class PaisesService {

  private _regiones: string[] = ['Africa', 'Americas', 'Asia', 'Europe', 'Oceania'];
  private baseUrl: string = 'https://restcountries.com/v3.1';

  constructor(private http: HttpClient) { }

  public get regiones(): string[] {
    return [...this._regiones];
  }

  /**
   * Example endpoint, search countries by region
   * https://restcountries.com/v3.1/region/americas?fields=name,cca2
   */
  getPaisesPorRegion(region: string): Observable<PaisSmall[]> {
    const url = `${this.baseUrl}/region/${region}`;
    const params = new HttpParams().set('fields', 'name,cca2');
    return this.http.get<PaisSmall[]>(url, { params });
  }

}
