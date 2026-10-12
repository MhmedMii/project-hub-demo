import { NotebookPen, ShieldCheck } from 'lucide-react';
import type { Role } from '../../data_models/account';
import { useLanguage } from '../languages/LanguageSettings';
import './DemoRoleButton.css';

export function DemoRoleButton({ role, isBusy, selected, onChoose }: {
  role: Role; isBusy: boolean; selected: boolean; onChoose: (role: Role) => void;
}) {
  const { translate } = useLanguage();
  const Icon = role === 'admin' ? ShieldCheck : NotebookPen;
  return <button type="button" className={`demo-role demo-role--${role}`} disabled={isBusy} onClick={() => onChoose(role)}>
    <Icon size={23} aria-hidden="true" /><span><strong>{translate(selected ? 'signingIn' : role === 'admin' ? 'continueAdmin' : 'continueCounselor')}</strong>
      <span>{translate(role === 'admin' ? 'adminDescription' : 'counselorDescription')}</span></span>
  </button>;
}
