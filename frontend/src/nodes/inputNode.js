import { Position } from 'reactflow';
import { LogIn } from 'lucide-react';
import { BaseNode } from './BaseNode';
import { TextField } from './fields/TextField';
import { SelectField } from './fields/SelectField';

export const InputNode = ({ id, data }) => (
  <BaseNode
    id={id}
    data={data}
    title="Input"
    icon={LogIn}
    handles={[{ type: 'source', position: Position.Right, id: `${id}-value`, label: 'value' }]}
  >
    <TextField nodeId={id} fieldName="inputName" label="Name" value={data.inputName} />
    <SelectField
      nodeId={id}
      fieldName="inputType"
      label="Type"
      options={['Text', 'File']}
      value={data.inputType}
    />
  </BaseNode>
);
