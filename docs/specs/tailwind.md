# Tailwind

スタイリング手段の選定は [ADR-007](../adr/007-styling.md)。書き方の基準は [Styling with utility classes](https://tailwindcss.com/docs/styling-with-utility-classes) と [Preflight](https://tailwindcss.com/docs/preflight) である。このファイルは、push 前に差分へ当てる仕様である。

## 対象

差分に `class` の指定、または `src/assets/main.css` があるとき。なければ何もしない。

## 仕様

- 見た目はマークアップのユーティリティクラスで書く。値は Tailwind の目盛りから選ぶ
- hover、focus、画面幅、ダークは、`hover:` や `dark:` のように別のクラスで足す
- 同じ見た目を何度も書くときは、Vue の部品に切り出す。`@apply` は常用しない
- ユーティリティで書ける見た目を、コンポーネントの `<style>` に移さない
- Preflight は外さない。余白はゼロ、見出しは本文と同じ大きさ、リストの点は無い、画像はブロックで親の幅に収まる、という土台のうえにクラスを足す。土台を足すときは `@layer base`
- Preflight や親からの継承で既に効いているユーティリティクラスは足さない

外から見た動きは変えない。クラスの並び順は、[conventions.md](../conventions.md) 第4節のとおり固定しない。
