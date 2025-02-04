import { inject, Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CargandoService {
  private readonly spinner = inject(NgxSpinnerService);
  private cargandoSubject = new BehaviorSubject<boolean>(false);
  private spinnerTimeout!: ReturnType<typeof setTimeout>;
  cargando$ = this.cargandoSubject.asObservable();

  constructor() {
    this.cargando$.subscribe((c) => {
      if (c) this.spinner.show();
      else this.spinner.hide();
    });
  }

  empezarCarga(): void {
    this.cargandoSubject.next(true);
    this.spinnerTimeout = setTimeout(() => {
      this.pararCarga();
    }, 40000);
  }

  pararCarga(): void {
    this.cargandoSubject.next(false);
    if (this.spinnerTimeout) {
      clearTimeout(this.spinnerTimeout);
    }
  }

  destruir(): void {
    this.cargandoSubject.unsubscribe();
  }
}
