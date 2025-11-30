# rule34-downloader

Приложение для скачивания изображений и видео с сайта [rule34.xxx](https://rule34.xxx) по заданным тегам.  
Node v22.14.0

## Установка

```bash
git clone https://github.com/yourusername/rule34-downloader.git
cd rule34-downloader
npm install
cp .env.example .env
```

## Настройка

- `TAGS=megumin,rem` — список тегов, по которым будет происходить скачивание. Нужно, чтобы они совпадали с тегами на сайте.
- `QUEUE_MODE=memory` — режим работы очередей:  
  - `memory` — все очереди и обработка в памяти. Не требует redis, но скачивает одно изображение за раз.
  - `redis` — очереди и обработка через Redis и bullmq. Количество воркеров можно настроить.
- `API_KEY`, `USER_ID` — Для получения кредов нужно создать аккаунт и сгенерировать ключ [здесь](https://rule34.xxx/index.php?page=account&s=options).
- `DISABLE_AI` —  посты с тегом `ai_generated` будут пропускаться.

## Запуск

Запустить redis можно через docker-compose:

```bash
docker-compose up
```

Запуск приложения:

```bash
npm run dev
```

```bash
npm run build
npm start
```

## Структура выходных данных

Скачанные файлы сохраняются в папку `downloads`:

```txt
downloads/
  new/
    <category>/
      ids.txt         # Список ID уже скачанных файлов
  old/
    <category>/
      <file_id>.jpg   # Скачанные файлы (jpg, png, mp4 и др.)
```

Скачанные файлы попадают в `downloads/new/<category>/`.  
После завершения изображения можно удалять/перемещать, они заново скачиваться не будут.  
При следующем запуске все изображения переместятся в `downloads/old/<category>/`. Т.е. в `/new/*` будут только новые изображения, которых до этого не было.

В `ids.txt` хранятся ID уже скачанных файлов для предотвращения повторных загрузок.
