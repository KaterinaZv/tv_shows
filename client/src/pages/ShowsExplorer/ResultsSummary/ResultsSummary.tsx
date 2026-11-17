import { Text } from '@/ui-kit/Text/Text';

import { usePresenter } from './logic/usePresenter';
import type { Props } from './types';

export const ResultsSummary = (props: Props) => {
  const { summary } = usePresenter(props);

  return <Text variant="muted">{summary}</Text>;
};
