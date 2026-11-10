import { useTranslation } from 'react-i18next';

import { SUPPORTED_LANGUAGES } from '@/i18n/constants';

export const usePresenter = () => {
  const { t, i18n } = useTranslation();

  return {
    groupLabel: t('language.groupLabel'),
    options: SUPPORTED_LANGUAGES.map((language) => ({
      value: language,
      label: language.toUpperCase(),
      isActive: language === i18n.resolvedLanguage,
    })),
    handleSelect: (language: string) => void i18n.changeLanguage(language),
  };
};
