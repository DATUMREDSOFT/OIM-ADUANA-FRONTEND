import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MaterialModule } from '../../../material.module';
import { AuthService } from 'src/app/services/auth.service';
import { CookieService } from 'ngx-cookie-service';
import { LocalStorageService } from '../../../services/local-storage.service';

import { ApiService } from 'src/app/services/api.service';
import Swal from 'sweetalert2';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-boxed-login',
  standalone: true,
  imports: [RouterModule, MaterialModule, FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './boxed-login.component.html',
})
export class AppBoxedLoginComponent implements OnInit {
  form: FormGroup;
  loading = false;
  options = { theme: 'light' };
  private authService = inject(AuthService);
  private localStorageService = inject(LocalStorageService);
  private apiService = inject(ApiService);
  private router = inject(Router);

  constructor(private fb: FormBuilder, private cookieService: CookieService) {
    this.form = this.fb.group({
      user: ['', [Validators.required, Validators.minLength(6)]],
      password: ['', [Validators.required]]
    });
  }

  ngOnInit(): void { }

  get f() { return this.form.controls; }

  async submit() {
    if (this.form.invalid) return;
    this.loading = true;

    const { user, password } = this.form.value;
    try {
      const response: any = await this.authService.login({ user, password, role: null }).toPromise();
      console.log('Login Response (Raw Token):', response);

      if (typeof response === 'string') {
        this.cookieService.set('authToken', response, { path: '/' });
        await this.initializeUserSession();
      } else {
        console.error('Invalid response structure:', response);
        Swal.fire('Error', 'Invalid response from the server', 'error');
      }
    } catch (error) {
      console.error('Login Error:', error);
      Swal.fire('Error', 'Invalid credentials', 'error');
    } finally {
      this.loading = false;
    }
  }

  private async initializeUserSession(): Promise<void> {
    try {
      const token = this.cookieService.get('authToken');
      if (!token) throw new Error('JWT token not found');
      const decodedToken = this.decodeJWT(token);
      console.log('Decoded Token:', decodedToken);
      const userlogin = decodedToken?.sub;
      if (!userlogin) throw new Error('User login not found in token');
      console.log('Extracted User Login:', userlogin);

      const applicantData = await firstValueFrom(this.apiService.request<any>('GET', `dga/form/user/applicant/${userlogin}`));
      const userType = applicantData.userType === 'EXTERNO DGA' ? 'AFPA' : 'INTERNO';
      const document = applicantData.document;

      this.localStorageService.setItem('solicitante', {
        value: applicantData
      }, 1440);


      this.localStorageService.setItem('tipo-usuario', {
        value: userType
      }, 1440);
      console.log('User Type Stored:', userType);

      const requestTypeUrl = userType === 'INTERNO' ? 'interno' : 'AFPA';
      const requestTypes = await firstValueFrom(this.apiService.request<any>('GET', `dga/form/requestype/list/${requestTypeUrl}`));
      const formattedRequestTypes = requestTypes.map((req: any) => ({
        id: req.id,
        value: req.name,
        status: req.status
      }));

      this.localStorageService.setItem('tipo-solicitud', formattedRequestTypes, 1440);
      console.log('Request Types Stored:', formattedRequestTypes);

      const applicantRequest = await firstValueFrom(this.apiService.request<any>('GET', `dga/form/request/applicant/Aplicante/${document}`));
      console.log('Applicant Request Data:', applicantRequest);

      const requestFlow = await firstValueFrom(this.apiService.request<any>('GET', `dga/form/requestflow/list/${document}`));
      console.log('Request Flow Data:', requestFlow);

      // Ensure redirection happens at the end of session initialization
      const redirectTo = userType === 'AFPA' ? '/dashboards/dashboard-afpa' : '/dashboards/dashboard-interno';
      console.log('Redirecting to:', redirectTo);
      this.router.navigate([redirectTo]);
    } catch (error) {
      console.error('Error initializing user session:', error);
      Swal.fire('Error', 'Failed to initialize user session', 'error');
    }
  }

  private decodeJWT(token: string): any {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      return JSON.parse(atob(base64));
    } catch (error) {
      console.error('JWT Decoding Error:', error);
      return null;
    }
  }
}
