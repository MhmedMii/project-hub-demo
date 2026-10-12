import { useState, type FormEvent } from 'react';
import { submitForm, type SaveStatus, type FormRequest } from './submit_form';
import { useSessionRecovery } from './use_session_recovery';

export function useForm<T>(options: Omit<FormRequest<T>, 'value'> & { initial: T }) {
  const [value, setValue] = useState(options.initial);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<SaveStatus>({ isSaving: false, error: null });
  const recover = useSessionRecovery();
  const setField = <K extends keyof T>(field: K, next: T[K]) => setValue(current => ({ ...current, [field]: next }));
  const submit = (event: FormEvent) => submitForm(event, { ...options, value }, { errors: setErrors, status: setStatus, recover });
  return { value, setField, errors, ...status, submit };
}
