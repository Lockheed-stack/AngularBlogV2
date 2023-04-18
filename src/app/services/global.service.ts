import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {

  public domain: string = "https://leelennin.top/";
  public qiniuImgsURL: string = this.domain + "qiniu-img/";
  public qiniuArticleURL: string = this.domain + "qiniu-article/";
  constructor() { }
}
