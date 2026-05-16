import { Position } from 'reactflow';
import { Globe } from 'lucide-react';
import { BaseNode } from './BaseNode';
import { SelectField } from './fields/SelectField';

export const APICallNode = ({ id, data }) => (
  <BaseNode
    id={id}
    data={data}
    title="API Call"
    icon={Globe}
    handles={[
      { type: 'target', position: Position.Left, id: `${id}-url`, label: 'url' },
      { type: 'target', position: Position.Left, id: `${id}-body`, label: 'body' },
      { type: 'source', position: Position.Right, id: `${id}-response`, label: 'response' },
    ]}
  >
    <SelectField
      nodeId={id}
      fieldName="method"
      label="Method"
      options={['GET', 'POST', 'PUT', 'DELETE']}
      value={data.method}
    />
  </BaseNode>
);
