import { Component } from '@angular/core';
import { MaterialModule } from '../../../../material.module';
import { TablerIconsModule } from 'angular-tabler-icons';

@Component({
  selector: 'app-solicitudes-finalizadas',
  standalone: true,
  imports: [MaterialModule, TablerIconsModule],
  templateUrl: './solicitudes-finalizadas.component.html',
})
export class AppFinishedRequests {}
