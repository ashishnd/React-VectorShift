import { useStore } from '../../store';
import { fieldInputClass, fieldLabelClass } from './fieldStyles';

export const TextField = ({ nodeId, fieldName, label, value, placeholder }) => {
  const updateNodeField = useStore((s) => s.updateNodeField);

  return (
    <label className="block">
      <span className={fieldLabelClass}>{label}</span>
      <input
        type="text"
        className={fieldInputClass}
        value={value ?? ''}
        placeholder={placeholder}
        onChange={(e) => updateNodeField(nodeId, fieldName, e.target.value)}
      />
    </label>
  );
};
