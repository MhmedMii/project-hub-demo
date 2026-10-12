import { useId, type SelectHTMLAttributes } from 'react';
import './SelectInput.css';

interface SelectInputProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string; options: { value: string; label: string }[];
}

export function SelectInput({ label, options, ...props }: SelectInputProps) {
  const identifier = useId();
  return <div className="select-field">
    <label className="field-label" htmlFor={identifier}>{label}</label>
    <select {...props} id={identifier} className="select-input">
      {options.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
    </select>
  </div>;
}
