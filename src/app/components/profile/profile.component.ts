import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  public user;

  constructor(private userService: UserService) {
    this.userService.currentUser.subscribe(u => {
      this.user = u;
    });
  }

  ngOnInit() {
  }

  updateName() {
    //
  }

  chooseImage() {
    //
  }

}
