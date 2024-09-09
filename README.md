# 得意先管理アプリケーション

このプロジェクトは、Next.js、Prisma ORM、PostgreSQL を使用した得意先管理アプリケーションです。

## 始め方

1. 依存関係をインストールします：

```bash
npm install
```

2. PostgreSQL データベースをセットアップし、`.env`ファイルの`DATABASE_URL`を更新します。

3. Prisma マイグレーションを実行します：

```bash
npx prisma migrate dev
```

4. 開発サーバーを起動します：

```bash
npm run dev
```

[http://localhost:3000](http://localhost:3000)をブラウザで開いて結果を確認してください。

## Prisma スキーマと API のセットアップ

### 1. Prisma スキーマの定義

`prisma/schema.prisma`ファイルでデータモデルを定義します：

```prisma
model Customer {
  id                Int      @id @default(autoincrement())
  name              String
  prefecture        String
  address           String
  phoneNumber       String
  faxNumber         String?
  isShippingStopped Boolean  @default(false)
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
}
```

### 2. マイグレーションの実行

スキーマを定義または更新した後、マイグレーションを実行します：

```bash
npx prisma migrate dev --name init
```

### 3. Prisma Client の生成

データベースとやり取りするための Prisma Client を生成します：

```bash
npx prisma generate
```

### 4. API エンドポイントの作成

`app/api`ディレクトリに API ルートを作成します。例えば、`app/api/customers/route.ts`：

```typescript
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  const customers = await prisma.customer.findMany();
  return NextResponse.json(customers);
}

export async function POST(request: Request) {
  const body = await request.json();
  const customer = await prisma.customer.create({ data: body });
  return NextResponse.json(customer);
}
```

これにより、得意先の一覧取得と新規作成のエンドポイントが作成されます。
