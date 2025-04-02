# Вибираємо базовий образ Node.js
FROM node:22.14-alpine

# Встановлюємо робочу директорію
WORKDIR /app

# Копіюємо package.json та package-lock.json (якщо є)
COPY package*.json ./

# Встановлюємо залежності
RUN npm install


# Копіюємо увесь код проєкту
COPY . .

# Генеруємо Prisma клієнт
RUN   npx prisma generate 

# Виставляємо порт, який буде використовувати контейнер
EXPOSE 8000

# Запускаємо додаток
CMD ["npm", "run", "start:dev"]
