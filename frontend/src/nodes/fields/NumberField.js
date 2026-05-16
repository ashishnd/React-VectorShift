import { useStore } from '../../store';
import { fieldInputClass, fieldLabelClass } from './fieldStyles';

export const NumberField = ({ nodeId, fieldName, label, value, min, max, step = 1 }) => {
  const updateNodeField = useStore((s) => s.updateNodeField);

  return (
    <label className="block">
      <span className={fieldLabelClass}>{label}</span>
      <input
        type="number"
        className={fieldInputClass}
        value={value ?? ''}
        min={min}
        max={max}
        step={step}
        onChange={(e) => updateNodeField(nodeId, fieldName, Number(e.target.value))}
      />
    </label>
  );
};
