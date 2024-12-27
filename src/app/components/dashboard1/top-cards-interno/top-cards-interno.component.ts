import { Component, Input, Output, EventEmitter, OnInit, SimpleChanges } from '@angular/core';
import { MaterialModule } from '../../../material.module';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-top-cards-interno',
  templateUrl: './top-cards-interno.component.html',
  standalone: true,
  imports: [MaterialModule, CommonModule]
})
export class AppTopCardsInternoComponent implements OnInit {
  @Output() cardClick = new EventEmitter<string>();

  usersCount: number = 0;
  digitadoresCount: number = 0;
  webServiceCount: number = 0;
  pendingRequestsCount: number = 0;

  constructor() {}

  ngOnInit() {
    this.fetchCardData();
  }

  fetchCardData() {
    // Mock data
    const data = {
      usersCount: 12,
      digitadoresCount: 4,
      webServiceCount: 8,
      pendingRequestsCount: 4
    };

    this.usersCount = data.usersCount;
    this.digitadoresCount = data.digitadoresCount;
    this.webServiceCount = data.webServiceCount;
    this.pendingRequestsCount = data.pendingRequestsCount;
  }

  onCardClick(cardType: string) {
    this.cardClick.emit(cardType);
  }
}