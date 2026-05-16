import { useMemo, useEffect, useRef } from 'react';
import { Position } from 'reactflow';
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

  const handles = useMemo(
    () => [
      ...variables.map((name) => ({
        type: 'target',
        position: Position.Left,
        id: `${id}-var-${name}`,
        label: name,
      })),
      { type: 'source', position: Position.Right, id: `${id}-output` },
    ],
    [id, variables]
  );

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
    <BaseNode id={id} data={data} title="Text" icon={Type} handles={handles}>
      <TextareaAutoResizeField
        nodeId={id}
        fieldName="text"
        label="Text"
        value={data.text}
        placeholder="Type text. Use {{ variableName }} to create input handles."
      />
    </BaseNode>
  );
};
