import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, Validators } from '@angular/forms';

import { AuthService } from 'src/app/services/auth.service';

const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;


@Component({
  selector: 'app-signup-page',
  templateUrl: './signup-page.component.html',
  styleUrls: ['./signup-page.component.css']
})
export class SignupPageComponent implements OnInit {
  usercreds = {
    email: '',
    password: '',
    displayName: ''
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

  goBack() {
    this.router.navigate(['/login']);
  }

  createAccount() {
    this.usercreds.email = this.emailFormControl.value;
    this.usercreds.password = this.passwordFormControl.value;
    this.auth.signUp(this.usercreds);
  }

}
