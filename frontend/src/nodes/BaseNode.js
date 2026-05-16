import { Handle, Position } from 'reactflow';
import { formatNodeBadgeId } from './nodeRegistry';

/**
 * Shared shell for pipeline nodes (card, badge, header, handles, body).
 *
 * @param {object} props
 * @param {string} props.id - React Flow node ID (e.g. customInput-1)
 * @param {object} props.data - React Flow node data (must include nodeType)
 * @param {string} props.title - Header title (e.g. "Input")
 * @param {import('lucide-react').LucideIcon} [props.icon] - Optional lucide icon in header
 * @param {Array<{ type: 'source'|'target', position: import('reactflow').Position, id: string, label?: string }>} [props.handles]
 * @param {import('react').ReactNode} props.children - Field UI rendered in the body
 */
export const BaseNode = ({ id, data, title, icon: Icon, handles = [], children }) => {
  const badgeId = formatNodeBadgeId(id, data?.nodeType);
  const grouped = groupHandlesBySide(handles);

  return (
    <div className="relative min-w-[240px] max-w-[400px] rounded-md border border-node-border bg-node-bg shadow-node">
      <div className="px-3 pt-2">
        <span className="inline-block rounded-full bg-accent-muted px-2 py-0.5 text-[10px] font-medium text-accent">
          {badgeId}
        </span>
      </div>

      <header className="flex items-center gap-2 border-b border-node-border px-3 pb-2 pt-1">
        {Icon && <Icon className="h-4 w-4 shrink-0 text-accent" strokeWidth={2} />}
        <span className="text-sm font-semibold text-zinc-800">{title}</span>
      </header>

      <div className="space-y-3 p-3">{children}</div>

      {Object.entries(grouped).map(([side, sideHandles]) =>
        sideHandles.map((handle, index) => (
          <HandleWithLabel
            key={handle.id}
            handle={handle}
            index={index}
            count={sideHandles.length}
            side={side}
          />
        ))
      )}
    </div>
  );
};

const groupHandlesBySide = (handles) => {
  const groups = {};
  handles.forEach((handle) => {
    const side = handle.position;
    if (!groups[side]) {
      groups[side] = [];
    }
    groups[side].push(handle);
  });
  return groups;
};

const getHandleOffset = (index, count) => `${((index + 1) / (count + 1)) * 100}%`;

const HandleWithLabel = ({ handle, index, count, side }) => {
  const offset = getHandleOffset(index, count);
  const isHorizontal = side === Position.Left || side === Position.Right;
  const positionStyle = isHorizontal ? { top: offset } : { left: offset };

  const labelStyle = isHorizontal
    ? {
        top: `calc(${offset} - 18px)`,
        ...(side === Position.Left
          ? { right: 'calc(100% + 6px)' }
          : { left: 'calc(100% + 6px)' }),
      }
    : {
        left: offset,
        transform: 'translateX(-50%)',
        ...(side === Position.Top ? { bottom: 'calc(100% + 4px)' } : { top: 'calc(100% + 4px)' }),
      };

  return (
    <>
      <Handle
        type={handle.type}
        position={handle.position}
        id={handle.id}
        className="!h-2.5 !w-2.5 !border-2 !border-white !bg-accent"
        style={positionStyle}
      />
      {handle.label && (
        <span
          className="pointer-events-none absolute z-50 text-[10px] text-zinc-500"
          style={labelStyle}
        >
          {handle.label}
        </span>
      )}
    </>
  );
};
