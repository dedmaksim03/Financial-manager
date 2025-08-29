FROM node:24.7.0

WORKDIR /usr/src/app/frontend

# Копируем package.json и yarn.lock для установки зависимостей
COPY package.json yarn.lock ./

RUN yarn install

# Копируем весь исходный код
COPY . .

# Порт, на котором запускается dev-сервер React (по умолчанию 3000)
EXPOSE 3001

CMD ["yarn", "start"]
