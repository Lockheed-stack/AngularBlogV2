import { HttpClient, HttpParams, } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { GlobalService } from './global.service';

export interface articles {
  data: [],
  message: string,
  total: number
}
export interface article {
  data: [],
  message: string,
}
export interface articleSubmitFormat {
  title: string,
  cid: number,
  desc: string,
  content: string,
  img: string
}

@Injectable({
  providedIn: 'root'
})
export class ArticlesService {

  constructor(
    private http: HttpClient,
    private globalVar: GlobalService,
  ) { }

  domain: string = this.globalVar.domain

  getArticlesInfo(
    pageIndex: number,
    pageSize: number,
    sortField: string | null,
    sortOrder: string | null,
    filters: Array<{ key: string; value: string[] }>
  ): Observable<articles> {
    let params = new HttpParams().appendAll({
      "pagesize": pageSize,
      "pagenum": pageIndex
    })

    // .append('page', `${pageIndex}`)
    // .append('results', `${pageSize}`)
    // .append('sortField', `${sortField}`)
    // .append('sortOrder', `${sortOrder}`);

    // filters.forEach(filter => {
    //   filter.value.forEach(value => {
    //     params = params.append(filter.key, value);
    //   });
    // });
    return this.http
      .get<articles>(this.domain + 'controller/article/list',
        { params }).pipe(catchError(() => of(null)));
  }

  getLast3ArticlesInfo(): Observable<article> {
    const url: string = this.domain + "controller/article/list/last";
    return this.http.get<article>(url,).pipe(catchError(() => of(null)));
  }
  getHot3ArticlesInfo(): Observable<article> {
    const url: string = this.domain + "controller/article/list/hot";
    return this.http.get<article>(url,).pipe(catchError(() => of(null)));
  }

  getSingleArticleInfo(id: number): Observable<article> {
    const url: string = this.domain + 'controller/article/';

    return this.http.get<article>(url.concat(String(id)),).pipe(catchError(() => of(null)));
  }

  getSingleArticleContent(url: string): Observable<any> {
    return this.http.get(url, { responseType: 'text' }).pipe(catchError(() => of(null)));
  }

  getArticlesInSameCatalog(cid: number, pageIndex: number, pageSize: number): Observable<articles> {
    const url: string = this.domain + 'controller/article/list/';
    let params = new HttpParams().appendAll({
      "pagesize": pageSize,
      "pagenum": pageIndex
    })
    return this.http.get<articles>(url.concat(String(cid)), { params }).pipe(catchError(() => of(null)));
  }

  deleteArticle(id: number): Observable<{ status: number, message: string }> {
    var url: string = this.domain + 'controller/article/';
    return this.http
      .delete<{ status: number, message: string }>(url.concat(String(id)),
      )
  }

  addArticle(data: articleSubmitFormat): Observable<any> {
    return this.http.post(this.domain + 'controller/article/add',
      data)
  }
  updataArticle(data: articleSubmitFormat, id: number): Observable<any> {
    var url: string = this.domain + 'controller/article/update/'
    return this.http.put(url.concat(String(id)),
      data)
  }

}
