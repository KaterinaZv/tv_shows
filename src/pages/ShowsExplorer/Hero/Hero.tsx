import { Badge } from '@/ui-kit/Badge/Badge';
import { Heading } from '@/ui-kit/Heading/Heading';
import { Text } from '@/ui-kit/Text/Text';

import styles from './Hero.module.css';
import { usePresenter } from './usePresenter';

export const Hero = () => {
  const { badge, title, subtitle } = usePresenter();

  return (
    <header className={styles.hero}>
      <Badge>{badge}</Badge>
      <Heading level={1} className={styles.title}>
        {title}
      </Heading>
      <Text variant="muted" className={styles.subtitle}>
        {subtitle}
      </Text>
    </header>
  );
};
