import { Button } from '@/ui-kit/Button/Button';
import { Heading } from '@/ui-kit/Heading/Heading';
import { Input } from '@/ui-kit/Input/Input';
import { Text } from '@/ui-kit/Text/Text';

import { usePresenter } from './logic/usePresenter';
import styles from './Login.module.css';

export const Login = () => {
  const {
    title,
    subtitle,
    email,
    emailLabel,
    emailPlaceholder,
    submitLabel,
    backLabel,
    isSubmitDisabled,
    errorText,
    handleEmailChange,
    handleKeyDown,
    handleSubmit,
    handleBack,
  } = usePresenter();

  return (
    <main className={styles.page}>
      <section className={styles.card}>
        <Heading level={1} className={styles.title}>
          {title}
        </Heading>
        <Text variant="muted">{subtitle}</Text>
        <Input
          type="email"
          autoComplete="email"
          value={email}
          ariaLabel={emailLabel}
          placeholder={emailPlaceholder}
          onChange={handleEmailChange}
          onKeyDown={handleKeyDown}
        />
        {errorText ? (
          <Text className={styles.error} role="alert">
            {errorText}
          </Text>
        ) : null}
        <Button variant="primary" isDisabled={isSubmitDisabled} onClick={handleSubmit}>
          {submitLabel}
        </Button>
        <Button variant="ghost" onClick={handleBack}>
          {backLabel}
        </Button>
      </section>
    </main>
  );
};
