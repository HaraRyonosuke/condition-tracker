# ADR-013: 本番の公開先（Vercel へ静的ファイルを置く）

## ステータス

accepted

## コンテキスト

ADR-011 は GitHub Pages を本番にした。プロジェクトサイトは
`https://hararyonosuke.github.io/condition-tracker/` であり、同じユーザーの
Pages はパスが違ってもオリジンを共有する。いま他の Pages は無く、アプリも保存しない。
US-02 の保存や US-06 のログインを同じ URL に足す前に、オリジンを分けたい。

第一候補は Vercel である。ホスト側の本番ビルドが扱える Node は 24 / 22 / 20 系であり、
26 は Sandbox だけである（2026-09-17 時点）。`engines.node` が `^26.9.0` のまま
Git 連携で Vercel にビルドさせると、ADR-004 と衝突する。

制約は以下の通り。

- 静的な Vite アプリである。実行時 Node は要らない
- ビルドに使う Node は ADR-004 のとおり 26.9.0 である（CI も同じ。ADR-010）
- クリップボード API は Secure Context（HTTPS）が必要である
- 確認は利用者が触る本番 URL で行う
- 公開リポジトリに秘密を置かない。デプロイトークンは GitHub Secrets に置く
- Git 連携の自動デプロイと Actions からの公開が二重に走らないようにする

## 選択肢

### 選択肢A: GitHub Pages のまま約束だけ書く

- 長所: 公開手順が変わらない
- 短所: オリジンは `github.io` のまま。保存・認証を足すときに同じ判断が戻る

### 選択肢B: Actions（Node 26.9.0）で成果物を作り、Vercel に静的ファイルとして置く

- 長所: オリジンがプロジェクトごとの `*.vercel.app` になる。ビルドの Node は 26.9.0 のまま。ホスト側に実行時 Node は求めない。後から応答ヘッダーをリポジトリから書ける
- 短所: Vercel アカウントと GitHub Secrets が要る。Git 連携の自動デプロイをオフにする運用が乗る

### 選択肢C: Vercel の Git 連携でホスト側にビルドさせる

- 長所: デプロイ job が短くなる
- 短所: いまの本番ビルドは Node 26 を扱えない。版を 24 系に下げると ADR-004 と CI が割れる

### 選択肢D: Cloudflare Pages へ出す

- 長所: 独自オリジンと `_headers`
- 短所: 第一候補が Vercel である。アカウントがもう一つ要る

## 決定

選択肢Bとする。本番の公開先は Vercel とする。
ビルドは GitHub Actions 上の Node 26.9.0 で `npm run build`（成果物は `dist`）。
`vercel build` は使わない。Vercel の builder は `engines.node` を 20 / 22 / 24 と照合し、
`^26.9.0` を拒否する。`dist` を Build Output API の `.vercel/output` に詰めて
`vercel deploy --prebuilt` で置く。ホスト側ではビルドしない。
`vercel.json` に `framework`（vite）、`buildCommand`、`outputDirectory`（`dist`）を書く。

Git 連携の自動デプロイは使わない。二重公開を避ける。

Vercel の本番ビルドが Node 26 系を扱えるようになったら、ホスト側ビルド（選択肢C）への移行を検討する。
そのときは本 ADR を superseded にする。オリジン分離は本決定で完了とする。C は手順を短くする判断である。

## 理由

効く制約は、ビルドの Node を 26.9.0 のままにすることと、`github.io` とオリジンを分けることである。
選択肢Bは両方を満たす。選択肢Aは後者を先送りする。選択肢Cは前者と衝突する。選択肢Dは第一候補ではない。

## セキュリティヘッダー

Vercel は `vercel.json` で応答ヘッダーを書ける。一段目で置くもの:

- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `X-Frame-Options: DENY`

`--prebuilt` では同じ値を `scripts/pack-vercel-output.mjs` が `.vercel/output/config.json` にも書く。
`vercel.json` だけだと成果物側に乗らない。

`Content-Security-Policy` は資産パスとインラインの確認が要る。一段目では置かない。
Permissions-Policy も一段目では置かない。

## 結果

- 本番 URL は https://mood-condition-tracker.vercel.app/ である。総合確認はここで行う。Vercel のプロジェクト名は `mood-condition-tracker`（リポジトリ名 `condition-tracker` とは別）
- 初期エイリアス `condition-tracker-pi.vercel.app` は Domains から外した。本番の正ではない
- ビルドは GitHub Actions 上の Node 26.9.0 で `npm run build`。`main` への merge 後に `check` のあと公開する
- 公開は `scripts/pack-vercel-output.mjs` で `.vercel/output` を作り、`vercel deploy --prebuilt --prod` する。`vercel build` は使わない
- 本番の `base` は `/` である。GitHub Pages 用の `/condition-tracker/` は使わない
- トークンと org / project の ID は GitHub Secrets（`VERCEL_TOKEN`、`VERCEL_ORG_ID`、`VERCEL_PROJECT_ID`）に置く。リポジトリ本文には書かない
- GitHub Pages へのデプロイは止める。旧 URL は本番の正ではない
- ホスト側ビルド（選択肢C）は、Vercel が Node 26 の本番ビルドを扱えるときに検討する。今はしない
- ADR-011 は本 ADR により superseded

## 導入（手元で一度だけ）

1. Vercel で静的プロジェクトを作る。Git 連携の Production 自動デプロイはオフにする
2. `vercel login` のあとリポジトリで `vercel link` し、`.vercel/project.json` の org / project ID を取る。`.vercel/` はコミットしない
3. GitHub の Secrets に `VERCEL_TOKEN`、`VERCEL_ORG_ID`、`VERCEL_PROJECT_ID` を置く
4. 本 ADR の workflow が `main` で通ったら、表示された URL を README と本 ADR の本番 URL に書く。現在の本番は https://mood-condition-tracker.vercel.app/ である。短い `*.vercel.app` が空いていなければ、Settings → Domains で希望のホストを足す
