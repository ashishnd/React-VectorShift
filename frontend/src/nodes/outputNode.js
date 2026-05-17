import { Position } from 'reactflow';
import { LogOut } from 'lucide-react';
import { BaseNode } from './BaseNode';
import { TextField } from './fields/TextField';
import { SelectField } from './fields/SelectField';

export const OutputNode = ({ id, data }) => (
  <BaseNode
    id={id}
    data={data}
    title="Output"
    icon={LogOut}
    handles={[{ type: 'target', position: Position.Left, id: `${id}-value`, label: 'value' }]}
  >
    <TextField nodeId={id} fieldName="outputName" label="Name" value={data.outputName} />
    <SelectField
      nodeId={id}
      fieldName="outputType"
      label="Type"
      options={['Text', 'Image']}
      value={data.outputType}
    />
  </BaseNode>
);
