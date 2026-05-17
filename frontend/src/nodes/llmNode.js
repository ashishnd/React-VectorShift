import { Position } from 'reactflow';
import { Sparkles } from 'lucide-react';
import { BaseNode } from './BaseNode';

export const LLMNode = ({ id, data }) => (
  <BaseNode
    id={id}
    data={data}
    title="LLM"
    icon={Sparkles}
    handles={[
      { type: 'target', position: Position.Left, id: `${id}-system`, label: 'system' },
      { type: 'target', position: Position.Left, id: `${id}-prompt`, label: 'prompt' },
      { type: 'source', position: Position.Right, id: `${id}-response`, label: 'response' },
    ]}
  />
);
