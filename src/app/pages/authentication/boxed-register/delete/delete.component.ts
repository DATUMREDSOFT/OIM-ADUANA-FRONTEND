import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-register',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
  templateUrl: './delete.component.html',
})
export class AppDeleteRegistryComponent {
  constructor(public dialogRef: MatDialogRef<AppDeleteRegistryComponent>) {}

  deletePersonal() {
    this.dialogRef.close(true);
  }
}

