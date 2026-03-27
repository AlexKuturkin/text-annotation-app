# Text Annotation App

Одностраничное приложение (SPA) для создания, редактирования и аннотирования текстовых статей с использованием Angular 21.

## Функционал

- **CRUD для статей**: Создание, просмотр, редактирование и удаление статей.
- **Аннотирование текста**: Выделение фрагментов текста, назначение цвета и текстовых примечаний (аннотаций).
- **Tooltip**: При наведении на выделенный текст показывается аннотация.
- **Хранение данных**: Все данные сохраняются в localStorage (эмуляция сервера).

## Технологии

- Angular 21
- TypeScript
- CSS/SCSS
- RxJS для реактивности
- Range API для работы с DOM

## Запуск

1. Установите зависимости: `npm install`
2. Запустите сервер: `npm start`
3. Откройте `http://localhost:4200`

## Структура проекта

- `src/app/models/`: Модели данных (Article, Annotation)
- `src/app/services/`: Сервисы для работы с данными (ArticleService, AnnotationService)
- `src/app/components/`: Компоненты (ArticleList, ArticleEditor, AnnotationTooltip)

## Без сторонних библиотек

Приложение реализовано без использования сторонних библиотек для UI, аннотаций и хранения данных.

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
