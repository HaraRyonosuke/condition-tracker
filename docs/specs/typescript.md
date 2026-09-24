# TypeScript

基準は [strict](https://www.typescriptlang.org/tsconfig/strict.html) である。バンドラ向けの `module` は [module](https://www.typescriptlang.org/tsconfig/module) にあり、Vue 公式の [@vue/tsconfig](https://github.com/vuejs/tsconfig) が Vite 向けの既定を足している。このファイルは、push 前に差分へ当てる仕様である。

## 対象

差分に `.ts`、`.vue`、または `tsconfig*.json` があるとき。なければ何もしない。

## 仕様

- `strict` を有効にする。`noImplicitAny` や `strictNullChecks` など、厳密な検査一式がまとめて入る
- 画面のコードは ES modules で書く。`module` は `ESNext`、`moduleResolution` は `bundler` にする
- 型検査はファイルを出さない。`noEmit` である。組み立ては Vite の `vite build` が行う
- `.vue` も型検査に含める。コマンドは `vue-tsc --build` である

`noUncheckedIndexedAccess` はこの仕様に含めない。`tsconfig.app.json` にあるその設定は、この仕様の外である。

外から見た動きは変えない。
