import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { combineLatest, Observable, of } from 'rxjs';

import { Pais, PaisSmall } from '../interfaces/paises.interface';

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

  /**
   * Example endpoint, search country by code
   * https://restcountries.com/v3.1/alpha/pe
   */
  getPaisPorCodigo(codigo: string): Observable<Pais[] | null> {
    if (!codigo) return of(null);
    return this.http.get<Pais[]>(`${this.baseUrl}/alpha/${codigo}`);
  }

  /**
   * Example endpoint, search country by code with fields
   * https://restcountries.com/v3.1/alpha/PE?fields=name,cca2
   */
  getPaisPorCodigoSmall(codigo: string): Observable<PaisSmall> {
    const params = new HttpParams().set('fields', 'name,cca2');
    return this.http.get<PaisSmall>(`${this.baseUrl}/alpha/${codigo}`, { params });
  }

  /**
   * Une las peticiones para devolver una sola. Por cada código en el arreglo de
   * borders se obtendrá un resultado y al final esos serán combinados en uno solo
   * Ejemplo: 
   * 0: {name: {…}, cca2: 'DZ'}
   * 1: {name: {…}, cca2: 'BF'}
   * 2: {name: {…}, cca2: 'GN'}
   */
  getPaisesPorCodigos(borders: string[]): Observable<PaisSmall[]>{
    if (!borders) return of([]);
    const peticiones: Observable<PaisSmall>[] = []; //Arreglo de peticiones
    borders.forEach(codigo => {
      const peticion = this.getPaisPorCodigoSmall(codigo);
      peticiones.push(peticion);
    });
    return combineLatest(peticiones);
  }

}
