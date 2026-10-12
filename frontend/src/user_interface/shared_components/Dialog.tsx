import { useEffect, useId, useRef, type ReactNode } from 'react';
import { X } from 'lucide-react';
import { useLanguage } from '../languages/LanguageSettings';
import { Button } from './Button';
import './Dialog.css';

interface DialogProps { title: string; children: ReactNode; onClose: () => void; isBusy?: boolean }

export function Dialog({ title, children, onClose, isBusy = false }: DialogProps) {
  const reference = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const { translate } = useLanguage();
  useEffect(() => {
    const dialog = reference.current;
    dialog?.showModal();
    return () => dialog?.close();
  }, []);
  return <dialog className="dialog" ref={reference} aria-labelledby={titleId}
    onCancel={event => { event.preventDefault(); if (!isBusy) onClose(); }}>
    <div className="dialog-heading"><h2 id={titleId}>{title}</h2>
      <Button variant="quiet" aria-label={translate('close')} onClick={onClose} disabled={isBusy}><X size={20} aria-hidden="true" /></Button>
    </div>
    <div className="dialog-content">{children}</div>
  </dialog>;
}
