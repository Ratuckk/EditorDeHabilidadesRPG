import { ELEMENT_KEYWORDS } from '../types/ability';

export interface FormattedTextPart {
  text: string;
  color?: string;
  isBracket?: boolean;
  isBrace?: boolean;
}

export function formatText(text: string): FormattedTextPart[] {
  if (!text) return [];

  const parts: FormattedTextPart[] = [];
  let currentIndex = 0;

  // Regex para encontrar [texto], {texto} e palavras-chave
  const regex = /\[([^\]]+)\]|\{([^}]+)\}|(\b[A-Z]{4}\b)/g;
  let match;

  while ((match = regex.exec(text)) !== null) {
    // Adiciona texto antes do match
    if (match.index > currentIndex) {
      const beforeText = text.substring(currentIndex, match.index);
      parts.push({ text: beforeText });
    }

    if (match[1]) {
      // [colchetes] - texto em vermelho
      parts.push({ text: match[1], isBracket: true, color: '#FF0000' });
    } else if (match[2]) {
      // {chaves} - texto em azul
      parts.push({ text: match[2], isBrace: true, color: '#0000FF' });
    } else if (match[3]) {
      // Palavra-chave de 4 letras
      const keyword = ELEMENT_KEYWORDS.find(k => k.code === match[3]);
      if (keyword) {
        parts.push({ text: match[3], color: keyword.hex });
      } else {
        parts.push({ text: match[3] });
      }
    }

    currentIndex = regex.lastIndex;
  }

  // Adiciona texto restante
  if (currentIndex < text.length) {
    parts.push({ text: text.substring(currentIndex) });
  }

  return parts;
}

export function processLineBreaks(text: string): string[] {
  return text.split('`');
}

export function capitalizeText(text: string): string {
  if (!text) return '';
  
  // Primeira letra maiúscula
  let result = text.charAt(0).toUpperCase() + text.slice(1);
  
  // Primeira letra após ponto
  result = result.replace(/\.\s+([a-z])/g, (match, letter) => {
    return '. ' + letter.toUpperCase();
  });
  
  return result;
}
