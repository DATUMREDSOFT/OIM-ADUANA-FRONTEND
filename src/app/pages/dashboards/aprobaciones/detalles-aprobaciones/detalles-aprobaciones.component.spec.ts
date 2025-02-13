import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetallesAprobacionesComponent } from './detalles-aprobaciones.component';

describe('DetallesAprobacionesComponent', () => {
  let component: DetallesAprobacionesComponent;
  let fixture: ComponentFixture<DetallesAprobacionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetallesAprobacionesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetallesAprobacionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
