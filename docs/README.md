# プロジェクトドキュメント構成

このディレクトリには、設計判断のプロセスと根拠を記録するためのドキュメントを格納する。

## 構成

```
docs/
├── README.md                     # このファイル
├── requirements.md               # 課題定義・ユーザーストーリー
├── design.md                     # 画面設計・データモデル設計（Mermaid図含む）
└── adr/                          # Architecture Decision Records
    ├── 000-template.md           # ADRテンプレート
    ├── 001-state-management.md   # 状態管理ライブラリの選定
    ├── 002-package-manager.md           # パッケージマネージャーの選定
    ├── 003-development-environment.md   # 開発環境の選定
    ├── 004-node-version-management.md   # Node.js のバージョン管理
    └── 005-ai-coding-assistant.md       # AI開発支援ツールの選定
```

## ドキュメントの書き進め方

1. **requirements.md** を最初に書く。「誰の・何の問題を・なぜ解くか」を明確にする
2. 技術的な判断が必要になるたびに **ADR** を1件書く
3. 実装に入る前に **design.md** で画面とデータ構造を整理する
4. 判断が変わった場合は、古いADRのステータスを `superseded by ADR-XXX` に変更し、新しいADRを起こす

## ADRのステータス

| ステータス | 意味 |
|-----------|------|
| `proposed` | 提案中。まだ確定していない |
| `accepted` | 採用。この判断で進める |
| `deprecated` | 非推奨。この判断はもう有効ではない |
| `superseded by ADR-XXX` | 別のADRに置き換えられた |

## 運用方針

- 完璧を目指さない。「その時点での判断」を記録することが目的
- 判断が後から変わることは想定内。変更の経緯が追跡できることに価値がある
- ドキュメントは実装しながら更新する。書き上げてから実装に入るという進め方はしない