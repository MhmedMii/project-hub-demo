import type { LocalizedText } from '../../data_models/localized_text';

export function checkLocalizedField(text: LocalizedText, field: string, maximum: number): Record<string, string> {
  const errors: Record<string, string> = {};
  for (const language of ['en', 'ar'] as const) {
    if (!text[language].trim()) errors[`${field}_${language}`] = 'required';
    else if (text[language].trim().length > maximum) errors[`${field}_${language}`] = 'tooLong';
  }
  return errors;
}
