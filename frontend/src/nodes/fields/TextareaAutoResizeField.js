import TextareaAutosize from 'react-textarea-autosize';
import { useStore } from '../../store';
import { fieldInputClass, fieldLabelClass } from './fieldStyles';

export const TextareaAutoResizeField = ({
  nodeId,
  fieldName,
  label,
  value,
  placeholder,
  minRows = 2,
  maxRows = 20,
}) => {
  const updateNodeField = useStore((s) => s.updateNodeField);

  return (
    <label className="block">
      <span className={fieldLabelClass}>{label}</span>
      <TextareaAutosize
        className={`${fieldInputClass} resize-none`}
        value={value ?? ''}
        placeholder={placeholder}
        minRows={minRows}
        maxRows={maxRows}
        onChange={(e) => updateNodeField(nodeId, fieldName, e.target.value)}
      />
    </label>
  );
};
