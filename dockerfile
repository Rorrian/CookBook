# Базовый образ с Node.js для сборки
FROM node:18 AS development
# облегченный вариант
# FROM node:alpine as development

# Рабочая директория
WORKDIR /var/www/app

# Копируем package.json и package-lock.json
COPY package*.json ./

# Устанавливаем зависимости
RUN npm ci

# Копируем весь проект
COPY . .