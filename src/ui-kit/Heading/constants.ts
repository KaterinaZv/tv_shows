import type { HeadingLevel } from './types';

export const HEADING_TAGS = { 1: 'h1', 2: 'h2', 3: 'h3' } as const satisfies Record<HeadingLevel, string>;
