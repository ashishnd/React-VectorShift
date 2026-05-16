import { useMemo, useEffect, useRef } from 'react';
import { Handle, Position } from 'reactflow';
import { Type } from 'lucide-react';
import { BaseNode } from './BaseNode';
import { TextareaAutoResizeField } from './fields/TextareaAutoResizeField';
import { useStore } from '../store';

// Matches {{ validJsIdentifier }} with optional whitespace. Captures the variable name.
const VARIABLE_REGEX = /\{\{\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\}\}/g;

const extractVariables = (text) => {
  if (!text) return [];
  const seen = new Set();
  const ordered = [];
  let match;
  VARIABLE_REGEX.lastIndex = 0;
  while ((match = VARIABLE_REGEX.exec(text)) !== null) {
    const name = match[1];
    if (!seen.has(name)) {
      seen.add(name);
      ordered.push(name);
    }
  }
  return ordered;
};

export const TextNode = ({ id, data }) => {
  const variables = useMemo(() => extractVariables(data.text), [data.text]);

  const prevVariablesRef = useRef(variables);
  const pruneEdgesForHandles = useStore((s) => s.pruneEdgesForHandles);

  useEffect(() => {
    const prev = prevVariablesRef.current;
    const current = variables;
    const removed = prev.filter((name) => !current.includes(name));
    if (removed.length) {
      pruneEdgesForHandles(removed.map((name) => `${id}-var-${name}`));
    }
    prevVariablesRef.current = current;
  }, [variables, id, pruneEdgesForHandles]);

  return (
    <BaseNode id={id} data={data} title="Text" icon={Type} handles={[]}>
      {variables.length > 0 && (
        <div className="-mx-3 mb-2 space-y-1 border-b border-node-border px-3 pb-2">
          {variables.map((name) => (
            <VariableHandleRow key={name} nodeId={id} variableName={name} />
          ))}
        </div>
      )}

      <TextareaAutoResizeField
        nodeId={id}
        fieldName="text"
        label="Text"
        value={data.text}
        placeholder="Type text. Use {{ variableName }} to create input handles."
      />

      <Handle
        type="source"
        position={Position.Right}
        id={`${id}-output`}
        className="!h-2.5 !w-2.5 !border-2 !border-white !bg-accent"
        style={{ top: '50%' }}
      />
    </BaseNode>
  );
};

const VariableHandleRow = ({ nodeId, variableName }) => (
  <div className="relative -mx-3 flex items-center py-1">
    <Handle
      type="target"
      position={Position.Left}
      id={`${nodeId}-var-${variableName}`}
      className="!h-2.5 !w-2.5 !border-2 !border-white !bg-accent"
    />
    <span className="pl-6 text-xs text-zinc-700">{variableName}</span>
  </div>
);
