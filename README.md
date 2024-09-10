# Next.js + Prisma + PostgreSQL プロジェクト

このプロジェクトは、Next.js、Prisma ORM、PostgreSQL を使用した Web アプリケーションです。

## セットアップ

1. リポジトリをクローンします。

2. 依存関係をインストールします：

   ```bash
   npm install
   ```

3. `.env`ファイルを作成し、必要な環境変数を設定します：

   ```
   DATABASE_URL="postgresql://user:password@db:5432/mydb?schema=public"
   ```

4. Docker Compose でアプリケーションを起動します：
   ```bash
   docker-compose up --build
   ```

アプリケーションは http://localhost:3000 で利用可能になります。

## 新しいモデルの追加手順

1. Prisma スキーマの更新:
   `prisma/schema.prisma`ファイルを開き、新しいモデルを追加します。例：

   ```prisma
   model Example {
     id        Int      @id @default(autoincrement())
     name      String
     createdAt DateTime @default(now())
     updatedAt DateTime @updatedAt
   }
   ```

2. マイグレーションの作成と適用:
   Docker コンテナ内で以下のコマンドを実行します：

   ```bash
   docker-compose exec frontend npx prisma migrate dev --name add_example_model
   ```

3. Prisma Client の再生成:

   ```bash
   docker-compose exec frontend npx prisma generate
   ```

4. API ルートの作成:
   `app/api/examples/route.ts`ファイルを作成し、基本的な CRUD 操作を実装します。

5. フロントエンドの更新:
   新しいモデルを使用するようにフロントエンドコンポーネントを更新します。

6. アプリケーションの再起動:
   ```bash
   docker-compose down
   docker-compose up -d
   ```

## 開発

- コードを変更すると、Next.js の開発サーバーが自動的に更新されます。
- データベーススキーマを変更した場合は、マイグレーションを実行してください。

##
