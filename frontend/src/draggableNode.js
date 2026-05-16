export const DraggableNode = ({ type, label, icon: Icon }) => {
  const onDragStart = (event, nodeType) => {
    const appData = { nodeType };
    event.target.style.cursor = 'grabbing';
    event.dataTransfer.setData('application/reactflow', JSON.stringify(appData));
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div
      className="inline-flex cursor-grab select-none items-center gap-1.5 rounded-md border border-node-border bg-white px-3 py-1.5 text-xs font-medium text-zinc-700 shadow-sm transition hover:border-accent hover:text-accent active:cursor-grabbing"
      onDragStart={(event) => onDragStart(event, type)}
      onDragEnd={(event) => (event.target.style.cursor = 'grab')}
      draggable
    >
      {Icon && <Icon className="h-3.5 w-3.5" strokeWidth={2} />}
      <span>{label}</span>
    </div>
  );
};
