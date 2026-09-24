# ツール仕様

push 前のリファクタは、下の順で差分に当てる。緩いものから始め、後ろの段が形を整える。関係するファイルが差分になければ、その仕様は何もしない。範囲の外は触らない。外から見た動きは変えない。

フレームワークごとの仕様（Vue、Pinia、Vite、TypeScript、Vitest）は、この順に残す。全体の形は [form.md](./form.md) に切り出してある。

| 順  | 仕様                          | 関係する差分                                                        |
| --- | ----------------------------- | ------------------------------------------------------------------- |
| 1   | [一般](./general.md)          | 今回の変更が触ったファイル                                          |
| 2   | [Tailwind](./tailwind.md)     | `class` の指定、または `src/assets/main.css`                        |
| 3   | [全体の形](./form.md)         | `.vue`                                                              |
| 4   | [Vue](./vue.md)               | `.vue`                                                              |
| 5   | [Pinia](./pinia.md)           | `src/stores/`、または `defineStore` / `createPinia`                 |
| 6   | [Vite](./vite.md)             | `index.html`、`vite.config.ts`、`public/`、または `import.meta.env` |
| 7   | [TypeScript](./typescript.md) | `.ts`、`.vue`、または `tsconfig*.json`                              |
| 8   | [Vitest](./vitest.md)         | `*.spec.ts`、`*.test.ts`、または Vitest の設定                      |

新しい仕様は、対象が広いもの、または部品や名前を新しく作るものを前に、書き方を狭く決めるものを後ろに足す。同じ行を別の理由で書き換える指定は、順では解消しない。そのときは仕様の文面を片方に寄せる。順の理由は [ADR-015](../adr/015-refactor-order.md) である。
