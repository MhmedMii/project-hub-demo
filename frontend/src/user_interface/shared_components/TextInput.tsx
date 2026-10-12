import { useId, type InputHTMLAttributes } from 'react';
import './TextInput.css';

interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> { label: string; error?: string; hint?: string }

export function TextInput({ label, error, hint, id, ...props }: TextInputProps) {
  const generated = useId();
  const identifier = id ?? generated;
  const description = error ? `${identifier}-error` : hint ? `${identifier}-hint` : undefined;
  return <div className="text-field">
    <label className="field-label" htmlFor={identifier}>{label}</label>
    <input {...props} id={identifier} className="text-input" aria-invalid={Boolean(error)} aria-describedby={description} />
    {hint && <p className="form-hint" id={`${identifier}-hint`}>{hint}</p>}
    {error && <p className="form-error" id={`${identifier}-error`}>{error}</p>}
  </div>;
}
