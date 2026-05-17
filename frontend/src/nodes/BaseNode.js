import { useState, useEffect, useRef, useMemo } from 'react';
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
  const edges = useStore((s) => s.edges);

  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const deleteTimerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (deleteTimerRef.current) clearTimeout(deleteTimerRef.current);
    };
  }, []);

  const connectedHandleIds = useMemo(() => {
    const set = new Set();
    edges.forEach((edge) => {
      if (edge.sourceHandle) set.add(edge.sourceHandle);
      if (edge.targetHandle) set.add(edge.targetHandle);
    });
    return set;
  }, [edges]);

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    if (isConfirmingDelete) {
      if (deleteTimerRef.current) clearTimeout(deleteTimerRef.current);
      removeNode(id);
    } else {
      setIsConfirmingDelete(true);
      deleteTimerRef.current = setTimeout(() => {
        setIsConfirmingDelete(false);
      }, 4000);
    }
  };

  const handleNodeClick = () => {
    if (isConfirmingDelete) {
      setIsConfirmingDelete(false);
      if (deleteTimerRef.current) clearTimeout(deleteTimerRef.current);
    }
  };

  return (
    <div
      onClick={handleNodeClick}
      className="relative min-w-[240px] max-w-[400px] rounded-md border border-node-border bg-node-bg shadow-node transition hover:shadow-md hover:ring-2 hover:ring-accent/30"
    >
      <div className="rounded-t-md border-b border-node-border bg-accent-muted/30 px-3 py-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex min-w-0 items-center gap-2">
            {Icon && <Icon className="h-5 w-5 shrink-0 text-accent" strokeWidth={2} />}
            <span className="text-base font-semibold text-zinc-900">{title}</span>
          </div>
          <button
            type="button"
            onClick={handleDeleteClick}
            className={`relative inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border shadow-sm transition ${
              isConfirmingDelete
                ? 'border-red-400 bg-red-500 text-white hover:bg-red-600'
                : 'border-zinc-300 bg-white text-zinc-500 hover:border-zinc-400 hover:bg-zinc-50 hover:text-zinc-800'
            }`}
            aria-label={isConfirmingDelete ? 'Confirm delete' : 'Remove node'}
          >
            <X className="h-3 w-3" strokeWidth={2.5} />
            {isConfirmingDelete && (
              <span className="pointer-events-none absolute left-full top-1/2 ml-2 -translate-y-1/2 whitespace-nowrap rounded bg-zinc-800 px-2 py-1 text-xs font-medium text-white shadow-lg">
                Confirm delete
              </span>
            )}
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
              isConnected={connectedHandleIds.has(handle.id)}
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

const HandleWithLabel = ({ handle, index, count, side, isConnected }) => {
  const offset = getHandleOffset(index, count);
  const isHorizontal = side === Position.Left || side === Position.Right;
  const positionStyle = isHorizontal
    ? side === Position.Left
      ? { top: offset, left: '0', transform: 'translate(-50%, -50%)' }
      : { top: offset, right: '0', left: 'auto', transform: 'translate(50%, -50%)' }
    : {
        left: offset,
        top: side === Position.Top ? '0' : 'auto',
        bottom: side === Position.Bottom ? '0' : 'auto',
        transform: side === Position.Top ? 'translate(-50%, -50%)' : 'translate(-50%, 50%)',
      };

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

  const handleClass = isConnected
    ? '!h-3.5 !w-3.5 !border-2 !border-accent !bg-accent'
    : '!h-3.5 !w-3.5 !border-2 !border-accent !bg-white';

  return (
    <>
      <Handle
        type={handle.type}
        position={handle.position}
        id={handle.id}
        className={handleClass}
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
