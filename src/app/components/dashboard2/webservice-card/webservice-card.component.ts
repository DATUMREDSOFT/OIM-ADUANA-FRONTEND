import { Component } from '@angular/core';
import { MaterialModule } from '../../../material.module';
import { TablerIconsModule } from 'angular-tabler-icons';

@Component({
  selector: 'app-webservice-card',
  standalone: true,
  imports: [MaterialModule, TablerIconsModule],
  templateUrl: './webservice-card.component.html',
})
export class AppWebServiceCardComponent {}
