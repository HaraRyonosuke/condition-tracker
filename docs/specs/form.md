# 全体の形

[conventions.md](../conventions.md) 第4節で閉じた、ファイルとテンプレートの形である。push 前に差分へ当てる。Vue のディレクティブは [vue.md](./vue.md)。

## 対象

差分に `.vue` があるとき。なければ何もしない。

## 仕様

- コンポーネントのファイル名は PascalCase にする。複数語にする。ルートの `App` だけ例外にする
- テンプレート内のコンポーネントタグは PascalCase にする（例: `<RecordInputView />`）
- 空のコンポーネントは自己閉じにする
- テンプレートの props とイベント名は kebab-case にする（例: `v-bind:model-value`）
- SFC のブロック順は `<script>`、`<template>`、必要なら `<style>` にする
- 汎用部品に `Base` / `App` / `V` などの接頭辞を付けない。複数画面で使う部品だけ `components/common/` に置く
- 複数属性の意味上の並びは固定しない

外から見た動きは変えない。
