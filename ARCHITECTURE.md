# AI Rules — Simple Architecture

> Версия 0.3. Документ пополняется по мере развития архитектуры.
> Правила обязательны для людей и для AI-ассистентов. Правила пишутся на русском, код и названия на английском.

## Стек

**Монорепозиторий** на npm workspaces: `client/` (фронтенд), `server/` (бэкенд), `shared/` (контракт API).

- **Frontend (`client/`):** React + TypeScript, Vite, React Query (`@tanstack/react-query`), собственный ui-kit на CSS-модулях (`*.module.css`), i18next + react-i18next. Хостинг — GitHub Pages.
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
  main.tsx        ← точка входа: провайдеры (React Query, i18n) и рендер <App />. Не компонент, правила View на него не распространяются
  App/            ← корневой компонент: шапка приложения + страница (позже — роутер)
  pages/          ← страницы. Каждая страница — компонент по правилам View + Presenter, внутри — дерево её компонентов
  components/     ← общие компоненты приложения (используются в 2+ местах или нужны на всех страницах)
  tasks/          ← общие (переиспользуемые) таски: бизнес-логика, нужная в 2+ местах
  stores/         ← сущности (Entity): сторы — «база данных», только get / set
  ui-kit/         ← базовые компоненты: Button, Input, Heading, Text, Badge, Link, Image, Chip, …
  shared/
    hooks/        ← универсальные хуки, не привязанные к предметной области
    constants/    ← общие константы, файлы по темам
    types/        ← общие типы, файлы по темам
    utils/        ← общие утилиты, файлы по темам
  api/            ← DAL: только HTTP-обвязка над fetch (httpClient), ошибки, queryClient. Без эндпоинтов (правило 12)
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
- Presenter **не вызывает `useQuery` / `useMutation` напрямую**. Каждый запрос оборачивается в отдельный кастомный хук в своём файле `logic/use<Name>.ts` (например, `logic/useSearchShows.ts`), а presenter только вызывает его. Query key выносится в `constants.ts`.
- Хуки React Query остаются хуками в `logic/` — в таски они не переезжают, потому что таски не зависят от React. Сама работа с данными (запрос к API и его обработка) — таска, которую хук передаёт в `queryFn`.
- Самостоятельная логика со своим состоянием (пагинация, debounce и т. п.) тоже выносится в кастомный хук `logic/use<Name>.ts` (например, `usePagination.ts`, `useGenreFilter.ts`). Presenter собирает такие хуки вместе и готовит данные для View.
- Размещение хука — по правилу 4: используется в одном месте → в `logic/` компонента, в нескольких → `src/shared/hooks/`.

```ts
// ShowsExplorer/logic/useSearchShows.ts — хук React Query
export const useSearchShows = (query: string) =>
  useQuery({
    queryKey: [...SEARCH_SHOWS_QUERY_KEY, query],
    queryFn: ({ signal }) => searchShows(query, signal), // searchShows — таска
    enabled: query.length > 0,
  });

// ShowsExplorer/logic/usePresenter.ts
const { data, isPending, isError } = useSearchShows(searchQuery);
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
    useSearchShows.ts         ← кастомные хуки: запросы, пагинация и т. п.
    tasks/                    ← таски компонента (если есть бизнес-логика)
      searchShows.ts          ← одна таска — один файл, имя файла = имя функции
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

| Что                                                     | Куда           |
| ------------------------------------------------------- | -------------- |
| Константы (`PAGE_SIZE`, `SEARCH_DEBOUNCE_MS`, …)        | `constants.ts` |
| Типы (`Props`, `GenreState`, …)                         | `types.ts`     |
| Технические хелперы (`formatYears`, `stripHtml`, …)     | `utils.ts`     |
| Бизнес-логика (`searchShows`, `filterShowsByGenres`, …) | `logic/tasks/` |

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

```ts
// ShowsExplorer/logic/tasks/filterShowsByGenres.ts — таска
import type { Show } from '@/api/types';

export const filterShowsByGenres = (shows: Show[], genres: string[]) =>
  genres.length > 0 ? shows.filter((show) => show.genres.some((genre) => genres.includes(genre))) : shows;
```

```ts
// ShowsExplorer/logic/useGenreFilter.ts — хук вызывает таску
const filteredShows = filterShowsByGenres(shows, selectedGenres);
```

---

## Правило 9. Entity — сторы state-менеджера

Сущность (Entity) — это **стор state-менеджера**. Стор — это **база данных**: он только хранит данные и даёт к ним доступ.

- **В сторе нет методов с логикой** — только `get` и `set`. Никаких `addFavorite`, `toggleGenre`, редьюсеров и вычислений внутри стора.
- **Вся логика работы с данными — в тасках.** Таска — контроллер: читает данные через `get`, вычисляет новое состояние и записывает через `set`. Одна таска может работать с несколькими сторами («таблицами / коллекциями»).
- Со сторами общаемся **напрямую**, без библиотек-посредников (redux-thunk, redux-saga и т. п.).
- Сторы лежат в `src/stores/`, один стор — одна «таблица / коллекция» — один файл: `src/stores/favoritesStore.ts`.
- Стор хранит **клиентское** состояние (избранное, настройки пользователя, данные, общие для нескольких страниц). **Серверные данные остаются в React Query** и в стор не дублируются.
- **Presenter** подписывается на стор, чтобы получать данные для отображения, а изменения запускает через таски.
- Конкретный state-менеджер выбирается, когда появится первая сущность.

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

- Frontend **не дублирует** бизнес-логику бэкенда: не фильтрует и не пагинирует то, что уже отфильтровал и разбил на страницы сервер. Фронт передаёт параметры и показывает ответ.
- Frontend **не обращается** к внешним API напрямую — только к своему бэкенду.
- Таски есть на обеих сторонах, но отвечают за разное: на бэкенде — бизнес-логика (найти, отфильтровать, добавить в избранное), на фронтенде — сценарий взаимодействия с нашим API (собрать параметры, вызвать эндпоинт, привести ответ к виду для UI).

---

## Правило 12. DAL — только HTTP-обвязка

Data access layer (DAL) — тонкая обёртка над `fetch`: методы `get` / `post` / `put` / `delete`, базовый URL, заголовки, таймаут, отмена запроса, преобразование HTTP-ошибок в `ApiError`.

- **В DAL нет эндпоинтов и знаний о ресурсах.** Никаких `showsApi.getAll()`, `favoritesApi.add()`.
- **Адрес эндпоинта, подготовка параметров и маппинг DTO в сущность — в таске**, которая этот эндпоинт использует.
- Presenter и хуки **не вызывают DAL напрямую** — только через таски. Таска «в одну строку» — не оверкилл: в ней и живут эндпоинт, параметры и маппинг.
- Правило одинаково для обеих сторон: на фронте DAL — `client/src/api/httpClient.ts` (ходит в наш бэкенд), на бэкенде — `server/src/dal/httpClient.ts` (ходит в TVmaze).

**Почему так:** удалили страницу или модуль — вместе с ними удалились их таски, а значит, эндпоинты и маппинг. В общей обёртке не остаётся мёртвых методов. Это Single Responsibility: вместе группируется то, что меняется по одной причине.

```ts
// client/src/pages/ShowsExplorer/logic/tasks/fetchShowsPage.ts — таска
export const fetchShowsPage = async (params: ShowsPageParams, signal?: AbortSignal) => {
  const response = await httpClient.get<ShowsPageResponse>('/api/shows', { params, signal });

  return { ...response, items: response.items.map(toShowCardData) };
};
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
    favorites/
      ...
  tasks/                ← общие таски (используются в 2+ модулях)
  stores/               ← сторы в памяти: «база данных», только get / set (правило 9)
  dal/                  ← httpClient для внешних API (правило 12)
  middleware/           ← общие middleware: CORS, clientId, обработка ошибок
  shared/               ← общие constants / types / utils
```

| Слой              | На фронте                    | На бэкенде                        |
| ----------------- | ---------------------------- | --------------------------------- |
| Вход              | View + Presenter             | `routes.ts` (обработчик Express)  |
| Бизнес-логика     | `logic/tasks/`               | `modules/<name>/tasks/`, `tasks/` |
| Данные            | `stores/`, кеш React Query   | `stores/` (объекты в памяти)      |
| Доступ к внешнему | `api/httpClient.ts` → бэкенд | `dal/httpClient.ts` → TVmaze      |

- **`routes.ts` — тонкий.** Только: прочитать и провалидировать параметры, вызвать **одну** таску, вернуть ответ с HTTP-статусом. Никакой бизнес-логики в обработчике.
- **Таски не знают про Express:** не импортируют `express`, не получают `req` / `res`, не выставляют HTTP-статусы. Принимают обычные аргументы, возвращают данные или бросают доменную ошибку, которую `routes.ts` / middleware переводит в HTTP-ответ.
- **Сторы — объекты в памяти** (`const cache = {}`, `const favorite = {}`) с доступом через `get` / `set`. Логика (TTL кеша, добавление и удаление избранного) — в тасках, не в сторе. Данные живут, пока жив процесс: перезапуск или засыпание сервера их стирает.
- Размещение — как на фронте (правила 4 и 7): используется в одном модуле → внутри модуля, в двух и больше → глобальная папка.

---

## Правило 14. Контракт API и идентификация клиента

- **Типы запросов и ответов API** (DTO) описываются **один раз** в `shared/` и импортируются и клиентом, и сервером. Расхождение контракта — ошибка типов, а не баг в рантайме.
- В `shared/` — **только типы** (и при необходимости константы контракта). Логики там нет.
- Ответы API — в формате, удобном фронту, но без UI-деталей: сервер не форматирует даты под язык и не отдаёт тексты интерфейса.
- **Идентификация клиента:** у каждого браузера своё избранное. Фронтенд при первом запуске генерирует `clientId` (`crypto.randomUUID()`), хранит его в `localStorage` и отправляет в каждом запросе в заголовке `X-Client-Id`. Это делает DAL (`httpClient`), а не таски. Бэкенд хранит данные по ключу клиента: `favorite[clientId]`.

---

## Контроль правил

Правила проверяются автоматически через ESLint, а не только на ревью:

- для View-файлов: импорт только `./logic/usePresenter`, компонентов, ui-kit, стилей и типов; запрет хуков React;
- запрет инлайн-стрелок в JSX-обработчиках (`react/jsx-no-bind`);
- запрет текста в JSX во View (`react/jsx-no-literals`), кроме символов-иконок;
- сырые `button`, `input`, `h1`–`h6`, `p`, `span`, `a`, `img` вне `src/ui-kit/` (`react/forbid-elements`, правило 5);
- импорт `@tanstack/react-query` в `usePresenter.ts` (правило 2);
- в тасках: импорт `react`, React Query, i18n, роутера, ui-kit и компонентов, вызовы хуков и JSX (правило 8);
- хуки (`use*.ts`) вне папки `logic/` компонента или `src/shared/hooks/` (правила 3 и 4);
- в `usePresenter.ts` и View на верхнем уровне модуля объявляется только сам хук или компонент; константы, типы и хелперы — ошибка (правило 7);
- порядок импортов, исправляется автоматически через `npm run lint:fix`;
- Prettier для форматирования, максимальная длина строки **120 символов** (`printWidth: 120`).

Все проверки запускаются одной командой: `npm run check`.

Конфигурация — `eslint.config.js`.
