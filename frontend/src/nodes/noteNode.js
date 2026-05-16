import { StickyNote } from 'lucide-react';
import { BaseNode } from './BaseNode';
import { TextareaField } from './fields/TextareaField';

export const NoteNode = ({ id, data }) => (
  <BaseNode id={id} data={data} title="Note" icon={StickyNote}>
    <TextareaField
      nodeId={id}
      fieldName="note"
      label="Note"
      value={data.note}
      placeholder="Add a comment about this section of the pipeline..."
      rows={3}
    />
  </BaseNode>
);
