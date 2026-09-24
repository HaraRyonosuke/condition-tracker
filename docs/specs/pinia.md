# Pinia

基準は [Defining a Store](https://pinia.vuejs.org/core-concepts/) である。このファイルは、push 前に差分へ当てる仕様である。

## 対象

差分に `src/stores/` のファイル、または `defineStore` / `createPinia` があるとき。なければ何もしない。

## 仕様

- ストアは `defineStore(id, ...)` で定義する。`id` は一意にする
- 関数名は `use` と `Store` で挟む（例: `useUserStore`）
- 第二引数は Options オブジェクトか Setup 関数のどちらかである。公式は、楽な方を選べと書いており、片方を必須にしていない
- Setup 関数では、`ref` が状態、`computed` が算出、関数が操作になる。状態はすべて `return` する。返さない状態や `readonly` にした状態は、開発ツールやプラグインが壊れる
- ストアは `use...Store()` が呼ばれるまで作らない
- 置き場は `stores/` とする。ファイルはストアごとに分ける

外から見た動きは変えない。
