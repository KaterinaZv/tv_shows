# AI Rules — Simple Architecture

> Версия 0.1. Документ пополняется по мере развития архитектуры.
> Правила обязательны для людей и для AI-ассистентов. Правила пишутся на русском, код и названия на английском.

## Стек

- React + TypeScript
- Vite
- React Query (`@tanstack/react-query`)
- Собственный ui-kit на CSS-модулях (`*.module.css`)
- ESLint + Prettier, обязательны. Код с ошибками линтера не считается готовым.

## Что такое Simple Architecture

Сейчас описаны слои **View** и **Presenter**.

| Слой      | Что это в React                      | Ответственность                                                       |
| --------- | ------------------------------------ | --------------------------------------------------------------------- |
| View      | Компонент (JSX)                      | Только то, что пользователь видит в браузере                          |
| Presenter | Хук `usePresenter` в отдельном файле | 100% логики компонента: получение данных, форматирование, обработчики |

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
import type { Props } from './types'
import { usePresenter } from './usePresenter'
import { Button } from '@/ui-kit/Button/Button'
import { ShowPoster } from './ShowPoster/ShowPoster'

export const ShowCard = (props: Props) => {
  const {
    title,
    premiereDate,
    rootClassName,
    isFavorite,
    handleFavoriteClick,
  } = usePresenter(props)

  return (
    <article className={rootClassName}>
      <ShowPoster />
      <h3>{title}</h3>
      <span>{premiereDate}</span>
      {isFavorite ? <span>★</span> : null}
      <Button onClick={handleFavoriteClick}>В избранное</Button>
    </article>
  )
}
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
- React Query (`useQuery` / `useMutation`) **пока** вызывается прямо в presenter. Когда появится слой Interactor, запросы переедут туда.

```ts
// ShowCard/usePresenter.ts — Presenter
import { useState } from 'react'
import type { Props } from './types'
import styles from './ShowCard.module.css'

export const usePresenter = ({ show, onFavoriteToggle }: Props) => {
  const [isFavorite, setIsFavorite] = useState(show.isFavorite)

  const handleFavoriteClick = () => {
    setIsFavorite((prev) => !prev)
    onFavoriteToggle(show.id)
  }

  return {
    title: show.name,
    premiereDate: new Date(show.premiered).toLocaleDateString('ru-RU'),
    rootClassName: isFavorite
      ? `${styles.card} ${styles.favorite}`
      : styles.card,
    isFavorite,
    handleFavoriteClick,
  }
}
```

### Компонент без логики

Если компоненту не нужна логика (чистая вёрстка), `usePresenter.ts` **не создаётся**. Как только появляется хотя бы одна строка логики, создаётся presenter.

---

## Правило 3. Каждый компонент — отдельная папка

```
ShowCard/
  ShowCard.tsx          ← View, точка входа (имя файла = имя папки)
  usePresenter.ts       ← Presenter (если есть логика)
  types.ts              ← типы компонента (Props и др.)
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

---

## Правило 5. ui-kit

Компоненты ui-kit подчиняются **тем же правилам**: View + Presenter, отдельная папка, `types.ts`, CSS-модули.

---

## Контроль правил

Правила проверяются автоматически через ESLint, а не только на ревью:

- для View-файлов: `no-restricted-imports` и запрет хуков React;
- запрет инлайн-стрелок в JSX-обработчиках (`react/jsx-no-bind`);
- порядок импортов, исправляется автоматически через `npm run lint:fix`;
- Prettier для форматирования, максимальная длина строки **120 символов** (`printWidth: 120`).

Все проверки запускаются одной командой: `npm run check`.

Конфигурация появится вместе с инициализацией проекта.

---

## Открытые вопросы (будут решены позже)

- Структура верхнего уровня `src/`: страницы, api, shared и т. п. Подчиняются ли страницы правилу View + Presenter.
