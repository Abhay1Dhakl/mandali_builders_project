FROM node:20-alpine

WORKDIR /app/frontend

COPY frontend/package.json /app/frontend/package.json
COPY frontend/tsconfig.json /app/frontend/tsconfig.json
COPY frontend/next.config.mjs /app/frontend/next.config.mjs
COPY frontend/next-env.d.ts /app/frontend/next-env.d.ts
RUN npm install

COPY frontend /app/frontend
COPY shared /app/shared

ENV API_BASE_URL=http://backend:8000
ENV NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:8000

RUN npm run build

CMD ["npm", "run", "start", "--", "-H", "0.0.0.0", "-p", "3000"]
