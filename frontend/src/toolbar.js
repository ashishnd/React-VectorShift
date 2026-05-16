import { DraggableNode } from './draggableNode';
import { getGroupedNodeEntries } from './nodes/nodeRegistry';

export const PipelineToolbar = () => {
  const groups = getGroupedNodeEntries();

  return (
    <div className="border-b border-node-border bg-white px-6 py-4">
      <div className="flex flex-wrap items-start gap-6">
        {groups.map(({ category, entries }) => (
          <div key={category} className="flex flex-col gap-2">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
              {category}
            </span>
            <div className="flex flex-wrap gap-2">
              {entries.map(({ type, label, icon }) => (
                <DraggableNode key={type} type={type} label={label} icon={icon} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
