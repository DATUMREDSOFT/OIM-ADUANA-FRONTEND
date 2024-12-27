import { Component } from '@angular/core';
import { MaterialModule } from '../../../../material.module';
import { TablerIconsModule } from 'angular-tabler-icons';

@Component({
  selector: 'app-solicitudes-no-iniciadas',
  standalone: true,
  imports: [MaterialModule, TablerIconsModule],
  templateUrl: './solicitudes-no-iniciadas.component.html',
})
export class AppNotStartedRequests {}
