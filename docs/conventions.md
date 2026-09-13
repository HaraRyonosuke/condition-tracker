# コーディング規約

**ステータス: 一部確定。** 見た目と未使用変数は ESLint + Prettier（ADR-008）に任せる。Vue の書き方は [Vue.js 公式 Style Guide](https://vuejs.org/style-guide/) の Priority A / B を土台にし、対話で閉じた項目だけ下に記録する。未決は既定を仮置きしない。この文書の更新だけでは `src/` を直さない。コード規約の正はこのファイルとする。PR の merge は [`.cursor/rules/pr-merge.mdc`](../.cursor/rules/pr-merge.mdc)、ブランチの切り方は第7節と [`.cursor/rules/branch-names.mdc`](../.cursor/rules/branch-names.mdc) とする。

## 根拠にする公開テンプレート

[Vue.js 公式 Style Guide](https://vuejs.org/style-guide/) の Priority A（必須）と B（強く推奨）を土台にする。TypeScript と Vue 3 Composition API は、公式ガイドが薄い箇所だけ短く足す。Git のコミットメッセージ規約は広げない。ブランチの切り方は第7節。

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

- コードの書き方は Cursor ルールに置かない。Git の手順だけ [`.cursor/rules/`](../.cursor/rules/) に置く（[PR merge](../.cursor/rules/pr-merge.mdc)、[ブランチ名](../.cursor/rules/branch-names.mdc)）。切り方の正は第7節。
- スプリントを束ねる中間ブランチ（`sprint/` や `develop`）は置かない。関わる人が増えたらこの節に戻す。
- 未決が再び出たら、第5節とこの文書のステータスを更新する。

## 7. ブランチの切り方

既存ブランチは改名しない。中間ブランチは今は置かない（第6節）。コミットメッセージ規約は広げない。

### 切り方

- `main` へは直接コミットしない。入る経路は PR の merge だけ
- 起点は常に最新の `origin/main`。未 merge の別 topic から切らない（続ける同一 PR は除く）
- 作業中のブランチへ、別 US や別種類の変更を足さない
- 機能は 1 US = 1 ブランチ = 1 PR。接頭辞は `feat` または `fix`。その US の設計・実装・ADR / design 更新はここに載せる
- その US に属さない変更は、merge 後の `main` から切る。ホスト・CI は `ci/`。ノートやサイクル末尾・規約だけなら `docs/`
- merge 済みブランチは再利用しない。続きは `main` から新規

### 名前

新規ブランチは `接頭辞/短い説明`。接頭辞は [Conventional Commits](https://www.conventionalcommits.org/) と同じ省略形に限る。`feature` や `release` などのフルスペルは使わない。

説明は英小文字の kebab-case。US 番号を含めてよい。

| 接頭辞     | 使うとき                         |
| ---------- | -------------------------------- |
| `feat`     | 機能追加                         |
| `fix`      | 不具合修正                       |
| `docs`     | 文書のみ                         |
| `style`    | 整形のみ（挙動は変えない）       |
| `refactor` | 挙動を変えない再構成             |
| `perf`     | 性能                             |
| `test`     | テストのみ                       |
| `build`    | ビルド・依存                     |
| `ci`       | CI・デプロイ設定                 |
| `chore`    | 上記以外                         |

この表にない接頭辞は使わない。

```
# ❌ BAD
feature/us-01-score-input
release/us-01-hosting
US merge 後のノートを同じ feat/ に足す
main に直接コミットする

# ✅ GOOD
feat/us-03-behavior-copy
docs/us-01-notes を origin/main から切る
ci/github-pages
```
