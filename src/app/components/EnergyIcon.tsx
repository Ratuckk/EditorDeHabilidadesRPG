import { EnergyIcon as EnergyIconType } from '../types/ability';

interface EnergyIconProps {
  type: EnergyIconType;
  className?: string;
}

export function EnergyIcon({ type, className = '' }: EnergyIconProps) {
  const baseClass = `inline-block ${className}`;

  switch (type) {
    case 'diamond':
      return (
        <svg
          viewBox="0 0 24 24"
          className={baseClass}
          fill="currentColor"
          aria-label="Físico"
        >
          <path d="M12 2L2 12L12 22L22 12L12 2Z" />
        </svg>
      );
    case 'sphere':
      return (
        <svg
          viewBox="0 0 24 24"
          className={baseClass}
          fill="currentColor"
          aria-label="Mágico"
        >
          <circle cx="12" cy="12" r="10" />
        </svg>
      );
    case 'triangle':
      return (
        <svg
          viewBox="0 0 24 24"
          className={baseClass}
          fill="currentColor"
          aria-label="Psíquico"
        >
          <path d="M12 2L22 20H2L12 2Z" />
        </svg>
      );
    case 'hexagon':
      return (
        <svg
          viewBox="0 0 24 24"
          className={baseClass}
          fill="currentColor"
          aria-label="Passiva"
        >
          <path d="M12 2L20 7V17L12 22L4 17V7L12 2Z" />
        </svg>
      );
  }
}
