import { useRef } from 'react';
import { Ability, AbilityType, ELEMENT_KEYWORDS } from '../types/ability';
import { EnergyIcon } from './EnergyIcon';
import { FormattedText } from './FormattedText';
import { Button } from './ui/button';
import { Download } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import html2canvas from 'html2canvas';

interface AbilityPreviewProps {
  ability: Ability;
}

export function AbilityPreview({ ability }: AbilityPreviewProps) {
  const previewRef = useRef<HTMLDivElement>(null);

  const getTypeFlatColor = (type: AbilityType): string => {
    switch (type) {
      case 'physical':
        return '#F59E0B'; // Amarelo/Laranja
      case 'magical':
        return '#3B82F6'; // Azul
      case 'psychic':
        return '#EC4899'; // Rosa
      case 'passive':
        return '#6B7280'; // Cinza
    }
  };

  const getDarkerFlatColor = (type: AbilityType): string => {
    switch (type) {
      case 'physical':
        return '#D97706'; // Amarelo/Laranja escuro
      case 'magical':
        return '#1E40AF'; // Azul escuro
      case 'psychic':
        return '#BE185D'; // Rosa escuro
      case 'passive':
        return '#4B5563'; // Cinza escuro
    }
  };

  const getEvenDarkerFlatColor = (type: AbilityType): string => {
    switch (type) {
      case 'physical':
        return '#B45309'; // Amarelo/Laranja mais escuro
      case 'magical':
        return '#1E3A8A'; // Azul mais escuro
      case 'psychic':
        return '#9D174D'; // Rosa mais escuro
      case 'passive':
        return '#374151'; // Cinza mais escuro
    }
  };

  const getElementColor = (elementCode: string): string => {
    const element = ELEMENT_KEYWORDS.find(e => e.code === elementCode.toUpperCase());
    return element ? element.hex : '#FFFFFF';
  };

  const getElement1Color = (element1: string, element2: string): string => {
    // Se elemento 1 for PURE, usa a cor do elemento 2
    if (element1.toUpperCase() === 'PURE') {
      return getElementColor(element2);
    }
    return getElementColor(element1);
  };

  const formatCastingSpeed = (speed: string): string => {
    const speedsWithAbility = ['NORMAL', 'NIMBLE', 'INSTANT', 'CHARGE', 'BURST', 'AMBUSH'];
    if (speedsWithAbility.includes(speed.toUpperCase())) {
      return `${speed} ABILITY`;
    }
    return speed;
  };

  const typeColor = getTypeFlatColor(ability.type);
  const darkerColor = getDarkerFlatColor(ability.type);
  const evenDarkerColor = getEvenDarkerFlatColor(ability.type);

  const formatCosts = (): JSX.Element[] => {
    const parts: JSX.Element[] = [];
    
    if (ability.rechargeTime) {
      parts.push(
        <span key="recharge" style={{ fontFamily: "'Open Sans', sans-serif", fontWeight: 800 }}>
          {ability.rechargeTime}
        </span>
      );
    }
    
    if (ability.mpCost) {
      if (parts.length > 0) parts.push(<span key="sep1"> / </span>);
      parts.push(
        <span key="mp" style={{ color: '#3B82F6', fontFamily: "'Open Sans', sans-serif", fontWeight: 800 }}>
          {ability.mpCost}MP
        </span>
      );
    }
    
    if (ability.hpCost) {
      if (parts.length > 0) parts.push(<span key="sep2"> / </span>);
      parts.push(
        <span key="hp" style={{ color: '#EF4444', fontFamily: "'Open Sans', sans-serif", fontWeight: 800 }}>
          {ability.hpCost}HP
        </span>
      );
    }
    
    if (ability.damage) {
      if (parts.length > 0) parts.push(<span key="sep3"> / </span>);
      parts.push(
        <span key="damage" style={{ fontFamily: "'Open Sans', sans-serif", fontWeight: 800 }}>
          {ability.damage}
        </span>
      );
    }
    
    return parts.length > 0 ? parts : [<span key="empty">—</span>];
  };

  const handleExportImage = async (format: 'png' | 'jpeg') => {
    if (!previewRef.current) return;

    try {
      const canvas = await html2canvas(previewRef.current, {
        backgroundColor: null,
        scale: 2,
        logging: false,
      });

      canvas.toBlob((blob) => {
        if (!blob) return;
        
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${ability.name || 'habilidade'}-${Date.now()}.${format}`;
        a.click();
        URL.revokeObjectURL(url);
        
        toast.success(`Habilidade exportada como ${format.toUpperCase()}!`);
      }, `image/${format}`);
    } catch (error) {
      toast.error('Erro ao exportar imagem!');
      console.error(error);
    }
  };

  return (
    <div className="space-y-3">
      {/* Botões de exportação */}
      <div className="flex gap-2 justify-end">
        <Button
          onClick={() => handleExportImage('png')}
          size="sm"
          variant="outline"
          className="bg-gray-800 text-white border-gray-700 hover:bg-gray-700"
        >
          <Download className="w-4 h-4 mr-2" />
          Exportar PNG
        </Button>
        <Button
          onClick={() => handleExportImage('jpeg')}
          size="sm"
          variant="outline"
          className="bg-gray-800 text-white border-gray-700 hover:bg-gray-700"
        >
          <Download className="w-4 h-4 mr-2" />
          Exportar JPEG
        </Button>
      </div>

      {/* Preview */}
      <div ref={previewRef} className="w-full p-3 rounded-2xl shadow-2xl" style={{ backgroundColor: typeColor }}>
        <div className="bg-white rounded-xl overflow-hidden">
          {/* Cabeçalho */}
          <div className="relative pt-6 pb-6 px-6" style={{ backgroundColor: typeColor }}>
            <div className="flex items-start gap-4">
              {/* Ícone de Energia - menor e mais à esquerda */}
              <div className="flex-shrink-0 flex items-center justify-center">
                <EnergyIcon type={ability.energyIcon} className="w-14 h-14 text-white drop-shadow-lg" />
              </div>
              
              <div className="flex-1 min-w-0">
                {/* Primeira linha: Nível e Nome em bloco escuro com status */}
                <div className="bg-black/30 rounded px-4 py-3 mb-3">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="text-white px-3 py-1 bg-black/20 rounded" style={{ fontFamily: "'Open Sans', sans-serif", fontWeight: 800, fontSize: '1.25rem' }}>
                        LV {ability.level}
                      </span>
                      <h1 className="text-white uppercase tracking-wide" style={{ fontFamily: "'Open Sans', sans-serif", fontWeight: 800, fontSize: '1.25rem' }}>
                        {ability.name || 'NOME DA HABILIDADE'}
                      </h1>
                    </div>
                    
                    {/* Custos dentro do bloco */}
                    <div className="text-white" style={{ fontFamily: "'Open Sans', sans-serif", fontWeight: 800, fontSize: '1.25rem' }}>
                      {formatCosts()}
                    </div>
                  </div>
                </div>

                {/* Segunda linha: Elementos + Velocidade de Conjuração */}
                <div className="flex items-center gap-3 mb-2">
                  <div className="flex items-center gap-2">
                    <span 
                      className="uppercase tracking-wider px-2 py-1 rounded bg-gray-800"
                      style={{ 
                        color: getElement1Color(ability.element1, ability.element2),
                        fontFamily: "'Open Sans', sans-serif",
                        fontWeight: 800,
                        fontSize: '1.25rem'
                      }}
                    >
                      {ability.element1 || 'ELEM'}
                    </span>
                    <span className="text-white" style={{ fontFamily: "'Open Sans', sans-serif", fontWeight: 800, fontSize: '1.25rem' }}>/</span>
                    <span 
                      className="uppercase tracking-wider px-2 py-1 rounded bg-gray-800"
                      style={{ 
                        color: getElementColor(ability.element2),
                        fontFamily: "'Open Sans', sans-serif",
                        fontWeight: 800,
                        fontSize: '1.25rem'
                      }}
                    >
                      {ability.element2 || 'ELEM'}
                    </span>
                  </div>
                  
                  {/* Velocidade de Conjuração ao lado dos elementos */}
                  {ability.castingSpeed && (
                    <div className="bg-green-400 text-black px-3 py-1.5 rounded uppercase tracking-wide" style={{ fontFamily: "'Open Sans', sans-serif", fontWeight: 800, fontSize: '1.25rem' }}>
                      {formatCastingSpeed(ability.castingSpeed)}
                    </div>
                  )}
                </div>

                {/* Terceira linha: SPD e Alcance */}
                <div className="flex items-center gap-3">
                  {ability.speed && (
                    <div className="bg-yellow-400 text-black px-3 py-1 rounded" style={{ fontFamily: "'Open Sans', sans-serif", fontWeight: 800, fontSize: '1.25rem' }}>
                      SPD: {ability.speed}
                    </div>
                  )}
                  {ability.range && (
                    <div className="flex items-center gap-2 bg-gray-800 px-3 py-1 rounded">
                      <span className="text-white" style={{ fontFamily: "'Open Sans', sans-serif", fontWeight: 800, fontSize: '1.25rem' }}>
                        ALCANCE: {ability.range}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Descrição - 35% maior, padding 20% menor */}
          <div className="px-8 py-12 min-h-[300px]" style={{ backgroundColor: darkerColor }}>
            {!ability.description && (
              <h2 className="text-white text-center mb-8 uppercase tracking-wider text-xl" style={{ fontFamily: "'Open Sans', sans-serif", fontWeight: 800 }}>
                DESCRIÇÃO
              </h2>
            )}
            <div className="text-left">
              <FormattedText 
                text={ability.description || ''} 
                className="text-white leading-relaxed" 
                style={{ fontFamily: "'Open Sans', sans-serif", fontWeight: 800, fontSize: '1.35rem' }}
              />
            </div>
          </div>

          {/* Efeito - 25% maior, padding 20% menor */}
          <div className="px-8 py-12 min-h-[350px]" style={{ backgroundColor: evenDarkerColor }}>
            {!ability.effect && (
              <h2 className="text-white text-center mb-8 uppercase tracking-wider text-xl" style={{ fontFamily: "'Open Sans', sans-serif", fontWeight: 800 }}>
                EFEITO
              </h2>
            )}
            <div className="text-left">
              <FormattedText 
                text={ability.effect || ''} 
                className="text-white leading-relaxed" 
                style={{ fontFamily: "'Open Sans', sans-serif", fontWeight: 800, fontSize: '1.25rem' }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}