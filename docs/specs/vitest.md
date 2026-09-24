# Vitest

書き方の基準は [Writing Tests](https://vitest.dev/guide/learn/writing-tests) と [Using Matchers](https://vitest.dev/guide/learn/matchers) である。名前の付け方は [Testing in Practice](https://vitest.dev/guide/learn/testing-in-practice) にある。何を単体にするかは [ADR-009](../adr/009-testing.md) である。このファイルは、push 前に差分へ当てる仕様である。

## 対象

差分に `*.spec.ts`、`*.test.ts`、または Vitest の設定があるとき。なければ何もしない。

## 仕様

- テストは `test`（別名 `it`）で定義し、結果は `expect` で見る。失敗する表明が一つでもあれば、そのテストは失敗する
- 関連するテストは `describe` でまとめる。入れ子は浅くする。単純なモジュールは平らな一覧で足りる
- `test`、`expect`、`describe` は、ファイルの先頭で `vitest` から import する。`globals` は有効にしない
- プリミティブの一致は `toBe`、形の一致は `toEqual` を使う
- テスト名は、実装の手順ではなく、振る舞いを書く
- 一つのテストは、一つの振る舞いに対応する
- 単体は薄くする。網羅率は追わない。画面を開かない確認に限る
- ブラウザの自動操作（E2E）は入れない。総合は本番 URL で人が見る

外から見た動きは変えない。
