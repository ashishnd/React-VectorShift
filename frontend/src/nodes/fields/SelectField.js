import { useStore } from '../../store';
import { fieldInputClass, fieldLabelClass } from './fieldStyles';

export const SelectField = ({ nodeId, fieldName, label, value, options }) => {
  const updateNodeField = useStore((s) => s.updateNodeField);

  return (
    <label className="block">
      <span className={fieldLabelClass}>{label}</span>
      <select
        className={fieldInputClass}
        value={value ?? options[0]}
        onChange={(e) => updateNodeField(nodeId, fieldName, e.target.value)}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
};
