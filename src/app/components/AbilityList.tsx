import { Ability } from '../types/ability';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
import { Plus, Copy, Scissors, Clipboard, Trash2 } from 'lucide-react';

interface AbilityListProps {
  abilities: Ability[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onCreate: () => void;
  onCopy: (id: string) => void;
  onCut: (id: string) => void;
  onPaste: () => void;
  onDelete: (id: string) => void;
  canPaste: boolean;
}

export function AbilityList({
  abilities,
  selectedId,
  onSelect,
  onCreate,
  onCopy,
  onCut,
  onPaste,
  onDelete,
  canPaste,
}: AbilityListProps) {
  return (
    <div className="bg-gray-800 rounded-lg shadow-lg p-3 h-full flex flex-col border border-gray-700">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm text-white">Habilidades</h3>
        <div className="flex gap-1">
          <Button onClick={onCreate} size="sm" aria-label="Criar nova habilidade" className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4" />
          </Button>
          <Button
            onClick={onPaste}
            size="sm"
            variant="outline"
            disabled={!canPaste}
            aria-label="Colar habilidade"
            className="bg-gray-700 text-white border-gray-600 hover:bg-gray-600"
          >
            <Clipboard className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="space-y-2">
          {abilities.length === 0 ? (
            <p className="text-gray-400 text-xs text-center py-8">
              Nenhuma habilidade.
              <br />
              Clique em + para criar.
            </p>
          ) : (
            abilities.map((ability) => (
              <div
                key={ability.id}
                className={`p-2 rounded border-2 cursor-pointer transition-all ${
                  selectedId === ability.id
                    ? 'border-blue-500 bg-blue-900/30'
                    : 'border-gray-600 hover:border-gray-500 bg-gray-700/50'
                }`}
                onClick={() => onSelect(ability.id)}
              >
                <div className="flex flex-col gap-1">
                  <h3 className="truncate text-sm text-white">
                    {ability.name || 'Sem nome'}
                  </h3>
                  <p className="text-xs text-gray-400">Nv {ability.level}</p>
                  <div className="flex gap-1 mt-1">
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        onCopy(ability.id);
                      }}
                      size="sm"
                      variant="ghost"
                      className="h-6 w-6 p-0 text-gray-300 hover:text-white hover:bg-gray-600"
                      aria-label="Copiar habilidade"
                    >
                      <Copy className="w-3 h-3" />
                    </Button>
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        onCut(ability.id);
                      }}
                      size="sm"
                      variant="ghost"
                      className="h-6 w-6 p-0 text-gray-300 hover:text-white hover:bg-gray-600"
                      aria-label="Cortar habilidade"
                    >
                      <Scissors className="w-3 h-3" />
                    </Button>
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(ability.id);
                      }}
                      size="sm"
                      variant="ghost"
                      className="h-6 w-6 p-0 text-red-400 hover:text-red-300 hover:bg-gray-600"
                      aria-label="Excluir habilidade"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
}