import { Injectable, Signal, signal } from '@angular/core';
import { ApiService } from './api.service';
import { System } from '../pages/dashboards/solicitud-base/models/system.model';
import { Profile } from '../pages/dashboards/solicitud-base/models/profile.model';
import { Aduana } from '../models/aduana.model';
import { lastValueFrom } from 'rxjs';
import { TipoUsuarioService } from './tipo-usuario.service';
import { inject } from '@angular/core';
import { Roles } from '../enums/roles.enum';

@Injectable({
  providedIn: 'root',
})
export class DropdownDataService {
    private readonly apiService = inject(ApiService);
    private readonly tipoUsuarioService = inject(TipoUsuarioService);
  
    private sistemasCache = signal<System[]>([]);
    private perfilesCache = signal<Profile[]>([]);
    private aduanasCache = signal<Aduana[]>([]);
    private gruposSistemaCache = new Map<string, Signal<any[]>>(); // Cache for system groups
  
    constructor() {}
  
    /**
     * ✅ Dynamically determine role to pass in the API request
     */
    private determineRole(): string {
        const tipoUsuario = this.tipoUsuarioService.getTipoUsuario();
        console.log("🔍 User Role from `tipoUsuarioService`:", tipoUsuario); // Log what we get
      
        if (!tipoUsuario) {
          console.warn("⚠️ No user role found! Defaulting to 'Externo'.");
          return 'Externo';  // Fallback to prevent `undefined`
        }
      
        return tipoUsuario === Roles.NOAFPA ? 'Externo' : tipoUsuario;
      }
      
  
    /**
     * ✅ Fetch Systems Based on User Role
     */
    async obtenerSistemas(): Promise<void> {
      if (this.sistemasCache().length === 0) {
        const role = this.determineRole(); // Get dynamic role
        const response = await lastValueFrom(
          this.apiService.request<System[]>('GET', `dga/form/request/list/system/${role}`)
        );
        this.sistemasCache.set(response);

      }
    }
  
    /**
     * ✅ Fetch Profiles Based on User Role
     */
    async obtenerPerfiles(): Promise<void> {
      if (this.perfilesCache().length === 0) {
        const role = this.determineRole();
        const response = await lastValueFrom(
          this.apiService.request<Profile[]>('GET', `dga/form/request/list/profile/${role}`)
        );
        this.perfilesCache.set(response);
      }
    }
    
  
    /**
     * ✅ Fetch Customs (Aduanas)
     */
    async obtenerAduanas(): Promise<void> {
      if (this.aduanasCache().length === 0) {
        const response = await lastValueFrom(
          this.apiService.request<Aduana[]>('GET', 'dga/form/request/list/customs')
        );
        this.aduanasCache.set(response);
      }
    }
  
    /**
     * ✅ Fetch System Groups Dynamically Based on Selected System
     * - Uses an in-memory cache for faster repeated requests.
     */
    async obtenerGruposPorSistema(systemId: string): Promise<void> {
      if (!this.gruposSistemaCache.has(systemId)) {
        this.gruposSistemaCache.set(systemId, signal([]));
      }
  
      const currentCache = this.gruposSistemaCache.get(systemId)!;
      if (currentCache().length === 0) {
        const response = await lastValueFrom(
          this.apiService.request<any[]>('GET', `dga/form/request/list/system/group/${systemId}`)
        );
        currentCache.apply(() => response);
      }
    }
  
    // ✅ Expose signals for components
    get sistemas(): Signal<System[]> {
      return this.sistemasCache;
    }
  
    get perfiles(): Signal<Profile[]> {
      return this.perfilesCache;
    }
  
    get aduanas(): Signal<Aduana[]> {
      return this.aduanasCache;
    }
  
    getGruposSistema(systemId: string): Signal<any[]> {
      if (!this.gruposSistemaCache.has(systemId)) {
        this.gruposSistemaCache.set(systemId, signal([]));
      }
      return this.gruposSistemaCache.get(systemId)!;
    }
  }
