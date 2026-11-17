@ARCHITECTURE.md

## Команды

Все команды запускаются **из корня** монорепозитория.

| Команда                 | Что делает                                                                             |
| ----------------------- | -------------------------------------------------------------------------------------- |
| `npm run dev`           | Клиент (Vite, :5173) и сервер (tsx watch, :3000) вместе. `/api` проксируется на сервер |
| `npm run dev -w client` | Только клиент                                                                          |
| `npm run dev -w server` | Только сервер                                                                          |
| `npm run check`         | Полная проверка: типы всех пакетов + ESLint + Stylelint + Prettier (`--check`)         |
| `npm run typecheck`     | Проверка типов во всех пакетах (`client`, `server`, `shared`)                          |
| `npm run lint`          | ESLint: правила архитектуры, порядок импортов                                          |
| `npm run lint:css`      | Stylelint: CSS-модули клиента, mobile first                                            |
| `npm run lint:fix`      | ESLint с автоисправлением (в том числе сортирует импорты)                              |
| `npm run format`        | Prettier: форматирует все файлы (`printWidth: 120`)                                    |
| `npm run build`         | Сборка клиента (`client/dist`) и сервера (`server/dist/index.js`, esbuild)             |

- Задача считается готовой, только если `npm run check` и `npm run build` проходят без ошибок.
- Зависимость пакета ставится в его workspace: `npm install <pkg> -w client` / `-w server`. Общие инструменты (линтеры, Prettier, husky) — в корне.
- **После изменения зависимостей `package-lock.json` пересобирается в Linux-контейнере** (`docker run --platform linux/amd64 node:22 npm install`), иначе `npm ci` в GitHub Actions и на Render может упасть.

## Деплой

| Что    | Куда         | Когда                                                                               |
| ------ | ------------ | ----------------------------------------------------------------------------------- |
| Клиент | GitHub Pages | Push в `main` → GitHub Actions (`.github/workflows/deploy.yml`)                     |
| Сервер | Render       | Push в `main` с изменениями в `server/`, `shared/` или зависимостях (`render.yaml`) |

- Продакшен: клиент — https://katerinazv.github.io/tv_shows/, API — https://tv-shows-api-6w33.onrender.com (`/api/health` для проверки).
- URL бэкенда для сборки клиента — переменная репозитория `VITE_API_URL` (Settings → Secrets and variables → Actions → Variables).
- Бесплатный Render засыпает через 15 минут без запросов: первый запрос после этого ждёт до минуты, данные в памяти (кеш, избранное) стираются.

## Код-стайл

- Комментарии в коде пишутся на английском.
- **`any` запрещён** — явный, через приведение (`as any`) и пришедший из библиотек (`JSON.parse`, `response.json()`). Для неизвестных данных — `unknown` с последующим сужением типа. Проверяет ESLint (`no-explicit-any`, `no-unsafe-*`).
- **Mobile first.** Базовые стили пишутся для мобильных, для экранов шире — только `@media (min-width: ...)`. `max-width` в медиазапросах запрещён (Stylelint).
- Брейкпоинты: `768px` — планшет и десктоп.

## Git-процесс

- Не делать `git commit` и `git push` без явного разрешения пользователя.
- Никогда не коммитить и не пушить напрямую в `main`. Каждый push в `main` запускает деплой на GitHub Pages.
- Имена веток: `<тип>/<kebab-case-на-английском>`
  - `feat/` — новая функциональность
  - `fix/` — исправление бага
  - `docs/` — документация
  - `chore/` — настройки, зависимости, CI

## Git-хуки (husky + lint-staged)

| Хук          | Что запускает                                                                                                                              |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------ |
| `pre-commit` | `lint-staged`: `eslint --fix` / `stylelint --fix` и `prettier --write` только по staged-файлам, затем `npm run typecheck` по всему проекту |
| `pre-push`   | `npm run check` и `npm run build`                                                                                                          |

- Если хук упал, нужно исправить причину и повторить коммит или push.
- Обходить хуки через `--no-verify` запрещено.
