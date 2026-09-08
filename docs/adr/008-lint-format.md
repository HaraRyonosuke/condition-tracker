# ADR-008: コード規約（Lint とフォーマット）

## ステータス

accepted

## コンテキスト

US-01 の実装レビューに入った。空白・引用符・Vue の書き方が人やセッションで揺れると、
レビューが見た目の議論になり、入力とコピーの確認が後回しになる。

制約は以下の通り。

- Vue 3 の単一ファイルコンポーネント（`.vue`）を主に書く
- TypeScript の型チェックは既に `vue-tsc` がある
- 個人プロジェクトであり、ツールの数と設定量は抑えたい
- 一周目の目的は入力とコピーであり、規約のための大規模な型付き Lint は過剰である

## 選択肢

### 選択肢A: ESLint + Prettier

- 長所: `.vue` の公式ルート。見た目は Prettier、Vue / TS のミスは ESLint。情報が多い
- 短所: パッケージが分かれる。設定ファイルが2系統になる

### 選択肢B: Biome 単体

- 長所: 速い。フォーマットと Lint が一本
- 短所: `.vue` の template が弱い。後から ESLint を足す可能性が高い

### 選択肢C: Prettier だけ

- 長所: 導入が最小。見た目だけ揃う
- 短所: 未使用変数や Vue の誤りは見ない

## 決定

選択肢Aとする。整形は Prettier、静的検査は ESLint（eslint-plugin-vue と typescript-eslint）とする。
衝突する整形ルールは eslint-config-prettier で ESLint 側を切る。

## 理由

効く制約は `.vue` を本丸に書くことである。選択肢Aがそこを公式にカバーする。
Biome は速さで勝つが、template が弱いと一周目の画面ファイルで穴が開く。
Prettier だけでは規約のうち「誤り」側が残る。
型の厳密検査は `vue-tsc` に任せ、ESLint は型情報なしの recommended にとどめる。

## 結果

- `npm run lint` と `npm run format` を使う
- 型チェックは `npm run type-check` のままにする
- husky / lint-staged は今は入れない
- Tailwind のクラス順専用プラグインは今は入れない
