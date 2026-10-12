import type { FormEvent, Dispatch, SetStateAction } from 'react';
import { errorCode } from '../../actions/display_helpers/error_code';

export interface SaveStatus { isSaving: boolean; error: string | null }
export interface FormRequest<T> { value: T; validate: (value: T) => Record<string, string>; save: (value: T) => Promise<unknown>; onSaved: () => void }
interface FormControls { errors: Dispatch<SetStateAction<Record<string, string>>>; status: Dispatch<SetStateAction<SaveStatus>>; recover: (code: string) => Promise<void> }

export async function submitForm<T>(event: FormEvent, request: FormRequest<T>, controls: FormControls) {
  event.preventDefault();
  const errors = request.validate(request.value);
  controls.errors(errors);
  if (Object.keys(errors).length) return;
  controls.status({ isSaving: true, error: null });
  try {
    await request.save(request.value);
    request.onSaved();
  } catch (error) {
    const code = errorCode(error);
    controls.status({ isSaving: false, error: code });
    await controls.recover(code);
  }
}
