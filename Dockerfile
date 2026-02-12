FROM node:22-alpine AS builder

WORKDIR /build

COPY . .

RUN cd server && npm install
RUN cd server && npx prisma generate
RUN cd server && npm run build
RUN cd client && npm install && npm run build

FROM node:22-alpine

WORKDIR /app
COPY --from=builder /build/server/package.json ./package.json
COPY --from=builder /build/server/node_modules ./node_modules
COPY --from=builder /build/server/dist ./dist

ENV NODE_ENV=production

RUN addgroup wedding && adduser -D -G wedding wedding
USER wedding

CMD ["npm", "run", "start"]

