FROM node:20-alpine AS base

# 개발 의존성 설치
FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# 애플리케이션 빌드
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# 프로덕션 이미지
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

# 필요한 파일만 복사
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# 보안 강화: 루트 사용자가 아닌 node 사용자로 실행
USER node

EXPOSE 5000
ENV PORT 5000
ENV HOST 0.0.0.0

CMD ["node", "dist/server/index.js"]