import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Request {
  id: string;
  reason: string;
  status: 'draft' | 'sent';
  date: Date;
}

@Injectable({
  providedIn: 'root'
})
export class RequestService {
  private drafts = new BehaviorSubject<Request[]>([
    { id: '1', reason: 'justificacion borrador 1', status: 'draft', date: new Date() },
    { id: '2', reason: 'justificacion borrador 2', status: 'draft', date: new Date() }
  ]);
  private sentRequests = new BehaviorSubject<Request[]>([
    { id: '3', reason: 'Enviada justificacion 1', status: 'sent', date: new Date() },
    { id: '4', reason: 'Enviada justificacion 2', status: 'sent', date: new Date() }
  ]);

  drafts$ = this.drafts.asObservable();
  sentRequests$ = this.sentRequests.asObservable();

  saveAsDraft(request: Request) {
    const currentDrafts = this.drafts.value;
    this.drafts.next([...currentDrafts, request]);
  }

  sendRequest(request: Request) {
    const currentSentRequests = this.sentRequests.value;
    this.sentRequests.next([...currentSentRequests, request]);
  }
}