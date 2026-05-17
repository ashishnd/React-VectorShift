import { Position } from 'reactflow';
import { Wand2 } from 'lucide-react';
import { BaseNode } from './BaseNode';
import { SelectField } from './fields/SelectField';

export const TransformNode = ({ id, data }) => (
  <BaseNode
    id={id}
    data={data}
    title="Transform"
    icon={Wand2}
    handles={[
      { type: 'target', position: Position.Left, id: `${id}-input`, label: 'text' },
      { type: 'source', position: Position.Right, id: `${id}-output`, label: 'result' },
    ]}
  >
    <SelectField
      nodeId={id}
      fieldName="operation"
      label="Operation"
      options={['uppercase', 'lowercase', 'trim', 'JSON.parse']}
      value={data.operation}
    />
  </BaseNode>
);
