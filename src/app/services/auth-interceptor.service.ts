import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';


export class AuthInterceptorService implements HttpInterceptor {

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const cloneReq = req.clone(
      {
        headers: req.headers.append('Authorization', 'Bearer '.concat(window.sessionStorage
          .getItem('token')))
      })

    return next.handle(cloneReq);
  }
  constructor() { }
}
