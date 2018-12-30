import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, Validators } from '@angular/forms';

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

  constructor(private router: Router, private auth: AuthService) { }

  ngOnInit() {
  }

  login() {
    this.usercreds.email = this.emailFormControl.value;
    this.usercreds.password = this.passwordFormControl.value;
    this.auth.login(this.usercreds);
  }

  signup() {
    this.router.navigate(['signup']);
  }

}
