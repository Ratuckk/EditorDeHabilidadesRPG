export type AbilityType = 'physical' | 'magical' | 'psychic' | 'passive';

export type EnergyIcon = 'diamond' | 'sphere' | 'triangle' | 'hexagon';

export interface Ability {
  id: string;
  type: AbilityType;
  energyIcon: EnergyIcon;
  level: number;
  name: string;
  rechargeTime: string; // AC - Ação ou Turno (texto livre)
  mpCost: string; // Mudado para string para permitir texto livre
  hpCost: string; // Mudado para string para permitir texto livre
  damage: string;
  element1: string;
  element2: string;
  speed: string; // Velocidade (texto livre)
  castingSpeed: string; // Velocidade de conjuração (select)
  range: string;
  description: string;
  effect: string;
  icon?: string;
}

export interface ElementKeyword {
  code: string;
  hex: string;
}

export const ELEMENT_KEYWORDS: ElementKeyword[] = [
  { code: 'CRYO', hex: '#00BFFF' },
  { code: 'RAIN', hex: '#1E90FF' },
  { code: 'SOUL', hex: '#9370DB' },
  { code: 'GENO', hex: '#8B0000' },
  { code: 'WOOD', hex: '#228B22' },
  { code: 'FUNG', hex: '#556B2F' },
  { code: 'STAR', hex: '#FFD700' },
  { code: 'CELL', hex: '#32CD32' },
  { code: 'SONG', hex: '#FF69B4' },
  { code: 'BLOD', hex: '#B22222' },
  { code: 'CLOD', hex: '#8B4513' },
  { code: 'BOMB', hex: '#FF4500' },
  { code: 'IRON', hex: '#708090' },
  { code: 'HOLY', hex: '#FFFFE0' },
  { code: 'VODO', hex: '#4B0082' },
  { code: 'MEAT', hex: '#CD5C5C' },
  { code: 'ELEC', hex: '#FFD700' },
  { code: 'ACID', hex: '#ADFF2F' },
  { code: 'BONE', hex: '#F5F5DC' },
  { code: 'TIME', hex: '#DAA520' },
  { code: 'AQUA', hex: '#00FFFF' },
  { code: 'AERO', hex: '#87CEEB' },
  { code: 'IGNI', hex: '#FF4500' },
  { code: 'ROCK', hex: '#8B4513' },
  { code: 'ZERO', hex: '#E6E6FA' },
  { code: 'MANA', hex: '#7B68EE' },
  { code: 'MIND', hex: '#9932CC' },
  { code: 'LUZI', hex: '#FFDAB9' },
  { code: 'DARK', hex: '#000000' },
  { code: 'LEAF', hex: '#228B22' },
  { code: 'TOXI', hex: '#9ACD32' },
  { code: 'ETER', hex: '#BA55D3' },
  { code: 'IKNI', hex: '#FF6347' },
  { code: 'GRAV', hex: '#2F4F4F' },
];

export const SPEED_TYPES = [
  'CHARGE',
  'NORMAL',
  'NIMBLE',
  'BURST',
  'AMBUSH',
  'INSTANT',
  'Item effect',
  'Passive effect',
];