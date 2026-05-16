import { Position } from 'reactflow';
import { Type } from 'lucide-react';
import { BaseNode } from './BaseNode';
import { TextareaField } from './fields/TextareaField';

export const TextNode = ({ id, data }) => (
  <BaseNode
    id={id}
    data={data}
    title="Text"
    icon={Type}
    handles={[{ type: 'source', position: Position.Right, id: `${id}-output` }]}
  >
    <TextareaField
      nodeId={id}
      fieldName="text"
      label="Text"
      value={data.text}
      placeholder="Enter text..."
    />
  </BaseNode>
);
