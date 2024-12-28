FROM node:22-alpine AS base

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci --production

COPY . .

RUN npm run build

FROM node:22-alpine as prod

WORKDIR /app

# Disable Next.js telemetry
ENV NEXT_TELEMETRY_DISABLED 1

COPY --from=base /app .

RUN useradd --create-home appuser

USER nextjs

EXPOSE 3000

CMD ["npm", "start"]
