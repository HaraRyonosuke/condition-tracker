---
name: testing
description: 単体テスト（Vitest）を足す・直すとき、本番 URL で Product Test をして docs/test-items/ に項目や結果を残すとき、issue にテストのラベルが付いているときに使う。置き場と書き方の正は docs にあり、このskillは読む順と、エージェントが決めてはいけないことだけを持つ
---

# テスト

置き場と書き方の決まりは、このskillには書かない。手を動かす前に、次の正を読む。同じ決まりを2か所に置くと、いずれ食い違うためである。

| 何を                                        | 正                                                                  |
| ------------------------------------------- | ------------------------------------------------------------------- |
| 何を単体にし、何を総合にするか              | [ADR-009](../../../docs/adr/009-testing.md)                         |
| 単体の書き方                                | [docs/specs/vitest.md](../../../docs/specs/vitest.md)               |
| Product Test の項目・結果の書き方と引き継ぎ | [docs/test-items/README.md](../../../docs/test-items/README.md)     |
| リリースノートの「確認」                    | [docs/releases/README.md](../../../docs/releases/README.md)         |
| ラベルの名前と付け方                        | [issues-not-plans](../../rules/issues-not-plans.mdc) の「ラベル」節 |

## 単体テスト

- 置き場は、いまのテストに合わせる。対象と同じディレクトリの `__tests__/` に、`<対象のファイル名>.spec.ts` で置く（例: `src/utils/__tests__/formatCopyText.spec.ts`）
- ADR-009 の範囲は「画面を開かない確認」である。コンポーネントを mount するテストなど、その範囲を超えるものは書かない。要ると思ったら、書く前に報告して止まる
- 単体を含む作業は、CI の `check` が通るまで完了にしない

## Product Test

- 手順は [docs/test-items/README.md](../../../docs/test-items/README.md) のとおりにする。新しい機能リリースは、直近の `product-test.md` をコピーしてから直す。項目が変わらない再デプロイは、直近のファイルの表に行を足す
- 確認者の欄には、実際に見た者を書く。エージェントが確認用ブラウザで見たら `Cursor` と書く。`自分` の行は、本人が結果を伝えたときだけ書く
- 見ていないものを「通った」「問題なし」にしない。見ていなければ `未実施` と書き、見なかった理由を短く添える
- 過去の行は書き換えない。消さない。失敗も未実施も、そのまま残す。うまくいったことも、いかなかったことも見せるリポジトリであるため
- 失敗した項目は、作業 issue にする。issue の形は [issue-format](../../rules/issue-format.mdc)、署名は [github-cursor-writing](../../rules/github-cursor-writing.mdc) に従う

## ラベル

ラベルの正は [issues-not-plans](../../rules/issues-not-plans.mdc) の「ラベル」節である。テストのラベルがその節に無いうちは、テストのラベルを付けない。作りもしない。

## 決めてはいけないこと

- テストの種類と範囲を増やすこと。たとえば結合テストを始めること。ADR-009 の判断を変えることになるので、本人が新しい ADR を決めるまで待つ（[docs/README.md](../../../docs/README.md) の「ドキュメントの書き進め方」）
- `product-test.md` の書式を変えること。表の列を足すことも含む。変えたいときは、README を直す案として本人に出す
- 本人の代わりに `自分` の行を書くこと

```
# ❌ BAD
見ていない項目を「問題なし」にする / 直近をコピーせずに空の一覧から始める / 過去の行を最新の結果で上書きする / 結合テストの決まりを自分で作る

# ✅ GOOD
正を読む → 単体は __tests__/ に spec.ts → Product Test は直近をコピーして行を足す → 見ていなければ未実施と理由 → 範囲を超えるなら報告して止まる
```

禁止: 見ていない項目を通った扱いにすること。過去の行を書き換えること。`自分` の行を代筆すること。

## ほかとの境界

- push 前に差分へ vitest.md を当てるのは [pre-push-refactor](../../rules/pre-push-refactor.mdc) である。このskillは、テストを書くときと、Product Test を記録するときだけに使う
- issue の作り方とラベルの付け方は [issues-not-plans](../../rules/issues-not-plans.mdc) である
