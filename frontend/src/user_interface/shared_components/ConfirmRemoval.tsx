import { useLanguage } from '../languages/LanguageSettings';
import { useRemoval } from '../screen_state/use_removal';
import { Button } from './Button';
import { Dialog } from './Dialog';
import { ErrorMessage } from './ErrorMessage';
import './ConfirmRemoval.css';

interface RemovalProps { title: string; name: string; remove: () => Promise<void>; onRemoved: () => void; onClose: () => void }

export function ConfirmRemoval({ title, name, remove, onRemoved, onClose }: RemovalProps) {
  const { translate } = useLanguage();
  const state = useRemoval(remove, onRemoved);
  return <Dialog title={title} onClose={onClose} isBusy={state.isRemoving}>
    <div className="removal-content"><strong>{name}</strong><p className="muted">{translate('removeDescription')}</p>
      {state.error && <ErrorMessage code={state.error} compact />}
      <div className="form-actions"><Button disabled={state.isRemoving} onClick={onClose}>{translate('cancel')}</Button>
        <Button variant="danger" disabled={state.isRemoving} onClick={() => { void state.confirm(); }}>{translate(state.isRemoving ? 'removing' : 'remove')}</Button>
      </div>
    </div>
  </Dialog>;
}
