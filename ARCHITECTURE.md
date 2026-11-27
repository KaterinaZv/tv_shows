# AI Rules — Simple Architecture

> Версия 0.6. Документ пополняется по мере развития архитектуры.
> Правила обязательны для людей и для AI-ассистентов. Правила пишутся на русском, код и названия на английском.

## Стек

**Монорепозиторий** на npm workspaces: `client/` (фронтенд), `server/` (бэкенд), `shared/` (контракт API).

- **Frontend (`client/`):** React + TypeScript, Vite, React Query (`@tanstack/react-query`), React Router (`react-router`, `HashRouter`), собственный ui-kit на CSS-модулях (`*.module.css`), i18next + react-i18next. Хостинг — GitHub Pages.
- **Backend (`server/`):** Node.js + TypeScript, Express. Хранение — в памяти процесса (баз данных пока нет). Хостинг — Render.
- ESLint + Stylelint + Prettier, обязательны. Код с ошибками линтера не считается готовым.

## Что такое Simple Architecture

Simple Architecture опирается на VIPER: **V**iew, **I**nteractor, **P**resenter, **E**ntity, **R**outer. Interactor у нас называется **Tasks**.

| Слой VIPER | У нас     | Что это в React                                   | Ответственность                                                           |
| ---------- | --------- | ------------------------------------------------- | ------------------------------------------------------------------------- |
| View       | View      | Компонент (JSX)                                   | Только то, что пользователь видит в браузере                              |
| Presenter  | Presenter | Хук `usePresenter` в `logic/usePresenter.ts`      | Связывает View с логикой: готовит данные к показу, обработчики, навигация |
| Interactor | **Tasks** | Обычные функции в `logic/tasks/` или `src/tasks/` | Бизнес-логика: контроллеры с доступом к любому стору (use cases)          |
| Entity     | Entity    | Стор state-менеджера в `src/stores/`              | База данных: только данные, доступ через `get` / `set`                    |
| Router     | Навигация | Вызовы роутера в presenter                        | Переходы между страницами. Не бизнес-логика, зависит от среды запуска     |

### Бизнес-правила и бизнес-логика

- **Бизнес-правила** описывают, как бизнес работает и зарабатывает. Они существуют и без приложения.
- **Бизнес-логика** — то, что в книге «Чистая архитектура» называется вариантами использования (use cases): сценарии взаимодействия пользователя с системой. В Simple Architecture вся бизнес-логика живёт в **тасках** (`tasks`).

---

## Структура проекта

```
client/           ← фронтенд, структура ниже
server/           ← бэкенд, структура — в правиле 13
shared/           ← контракт API: типы запросов и ответов, общие для client и server (правило 14)
package.json      ← npm workspaces, общие ESLint / Prettier / git-хуки
```

Структура фронтенда (пути — относительно `client/`):

```
src/
  main.tsx        ← точка входа: провайдеры (React Query, i18n, HashRouter) и рендер <App />. Не компонент, правила View на него не распространяются
  App/            ← корневой компонент: шапка приложения + страница по маршруту (`useRoutes`, таблица маршрутов в `constants.tsx`)
  pages/          ← страницы (ShowsExplorer, Login). Каждая страница — компонент по правилам View + Presenter, внутри — дерево её компонентов
  components/     ← общие компоненты приложения (используются в 2+ местах или нужны на всех страницах)
  tasks/          ← общие таски (нужны в 2+ местах) и таски уровня приложения (showToast, dismissToast, fetchCurrentUser)
  stores/         ← сущности (Entity): createStore + сторы — «база данных», только get / set (toastsStore)
  ui-kit/         ← базовые компоненты: Button, Input, SearchInput, Heading, Text, Badge, Link, Image, Chip, Spinner, Drawer, Toast
  shared/
    hooks/        ← универсальные хуки, не привязанные к предметной области
    constants/    ← общие константы, файлы по темам
    types/        ← общие типы, файлы по темам
    utils/        ← общие утилиты, файлы по темам
  api/            ← DAL: только HTTP-обвязка над fetch (httpClient), токен сессии (authToken), ошибки, queryClient. Без эндпоинтов (правило 12)
  i18n/           ← настройка i18next и переводы (locales/*.json)
  styles/         ← глобальные стили и CSS-переменные (токены)
```

- **Страницы подчиняются правилу View + Presenter** так же, как любой компонент.
- Зависимости идут сверху вниз: `pages` → `components` → `ui-kit`. `ui-kit` не импортирует ничего из `pages`, `components`, `api` и `i18n`; `components` не импортируют из `pages`.
- `shared`, `api` и `i18n` могут использоваться любым слоем, кроме `ui-kit`.
- Таски (`logic/tasks/`, `src/tasks/`) могут использовать `api`, `stores`, `shared` и другие таски. Таски **не зависят** от React, компонентов, ui-kit, i18n и роутера.

---

## Правило 1. Компонент — это View

View содержит **только две вещи**: вызов `usePresenter` и JSX.

### Разрешённые импорты во View

- `./logic/usePresenter`
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
import { usePresenter } from './logic/usePresenter';
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

- Presenter лежит в файле `logic/usePresenter.ts` в папке компонента. Имя одинаковое во всех компонентах.
- Presenter забирает **100% логики отображения** компонента: хуки React, запросы React Query, форматирование, вычисление классов, обработчики, навигацию. **Бизнес-логику** presenter не реализует сам, а вызывает таски (правило 8).
- Принимает props компонента целиком: `usePresenter(props)`.
- Возвращает **плоский объект**, в котором всё готово к показу:
  - данные в финальном виде: отформатированные строки, числа, даты;
  - флаги состояния: `isLoading`, `isEmpty`, `isError`, `isOpen`, …;
  - готовые `className`;
  - обработчики с префиксом `handle*`: `handleClick`, `handleSubmit`, …
- Presenter **не вызывает `useQuery` / `useMutation` напрямую**. Каждый запрос оборачивается в отдельный кастомный хук в своём файле `logic/use<Name>.ts` (например, `logic/useShowsPage.ts`), а presenter только вызывает его. Query key выносится в `constants.ts`.
- Хуки React Query остаются хуками в `logic/` — в таски они не переезжают, потому что таски не зависят от React. Сама работа с данными (запрос к API и его обработка) — таска, которую хук передаёт в `queryFn`.
- Самостоятельная логика со своим состоянием (пагинация, debounce и т. п.) тоже выносится в кастомный хук `logic/use<Name>.ts` (например, `usePagination.ts`, `useGenreFilter.ts`). Presenter собирает такие хуки вместе и готовит данные для View.
- Размещение хука — по правилу 4: используется в одном месте → в `logic/` компонента, в нескольких → `src/shared/hooks/`.
- **После мутации кеш обновляется по ответу сервера, а не перезапросом.** Если ответ содержит новое состояние (например, `{ showId, isFavorite, count }`), хук мутации применяет его к кешу через `setQueryData` / `setQueriesData`. Преобразование данных по ответу сервера — **таска** (`updateShowsPageFavorite`, `updateFavoritesList`): чистая функция над данными контракта API, без React Query. Кеш React Query играет роль стора для серверных данных, а таска — контроллера. Вызов `setQueryData` / `setQueriesData` — в хуке мутации. `invalidateQueries` — только когда ответ не содержит нужных данных.

```ts
// ShowsExplorer/logic/useShowsPage.ts — хук React Query
export const useShowsPage = ({ query, genres, page }: ShowsPageParams) =>
  useQuery({
    queryKey: [...SHOWS_PAGE_QUERY_KEY, query, genres, page],
    queryFn: ({ signal }) => fetchShowsPage({ query, genres, page }, signal), // fetchShowsPage — таска
    enabled: query.length > 0,
  });

// ShowsExplorer/logic/usePresenter.ts
const { data, isPending, isError } = useShowsPage({ query: searchQuery, genres: selectedGenres, page });
```

```ts
// ShowCard/logic/usePresenter.ts — Presenter
import { useState } from 'react';
import type { Props } from '../types';
import styles from '../ShowCard.module.css';

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

Если компоненту не нужна логика (чистая вёрстка), папка `logic/` и `usePresenter.ts` **не создаются**. Как только появляется хотя бы одна строка логики, создаётся `logic/usePresenter.ts`.

---

## Правило 3. Каждый компонент — отдельная папка

```
ShowsExplorer/
  ShowsExplorer.tsx           ← View, точка входа (имя файла = имя папки)
  ShowsExplorer.module.css    ← стили
  types.ts                    ← типы компонента (Props и др.)
  constants.ts                ← константы (если есть)
  utils.ts                    ← технические хелперы (если есть)
  logic/                      ← все хуки компонента и его таски (если есть логика)
    usePresenter.ts           ← Presenter
    useShowsPage.ts           ← кастомные хуки: запросы, пагинация и т. п.
    tasks/                    ← таски компонента (если есть бизнес-логика)
      fetchShowsPage.ts       ← одна таска — один файл, имя файла = имя функции
```

- Имя папки = имя компонента = имя файла View (PascalCase).
- Типы компонента (`Props` и др.) лежат в `types.ts`. Их импортируют и View, и Presenter.
- **Все хуки компонента** (`usePresenter` и кастомные `use*`) лежат в `logic/`. Во View и рядом с ним хуков нет.
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
      ShowCard.module.css
      types.ts
      logic/
        usePresenter.ts
      ShowPoster/             ← используется только в ShowCard → вложен
        ShowPoster.tsx
        ShowPoster.module.css
```

Когда вложенный компонент понадобился во втором месте, его папку нужно перенести на верхний уровень в том же изменении.

**Исключение — компоненты уровня приложения.** Компоненты, которые заведомо нужны на всех страницах (`AppHeader`, `LanguageSwitcher`, общая навигация), сразу кладутся в `src/components/`, даже если пока используются в одном месте. Шапка приложения рендерится в корневом `src/App/App.tsx`, а не внутри страницы.

**Исключение — универсальные хуки.** Хуки, не привязанные к предметной области (`useDebouncedValue`, `usePagination`, `useSearchQuery` и т. п.), сразу кладутся в `src/shared/hooks/` (один хук — один файл), даже если пока используются в одном месте. Их типы — в `src/shared/types/`. Хуки предметной области (`useShowsPage`) подчиняются общему правилу.

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
| `dialog`            | `Drawer`                 |

- Сырые `button`, `input`, `h1`–`h6`, `p`, `span`, `a`, `img`, `dialog` разрешены только внутри `src/ui-kit/`.
- Составные компоненты ui-kit (`SearchInput`, `Drawer`, `Toast`) собираются из базовых компонентов ui-kit и тоже не знают про i18n: тексты (`closeLabel`, `clearLabel`, …) приходят через props.
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

| Что                                                 | Куда           |
| --------------------------------------------------- | -------------- |
| Константы (`PAGE_SIZE`, `SEARCH_DEBOUNCE_MS`, …)    | `constants.ts` |
| Типы (`Props`, `GenreState`, …)                     | `types.ts`     |
| Технические хелперы (`formatYears`, `stripHtml`, …) | `utils.ts`     |
| Бизнес-логика (`fetchShowsPage`, `toggleGenre`, …)  | `logic/tasks/` |

Размещение — по тому же принципу, что и компоненты (правило 4):

- **используется в одном месте** → файл лежит в папке компонента, который его использует;
- **используется в двух местах и больше** → переезжает на глобальный уровень в папки `src/shared/constants/`, `src/shared/types/`, `src/shared/utils/`. Внутри — файлы по теме: `constants/pagination.ts`, `types/pagination.ts` и т. п. Без `index.ts`.

**Хелпер или таска?** Если функция описывает действие предметной области — что приложение делает для пользователя (найти сериалы, отфильтровать по жанрам, добавить в избранное), это **таска**. Если это техническое преобразование без смысла для бизнеса (вырезать HTML, отформатировать год), это **хелпер** в `utils.ts`.

```ts
// ❌ ShowsExplorer/logic/usePresenter.ts
const PAGE_SIZE = 3;
type GenreState = { query: string; genre: string | null };

// ✅
import { PAGE_SIZE } from '@/shared/constants/pagination'; // используется в ShowsExplorer и ShowListSkeleton
import type { GenreState } from '../types';
```

---

## Правило 8. Tasks — бизнес-логика в обычных функциях

Таска (task) — реализация одного сценария взаимодействия пользователя с системой (use case, в VIPER — Interactor). Принимает входные данные, выполняет инструкции, возвращает результат.

- **Таска — обычная JS/TS-функция.** Одна таска — одна функция. Внутри её можно разбить на шаги, но снаружи это всегда вызов одной функции.
- **Имя — глагол:** `searchShows`, `filterShowsByGenres`, `addToFavorites`, `login`, `buy`.
- **Одна таска — один файл**, имя файла = имя функции: `logic/tasks/filterShowsByGenres.ts`. Вспомогательные шаги таски — в том же файле, наружу экспортируется только сама таска.
- **В тасках нет React.** Ни импортов `react`, ни хуков, ни React Query, ни JSX. Слой на 100% независим от библиотеки отображения.
- **В тасках нет i18n и навигации.** Тексты и переходы зависят от интерфейса и среды, а не от бизнес-логики (правила 6 и 10).
- **Таска — контроллер.** Она имеет доступ к любому стору («базе / таблице / коллекции») и работает с ним напрямую через `get` / `set`, без посредников вроде redux-thunk или redux-saga (правило 9). Вся логика изменения данных — в таске, а не в сторе.
- Таска может вызывать `api`, сторы, `shared` и другие таски. Может быть асинхронной.

### Где лежат таски

- **Используется одним компонентом** → `logic/tasks/` этого компонента.
- **Используется в двух местах и больше** → глобальная папка `src/tasks/` (по аналогии с правилом 4).
- **Исключение — таски уровня приложения.** Таски, которые заведомо нужны везде (уведомления: `showToast`, `dismissToast`), сразу кладутся в `src/tasks/`, даже если пока используются в одном месте — по аналогии с компонентами уровня приложения (правило 4).

```ts
// server/src/modules/shows/tasks/filterShowsByGenres.ts — таска бэкенда
import type { Show } from '@tv-shows/shared/shows';

export const filterShowsByGenres = (shows: Show[], genres: string[]) =>
  genres.length > 0 ? shows.filter((show) => show.genres.some((genre) => genres.includes(genre))) : shows;
```

```ts
// server/src/modules/shows/tasks/getShowsPage.ts — таска собирает сценарий из других тасок
const shows = await searchShows(query);
const filteredShows = filterShowsByGenres(shows, genres);
const pageData = paginate(filteredShows, page, PAGE_SIZE);
```

---

## Правило 9. Entity — сторы state-менеджера

Сущность (Entity) — это **стор state-менеджера**. Стор — это **база данных**: он только хранит данные и даёт к ним доступ.

- **В сторе нет методов с логикой** — только `get` и `set`. Никаких `addFavorite`, `toggleGenre`, редьюсеров и вычислений внутри стора.
- **Вся логика работы с данными — в тасках.** Таска — контроллер: читает данные через `get`, вычисляет новое состояние и записывает через `set`. Одна таска может работать с несколькими сторами («таблицами / коллекциями»).
- Со сторами общаемся **напрямую**, без библиотек-посредников (redux-thunk, redux-saga и т. п.).
- Сторы лежат в `src/stores/`, один стор — одна «таблица / коллекция» — один файл: `src/stores/favoritesStore.ts`.
- Стор хранит **клиентское** состояние (избранное, настройки пользователя, данные, общие для нескольких страниц). **Серверные данные остаются в React Query** и в стор не дублируются.
- **Presenter** получает данные стора через хук-селектор `logic/use<Name>.ts`, а изменения запускает через таски.
- **На клиенте state-менеджер — свой минимальный `createStore`** (`client/src/stores/createStore.ts`), без библиотек: `get` / `set` + `subscribe`. `subscribe` — инфраструктура для React, логики в нём нет. Стор читает хук-селектор через `useStore(store)` (`useSyncExternalStore`), изменяют — только таски.
- Первая клиентская сущность — `toastsStore` (уведомления): таска `showToast` пишет в стор, компонент `Toasts` читает его через хук `useToasts`. Текст уведомления presenter передаёт в таску уже переведённым (в тасках нет i18n).
- **На бэкенде сторы — обычные объекты в памяти** (`const cache = {}`, `const favorite = {}`), обёрнутые в `get` / `set` (`server/src/stores/`).

### Стор — самое чувствительное место

Зависимости идут цепочкой: View → Presenter → Tasks → Store. От того, как устроен стор, зависит всё приложение, поэтому любое серьёзное изменение стора — риск багов в других слоях. Чтобы менять стор реже и дешевле:

- **Не храним в сторе то, что можно не хранить.** Производные данные вычисляются в таске или presenter, серверные остаются в React Query.
- **Храним минимум данных.** Меньше полей — меньше поводов менять форму записи.
- **Минимум обращений к стору.** Пишут в стор только таски, читают — таски и хуки-селекторы. Presenter стор не импортирует. Чем меньше мест знает о сторе, тем меньше кода придётся чинить при его изменении.
- **Записи стора не уходят дальше хука-селектора** (правило 15). Тип записи стора — часть стора; presenter и View получают свой тип из `types.ts` компонента.

```ts
// src/tasks/addToFavorites.ts — таска-контроллер
export const addToFavorites = (show: Show) => {
  const favorites = favoritesStore.get();

  if (favorites.some((item) => item.id === show.id)) return;

  favoritesStore.set([...favorites, show]);
};
```

---

## Правило 10. Router — навигация только в presenter

- Переходы между страницами выполняются **в presenter**.
- Навигация — **не бизнес-логика**. Таска делает своё дело и возвращает результат, а куда перейти после неё, решает presenter.
- Причина: одна и та же таска (например, `logout`) одинаково работает в вебе и в мобильном приложении, а навигация после неё зависит от среды запуска.

```ts
// logic/usePresenter.ts
const handleLogout = async () => {
  await logout(); // таска: бизнес-логика
  navigate('/login'); // навигация: решение presenter
};
```

- Роутер — `HashRouter` из `react-router`: адреса вида `#/login`, потому что GitHub Pages отдаёт только `index.html` и не умеет отвечать на `/login`. Провайдер подключается в `main.tsx`.
- Таблица маршрутов — `App/constants.tsx`, пути страниц — `src/shared/constants/routes.ts` (`ROUTES.login`), чтобы presenter не писал адреса строками.
- View не импортирует роутер: `useRoutes`, `useNavigate`, `useLocation` вызываются только в presenter (правило 1).

---

## Правило 11. Frontend и backend: кто за что отвечает

**Backend — источник истины для данных и бизнес-логики, frontend — для отображения и взаимодействия с пользователем.**

| Ответственность                                                                         | Где          |
| --------------------------------------------------------------------------------------- | ------------ |
| Обращение к внешним API (TVmaze), кеширование их ответов                                | **backend**  |
| Фильтрация, пагинация, сортировка данных                                                | **backend**  |
| Хранение пользовательских данных (избранное) и правила их изменения                     | **backend**  |
| Валидация входных данных (как последний рубеж)                                          | **backend**  |
| Что и в каком виде показать: форматирование, тексты (i18n), состояния загрузки и ошибок | **frontend** |
| Ввод пользователя: debounce, выбранные фильтры и страница как **параметры запроса**     | **frontend** |
| Уведомления (toast), навигация, анимации                                                | **frontend** |

- **Валидация — на обеих сторонах, правило — одно.** Клиент проверяет ввод до запроса: кнопка неактивна, пока email не похож на настоящий, и заведомо неверные данные не уходят на сервер. Сервер проверяет всё равно — клиент можно обойти. Чтобы правила не разошлись, формат лежит в контракте (`EMAIL_PATTERN` в `shared/src/auth.ts`, правило 14), а не копируется.
- Frontend **не дублирует** бизнес-логику бэкенда: не фильтрует и не пагинирует то, что уже отфильтровал и разбил на страницы сервер. Фронт передаёт параметры и показывает ответ.
- **Осознанный компромисс:** при обновлении кеша по ответу мутации клиент повторяет минимум правил сервера (например, «новое избранное — сверху» в `updateFavoritesList`). Это дешевле, чем перезапрос списка; при расхождении источник правды — сервер.
- Frontend **не обращается** к внешним API напрямую — только к своему бэкенду.
- Таски есть на обеих сторонах, но отвечают за разное: на бэкенде — бизнес-логика (найти, отфильтровать, добавить в избранное), на фронтенде — сценарий взаимодействия с нашим API (собрать параметры, вызвать эндпоинт, привести ответ к виду для UI).

---

## Правило 12. DAL — только HTTP-обвязка

Data access layer (DAL) — тонкая обёртка над `fetch`: методы `get` / `post` / `put` / `delete`, базовый URL, заголовки, таймаут, отмена запроса, преобразование HTTP-ошибок в `ApiError`.

- **В DAL нет эндпоинтов и знаний о ресурсах.** Никаких `showsApi.getAll()`, `favoritesApi.add()`.
- **Адрес эндпоинта, подготовка параметров и маппинг DTO в сущность — в таске**, которая этот эндпоинт использует.
- Presenter и хуки **не вызывают DAL напрямую** — только через таски. Таска «в одну строку» — не оверкилл: в ней и живут эндпоинт, параметры и маппинг.
- Правило одинаково для обеих сторон: на фронте DAL — `client/src/api/httpClient.ts` (ходит в наш бэкенд), на бэкенде — `server/src/dal/createHttpClient.ts` + `dal/tvmaze.ts` (ходит в TVmaze).

**Почему так:** удалили страницу или модуль — вместе с ними удалились их таски, а значит, эндпоинты и маппинг. В общей обёртке не остаётся мёртвых методов. Это Single Responsibility: вместе группируется то, что меняется по одной причине.

```ts
// client/src/pages/ShowsExplorer/logic/tasks/fetchShowsPage.ts — таска
export const fetchShowsPage = ({ query, genres, page }: ShowsPageParams, signal?: AbortSignal) => {
  const params: ShowsPageQuery = { q: query, genres: genres.join(','), page };

  return httpClient.get<ShowsPageResponse>('/api/shows', { params, signal });
};
```

```ts
// server/src/modules/shows/tasks/searchShows.ts — таска бэкенда: эндпоинт TVmaze и маппинг DTO здесь, а не в DAL
const results = await tvmaze.get<TvmazeSearchResult[]>('/search/shows', { params: { q: query } });

return results.map((result) => toShow(result.show));
```

---

## Правило 13. Backend — те же слои без React

Бэкенд следует тем же принципам Simple Architecture: бизнес-логика в тасках, данные в сторах, тонкий слой «входа», который связывает внешний мир с тасками.

```
server/src/
  index.ts              ← точка входа: создание Express-приложения, middleware, подключение роутов, запуск
  modules/              ← модули по предметным областям (аналог страниц на фронте)
    shows/
      routes.ts         ← HTTP-слой: разбор запроса → вызов таски → HTTP-ответ
      tasks/            ← бизнес-логика модуля, одна таска — один файл
      types.ts, constants.ts, utils.ts
    auth/
      routes.ts         ← POST /api/auth/login, GET /api/auth/me, POST /api/auth/logout
      tasks/            ← login, getCurrentUser, logout
    favorites/
      routes.ts         ← GET / POST / DELETE /api/favorites (только для вошедших)
      tasks/            ← getFavorites, addToFavorites, removeFromFavorites
  tasks/                ← общие таски (используются в 2+ модулях или в middleware): fetchTvmaze (кеш), mapTvmazeShow, markFavorites, getSessionEmail
  stores/               ← сторы в памяти, только get / set (правило 9): tvmazeCacheStore, sessionsStore, favoritesStore
  dal/                  ← createHttpClient (обвязка над fetch) + tvmaze (клиент с базовым URL TVmaze) (правило 12)
  middleware/           ← общие middleware: cors, authenticate, requireAuth, errorHandler (доменные ошибки → HTTP)
  shared/               ← общие constants / env / errors / types / utils
```

| Слой              | На фронте                    | На бэкенде                                           |
| ----------------- | ---------------------------- | ---------------------------------------------------- |
| Вход              | View + Presenter             | `routes.ts` (обработчик Express)                     |
| Бизнес-логика     | `logic/tasks/`               | `modules/<name>/tasks/`, `tasks/`                    |
| Данные            | `stores/`, кеш React Query   | `stores/` (объекты в памяти)                         |
| Доступ к внешнему | `api/httpClient.ts` → бэкенд | `dal/createHttpClient.ts` + `dal/tvmaze.ts` → TVmaze |

- **`routes.ts` — тонкий.** Только: прочитать и провалидировать параметры, вызвать **одну** таску, вернуть ответ с HTTP-статусом. Никакой бизнес-логики в обработчике.
- **Таски не знают про Express:** не импортируют `express`, не получают `req` / `res`, не выставляют HTTP-статусы. Принимают обычные аргументы, возвращают данные или бросают доменную ошибку, которую `routes.ts` / middleware переводит в HTTP-ответ.
- **Сторы — объекты в памяти** (`const cache = {}`, `const favorite = {}`) с доступом через `get` / `set`. Логика (TTL кеша, добавление и удаление избранного) — в тасках, не в сторе. Данные живут, пока жив процесс: перезапуск или засыпание сервера их стирает.
- Размещение — как на фронте (правила 4 и 7): используется в одном модуле → внутри модуля, в двух и больше → глобальная папка.

---

## Правило 14. Контракт API и авторизация

- **Типы запросов и ответов API** (DTO) описываются **один раз** в `shared/` и импортируются и клиентом, и сервером. Расхождение контракта — ошибка типов, а не баг в рантайме.
- В `shared/` — **только типы** (и при необходимости константы контракта). Логики там нет.
- Ответы API — в формате, удобном фронту, но без UI-деталей: сервер не форматирует даты под язык и не отдаёт тексты интерфейса.
- **Авторизация — на бэкенде.** Вход по email без пароля: `POST /api/auth/login` проверяет email, открывает сессию (`sessions[token] = email`) и возвращает токен. Бэкенд — источник истины о том, кто вошёл; фронтенд только хранит токен и показывает результат.
- **Токен отправляет DAL.** Таска `login` сохраняет токен (`api/authToken.ts`, `localStorage`), `logout` — удаляет. `httpClient` добавляет заголовок `Authorization: Bearer <token>` в каждый запрос, таски про заголовки не знают.
- **Middleware `authenticate`** на каждом запросе находит пользователя по токену (таска `getSessionEmail`) и кладёт его в `response.locals.userEmail` (`null` для гостя). Роуты передают email в таски обычным аргументом. **`requireAuth`** закрывает персональные роуты (`/api/favorites`) ответом `401`.
- **Персональные данные хранятся по email, а не по сессии:** `favorite[email]`. Выход закрывает только сессию, поэтому после повторного входа под тем же email избранное на месте.
- **Текущий пользователь на клиенте — серверные данные**, поэтому он в кеше React Query (`useCurrentUser`, `src/shared/hooks/`), а не в сторе (правило 9: не храним то, что можно не хранить). Вход и выход записывают нового пользователя в кеш по ответу сервера, а персональные запросы (избранное, звёздочки в выдаче) сбрасывают и запрашивают заново.
- **Гость** ищет и смотрит сериалы: сервер отдаёт `isFavorite: false`, кнопки избранного в шапке нет, звёздочка отправляет на страницу входа. Запрет на сервере (`401`) — последний рубеж, интерфейс его только повторяет.

---

## Правило 15. Инверсия зависимостей: интерфейсы между слоями

Отображение зависит от бизнес-логики, а не наоборот: View → Presenter → Tasks → Store. Между слоями стоят интерфейсы, которые гасят изменения нижнего слоя и не пускают их выше.

| Граница           | Интерфейс                                                         | Что он отбивает                                           |
| ----------------- | ----------------------------------------------------------------- | --------------------------------------------------------- |
| View ↔ Presenter  | Объект, который возвращает `usePresenter`, и типы из `types.ts`   | Изменения тасок, React Query, i18n                        |
| Presenter ↔ Store | Хук-селектор `logic/use<Name>.ts`, возвращает тип из `types.ts`   | Как стор хранит данные                                    |
| Presenter ↔ Tasks | Сигнатура таски: простые аргументы и типы контракта API на выходе | Как таска устроена внутри и с какими сторами она работает |
| Tasks ↔ Store     | `get` / `set`                                                     | Как стор хранит данные                                    |

- **Presenter не знает про стор.** Стор читает хук-селектор `logic/use<Name>.ts` (как `useShowsPage` для React Query, правило 2): подписывается через `useStore` и преобразует записи в тип из `types.ts` компонента. Переименование поля в сторе исправляется в одной строке селектора, а presenter и View не меняются.
- **Интерфейс отбивает изменения за ним, но не изменения самого себя.** Если меняется то, что видит пользователь (новое поле в `types.ts`), правятся обе стороны: селектор или таска и View. Интерфейс описывает потребности View, поэтому меняется редко.
- **Таска не отдаёт наружу структуру стора.** Аргументы и результат таски — простые значения или типы контракта API, а не типы из `src/stores/types.ts`. Общие типы предметной области (`ToastVariant`) лежат в `src/shared/types/`.
- Благодаря этим границам баг или задача часто закрываются изменением одной таски или одного селектора, а код остаётся читаемым.

```ts
// components/Toasts/logic/useToasts.ts — единственное место, которое знает toastsStore
export const useToasts = (): ToastItem[] =>
  useStore(toastsStore).map(({ id, message, variant }) => ({ id, message, variant }));

// components/Toasts/logic/usePresenter.ts — знает только ToastItem
const toasts = useToasts();
```

---

## Контроль правил

Правила проверяются автоматически через ESLint, а не только на ревью:

- для View-файлов: импорт только `./logic/usePresenter`, компонентов, ui-kit, стилей и типов; запрет хуков React;
- запрет инлайн-стрелок в JSX-обработчиках (`react/jsx-no-bind`);
- запрет текста в JSX во View (`react/jsx-no-literals`), кроме символов-иконок;
- сырые `button`, `input`, `h1`–`h6`, `p`, `span`, `a`, `img`, `dialog` вне `src/ui-kit/` (`react/forbid-elements`, правило 5);
- импорт `@tanstack/react-query` в `usePresenter.ts` (правило 2);
- в тасках: импорт `react`, React Query, i18n, роутера, ui-kit и компонентов, вызовы хуков и JSX (правило 8);
- хуки (`use*.ts`) вне папки `logic/` компонента или `src/shared/hooks/` (правила 3 и 4);
- в `usePresenter.ts` и View на верхнем уровне модуля объявляется только сам хук или компонент; константы, типы и хелперы — ошибка (правило 7);
- в тасках бэкенда: импорт `express`, `cors`, роутов и middleware (правило 13);
- `any` — явный, через приведение и пришедший из библиотек (`no-explicit-any`, `no-unsafe-*`);
- порядок импортов, исправляется автоматически через `npm run lint:fix`;
- Stylelint: mobile first — `max-width` в медиазапросах запрещён;
- Prettier для форматирования, максимальная длина строки **120 символов** (`printWidth: 120`).

Все проверки запускаются одной командой: `npm run check`.

Конфигурация — `eslint.config.js` и `.stylelintrc.json`.
