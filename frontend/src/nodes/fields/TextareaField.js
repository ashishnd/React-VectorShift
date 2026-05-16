import { useStore } from '../../store';
import { fieldInputClass, fieldLabelClass } from './fieldStyles';

export const TextareaField = ({ nodeId, fieldName, label, value, placeholder, rows = 2 }) => {
  const updateNodeField = useStore((s) => s.updateNodeField);

  return (
    <label className="block">
      <span className={fieldLabelClass}>{label}</span>
      <textarea
        className={fieldInputClass}
        rows={rows}
        value={value ?? ''}
        placeholder={placeholder}
        onChange={(e) => updateNodeField(nodeId, fieldName, e.target.value)}
      />
    </label>
  );
};
