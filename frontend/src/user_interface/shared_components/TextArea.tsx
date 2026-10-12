import { useId, type TextareaHTMLAttributes } from 'react';
import './TextArea.css';

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> { label: string; error?: string; hint?: string }

export function TextArea({ label, error, hint, ...props }: TextAreaProps) {
  const identifier = useId();
  return <div className="textarea-field">
    <label className="field-label" htmlFor={identifier}>{label}</label>
    <textarea {...props} id={identifier} className="text-area" aria-invalid={Boolean(error)}
      aria-describedby={error ? `${identifier}-error` : hint ? `${identifier}-hint` : undefined} />
    {hint && <p className="form-hint" id={`${identifier}-hint`}>{hint}</p>}
    {error && <p className="form-error" id={`${identifier}-error`}>{error}</p>}
  </div>;
}
