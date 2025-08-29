# Используем официальный образ Node.js
FROM node:22.14.0

# Устанавливаем рабочую директорию
WORKDIR /usr/src/app/backend

# Установка часового пояса
RUN apt-get update && apt-get install -y tzdata
ENV TZ=Europe/Moscow
RUN dpkg-reconfigure -f noninteractive tzdata

# Копируем package.json и yarn.lock
COPY package.json yarn.lock ./

# Устанавливаем зависимости с помощью Yarn
RUN yarn install

# Копируем все файлы приложения
COPY . .

# Запускаем приложение в режиме разработки
CMD ["yarn", "start"]

# Компилируем TypeScript в JavaScript
#RUN yarn build

# Указываем команду для запуска приложения
#CMD ["yarn", "start:prod"]

# Открываем порт, на котором будет работать приложение
EXPOSE 3000
