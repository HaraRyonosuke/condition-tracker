# ADR-011: 本番の公開先（ホスティング）

## ステータス

accepted

## コンテキスト

US-01 の機能は PR #1 で `main` に入った。リリーススプリントでは、利用者が触る HTTPS の本番 URL へ出し、そこでコピーを総合確認する（ADR-009）。
ホストを決めないと、確認先もセキュリティヘッダーの置き場も決まらない。

比較の中心は GitHub Pages と Vercel である。Vercel 側で今回問題になりそうなのは、本番ビルドの Node 26 対応である。Preview URL・別アカウント・パス付き URL・カスタムヘッダーの差は、今回の採否では重く見ない。

制約は以下の通り。

- 静的な Vite アプリである。サーバ側の実行時 Node は要らない
- ビルドに使う Node は ADR-004 のとおり 26.7.0 である（CI も同じ。ADR-010）
- クリップボード API は Secure Context（HTTPS）が必要である
- 確認は利用者が触る本番 URL で行う
- 一周目に API は無い。CORS の ADR は書かない
- 公開リポジトリに秘密を置かない

## 選択肢

### 選択肢A: GitHub Pages（Actions でビルドして静的ファイルを公開）

- 長所: 既存の GitHub Actions で Node 26.7.0 を使ってビルドできる。HTTPS が付く。追加のホスト用ビルド環境が要らない
- 短所: プロジェクトサイトはパス付き URL になる（Vite の `base` が要る）。応答ヘッダーをリポジトリから指定できない

### 選択肢B: Vercel（Git 連携でホスト側がビルド）

- 長所: Vite との相性がよい。ルート URL にしやすい。カスタムヘッダーを書ける。Git 連携の再デプロイが短い
- 短所: 本番ビルドで使える Node は 20 / 22 / 24 系であり、26.7.0 ではない。`engines.node` が `^26.7.0` だとホスト側ビルドと衝突しうる。版を 24 系に下げると ADR-004 と CI が割れる

### 選択肢C: Cloudflare Pages

- 長所: `_headers` で応答ヘッダーを書ける
- 短所: アカウントがもう一つ要る。今回の比較の主対象ではない

### 選択肢D: 自前サーバ / 共有 PC で公開する

- 長所: ホスト製品に依存しない
- 短所: 運用と HTTPS を自分で見る。ADR-003 と衝突しうる

## 決定

選択肢Aとする。いまの公開先は GitHub Pages とする。
`main` への反映後、GitHub Actions が Node 26.7.0 でビルドし、静的ファイルを Pages へ出す。

利用者が触る本番 URL は次とする。

`https://hararyonosuke.github.io/condition-tracker/`

Vercel の本番ビルドが Node 26 系を扱えるようになったら、選択肢Bへの移行を検討する。そのときは本 ADR を superseded にする。

## 理由

効く制約は、ビルドの Node を 26.7.0 のままにすることである。
選択肢Aは、すでに使っている Actions でビルドし、公開だけ Pages に任せる。実行時 Node をホストに求めない。

選択肢Bは、パスやヘッダーでは楽だが、いまは本番ビルドの Node 26 が足りない。この一点が採否に効く。Preview やアカウントの差は、今回は気にしない。
選択肢CとDは、Node の問題を解かない。一周目に選ぶ理由にならない。

パス付き URL と、カスタムヘッダーが置けないことは受け入れる。

## セキュリティヘッダー（ホスト決定後）

GitHub Pages は、リポジトリ内の設定ファイルで応答ヘッダーを指定できない。
今回の採否理由ではない。置ける範囲の説明である。

GitHub が付けるもの:

- HTTPS（`*.github.io`）
- `github.io` に対する GitHub 側の HSTS 運用

リポジトリから置けないもの（一周目では置かない）:

- `Content-Security-Policy`
- `Permissions-Policy`
- `X-Frame-Options` / `frame-ancestors`
- 独自の HSTS 値

クリップボードは HTTPS の Secure Context があれば足りる。Pages の HTTPS で満たす。
ヘッダーのためだけに CDN を前置きするのは、一周目ではやらない。
外部 API が無いので、CORS 用の設定も ADR も足さない。

Vercel へ移行するときは、そのホストで置くヘッダーを改めて説明してから書く。

## 結果

- 本番 URL は `https://hararyonosuke.github.io/condition-tracker/` である。総合確認はここで行う
- ビルドは GitHub Actions 上の Node 26.7.0。ホスト側に実行時 Node は求めない
- プロジェクトサイトなので、本番ビルドだけ `base` を `/condition-tracker/` にする。ローカル開発は `/` のまま
- Jekyll に拾われないよう、公開成果物に `.nojekyll` を置く
- 2周目以降の再デプロイは、`main` への merge 後に同じ公開手順で足りる
- Vercel が Node 26 を本番ビルドで扱えるようになったら、移行を検討する。今は移行しない
- 公開先の前提が変わった場合は、本ADRを superseded にして再検討する
