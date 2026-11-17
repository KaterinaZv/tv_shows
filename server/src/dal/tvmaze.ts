import { TVMAZE_API_URL, TVMAZE_TIMEOUT_MS } from '../shared/constants';
import { createHttpClient } from './createHttpClient';

export const tvmaze = createHttpClient({ baseUrl: TVMAZE_API_URL, timeoutMs: TVMAZE_TIMEOUT_MS });
