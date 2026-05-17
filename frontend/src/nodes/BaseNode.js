import { Handle, Position } from 'reactflow';
import { X } from 'lucide-react';
import { useStore } from '../store';
import { formatNodeBadgeId, getDescription } from './nodeRegistry';

/**
 * Shared shell for pipeline nodes (card, badge, header, handles, body).
 *
 * Handles are positioned proportionally within a body region (the wrapper
 * around children), NOT absolutely from the card top. This means handle
 * positions auto-balance based on:
 *   - The number of handles on each side (1 → 50%, 2 → 33%/66%, etc.)
 *   - The body region's height (handles flank the body content visually)
 *
 * The header region (badge + title) is excluded from handle positioning,
 * so handles never overlap the title or badge.
 *
 * @param {object} props
 * @param {string} props.id - React Flow node ID
 * @param {object} props.data - React Flow node data (must include nodeType)
 * @param {string} props.title - Header title
 * @param {import('lucide-react').LucideIcon} [props.icon]
 * @param {Array<{ type: 'source'|'target', position: import('reactflow').Position, id: string, label?: string }>} [props.handles]
 * @param {import('react').ReactNode} props.children
 */
export const BaseNode = ({ id, data, title, icon: Icon, handles = [], children }) => {
  const badgeId = formatNodeBadgeId(id, data?.nodeType);
  const description = getDescription(data?.nodeType);
  const grouped = groupHandlesBySide(handles);
  const removeNode = useStore((s) => s.removeNode);

  return (
    <div className="relative min-w-[240px] max-w-[400px] rounded-md border border-node-border bg-node-bg shadow-node transition-shadow hover:shadow-md">
      <div className="rounded-t-md border-b border-node-border bg-accent-muted/30 px-3 py-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex min-w-0 items-center gap-2">
            {Icon && <Icon className="h-5 w-5 shrink-0 text-accent" strokeWidth={2} />}
            <span className="text-base font-semibold text-zinc-900">{title}</span>
          </div>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              removeNode(id);
            }}
            className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-zinc-300 bg-white text-zinc-500 shadow-sm transition hover:border-zinc-400 hover:bg-zinc-50 hover:text-zinc-800"
            aria-label="Remove node"
          >
            <X className="h-3 w-3" strokeWidth={2.5} />
          </button>
        </div>
        {description && (
          <p className="mt-1.5 text-xs leading-relaxed text-zinc-600">{description}</p>
        )}
      </div>

      <div className="border-b border-node-border px-3 py-2">
        <div className="rounded bg-accent-muted/50 px-2 py-1 text-center font-mono text-xs font-medium text-accent">
          {badgeId}
        </div>
      </div>

      <div className="relative min-h-[80px]">
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
