# condition-tracker

日々の体調を記録・可視化するための個人用Webアプリケーション。

## 概要

体調のセルフモニタリングを継続する際、記録が手書きやテキストメモに分散すると、
蓄積したデータを振り返ったり傾向を掴んだりすることが難しくなる。

本アプリは、短時間で体調を7項目のスコアとして入力し、
整形テキストをコピーして外部の経過管理スレッドへ貼ることを目的とする。
履歴の正はスレッド側にある。一覧・グラフをアプリ内に置くかは将来判断とする。

## プロジェクトの位置づけ

このリポジトリは、動くアプリケーションの実装に加えて、
**設計判断のプロセスを明示的に記録すること** を目的とした個人プロジェクトである。

要件定義・技術選定・設計判断はすべて `docs/` 配下にドキュメントとして残しており、
「なぜその技術を選んだか」「どのようなトレードオフを受け入れたか」を追跡できる構成にしている。

開発はユーザーストーリー単位のイテレーション（スプリント）で進行する。
機能スプリントとリリーススプリントに分け、サイクル末尾で振り返りと引き継ぎを行う。
手順の正は [docs/README.md](./docs/README.md) の「スプリントの進め方」。

## 技術スタック

| カテゴリ               | 技術                      |
| ---------------------- | ------------------------- |
| フレームワーク         | Vue 3 (Composition API)   |
| 言語                   | TypeScript                |
| 状態管理               | Pinia                     |
| ビルドツール           | Vite                      |
| パッケージマネージャー | npm                       |
| 開発環境               | 自前PC（ローカル）        |
| Node.js                | 26.7.0（Volta）           |
| AI開発支援             | Cursor                    |
| データ持ち出し         | クリップボードへコピー    |
| スタイリング           | Tailwind CSS              |
| コード規約             | ESLint + Prettier         |
| 単体テスト             | Vitest（ADR-009）         |
| CI                     | GitHub Actions（ADR-010） |

技術選定の理由は各ADR（`docs/adr/`）を参照。

## ドキュメント

| ドキュメント                                   | 内容                                             |
| ---------------------------------------------- | ------------------------------------------------ |
| [docs/README.md](./docs/README.md)             | ドキュメント構成、スプリントの進め方、書き進め方 |
| [docs/requirements.md](./docs/requirements.md) | 課題定義・ユーザーストーリー                     |
| [docs/design.md](./docs/design.md)             | 画面設計・データモデル設計                       |
| [docs/adr/](./docs/adr/)                       | アーキテクチャ決定記録（ADR）                    |
| [docs/releases/](./docs/releases/)             | 変更履歴の正。GitHub Releases からリンクする     |
| [docs/conventions.md](./docs/conventions.md)   | 人向けコーディング規約                           |

## 開発環境のセットアップ

### 推奨エディタ

[VSCode](https://code.visualstudio.com/) + [Vue - Official 拡張](https://marketplace.visualstudio.com/items?itemName=Vue.volar)

### インストール

```sh
npm install
```

### 開発サーバーの起動

```sh
npm run dev
```

### 本番ビルド

```sh
npm run build
```

### 単体テスト

```sh
npm run test:unit
```

## ライセンス

MIT
