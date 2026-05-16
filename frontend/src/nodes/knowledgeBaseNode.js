import { Position } from 'reactflow';
import { Database } from 'lucide-react';
import { BaseNode } from './BaseNode';
import { TextField } from './fields/TextField';
import { NumberField } from './fields/NumberField';

export const KnowledgeBaseNode = ({ id, data }) => (
  <BaseNode
    id={id}
    data={data}
    title="Knowledge Base"
    icon={Database}
    handles={[
      { type: 'target', position: Position.Left, id: `${id}-query`, label: 'query' },
      { type: 'source', position: Position.Right, id: `${id}-context`, label: 'context' },
    ]}
  >
    <TextField
      nodeId={id}
      fieldName="kbName"
      label="KB Name"
      value={data.kbName}
      placeholder="e.g. product-docs"
    />
    <NumberField
      nodeId={id}
      fieldName="topK"
      label="Top K"
      value={data.topK}
      min={1}
      max={20}
    />
  </BaseNode>
);
