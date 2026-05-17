import { useStore } from './store';
import { getDefaults } from './nodes/nodeRegistry';

export const DraggableNode = ({ type, label, icon: Icon }) => {
  const reactFlowInstance = useStore((s) => s.reactFlowInstance);

  const onDragStart = (event, nodeType) => {
    const appData = { nodeType };
    event.target.style.cursor = 'grabbing';
    event.dataTransfer.setData('application/reactflow', JSON.stringify(appData));
    event.dataTransfer.effectAllowed = 'move';
  };

  const handleClick = () => {
    if (!reactFlowInstance) return;
    const { x, y, zoom } = reactFlowInstance.getViewport();
    const wrapperEl = document.querySelector('.react-flow');
    if (!wrapperEl) return;
    const { width, height } = wrapperEl.getBoundingClientRect();
    const position = {
      x: (-x + width / 2) / zoom - 120,
      y: (-y + height / 2) / zoom - 40,
    };
    const nodeID = useStore.getState().getNodeID(type);
    useStore.getState().addNode({
      id: nodeID,
      type,
      position,
      data: { id: nodeID, nodeType: type, ...getDefaults(type) },
    });
  };

  return (
    <div
      onClick={handleClick}
      className="inline-flex cursor-pointer select-none items-center gap-1.5 rounded-md border border-node-border bg-white px-3 py-1.5 text-xs font-medium text-zinc-700 shadow-sm transition hover:border-accent hover:text-accent active:cursor-grabbing"
      onDragStart={(event) => onDragStart(event, type)}
      onDragEnd={(event) => (event.target.style.cursor = 'grab')}
      draggable
    >
      {Icon && <Icon className="h-3.5 w-3.5" strokeWidth={2} />}
      <span>{label}</span>
    </div>
  );
};
