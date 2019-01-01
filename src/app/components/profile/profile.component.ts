import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material';

import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  public user;
  public nicknameEdit: boolean = false;
  public newNickname: string;
  public selectedFiles: FileList;

  constructor(private userService: UserService, private snackBar: MatSnackBar) {
    this.userService.currentUser.subscribe(u => {
      this.user = u;
    });
  }

  ngOnInit() {
  }

  editName() {
    this.nicknameEdit = !this.nicknameEdit;
  }

  updateName() {
    this.userService.updateNickname(this.newNickname).then(() => {
      this.editName();
      this.newNickname = '';
    }).catch((err) => {
      this.snackBar.open(err.message, 'Close', { duration: 5000 });
    });
  }

  chooseImage(event) {
    this.selectedFiles = event.target.files;
    if (this.selectedFiles.item(0)) {
      this.userService.updateProfilePic(this.selectedFiles.item(0))
          .catch(err => {
            console.log(err);
            this.snackBar.open(err.message, 'Close', { duration: 5000 });
          });
    }
  }

}
