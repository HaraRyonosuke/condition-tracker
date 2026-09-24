# Vite

基準は [Getting Started](https://vite.dev/guide/) の `index.html` とプロジェクトルートである。機能は [Features](https://vite.dev/guide/features)、静的ファイルは [Static Asset Handling](https://vite.dev/guide/assets)、本番ビルドは [Building for Production](https://vite.dev/guide/build)、設定は [Config](https://vite.dev/config/) に分かれている。このファイルは、push 前に差分へ当てる仕様である。

## 対象

差分に `index.html`、`vite.config.ts`、`public/`、または `import.meta.env` があるとき。なければ何もしない。

## 仕様

- 開発サーバの起点は、プロジェクトルートの `index.html` である。`public/` の中には置かない。`<script type="module">` から JavaScript を読む
- 既定のルートは、コマンドを実行したディレクトリである。`vite.config.ts` もそのルートで探す。ルートを変えたら、設定ファイルもそこへ移す
- フレームワークとの接続はプラグインである。Vue は `@vitejs/plugin-vue` を使う。Vite 本体は Vue の書き方を決めない
- 設定は `defineConfig` で書く
- ブラウザに渡してよい環境変数は、`VITE_` で始まるものだけである。コードからは `import.meta.env` で読む
- サブパスに置くときは `base` を変える。既定は `/` である
- 画像などは、原則 `import` する。`public/` は、パスをそのまま残してコピーしたいファイルだけにする。参照は `/icon.png` のようなルートからの絶対パスである
- 本番は `vite build` である。入口はルートの `index.html` で、出力は静的なファイルである

外から見た動きは変えない。
