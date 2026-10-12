import type { Dispatch, SetStateAction, RefObject } from 'react';
import { errorCode } from '../../actions/display_helpers/error_code';

export interface ScreenData<T> { data: T; isLoading: boolean; error: string | null }
interface ScreenRequest<T> { load: () => Promise<T>; initial: T; recover: (code: string) => Promise<void> }

export async function loadScreenData<T>(request: ScreenRequest<T>, update: Dispatch<SetStateAction<ScreenData<T>>>, sequence: RefObject<number>) {
  const identifier = ++sequence.current;
  update(current => ({ ...current, isLoading: true, error: null }));
  try {
    const data = await request.load();
    if (identifier === sequence.current) update({ data, isLoading: false, error: null });
  } catch (error) {
    if (identifier !== sequence.current) return;
    const code = errorCode(error);
    update({ data: request.initial, isLoading: false, error: code });
    await request.recover(code);
  }
}
