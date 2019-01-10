import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material';

import { UserService } from 'src/app/services/user.service';
import { RequestsService } from 'src/app/services/requests.service';

@Component({
  selector: 'app-add-friend',
  templateUrl: './add-friend.component.html',
  styleUrls: ['./add-friend.component.css']
})
export class AddFriendComponent implements OnInit {
  users;

  constructor(
      private userService: UserService,
      private requestsService: RequestsService,
      private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.userService.getAllUsers().subscribe(users => {
      this.users = users;
    });
  }

  addFriend(user) {
    this.requestsService.addRequest(user.email).then(() => {
      this.snackBar.open('Request sent', 'OK', { duration: 3000 });
    });
  }

}
