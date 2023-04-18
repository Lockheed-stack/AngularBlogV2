import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, timeInterval } from 'rxjs';
import { GlobalService } from '../services/global.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(
    private http: HttpClient,
    private router: Router,
    private globalVar: GlobalService,
  ) { }

  // value from global
  domain: string = this.globalVar.domain;

  hidePassword: boolean = true;
  signinForm: FormGroup;

  signInSuccess: boolean = null;
  btnSubmitClicked: boolean = false;
  btnSubmitDisabled: boolean = false;
  showProgressSpin: boolean = false;
  loginErrMsg:string = "";



  ngOnInit(): void {
    this.signinForm = new FormGroup({
      'username': new FormControl(null, [Validators.required]),
      'password': new FormControl(null, Validators.required),
    });
  }

  onSubmit(): void {
    this.signInSuccess = null;
    this.btnSubmitClicked = true;
    this.btnSubmitDisabled = true;

    this.showProgressSpin = true;
    // Check form validation
    if (this.signinForm.get('username').invalid || this.signinForm.get('password').invalid) {
      this.showProgressSpin = false;
      this.btnSubmitDisabled = false;
      this.btnSubmitClicked = false;
      return;
    }

    const postData = {
      'username': this.signinForm.get('username').value,
      'password': this.signinForm.get('password').value,
    };

    this.http.post<{ message: string, status: number, token: string }>(
      this.domain + 'controller/login', postData
    ).subscribe(
      {
        next: (value) => {
          if (value.status === 400 || value.token === "") {
            this.loginErrMsg = "用户名或密码错误";
            this.signInSuccess = false;
            this.showProgressSpin = false;
            this.btnSubmitDisabled = false;
          }
          else {
            this.signInSuccess = true;
            window.sessionStorage.setItem('token', value.token);
            setTimeout(() => {
              this.router.navigate(['/blogadmin']);
            }, 1000)
            this.showProgressSpin = false;
          }
        },
        error: (err) => {
          this.loginErrMsg = "请检查网络"
          this.signInSuccess = false;
          this.showProgressSpin = false;
          this.btnSubmitDisabled = false;
        }
      }
    );
  }

  onWarningBannerClose() {
    this.btnSubmitClicked = false;
  }


  // onAddSecret() {
  //   const control = new FormControl(null, Validators.required);
  //   (<FormArray>this.signinForm.get('secrets')).push(control);
  // }

  // forbiddenUsernames = ['Chris', 'Anna'];
  // forbiddenNames(control: FormControl): { [s: string]: boolean } {
  //   if (this.forbiddenUsernames.indexOf(control.value) !== -1) {
  //     return { 'nameIsForbidden': true };
  //   }
  //   return null;
  // }

  // forbiddenEmails(control: FormControl): Promise<any> | Observable<any> {
  //   const promise = new Promise<any>((resolve, reject) => {
  //     setTimeout(() => {
  //       if (control.value === 'test@test.com') {
  //         resolve({ 'emailIsForbidden': true });
  //       } else {
  //         resolve(null);
  //       }
  //     }, 1500);
  //   });
  //   return promise;
  // }
}
