import { Badge } from '@/ui-kit/Badge/Badge';
import { Button } from '@/ui-kit/Button/Button';
import { Heading } from '@/ui-kit/Heading/Heading';
import { Image } from '@/ui-kit/Image/Image';
import { Link } from '@/ui-kit/Link/Link';
import { Text } from '@/ui-kit/Text/Text';

import { usePresenter } from './logic/usePresenter';
import styles from './ShowCard.module.css';
import type { Props } from './types';

export const ShowCard = (props: Props) => {
  const {
    title,
    posterUrl,
    posterAlt,
    posterPlaceholder,
    rating,
    meta,
    genres,
    summary,
    tvmazeUrl,
    linkLabel,
    isFavorite,
    favoriteIcon,
    favoriteLabel,
    favoriteClassName,
    bodyClassName,
    isFavoritePending,
    handleFavoriteClick,
  } = usePresenter(props);

  return (
    <div className={styles.container}>
      <article className={styles.card}>
        <div className={styles.poster}>
          {posterUrl ? (
            <Image className={styles.image} src={posterUrl} alt={posterAlt} />
          ) : (
            <div className={styles.placeholder} aria-hidden="true">
              {posterPlaceholder}
            </div>
          )}
          <Button
            variant="ghost"
            className={favoriteClassName}
            ariaLabel={favoriteLabel}
            isPressed={isFavorite}
            isDisabled={isFavoritePending}
            onClick={handleFavoriteClick}
          >
            {favoriteIcon}
          </Button>
        </div>

        {rating ? (
          <Badge variant="rating" className={styles.rating}>
            {rating}
          </Badge>
        ) : null}

        <div className={bodyClassName}>
          <Heading level={3}>{title}</Heading>
          <Text variant="caption">{meta}</Text>
          <ul className={styles.genres}>
            {genres.map((genre) => (
              <li key={genre}>
                <Badge>{genre}</Badge>
              </li>
            ))}
          </ul>
          <Text variant="muted" className={styles.summary}>
            {summary}
          </Text>
          <Link className={styles.link} href={tvmazeUrl} isExternal>
            {linkLabel}
          </Link>
        </div>
      </article>
    </div>
  );
};
