# TV Shows Explorer

Поиск сериалов через [TVmaze API](https://www.tvmaze.com/api). Учебный проект для отработки Simple Architecture (см. [ARCHITECTURE.md](ARCHITECTURE.md)).

- **Клиент:** https://katerinazv.github.io/tv_shows/
- **API:** Render (бесплатный тариф: засыпает через 15 минут без запросов, первый запрос после сна — до минуты; данные в памяти при этом стираются)

## Структура

```
client/   ← React + Vite (GitHub Pages)
server/   ← Node.js + Express (Render)
shared/   ← типы контракта API
```

## Запуск локально

Нужен Node.js 20.19+.

```bash
npm install
npm run dev
```

Клиент — http://localhost:5173, API — http://localhost:3000 (запросы клиента к `/api` проксируются на сервер).

Проверки и сборка:

```bash
npm run check
npm run build
```
