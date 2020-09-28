--------------------------------
-- 1. Получить список всех категорий
-- (идентификатор,
-- наименование категории);
SELECT
  categories.id AS "Id",
  categories.name AS "Категория"
FROM
  categories;

--------------------------------
-- 2. Получить список категорий для которых создано минимум одно объявление
-- (идентификатор,
-- наименование категории);
SELECT DISTINCT
  categories.id AS "Id",
  categories.name AS "Категория"
FROM
  categories
    INNER JOIN offers_categories ON categories.id = offers_categories.category_id
ORDER BY (categories.id);

--------------------------------
-- 3. Получить список категорий с количеством объявлений
-- (идентификатор,
-- наименование категории,
-- количество объявлений в категории);
SELECT
  categories.id AS "Id",
  categories.name AS "Категория",
  COUNT(offers_categories) AS "Кол-во постов"
FROM
  categories
    iNNER JOIN offers_categories ON categories.id = offers_categories.category_id
GROUP BY
  categories.id
ORDER BY (categories.id);

--------------------------------
-- 4. Получить список объявлений
-- (идентификатор объявления,
-- заголовок объявления,
-- стоимость,
-- тип объявления,
-- текст объявления,
-- дата публикации,
-- имя и фамилия автора,
-- контактный email,
-- количество комментариев,
-- наименование категорий).
-- Сначала свежие объявления;
SELECT
  offers.id AS "Id",
  offers.title AS "Заголовок",
  offers.sum AS "Стоимость",
  types.name AS "Тип",
  offers.description AS "Текст",
  offers.created_date AS "Дата",
  authors.firstname AS "Имя автора",
  authors.lastname AS "Фамилия",
  authors.email AS "Email",
  (
    SELECT COUNT(*) FROM comments
    WHERE comments.offer_id = offers.id
  ) AS "Кол-во комментариев",
  categories.list AS "Список категорий"
FROM
  offers
    INNER JOIN types ON types.id = offers.type_id
    INNER JOIN authors ON authors.id = offers.author_id
    INNER JOIN
      (
        SELECT
          offers_categories.offer_id AS "offer_id",
          STRING_AGG(categories.name, ', ') AS "list"
        FROM offers_categories
          LEFT JOIN categories ON categories.id = offers_categories.category_id
        GROUP BY
          offers_categories.offer_id
      ) categories ON offers.id = categories.offer_id
ORDER BY offers.created_date DESC;

--------------------------------
-- 5. Получить полную информацию определённого объявления
-- (идентификатор объявления,
-- заголовок объявления,
-- стоимость,
-- тип объявления,
-- текст объявления,
-- дата публикации,
-- имя и фамилия автора,
-- контактный email,
-- количество комментариев,
-- наименование категорий);
SELECT
  offers.id AS "Id",
  offers.title AS "Заголовок",
  offers.sum AS "Стоимость",
  types.name AS "Тип",
  offers.description AS "Текст",
  offers.created_date AS "Дата",
  authors.firstname AS "Имя автора",
  authors.lastname AS "Фамилия",
  authors.email AS "Email",
  (
    SELECT COUNT(*) FROM comments
    WHERE comments.offer_id = offers.id
  ) AS "Кол-во комментариев",
  categories.list AS "Список категорий"
FROM
  offers
    INNER JOIN types ON types.id = offers.type_id
    INNER JOIN authors ON authors.id = offers.author_id
    INNER JOIN
  (
    SELECT
      offers_categories.offer_id AS "offer_id",
      STRING_AGG(categories.name, ', ') AS "list"
    FROM offers_categories
      LEFT JOIN categories ON categories.id = offers_categories.category_id
    GROUP BY
      offers_categories.offer_id
  ) categories ON offers.id = categories.offer_id
WHERE offers.id = 1;

--------------------------------
-- 6. Получить список из 5 свежих комментариев
-- (идентификатор комментария,
-- идентификатор объявления,
-- имя и фамилия автора,
-- текст комментария);
SELECT
  comments.id AS "Id комментария",
  offers.id AS "Id поста",
  authors.firstname AS "Имя автора",
  authors.lastname AS "Фамилия",
  comments.text AS "Текст комментария"
FROM
  comments
    INNER JOIN offers ON offers.id = comments.offer_id
    INNER JOIN authors ON authors.id = offers.author_id
ORDER BY comments.created_date DESC
LIMIT 5;

--------------------------------
-- 7. Получить список комментариев для определённого объявления
-- (идентификатор комментария,
-- идентификатор объявления,
-- имя и фамилия автора,
-- текст комментария).
-- Сначала новые комментарии;
SELECT
  comments.id AS "Id комментария",
  comments.offer_id AS "Id поста",
  authors.firstname AS "Имя автора",
  authors.lastname AS "Фамилия",
  comments.text AS "Текст комментария"
FROM
  comments
    INNER JOIN authors ON authors.id = comments.author_id
WHERE comments.offer_id = 2
ORDER BY comments.created_date DESC;

--------------------------------
-- 8. Выбрать 2 объявления, соответствующих типу «куплю»;
SELECT *
FROM
  offers
WHERE offers.type_id = 1
LIMIT 2;

--------------------------------
-- 9. Обновить заголовок определённого объявления на «Уникальное предложение!»;
UPDATE offers
  SET title = 'Уникальное предложение!'
WHERE offers.id = 1;
