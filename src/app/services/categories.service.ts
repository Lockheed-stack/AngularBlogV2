import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { GlobalService } from './global.service';


export interface Categories {
  data: [],
  message: string,
  total: number
}
export interface CatalogSubmitFormat {
  name: string
}

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {

  constructor(
    private http: HttpClient,
    private globalVar: GlobalService,
  ) { }

  domain: string = this.globalVar.domain

  getCategories(
    pageIndex: number,
    pageSize: number,
    sortField: string | null,
    sortOrder: string | null,
    filters: Array<{ key: string; value: string[] }>
  ): Observable<Categories> {
    let params = new HttpParams().appendAll({
      "pagesize": pageSize,
      "pagenum": pageIndex
    })
    return this.http
      .get<Categories>(this.domain + 'controller/categories',
        { params }).pipe(catchError(() => of(null)));
  }

  getCategoriesWithArticles(pageIndex: number, pageSize: number,): Observable<Categories> {
    let params = new HttpParams().appendAll({
      "pagesize": pageSize,
      "pagenum": pageIndex
    })
    return this.http
      .get<Categories>(this.domain + 'controller/categories/list',
        { params }).pipe(catchError(() => of(null)));
  }


  deleteCategories(id: number): Observable<{ status: number, message: string }> {
    var url: string = this.domain + 'controller/category/';
    return this.http
      .delete<{ status: number, message: string }>(url.concat(String(id)),
      )
  }

  addCatalog(data: CatalogSubmitFormat): Observable<{ data: any, message: string }> {
    var url: string = this.domain + 'controller/category/add';
    return this.http.post<{ data: any, message: string }>(
      url,
      data
    )
  }

  updateCatalog(id: number, name: string): Observable<{ data: any, message: string }> {
    var url: string = this.domain + 'controller/category/';

    return this.http.put<{ data: any, message: string }>(
      url.concat(String(id)),
      { 'name': name },
    ).pipe(catchError(() => of(null)));
  }
}
