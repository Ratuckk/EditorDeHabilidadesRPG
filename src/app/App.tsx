import { useState, useEffect } from 'react';
import { Ability } from './types/ability';
import { AbilityEditor } from './components/AbilityEditor';
import { AbilityPreview } from './components/AbilityPreview';
import { AbilityList } from './components/AbilityList';
import { useUndoRedo } from './hooks/useUndoRedo';
import { Button } from './components/ui/button';
import { toast } from 'sonner@2.0.3';
import { Toaster } from './components/ui/sonner';
import {
  Download,
  Upload,
  Undo,
  Redo,
  FileJson,
  Image as ImageIcon,
  Save,
} from 'lucide-react';

function createEmptyAbility(): Ability {
  return {
    id: crypto.randomUUID(),
    type: 'magical',
    energyIcon: 'sphere',
    level: 1,
    name: '',
    rechargeTime: '',
    mpCost: '',
    hpCost: '',
    damage: '',
    element1: '',
    element2: '',
    speed: '',
    castingSpeed: '',
    range: '',
    description: '',
    effect: '',
  };
}

export default function App() {
  const [abilities, setAbilities] = useState<Ability[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [clipboard, setClipboard] = useState<Ability | null>(null);
  const [clipboardMode, setClipboardMode] = useState<'copy' | 'cut' | null>(null);

  const currentAbility = abilities.find((a) => a.id === selectedId) || null;

  const {
    state: editingAbility,
    setState: setEditingAbility,
    undo,
    redo,
    canUndo,
    canRedo,
    reset: resetHistory,
  } = useUndoRedo<Ability | null>(currentAbility);

  // Sincronizar com a habilidade selecionada
  useEffect(() => {
    if (currentAbility) {
      resetHistory(currentAbility);
    }
  }, [selectedId]);

  // Salvar mudanças no estado global com debounce
  useEffect(() => {
    if (!editingAbility || !selectedId) return;

    const timeoutId = setTimeout(() => {
      setAbilities((prev) =>
        prev.map((a) => (a.id === selectedId ? editingAbility : a))
      );
    }, 200);

    return () => clearTimeout(timeoutId);
  }, [editingAbility, selectedId]);

  const handleCreate = () => {
    const newAbility = createEmptyAbility();
    setAbilities((prev) => [...prev, newAbility]);
    setSelectedId(newAbility.id);
    toast.success('Nova habilidade criada!');
  };

  const handleSelect = (id: string) => {
    setSelectedId(id);
  };

  const handleCopy = (id: string) => {
    const ability = abilities.find((a) => a.id === id);
    if (ability) {
      setClipboard(ability);
      setClipboardMode('copy');
      toast.success('Habilidade copiada!');
    }
  };

  const handleCut = (id: string) => {
    const ability = abilities.find((a) => a.id === id);
    if (ability) {
      setClipboard(ability);
      setClipboardMode('cut');
      toast.success('Habilidade cortada!');
    }
  };

  const handlePaste = () => {
    if (!clipboard) return;

    if (clipboardMode === 'cut') {
      // Remover a habilidade original
      setAbilities((prev) => prev.filter((a) => a.id !== clipboard.id));
    }

    // Criar cópia com novo ID
    const newAbility = { ...clipboard, id: crypto.randomUUID() };
    setAbilities((prev) => [...prev, newAbility]);
    setSelectedId(newAbility.id);

    if (clipboardMode === 'cut') {
      setClipboard(null);
      setClipboardMode(null);
    }

    toast.success('Habilidade colada!');
  };

  const handleDelete = (id: string) => {
    setAbilities((prev) => prev.filter((a) => a.id !== id));
    if (selectedId === id) {
      setSelectedId(null);
    }
    toast.success('Habilidade excluída!');
  };

  const handleExport = () => {
    const data = JSON.stringify(abilities, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `habilidades-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Habilidades exportadas!');
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const data = JSON.parse(event.target?.result as string);
          if (Array.isArray(data)) {
            // Gerar novos IDs para evitar conflitos
            const importedAbilities = data.map((ability) => ({
              ...ability,
              id: crypto.randomUUID(),
            }));
            setAbilities((prev) => [...prev, ...importedAbilities]);
            toast.success(`${importedAbilities.length} habilidades importadas!`);
          } else {
            toast.error('Formato de arquivo inválido!');
          }
        } catch (error) {
          toast.error('Erro ao importar arquivo!');
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  const handleSaveAll = () => {
    localStorage.setItem('rpg-abilities', JSON.stringify(abilities));
    toast.success('Todas as habilidades salvas localmente!');
  };

  const handleLoadAll = () => {
    const saved = localStorage.getItem('rpg-abilities');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        setAbilities(data);
        toast.success('Habilidades carregadas!');
      } catch {
        toast.error('Erro ao carregar habilidades salvas!');
      }
    } else {
      toast.info('Nenhuma habilidade salva encontrada!');
    }
  };

  // Carregar automaticamente ao iniciar
  useEffect(() => {
    handleLoadAll();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <Toaster />
      
      <div className="max-w-[1800px] mx-auto">
        {/* Header */}
        <header className="mb-6">
          <h1 className="text-center mb-4 text-white">Editor de Habilidades RPG</h1>
          <div className="flex flex-wrap gap-2 justify-center">
            <Button
              onClick={undo}
              disabled={!canUndo}
              variant="outline"
              size="sm"
              aria-label="Desfazer"
              className="bg-gray-800 text-white border-gray-700 hover:bg-gray-700"
            >
              <Undo className="w-4 h-4 mr-2" />
              Desfazer
            </Button>
            <Button
              onClick={redo}
              disabled={!canRedo}
              variant="outline"
              size="sm"
              aria-label="Refazer"
              className="bg-gray-800 text-white border-gray-700 hover:bg-gray-700"
            >
              <Redo className="w-4 h-4 mr-2" />
              Refazer
            </Button>
            <Button onClick={handleImport} variant="outline" size="sm" className="bg-gray-800 text-white border-gray-700 hover:bg-gray-700">
              <Upload className="w-4 h-4 mr-2" />
              Importar JSON
            </Button>
            <Button onClick={handleExport} variant="outline" size="sm" className="bg-gray-800 text-white border-gray-700 hover:bg-gray-700">
              <Download className="w-4 h-4 mr-2" />
              Exportar JSON
            </Button>
            <Button onClick={handleSaveAll} variant="outline" size="sm" className="bg-gray-800 text-white border-gray-700 hover:bg-gray-700">
              <Save className="w-4 h-4 mr-2" />
              Salvar Localmente
            </Button>
          </div>
        </header>

        {/* Main Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Lista de Habilidades - menor */}
          <div className="lg:col-span-2">
            <AbilityList
              abilities={abilities}
              selectedId={selectedId}
              onSelect={handleSelect}
              onCreate={handleCreate}
              onCopy={handleCopy}
              onCut={handleCut}
              onPaste={handlePaste}
              onDelete={handleDelete}
              canPaste={clipboard !== null}
            />
          </div>

          {/* Editor - médio */}
          <div className="lg:col-span-4">
            {editingAbility ? (
              <AbilityEditor
                ability={editingAbility}
                onChange={setEditingAbility}
              />
            ) : (
              <div className="bg-gray-800 rounded-lg shadow-lg p-12 text-center">
                <FileJson className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <h2 className="text-gray-300 mb-2">Nenhuma habilidade selecionada</h2>
                <p className="text-gray-400 mb-6">
                  Selecione uma habilidade da lista ou crie uma nova para começar
                </p>
                <Button onClick={handleCreate} className="bg-blue-600 hover:bg-blue-700">
                  Criar Nova Habilidade
                </Button>
              </div>
            )}
          </div>

          {/* Preview - MAIOR */}
          <div className="lg:col-span-6">
            {editingAbility ? (
              <div className="sticky top-6">
                <h2 className="mb-4 text-center text-white">Pré-visualização</h2>
                <AbilityPreview ability={editingAbility} />
              </div>
            ) : (
              <div className="bg-gray-800 rounded-lg shadow-lg p-12 text-center">
                <ImageIcon className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <h2 className="text-gray-300 mb-2">Pré-visualização</h2>
                <p className="text-gray-400">
                  A pré-visualização aparecerá aqui quando você selecionar uma habilidade
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}