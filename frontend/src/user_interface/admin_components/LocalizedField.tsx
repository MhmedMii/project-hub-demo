import type { ChangeEvent } from 'react';
import type { LocalizedText } from '../../data_models/localized_text';
import { useLanguage } from '../languages/LanguageSettings';
import { TextInput } from '../shared_components/TextInput';
import { TextArea } from '../shared_components/TextArea';
import './LocalizedField.css';

interface LocalizedFieldProps {
  field: 'title' | 'description' | 'category'; value: LocalizedText; onChange: (value: LocalizedText) => void;
  errors: Record<string, string>; disabled: boolean;
}

export function LocalizedField({ field, value, onChange, errors, disabled }: LocalizedFieldProps) {
  const { translate } = useLanguage();
  const Field = field === 'description' ? TextArea : TextInput;
  return <div className="two-fields localized-field">{(['en', 'ar'] as const).map(language => <Field
    key={language} label={translate(`${field}${language === 'en' ? 'En' : 'Ar'}`)} value={value[language]}
    dir={language === 'en' ? 'ltr' : 'rtl'} disabled={disabled}
    error={errors[`${field}_${language}`] ? translate(errors[`${field}_${language}`]!) : undefined}
    onChange={(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => onChange({ ...value, [language]: event.target.value })}
  />)}</div>;
}
