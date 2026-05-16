import { StickyNote } from 'lucide-react';
import { BaseNode } from './BaseNode';
import { TextareaAutoResizeField } from './fields/TextareaAutoResizeField';

export const NoteNode = ({ id, data }) => (
  <BaseNode id={id} data={data} title="Note" icon={StickyNote}>
    <TextareaAutoResizeField
      nodeId={id}
      fieldName="note"
      label="Note"
      value={data.note}
      placeholder="Add a comment about this section of the pipeline..."
      minRows={3}
      maxRows={20}
    />
  </BaseNode>
);
