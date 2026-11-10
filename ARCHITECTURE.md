# AI Rules — Simple Architecture

> Версия 0.1. Документ пополняется по мере развития архитектуры.
> Правила обязательны для людей и для AI-ассистентов. Правила пишутся на русском, код и названия на английском.

## Стек

- React + TypeScript
- Vite
- React Query (`@tanstack/react-query`)
- Собственный ui-kit на CSS-модулях (`*.module.css`)
- i18next + react-i18next — переводы интерфейса
- ESLint + Stylelint + Prettier, обязательны. Код с ошибками линтера не считается готовым.

## Что такое Simple Architecture

Сейчас описаны слои **View** и **Presenter**.

| Слой      | Что это в React                      | Ответственность                                                       |
| --------- | ------------------------------------ | --------------------------------------------------------------------- |
| View      | Компонент (JSX)                      | Только то, что пользователь видит в браузере                          |
| Presenter | Хук `usePresenter` в отдельном файле | 100% логики компонента: получение данных, форматирование, обработчики |

---

## Структура проекта

```
src/
  main.tsx        ← точка входа: провайдеры (React Query, i18n) и рендер <App />. Не компонент, правила View на него не распространяются
  App/            ← корневой компонент: шапка приложения + страница (позже — роутер)
  pages/          ← страницы. Каждая страница — компонент по правилам View + Presenter, внутри — дерево её компонентов
  components/     ← общие компоненты приложения (используются в 2+ местах или нужны на всех страницах)
  ui-kit/         ← базовые компоненты: Button, Input, Heading, Text, Badge, Link, Image, Chip, …
  shared/
    hooks/        ← универсальные хуки, не привязанные к предметной области
    constants/    ← общие константы, файлы по темам
    types/        ← общие типы, файлы по темам
    utils/        ← общие утилиты, файлы по темам
  api/            ← работа с сервером: запросы, типы ответов, ошибки, queryClient
  i18n/           ← настройка i18next и переводы (locales/*.json)
  styles/         ← глобальные стили и CSS-переменные (токены)
```

- **Страницы подчиняются правилу View + Presenter** так же, как любой компонент.
- Зависимости идут сверху вниз: `pages` → `components` → `ui-kit`. `ui-kit` не импортирует ничего из `pages`, `components`, `api` и `i18n`; `components` не импортируют из `pages`.
- `shared`, `api` и `i18n` могут использоваться любым слоем, кроме `ui-kit`.

---

## Правило 1. Компонент — это View

View содержит **только две вещи**: вызов `usePresenter` и JSX.

### Разрешённые импорты во View

- `./usePresenter`
- дочерние компоненты (вложенные или общие)
- компоненты ui-kit
- стили `*.module.css`
- типы, только через `import type` (например, `import type { Props } from './types'`)

Все остальные импорты **запрещены**: хуки React (`useState`, `useEffect`, …), React Query, утилиты, константы, хелперы, `clsx` и т. п.

### Разрешено в JSX

- условный рендер: `{isOpen && <Modal />}`, тернарники `{isLoading ? <Spinner /> : <List />}`
- рендер списков через `.map()`: `{items.map((item) => <Item key={item.id} {...item} />)}`

### Запрещено в JSX

- инлайн-стрелки в обработчиках: `onClick={() => onSelect(id)}` ❌. Presenter отдаёт готовый обработчик.
- форматирование данных: `date.toLocaleDateString()`, `price.toFixed(2)`, `` `${a} ${b}` `` ❌
- вычисление классов: ``className={`${styles.card} ${isActive ? styles.active : ''}`}`` ❌. Presenter отдаёт готовый `className`.
- любые вычисления, кроме условного рендера и `.map()`

### Пример

```tsx
// ShowCard/ShowCard.tsx — View
import type { Props } from './types';
import { usePresenter } from './usePresenter';
import { Button } from '@/ui-kit/Button/Button';
import { ShowPoster } from './ShowPoster/ShowPoster';

export const ShowCard = (props: Props) => {
  const { title, premiereDate, rootClassName, isFavorite, handleFavoriteClick } = usePresenter(props);

  return (
    <article className={rootClassName}>
      <ShowPoster />
      <h3>{title}</h3>
      <span>{premiereDate}</span>
      {isFavorite ? <span>★</span> : null}
      <Button onClick={handleFavoriteClick}>В избранное</Button>
    </article>
  );
};
```

---

## Правило 2. Presenter — это хук `usePresenter`

- Presenter лежит в файле `usePresenter.ts` в папке компонента. Имя одинаковое во всех компонентах.
- Presenter забирает **100% логики** компонента: хуки React, запросы React Query, форматирование, вычисление классов, обработчики.
- Принимает props компонента целиком: `usePresenter(props)`.
- Возвращает **плоский объект**, в котором всё готово к показу:
  - данные в финальном виде: отформатированные строки, числа, даты;
  - флаги состояния: `isLoading`, `isEmpty`, `isError`, `isOpen`, …;
  - готовые `className`;
  - обработчики с префиксом `handle*`: `handleClick`, `handleSubmit`, …
- Presenter **не вызывает `useQuery` / `useMutation` напрямую**. Каждый запрос оборачивается в отдельный кастомный хук в своём файле `use<Name>.ts` (например, `useSearchShows.ts`), а presenter только вызывает его. Query key выносится в `constants.ts`.
- Размещение хука — по правилу 4: используется в одном месте → в папке компонента, в нескольких → `src/shared/hooks/`.
- Когда появится слой Interactor, эти хуки переедут туда.
- Самостоятельная логика со своим состоянием (пагинация, debounce и т. п.) тоже выносится в кастомный хук `use<Name>.ts` (например, `usePagination.ts`, `useGenreFilter.ts`). Presenter собирает такие хуки вместе и готовит данные для View.

```ts
// ShowsExplorer/useSearchShows.ts
export const useSearchShows = (query: string) =>
  useQuery({
    queryKey: [...SEARCH_SHOWS_QUERY_KEY, query],
    queryFn: ({ signal }) => searchShows(query, signal),
    enabled: query.length > 0,
  });

// ShowsExplorer/usePresenter.ts
const { data, isPending, isError } = useSearchShows(searchQuery);
```

```ts
// ShowCard/usePresenter.ts — Presenter
import { useState } from 'react';
import type { Props } from './types';
import styles from './ShowCard.module.css';

export const usePresenter = ({ show, onFavoriteToggle }: Props) => {
  const [isFavorite, setIsFavorite] = useState(show.isFavorite);

  const handleFavoriteClick = () => {
    setIsFavorite((prev) => !prev);
    onFavoriteToggle(show.id);
  };

  return {
    title: show.name,
    premiereDate: new Date(show.premiered).toLocaleDateString('ru-RU'),
    rootClassName: isFavorite ? `${styles.card} ${styles.favorite}` : styles.card,
    isFavorite,
    handleFavoriteClick,
  };
};
```

### Компонент без логики

Если компоненту не нужна логика (чистая вёрстка), `usePresenter.ts` **не создаётся**. Как только появляется хотя бы одна строка логики, создаётся presenter.

---

## Правило 3. Каждый компонент — отдельная папка

```
ShowCard/
  ShowCard.tsx          ← View, точка входа (имя файла = имя папки)
  usePresenter.ts       ← Presenter (если есть логика)
  useSearchShows.ts     ← кастомные хуки: запросы, пагинация и т. п. (если есть)
  types.ts              ← типы компонента (Props и др.)
  constants.ts          ← константы (если есть)
  utils.ts              ← чистые функции-хелперы (если есть)
  ShowCard.module.css   ← стили
```

- Имя папки = имя компонента = имя файла View (PascalCase).
- Типы компонента (`Props` и др.) лежат в `types.ts`. Их импортируют и View, и Presenter.
- **Без `index.ts`** и barrel-файлов. Импорт всегда идёт по полному пути до файла: `./ShowPoster/ShowPoster`.

---

## Правило 4. Где лежит папка компонента

- **Используется в одном месте** → папка лежит **внутри папки компонента-родителя**, который её использует. Так строится дерево компонентов.
- **Используется в двух местах и больше** → папка переезжает **на самый верхний уровень** общих компонентов (не к ближайшему общему родителю).

```
src/
  components/
    ShowCard/                 ← используется в нескольких местах → верхний уровень
      ShowCard.tsx
      usePresenter.ts
      types.ts
      ShowCard.module.css
      ShowPoster/             ← используется только в ShowCard → вложен
        ShowPoster.tsx
        ShowPoster.module.css
```

Когда вложенный компонент понадобился во втором месте, его папку нужно перенести на верхний уровень в том же изменении.

**Исключение — компоненты уровня приложения.** Компоненты, которые заведомо нужны на всех страницах (`AppHeader`, `LanguageSwitcher`, общая навигация), сразу кладутся в `src/components/`, даже если пока используются в одном месте. Шапка приложения рендерится в корневом `src/App/App.tsx`, а не внутри страницы.

**Исключение — универсальные хуки.** Хуки, не привязанные к предметной области (`useDebouncedValue`, `usePagination`, `useSearchQuery` и т. п.), сразу кладутся в `src/shared/hooks/` (один хук — один файл), даже если пока используются в одном месте. Их типы — в `src/shared/types/`. Хуки предметной области (`useSearchShows`) подчиняются общему правилу.

---

## Правило 5. ui-kit

Компоненты ui-kit подчиняются **тем же правилам**: View + Presenter, отдельная папка, `types.ts`, CSS-модули.

Базовые HTML-элементы рендерятся **только через ui-kit**, чтобы стили и поведение переиспользовались:

| Элемент             | Компонент ui-kit         |
| ------------------- | ------------------------ |
| `button`            | `Button`                 |
| `input`             | `Input`                  |
| `h1`–`h6`           | `Heading` (`level`)      |
| `p`, `span` (текст) | `Text` (`as`, `variant`) |
| `span` (плашка)     | `Badge` (`variant`)      |
| `a`                 | `Link` (`isExternal`)    |
| `img`               | `Image` (`isLazy`)       |

- Сырые `button`, `input`, `h1`–`h6`, `p`, `span`, `a`, `img` разрешены только внутри `src/ui-kit/`.
- Компоненты ui-kit принимают необязательный `className` — для раскладки и точечных стилей конкретного места (позиционирование, отступы, line-clamp).
- Не хватает варианта или элемента — добавляем его в ui-kit, а не верстаем сырым тегом.

---

## Правило 6. Тексты интерфейса — только через i18n в presenter

- Все тексты интерфейса (заголовки, подписи, `placeholder`, `aria-label`, `alt`, сообщения об ошибках) лежат в файлах переводов `src/i18n/locales/*.json`.
- `useTranslation` вызывается **только в presenter**. View получает готовые строки и не содержит текста в JSX.
- Тексты переводит presenter **того компонента, который их показывает**. Родитель не собирает тексты для детей в объект `texts` и не передаёт их через props. Если у родителя набирается много чужих текстов — это сигнал выделить дочерние компоненты (например, `Header`, `SearchBar`, `SearchStatus`).
- **ui-kit не зависит от i18n**: тексты приходят в компоненты ui-kit через props (`label`, `clearLabel`, `ariaLabel`, …).
- Склонения — средствами i18next (`count` + ключи `_one`, `_few`, `_many`, `_other`), без самописных функций.
- Источник ключей — `en.json`. Ключ, которого нет в `ru.json`, — ошибка типов.

```ts
// ShowCard/usePresenter.ts
export const usePresenter = ({ show }: Props) => {
  const { t } = useTranslation();

  return {
    posterAlt: t('show.posterAlt', { title: show.name }),
    linkLabel: t('show.openOnTvmaze'),
  };
};
```

```tsx
// ui-kit получает текст через props
<SearchInput clearLabel={clearLabel} loadingLabel={loadingLabel} />
```

---

## Правило 7. Константы, типы и хелперы — в отдельных файлах

В `usePresenter.ts` и View не объявляются константы, типы и функции-хелперы на уровне модуля. Presenter содержит только хук.

| Что                                                        | Куда           |
| ---------------------------------------------------------- | -------------- |
| Константы (`PAGE_SIZE`, `SEARCH_DEBOUNCE_MS`, …)           | `constants.ts` |
| Типы (`Props`, `GenreState`, …)                            | `types.ts`     |
| Чистые функции-хелперы (`collectGenres`, `formatYears`, …) | `utils.ts`     |

Размещение — по тому же принципу, что и компоненты (правило 4):

- **используется в одном месте** → файл лежит в папке компонента, который его использует;
- **используется в двух местах и больше** → переезжает на глобальный уровень в папки `src/shared/constants/`, `src/shared/types/`, `src/shared/utils/`. Внутри — файлы по теме: `constants/pagination.ts`, `types/pagination.ts` и т. п. Без `index.ts`.

```ts
// ❌ ShowsExplorer/usePresenter.ts
const PAGE_SIZE = 3;
type GenreState = { query: string; genre: string | null };

// ✅
import { PAGE_SIZE } from '@/shared/constants/pagination'; // используется в ShowsExplorer и ShowListSkeleton
import type { GenreState } from './types';
```

---

## Контроль правил

Правила проверяются автоматически через ESLint, а не только на ревью:

- для View-файлов: `no-restricted-imports` и запрет хуков React;
- запрет инлайн-стрелок в JSX-обработчиках (`react/jsx-no-bind`);
- запрет текста в JSX во View (`react/jsx-no-literals`), кроме символов-иконок;
- сырые `button`, `input`, `h1`–`h6`, `p`, `span`, `a`, `img` вне `src/ui-kit/` (`react/forbid-elements`, правило 5);
- импорт `@tanstack/react-query` в `usePresenter.ts` (правило 2);
- в `usePresenter.ts` и View на верхнем уровне модуля объявляется только сам хук или компонент; константы, типы и хелперы — ошибка (правило 7);
- порядок импортов, исправляется автоматически через `npm run lint:fix`;
- Prettier для форматирования, максимальная длина строки **120 символов** (`printWidth: 120`).

Все проверки запускаются одной командой: `npm run check`.

Конфигурация — `eslint.config.js`.
