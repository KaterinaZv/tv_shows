import { Text } from '@/ui-kit/Text/Text';

import type { Props } from './types';
import { usePresenter } from './usePresenter';

export const ResultsSummary = (props: Props) => {
  const { summary } = usePresenter(props);

  return <Text variant="muted">{summary}</Text>;
};
