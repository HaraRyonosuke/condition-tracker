# Vue

対話で閉じた書き方のうち、push 前に差分へ当てる項目である。一覧のほかの項目は [conventions.md](../conventions.md) 第4節。

## 対象

差分に `.vue` があるとき。なければ何もしない。

## 仕様

- ディレクティブは常にフル形式にする。`v-on:click`、`v-bind:class`、`v-slot`。省略（`@` / `:` / `#`）は使わない
- テンプレート内のコンポーネントタグは PascalCase にする（例: `<RecordInputView />`）

外から見た動きは変えない。
