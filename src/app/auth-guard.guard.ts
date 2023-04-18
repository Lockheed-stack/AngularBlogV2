import { HttpClient, HttpHandler } from '@angular/common/http';
import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { GlobalService } from './services/global.service';
import { catchError, map, of } from 'rxjs';
// import { LoginStatusCheckService } from './services/login-status-check.service';


// export class AuthGuard implements CanActivate {
//   canActivate(
//     route: ActivatedRouteSnapshot,
//     state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

//     console.log(route)
//     console.log(state)

//     return true;
//   }

// }

export const AuthGuard: CanActivateFn = (
  next: ActivatedRouteSnapshot,
  state: RouterStateSnapshot) => {
  // your  logic goes here
  const token = window.sessionStorage.getItem('token');
  const router = inject(Router)
  const http = inject(HttpClient)
  const domain = inject(GlobalService)
  let canBeActived: boolean = false;

  if (!token) {
    next.outlet = '/login';
    return router.parseUrl('/login');
  }

  // check token validation
  return http.post<{ data: string, message: string }>(domain.domain + "controller/checkLoginStatus",
    {}).pipe(
      map(value => {
        if (value.message !== "OK") {
          return router.parseUrl('/login');
        }
        return true;
      }),
      catchError((err,caught)=>{
        return of(router.parseUrl('/login'));
      })
    )


}