## 事前準備

- Nodeのバージョン20以上を用意してください
- `.env`ファイルを入手し、プロジェクトのルートディレクトリに配置してください

## 始め方

1. 依存関係のインストール：
   ```bash
   npm i
   ```

2. ローカルDBの初期化：
   ```bash
   npm run db:migrate:local
   ```

3. ローカルサーバーの起動：
   ```bash
   npm run dev
   ```

   サーバー起動後、http://localhost:5173/ からAPI+SPAの動作確認が可能

## DB内容の閲覧・変更方法

1. ローカルDBをdrizzle-kitで開く：
   ```bash
   npm run db:studio:local
   ```

2. リモートDBをdrizzle-kitで開く：
   ```bash
   npm run db:studio:prod
   ```

## スキーマの変更方法

1. `backend\db\schema.ts` を編集

2. スキーマファイルの生成：
   ```bash
   npm run db:generate
   ```

3. ローカルDBのマイグレーション：
   ```bash
   npm run db:migrate:local
   ```

4. リモートDBのマイグレーション：
   ```bash
   npm run db:migrate:prod
   ```

## 使用技術

### フロントエンド
- **React 19**: 最新のUIライブラリ、コンポーネントベースのUI開発
- **Vite 6**: 高速なビルドツールと開発サーバー
- **TypeScript**: 型安全な開発環境
- **TailwindCSS 4**: ユーティリティファーストのCSSフレームワーク

### バックエンド
- **Cloudflare Workers**: エッジでのサーバーレス実行環境
- **Hono**: 軽量で高速なWebフレームワーク
- **Cloudflare D1**: SQLite互換のサーバーレスデータベース
- **Cloudflare R2**: オブジェクトストレージ（ファイル保存用）

### データ管理
- **Drizzle ORM**: TypeScript向けのシンプルで型安全なORM
- **Drizzle Kit**: マイグレーション管理とデータベース管理UI

### 開発ツール
- **Biome**: 高速なリンターとフォーマッター
- **TypeScript**: 型安全な開発言語
- **Wrangler**: Cloudflareツールのローカル開発およびデプロイCLI

### API開発
- **Zod**: スキーマ検証ライブラリ
- **OpenAPI/Swagger UI**: APIドキュメント自動生成

## CI/CD

このプロジェクトにはGitHub Actionsを使用したCI/CDが設定されています。
mainブランチへのコード変更時に自動的にCloudflare Workersへデプロイされます。
