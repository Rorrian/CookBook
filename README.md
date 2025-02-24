# CookBook

_Кулинарная книга_

![alt text](example.png)

## Цель:
Сочетание уюта и атмосферности бумажной версии и удобства электронной

## Technologies:
- React
- React-router-dom
- Redux
- RTK
- TS
- Tailwind
- Heroui(nextui)
- Framer-Motion
- Supabase
- Toastify
- Vite
<!-- - Jest -->

## Application functionality:
- Пользователи:
	- Авторизация и регистрация
	- Восстановление и изменение пароля
- CRUD-операции для рецептов (добавление, редактирование, удаление), загрузка изображений, управление ингредиентами, шагами приготовления, категориями
- Фильтрация и поиск рецептов по:
	- категориям
	- сложности
	- ингредиентам

## Тестовый аккаунт для просмотра:
- Почта:
abc2@gmail.com
- Пароль:
7gyC@Pada_23918hdas


## Deployment:
https://rorrian-cook-book-app.vercel.app/


<details>
	<summary>Настройка кастомных svg в Vite как React-компонентов c TS</summary>
	
	- Установить плагин vite-plugin-svgr
	- Добавить vite-plugin-svgr в vite.config.ts:
		export default defineConfig({
			plugins: [
				react(),
				svgr(), - тут
				analyzer(),
			], ...
	- Создать папку src/assets/icons с svg
	- Проверить корректность путей и алиасов к иконкам
	- Изменить файл vite.env.d.ts:
		/// <reference types="vite/client" />
		/// <reference types="vite-plugin-svgr/client" />

		declare module '*.svg?react' {
			import * as React from 'react'
			export const ReactComponent: React.FC<React.SVGProps<SVGSVGElement>>
			export default ReactComponent
		}
	- Изменить файл tsconfig.json:
		{
			"compilerOptions": {
				...
				"types": ["vite-plugin-svgr/client"],
			},
			"include": [
				"src/**/*",
				"src/vite-env.d.ts"
			], ...
	- Создать файл для общего импорта svg - src/shared/icons/index.ts:
		export { default as EditIcon } from '@assets/icons/edit.svg?react';
		export { default as DeleteIcon } from '@assets/icons/delete.svg?react';
	- Перезапустить TS server и IDE, проверить на наличие ошибок в дев-режиме и при билде
	- Пример использования иконок:
		import { EditIcon, DeleteIcon } from '@shared/icons';
		...
		<EditIcon width={20} height={20} />
</details>