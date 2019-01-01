import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';

import { AuthService } from 'src/app/services/auth.service';

const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit {
  usercreds = {
    email: '',
    password: ''
  };

  emailFormControl: FormControl = new FormControl('', [
    Validators.required,
    Validators.pattern(EMAIL_REGEX)
  ]);

  passwordFormControl: FormControl = new FormControl('', [
    Validators.required
  ]);

  constructor(
      private router: Router,
      private auth: AuthService,
      private snackBar: MatSnackBar) { }

  ngOnInit() {
  }

  login() {
    this.usercreds.email = this.emailFormControl.value;
    this.usercreds.password = this.passwordFormControl.value;
    
    this.auth.login(this.usercreds)
        .catch(err => {
          let msg: string;
          switch (err.code) {
            case 'auth/user-not-found':
              msg = 'User not found';
              break;
            case 'auth/wrong-password':
              msg = 'Wrong password';
              break;
            default:
              msg = `Error with code ${err.code}: ${err.message}`;
              break;
          }
          this.snackBar.open(msg, 'Close', { duration: 3000 });
        });
  }

  signup() {
    this.router.navigate(['signup']);
  }

}
