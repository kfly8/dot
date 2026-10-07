# dotの記事を書く

執筆時の入口は [AGENTS.md](../AGENTS.md) です。構成と内容の判断は [dot-core-message-writing](../.agents/skills/dot-core-message-writing/SKILL.md)、日本語の仕上げは [dot-japanese-editing](../.agents/skills/dot-japanese-editing/SKILL.md) を参照してください。執筆方針はスキル側で管理し、この文書にはリポジトリ固有の作業だけを置きます。出典・改変の説明とライセンスも各スキルにあります。

## 記事ファイルと検証

- `content/posts.tsx` に同じslugの日英タイトル・要約・本文を追加・編集します。
- 一覧やAboutも変える場合は `scripts/generate.tsx` を編集します。
- 読者が実行するコードと検査は実際のソース・テストで確かめ、詳細資料は `docs/` に置いて本文からリンクします。
- `npm run build`、`npm test`、`npm run typecheck` を実行します。ブラウザで表示・実例・言語切替を確認し、未実施の検証は完了扱いにしません。

初回記事の具体的な再現方法は [wiring-experiment.md](wiring-experiment.md)、実施済みの検証記録は [verification.md](verification.md) にあります。起動と依頼済みの公開作業は [README.md](../README.md) を参照してください。

## スキルの利用

リポジトリを作業対象にしたエージェントには、AGENTS.mdから該当スキルの参照を指示しています。明示する場合は「dot-core-message-writingとdot-japanese-editingを使って記事を改稿」のように指定できます。スキル一覧に表示されない環境でも、AGENTS.mdの相対パスから本文を読めます。

これは参照すべき手順の定義です。ファイルの存在だけで、すべてのツールの自動検出、毎回の適用、記事品質を保証するものではありません。完了時は適用したスキルと、行った検証・未検証事項を報告してください。
