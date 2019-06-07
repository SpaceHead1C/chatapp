import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material';

import { RequestsService } from 'src/app/services/requests.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-requests',
  templateUrl: './requests.component.html',
  styleUrls: ['./requests.component.css']
})
export class RequestsComponent implements OnInit {
  requests;

  constructor(
      private requestService: RequestsService,
      private userService: UserService,
      private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.requestService.getMyRequests().subscribe(requests => {
      this.requests = this.userService.getUsers(requests);
    })
  }

  acceptRequest(request) {
    this.requestService.acceptRequest(request).then(() => {
      this.snackBar.open('Friend added', 'OK', { duration: 3000 });
    }); 
  }

  deleteRequest(request) {
    this.requestService.deleteRequest(request).then(() => {
      this.snackBar.open('Request ignored', 'OK', { duration: 3000 });
    });
  }

}
