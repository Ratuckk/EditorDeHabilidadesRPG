import { Ability, AbilityType, EnergyIcon as EnergyIconType, SPEED_TYPES } from '../types/ability';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { EnergyIcon } from './EnergyIcon';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { HelpCircle } from 'lucide-react';

interface AbilityEditorProps {
  ability: Ability;
  onChange: (ability: Ability) => void;
}

const tooltips = {
  level: "Determina o nível da habilidade, respectivamente: Inferior(1), Intermediário (2), Superior (3), Absoluto (4) e Ritual (5).",
  name: "Nome da Habilidade: Indica o título completo da habilidade. Quando a habilidade for derivada de um arquétipo, o nome deve iniciar com o arquétipo, seguido de dois-pontos e do nome distintivo da habilidade.",
  recharge: "Define o tempo de recarga necessário antes que a habilidade possa ser usada novamente. Ações (AC): a cada ação realizada, o tempo de recarga diminui. Turnos (T): o tempo de recarga reduz somente ao final de cada turno.",
  mp: "Indica o custo em Energia (EN) para conjurar a habilidade. Esse custo pode ser expresso em valor fixo ou porcentagem do total de energia do personagem.",
  hp: "Define o custo alternativo para conjuração, que pode consumir Health Points (HP) ou Energy Shield (ES). Este campo permite escrita livre, possibilitando diferentes formatos de custo além de apenas HP.",
  damage: "Representa o valor de dano causado pela habilidade. Deve ser acompanhado do tipo de dano, conforme a sigla: PA – Psíquico, MA – Mágico, A – Físico, DMG – Dano puro (sem tipo, pode ser defendido por qualquer forma), ADMG – Dano absoluto (ignora defesas). O dano também pode ser indicado em porcentagem, se aplicável.",
  elements: "Lista os elementos associados à habilidade. Caso a habilidade pertença a apenas um elemento, utilize a marcação PURE no primeiro campo e o nome do elemento no segundo. Exemplo: PURE/IGNI",
  speed: "Determina a velocidade de disparo ou execução da habilidade. Esse valor é utilizado em testes de reação, esquiva e em outros fatores que dependam de rapidez.",
  castingSpeed: "Define a velocidade com que a habilidade é conjurada. Velocidades especiais como NORMAL, NIMBLE, INSTANT, CHARGE, BURST e AMBUSH adicionam automaticamente a palavra ABILITY na pré-visualização.",
  range: "Define o alcance efetivo da habilidade, medido em metros, além de especificar o formato da área de efeito. Exemplo: 'Cone de 12 metros, com a ponta iniciando no usuário.'",
  description: "Campo voltado ao roleplay. Descreve como a habilidade é conjurada, sua forma, movimento, visual e manifestação dentro da narrativa.",
  effect: "Apresenta o efeito mecânico em jogo da habilidade, descrevendo o que ela faz e como interage com o sistema. Informações adicionais ou condições especiais devem ser incluídas após um travessão (–)."
};

const LabelWithTooltip = ({ htmlFor, children, tooltip }: { htmlFor?: string; children: React.ReactNode; tooltip: string }) => {
  return (
    <div className="flex items-center gap-1.5 mb-1.5">
      <Label htmlFor={htmlFor} className="text-white">{children}</Label>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <button type="button" className="text-gray-400 hover:text-white transition-colors">
              <HelpCircle className="w-3.5 h-3.5" />
            </button>
          </TooltipTrigger>
          <TooltipContent className="max-w-xs bg-gray-900 text-white border-gray-700">
            <p className="text-sm">{tooltip}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export function AbilityEditor({ ability, onChange }: AbilityEditorProps) {
  const updateField = (field: keyof Ability, value: any) => {
    onChange({ ...ability, [field]: value });
  };

  const setAbilityType = (type: AbilityType) => {
    // Definir ícone de energia baseado no tipo
    let energyIcon: EnergyIconType;
    switch (type) {
      case 'physical':
        energyIcon = 'diamond';
        break;
      case 'magical':
        energyIcon = 'sphere';
        break;
      case 'psychic':
        energyIcon = 'triangle';
        break;
      case 'passive':
        energyIcon = 'hexagon';
        break;
    }
    onChange({ ...ability, type, energyIcon });
  };

  const getTypeButtonClass = (type: AbilityType): string => {
    const baseClass = 'px-4 py-2 rounded transition-all';
    const isActive = ability.type === type;
    
    switch (type) {
      case 'physical':
        return `${baseClass} ${isActive ? 'bg-gradient-to-r from-orange-400 to-yellow-400 text-white' : 'bg-gray-200'}`;
      case 'magical':
        return `${baseClass} ${isActive ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white' : 'bg-gray-200'}`;
      case 'psychic':
        return `${baseClass} ${isActive ? 'bg-gradient-to-r from-pink-400 to-pink-500 text-white' : 'bg-gray-200'}`;
      case 'passive':
        return `${baseClass} ${isActive ? 'bg-gradient-to-r from-gray-400 to-gray-500 text-white' : 'bg-gray-200'}`;
    }
  };

  return (
    <div className="space-y-4 p-6 bg-gray-800 rounded-lg shadow-lg border border-gray-700">
      {/* Tipo */}
      <div>
        <Label className="text-white">Tipo de Habilidade</Label>
        <div className="flex gap-2 flex-wrap mt-2">
          <button
            onClick={() => setAbilityType('physical')}
            className={getTypeButtonClass('physical')}
            aria-label="Tipo Físico"
          >
            <EnergyIcon type="diamond" className="w-5 h-5 inline-block mr-2" />
            Físico
          </button>
          <button
            onClick={() => setAbilityType('magical')}
            className={getTypeButtonClass('magical')}
            aria-label="Tipo Mágico"
          >
            <EnergyIcon type="sphere" className="w-5 h-5 inline-block mr-2" />
            Mágico
          </button>
          <button
            onClick={() => setAbilityType('psychic')}
            className={getTypeButtonClass('psychic')}
            aria-label="Tipo Psíquico"
          >
            <EnergyIcon type="triangle" className="w-5 h-5 inline-block mr-2" />
            Psíquico
          </button>
          <button
            onClick={() => setAbilityType('passive')}
            className={getTypeButtonClass('passive')}
            aria-label="Tipo Passiva"
          >
            <EnergyIcon type="hexagon" className="w-5 h-5 inline-block mr-2" />
            Passiva
          </button>
        </div>
      </div>

      {/* Nível */}
      <div className="grid grid-cols-[auto_1fr] gap-3 items-end">
        <div className="w-24">
          <LabelWithTooltip htmlFor="level" tooltip={tooltips.level}>
            Nível (LV)
          </LabelWithTooltip>
          <Input
            id="level"
            type="number"
            value={ability.level}
            onChange={(e) => updateField('level', parseInt(e.target.value) || 0)}
            className="bg-gray-700 text-white border-gray-600"
          />
        </div>
        
        {/* Nome */}
        <div className="flex-1">
          <LabelWithTooltip htmlFor="name" tooltip={tooltips.name}>
            Nome da Habilidade
          </LabelWithTooltip>
          <Input
            id="name"
            value={ability.name}
            onChange={(e) => updateField('name', e.target.value)}
            placeholder="Digite o nome da habilidade"
            className="bg-gray-700 text-white border-gray-600"
          />
        </div>
      </div>

      {/* Ação ou Turno / MP / HP / Dano */}
      <div className="grid grid-cols-4 gap-2">
        <div>
          <LabelWithTooltip htmlFor="recharge" tooltip={tooltips.recharge}>
            <span className="text-xs">Ação/Turno</span>
          </LabelWithTooltip>
          <Input
            id="recharge"
            value={ability.rechargeTime || ''}
            onChange={(e) => updateField('rechargeTime', e.target.value)}
            placeholder="Ex: 1T"
            className="w-full bg-gray-700 text-white border-gray-600"
          />
        </div>
        <div>
          <LabelWithTooltip htmlFor="mp" tooltip={tooltips.mp}>
            <span className="text-xs">EN (MP)</span>
          </LabelWithTooltip>
          <Input
            id="mp"
            value={ability.mpCost || ''}
            onChange={(e) => updateField('mpCost', e.target.value)}
            placeholder="Ex: 50 ou 20%"
            className="w-full bg-gray-700 text-white border-gray-600"
          />
        </div>
        <div>
          <LabelWithTooltip htmlFor="hp" tooltip={tooltips.hp}>
            <span className="text-xs">HP/ES</span>
          </LabelWithTooltip>
          <Input
            id="hp"
            value={ability.hpCost || ''}
            onChange={(e) => updateField('hpCost', e.target.value)}
            placeholder="Ex: 30 ou 15%"
            className="w-full bg-gray-700 text-white border-gray-600"
          />
        </div>
        <div>
          <LabelWithTooltip htmlFor="damage" tooltip={tooltips.damage}>
            <span className="text-xs">Dano</span>
          </LabelWithTooltip>
          <Input
            id="damage"
            value={ability.damage || ''}
            onChange={(e) => updateField('damage', e.target.value)}
            placeholder="0d0"
            className="w-full bg-gray-700 text-white border-gray-600"
          />
        </div>
      </div>

      {/* Elementos e Velocidade */}
      <div className="grid grid-cols-3 gap-2">
        <div>
          <LabelWithTooltip htmlFor="element1" tooltip={tooltips.elements}>
            Elemento 1
          </LabelWithTooltip>
          <Input
            id="element1"
            value={ability.element1}
            onChange={(e) => updateField('element1', e.target.value.toUpperCase())}
            placeholder="Ex: IGNI"
            maxLength={4}
            className="bg-gray-700 text-white border-gray-600"
          />
        </div>
        <div>
          <LabelWithTooltip htmlFor="element2" tooltip={tooltips.elements}>
            Elemento 2
          </LabelWithTooltip>
          <Input
            id="element2"
            value={ability.element2}
            onChange={(e) => updateField('element2', e.target.value.toUpperCase())}
            placeholder="Ex: CRYO"
            maxLength={4}
            className="bg-gray-700 text-white border-gray-600"
          />
        </div>
        <div>
          <LabelWithTooltip htmlFor="speed" tooltip={tooltips.speed}>
            Velocidade
          </LabelWithTooltip>
          <Input
            id="speed"
            value={ability.speed}
            onChange={(e) => updateField('speed', e.target.value)}
            placeholder="Ex: 10m/s"
            className="bg-gray-700 text-white border-gray-600"
          />
        </div>
      </div>

      {/* Velocidade de Conjuração */}
      <div>
        <LabelWithTooltip htmlFor="castingSpeed" tooltip={tooltips.castingSpeed}>
          Velocidade de Conjuração
        </LabelWithTooltip>
        <Select value={ability.castingSpeed} onValueChange={(value) => updateField('castingSpeed', value)}>
          <SelectTrigger id="castingSpeed" className="bg-gray-700 text-white border-gray-600">
            <SelectValue placeholder="Selecione a velocidade de conjuração" />
          </SelectTrigger>
          <SelectContent className="bg-gray-700 text-white border-gray-600">
            {SPEED_TYPES.map((speed) => (
              <SelectItem key={speed} value={speed} className="focus:bg-gray-600">
                {speed}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Alcance */}
      <div>
        <LabelWithTooltip htmlFor="range" tooltip={tooltips.range}>
          Alcance
        </LabelWithTooltip>
        <Input
          id="range"
          value={ability.range}
          onChange={(e) => updateField('range', e.target.value)}
          placeholder="Ex: 10m, Toque, Área"
          className="bg-gray-700 text-white border-gray-600"
        />
      </div>

      {/* Descrição */}
      <div>
        <LabelWithTooltip htmlFor="description" tooltip={tooltips.description}>
          Descrição Principal
        </LabelWithTooltip>
        <Textarea
          id="description"
          value={ability.description}
          onChange={(e) => updateField('description', e.target.value)}
          placeholder="Digite a descrição principal da habilidade"
          rows={4}
          className="bg-gray-700 text-white border-gray-600"
        />
        <p className="text-xs text-gray-400 mt-1">
          Use {'{chaves}'} para azul, [colchetes] para vermelho, ` para quebra de linha
        </p>
      </div>

      {/* Efeito */}
      <div>
        <LabelWithTooltip htmlFor="effect" tooltip={tooltips.effect}>
          Efeito (Descrição Estendida)
        </LabelWithTooltip>
        <Textarea
          id="effect"
          value={ability.effect}
          onChange={(e) => updateField('effect', e.target.value)}
          placeholder="Digite o efeito detalhado da habilidade"
          rows={6}
          className="bg-gray-700 text-white border-gray-600"
        />
        <p className="text-xs text-gray-400 mt-1">
          Use {'{chaves}'} para azul, [colchetes] para vermelho, ` para quebra de linha. Ao pressionar Enter após um travessão (- ), você inicia um novo item de lista.
        </p>
      </div>
    </div>
  );
}