import { colors } from '../theme/colors';
import { MissionThreatLevel, MissionStatus, HeroStatus, UserRole, TargetLocation } from '../types';

export const formatMissionDate = (dateString?: string): string => {
  if (!dateString) return 'TBD';
  try {
    const parts = dateString.split('-');
    if (parts.length === 3) {
      const year = parts[0];
      const monthIndex = parseInt(parts[1], 10) - 1;
      const day = parts[2];
      const months = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC'];
      const monthName = months[monthIndex] || parts[1];
      return `${day} ${monthName} ${year}`;
    }
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).toUpperCase();
  } catch {
    return dateString;
  }
};

export const getPowerColor = (level: number): string => {
  if (level >= 90) return '#ff3366'; // High Cosmic Danger / Red
  if (level >= 75) return '#ffd700'; // Alpha / Gold
  if (level >= 50) return '#00e5ff'; // Beta / Arc Cyan
  return '#38bdf8'; // Standard / Blue
};

export const getThreatColor = (level: MissionThreatLevel): { bg: string; text: string; border: string } => {
  switch (level) {
    case 'ALTO':
      return {
        bg: 'rgba(255, 51, 102, 0.15)',
        text: colors.dangerHigh,
        border: colors.borderDanger,
      };
    case 'MEDIO':
      return {
        bg: 'rgba(255, 178, 41, 0.15)',
        text: colors.dangerMedium,
        border: 'rgba(255, 178, 41, 0.4)',
      };
    case 'BAJO':
    default:
      return {
        bg: 'rgba(0, 229, 255, 0.15)',
        text: colors.dangerLow,
        border: colors.borderCyan,
      };
  }
};

export const getStatusColor = (status: MissionStatus | HeroStatus): { bg: string; text: string; border: string } => {
  switch (status) {
    case 'COMPLETADA':
    case 'ACTIVO':
      return {
        bg: 'rgba(0, 230, 118, 0.15)',
        text: colors.statusActive,
        border: 'rgba(0, 230, 118, 0.4)',
      };
    case 'EN_PROGRESO':
      return {
        bg: 'rgba(0, 229, 255, 0.15)',
        text: colors.primary,
        border: colors.borderCyan,
      };
    case 'PENDIENTE':
      return {
        bg: 'rgba(255, 178, 41, 0.15)',
        text: colors.statusPending,
        border: 'rgba(255, 178, 41, 0.4)',
      };
    case 'INACTIVO':
    default:
      return {
        bg: 'rgba(100, 116, 139, 0.15)',
        text: colors.statusInactive,
        border: 'rgba(100, 116, 139, 0.4)',
      };
  }
};

export const getClearanceColor = (role: UserRole): { bg: string; text: string; border: string } => {
  if (role === 'ADMIN') {
    return {
      bg: 'rgba(255, 215, 0, 0.15)',
      text: colors.secondary,
      border: colors.borderGold,
    };
  }
  return {
    bg: 'rgba(0, 229, 255, 0.15)',
    text: colors.primary,
    border: colors.borderCyan,
  };
};

export const formatMissionLocation = (
  targetLocation?: TargetLocation | null,
  rawUbicacion?: string
): string => {
  if (targetLocation && (targetLocation.city || targetLocation.country)) {
    const parts = [targetLocation.city, targetLocation.country].filter(Boolean);
    return parts.join(', ');
  }
  if (rawUbicacion) {
    return rawUbicacion;
  }
  return 'Zona Táctica Global';
};
