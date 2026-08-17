export type UserRole = 'ADMIN' | 'CONSULTA';

export interface User {
  id: number;
  nombre: string;
  email: string;
  rol: UserRole;
  created_at?: string;
  updated_at?: string;
}

export type HeroStatus = 'ACTIVO' | 'INACTIVO';

export interface Hero {
  id: number;
  nombre: string;
  nombre_real: string;
  poder_principal: string;
  nivel_poder: number;
  imagen_url: string;
  estado: HeroStatus;
  missions_count?: number;
  created_at?: string;
  updated_at?: string;
}

export type MissionThreatLevel = 'BAJO' | 'MEDIO' | 'ALTO';
export type MissionStatus = 'PENDIENTE' | 'EN_PROGRESO' | 'COMPLETADA';

export interface TargetLocation {
  id: number;
  name?: string;
  city: string;
  country: string;
  country_code?: string;
  latitude?: number;
  longitude?: number;
  created_at?: string;
  updated_at?: string;
}

export interface Mission {
  id: number;
  titulo: string;
  descripcion: string;
  ubicacion?: string;
  fecha: string;
  nivel_peligro: MissionThreatLevel;
  estado: MissionStatus;
  superheroe_id: number;
  target_location_id?: number | null;
  hero?: Hero;
  superheroe?: Hero;
  target_location?: TargetLocation | null;
  created_at?: string;
  updated_at?: string;
}

export interface ApiResponse<T> {
  success?: boolean;
  status?: string;
  message?: string;
  data: T;
}

export interface AuthResponseData {
  user: User;
  access_token: string;
  token_type: string;
  expires_in: number;
}

export interface AuthResponse {
  success?: boolean;
  status?: string;
  message?: string;
  data: AuthResponseData;
}

export interface ApiErrorResponse {
  success?: boolean;
  status?: string;
  message: string;
  errors?: Record<string, string[]>;
}
