import { Position } from 'reactflow';
import { Filter as FilterIcon } from 'lucide-react';
import { BaseNode } from './BaseNode';
import { SelectField } from './fields/SelectField';
import { TextField } from './fields/TextField';

export const FilterNode = ({ id, data }) => (
  <BaseNode
    id={id}
    data={data}
    title="Filter"
    icon={FilterIcon}
    handles={[
      { type: 'target', position: Position.Left, id: `${id}-input`, label: 'text' },
      { type: 'source', position: Position.Right, id: `${id}-output`, label: 'result' },
    ]}
  >
    <SelectField
      nodeId={id}
      fieldName="condition"
      label="Condition"
      options={['contains', 'equals', 'regex']}
      value={data.condition}
    />
    <TextField
      nodeId={id}
      fieldName="pattern"
      label="Pattern"
      value={data.pattern}
      placeholder="e.g. error"
    />
  </BaseNode>
);
