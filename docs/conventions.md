# コーディング規約

**ステータス: 一部確定。** 見た目と未使用変数は ESLint + Prettier（ADR-008）に任せる。Vue の書き方は [Vue.js 公式 Style Guide](https://vuejs.org/style-guide/) の Priority A / B を土台にし、対話で閉じた項目だけ下に記録する。未決は既定を仮置きしない。この文書の更新だけでは `src/` を直さない。コード規約の正はこのファイルとする。PR の merge 手順は [`.cursor/rules/pr-merge.mdc`](../.cursor/rules/pr-merge.mdc) とする。

## 根拠にする公開テンプレート

[Vue.js 公式 Style Guide](https://vuejs.org/style-guide/) の Priority A（必須）と B（強く推奨）を土台にする。TypeScript と Vue 3 Composition API は、公式ガイドが薄い箇所だけ短く足す。Git のメッセージ規約は広げない。

## 1. Priority A

出典: [Priority A Rules: Essential](https://vuejs.org/style-guide/rules-essential.html)

- コンポーネント名は複数語。ルートの `App` だけ例外。
- props は型を明示する（`<script setup lang="ts">` では `defineProps<{ ... }>()`）。
- `v-for` には常に `key`。
- 同じ要素に `v-if` と `v-for` を付けない。
- スタイルの衝突を避ける。本リポジトリは Tailwind（ADR-007）なので、コンポーネント内に未スコープの独自 CSS を増やさず、ユーティリティクラスで書く。グローバルは `src/assets/main.css` に限る。

Options API 向けの「data は関数」は、Composition API のみの本リポジトリでは適用対象外とする。

## 2. このプロジェクト固有（設計どおり）

出典: `docs/design.md` と現状の `src/`。

### 配置

```
src/
├── views/                 # 画面（一周目は RecordInputView のみ）
├── components/            # 機能部品（画面・ドメイン固有）
│   └── common/            # 複数画面で使う汎用部品。最初の1個を足すときに作る
├── stores/                # Pinia
├── constants/             # 項目定義などアプリ全体の定数
├── utils/                 # 日時・コピー文面など純関数
└── assets/                # グローバル CSS
```

一周目は Vue Router を入れない。`App.vue` から `RecordInputView` を出す。

### コンポーネント

- 画面は `views/` の `*View.vue`。機能部品は `components/` 直下に役割が分かる PascalCase（例: `ScoreForm`, `ScoreItemInput`）。
- 汎用部品は `Base` / `App` / `V` などの接頭辞を付けない。層はフォルダで示す（`components/common/`）。フォルダは最初の汎用部品を足すときに作る。空の `common/` は置かない。
- 汎用フォルダ内でもコンポーネント名は複数語。HTML 要素と同名（`Button.vue`）は使わない。
- 単一ファイルは `<script setup lang="ts">`。Options API は使わない。
- 画面コピー（見出し・質問文・ボタン）と、クリップボードへ出す整形テキストは別物。画面用の4択ラベル（なし／少し／かなり／とても）をコピー文面に出さない。
- UI 文言は日本語。絵文字は使わない。
- フッターは置かない。日付ピッカーは置かない。記録日時はコピー時にブラウザ時計から付ける。
- イテレーション1はライトテーマのみ。

### データとストア

- チェック項目の `id`（`q1` … `q7`）は記録のキーとして安定させる。表示名や質問文を変えても `id` は変えない。
- 定義は `src/constants/checkItems.ts` の1か所。各記録は `{ key, score }` 相当だけを持つ。
- Pinia は Setup Store（`defineStore('id', () => { ... })`）。一周目は永続化しない（persist プラグインも localStorage も使わない）。
- ストアは入力中の draft とコピー用処理。履歴配列は持たない。
- 未回答は `null`。未回答を 0 として合計しない。

### コピー文面の日時

- コピー用の日時は `Intl` の `ja-JP` で、`recordedAt` を IANA `timeZone` で解釈する。
- 形式は `YYYY-MM-DD (曜) HH:MM` にタイムゾーン名。秒は ISO の `recordedAt` にだけ残す。
- タイムゾーンはブラウザ／OS から取る。VPN の出口 IP からは取らない。

## 3. TypeScript / Composition API

- `lang="ts"` を付ける。`any` は新コードに使わない。
- ストアからテンプレートへ出す reactive な値は `storeToRefs`。アクションはストアの関数を直接呼ぶ。
- クリップボードや日時の副作用はストア／util に寄せ、表示コンポーネントは入力と表示に留める。

## 4. 対話で閉じた項目（確定）

Vue 公式の Priority B / C のうち、対話で選んだもの。`src/` への適用は依頼があったターンで行う。

| 項目                               | 確定                                                                                          | 備考                                                                                  |
| ---------------------------------- | --------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| SFC のファイル名                   | PascalCase（例: `RecordInputView.vue`）                                                       | 現状どおり                                                                            |
| テンプレート内のコンポーネントタグ | PascalCase（例: `<RecordInputView />`）                                                       | 現状どおり                                                                            |
| 空のコンポーネント                 | 自己閉じ                                                                                      | 現状どおり                                                                            |
| テンプレートの props / イベント名  | kebab-case（例: `v-bind:model-value`）                                                        | 公式の SFC 推奨。現状のバインドも kebab-case                                          |
| ディレクティブ                     | **常にフル形式**（`v-on:click`、`v-bind:class`、`v-slot`）。省略（`@` / `:` / `#`）は使わない | ESLint（`vue/v-on-style` など longform）で強制する                                    |
| SFC のブロック順                   | `<script>` のあと `<template>`。必要ならそのあと `<style>`                                    | 現状どおり。公式の推奨の一つ                                                          |
| 汎用コンポーネントの見分け         | 接頭辞なし。複数画面で使う部品だけ `src/components/common/`                                   | 機能部品は `components/` 直下のまま。一周目は該当なし。フォルダは実物を足すときに作る |
| 複数属性の意味上の並び             | **固定しない。** Lint でも強制しない                                                          | 折返しは Prettier。書く人の順を尊重する。推奨表も置かない（揃えたくなるため）         |

## 5. 未決（既定を置かない）

いま対話で閉じ残している項目はない。仮の既定を置きたくなったら、この節に戻す。

## 6. あとでやること（今はやらない）

- Cursor ルールはコード規約には使わない。PR merge の手順だけ [`.cursor/rules/pr-merge.mdc`](../.cursor/rules/pr-merge.mdc) に置く。
- 未決が再び出たら、第5節とこの文書のステータスを更新する。
