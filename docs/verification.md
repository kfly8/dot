# 初回公開の検証 — 2026-10-07

- `npm test`: 2 tests、10 assertions、すべて成功。IR上のイベント接続と子propsの検査。
- `npm run build`: 6ページ、404、sitemap、robots.txtの静的生成に成功。
- `npm run typecheck`: 成功。
- `npx wrangler deploy --dry-run`: 成功。
- `npm audit`: 0 vulnerabilities。
- `bf debug signals`: quantity=5、express=false、totalのmemoを確認。
- `bf debug trace`: quantity → total → TotalReadout.value。子を別途指定してprops.value → textを確認。
- `bf debug why-update ... s3`: quantityとsetQuantityへの接続を確認。
- MacのChrome: ローカルの日本語トップ、記事、日英切替を確認。見積は500 → 600 → 800に更新。375 × 667のデバイス表示で記事の見出し・本文・ナビゲーションに重なりなし。
- MacのSafari: 公開HTTPSの英語記事を読み込み、500 → 600 → 800を再確認。数量1で減算ボタンが無効。チェック解除後100、Spaceキーによるチェック切替も動作。
- 公開された日英6ページ、CSS、JS、favicon、sitemap、robots.txtはHTTPS 200で、ローカル生成物とバイト単位で一致。
- HTTPトップはHTTPSトップへ301。不明なURLは404。内部リンクと参照アセットの存在を検査。

公開先は `https://dot.kobaken.co/`。独立したCloudflare Worker `dot` のCustom Domainとして公開。DNSの競合警告はなく、既存レコードの上書きは承認していない。既存サイトのWorkerは変更していない。

初回のCloudflare Version ID: `b04ebd7e-643b-446f-b2fa-663a375c42fb`。

この記録は速度ベンチマーク、実機スマートフォン検証、全ブラウザでの互換性保証ではない。静的テストは実行時の計算やハイドレーションを検査しないため、上記のブラウザ確認と役割を分けている。

## 活動紹介への改稿とRouter導入 — 2026-10-07

トップ、About、初回記事、執筆手順を、kobakenの公開活動と使う人に届く価値を紹介する方針へ改稿。日本語・英語を同じ根拠から更新した。BarefootJS README、公式CLI資料、kfly8作成のPR #2961（2026-09-13 merge）を確認し、事実とdotの評価を分けた。

`@barefootjs/router` の公開現行版0.39.3を同版で追加。通常のHTMLリンクをregion差替えへ拡張し、先読み・キャッシュは公式の既定動作を使用する。速度の比較測定はしていない。JSON APIを使っていないためcreateQueryは追加しなかった。

- build / typecheck / dry-run成功、npm audit 0件。
- テストは4件・27 assertions。静的配線に加え、DOMを保持した遷移、html lang、canonical・alternate・OG、見出しフォーカス、戻る/進むを検証。
- Mac Safariのローカル表示で、トップ→日本語記事→英語記事→戻る→進むを確認。記事到着後の見積500→600→800、履歴移動後の500→600も確認し、再ハイドレーションが働くことを検証。
- DOMテストはネットワークとisland module実行を模擬するため、実行時UIの代替ではない。上のMacブラウザで補完した。

更新公開のVersion ID: `db1b047b-76c3-49ce-824e-ff799073e10d`。公開6ページと全CSS/JSがローカル生成物とバイト単位で一致。HTTPS 200、HTTP→HTTPS 301、不明URL 404、既存kobaken.co 200を再確認。Mac Safariの公開版でトップ→About→戻る→記事の遷移と、見積500の初期表示を確認した。続く追加操作では検証ウインドウを取得できなくなったため、その操作は結果に含めていない。遷移後の見積操作は上記ローカルの同一ビルドで確認済み。

## 2026-10-07: プロダクトと配線実験へ焦点を整理

記事・トップ・Aboutの日英版を改稿。人物紹介や無関係なPRの紹介を除き、子へ渡す式の検査と再現手順に絞った。Router構成は維持。

実際の `renderToTest` / `find({ componentName: 'TotalReadout' }).props.value` に対するテストを、名前 `passes total() to TotalReadout.value` で独立させた。次のコマンドで正しい接続を検査し、ソースを一時変更してから必ず復元した。

```sh
bun test ui/components/ui/__tests__/estimate.test.ts --test-name-pattern 'passes total'
```

- `value={total()}`: 1 pass、2 filtered out、0 fail。
- `value={quantity()}`: 0 pass、2 filtered out、1 fail、終了コード1。Expected `"total()"`、Received `"quantity()"`。
- 復元後: 1 pass、2 filtered out、0 fail。
- 全体: build成功、typecheck成功、5 tests / 27 assertions成功。

本文中のコードは省略箇所を明示。完全な実装とテストはリポジトリにあり、補足資料 `docs/wiring-experiment.md` から参照できる。

今回の文章変更後はMacブラウザ操作ツールが `Transport closed` を返し、画面再確認は実施できなかった。前回の同じRouter・見積UIのローカルブラウザ検証とは区別する。

公開実装commit: `c46692a`。Cloudflare version: `e0684a1d-4bb8-44f4-82e9-63d9c487ce7d`。既存の認可済みWrangler経路をTTYで使用し、DNS競合や他サイトの変更なしに `dot.kobaken.co` へ更新した。

公開後は日英6ページ・CSS/JS等の計14ファイルについてHTTPS 200とローカルビルドとのバイト一致を確認。HTTPは301で同じHTTPS URLへ転送、存在しないURLは404、既存 `https://kobaken.co/` は200だった。

## 2026-10-07: 成功したテストの証拠範囲を扱う全面改稿

日英記事を、テストの観測対象・期待値・未確認の範囲を読み直す内容へ全面改稿。外部事例はDaniel Prager氏の2026-03-08の開発記録を原文確認し、本人の報告として短く紹介した。人物の職歴は本人のAboutを確認。静的検査の例を、外部事例を解決した証拠としては扱わない。

- 事例: https://www.linkedin.com/pulse/ai-debugging-story-tests-passed-functionality-broken-daniel-prager-vvemc
- プロフィール: https://pragerconsulting.com/about/

既存の `passes total() to TotalReadout.value` テストを再実行し、次を確認。変更したソースはfinallyで元に戻した。

- 元の `value={total()}`: 終了コード0。
- `value={quantity()}`: 終了コード1。
- `quantity() * 100` を `quantity() * 101` に変更し、`value={total()}` を維持: 終了コード0。
- 元のソースに復元: 終了コード0。

最後の例は、子へ渡す式の検査では価格の計算違いを検出しないという本文の根拠。既存UI・Routerの実装変更はない。ブラウザでの今回の再操作・目視検証は実施していない。

## 2026-10-07: AI生成テストの期待値と検出力に研究を反映

記事の日英本文を全面改稿。対象読者はAIによる実装とテストを受け入れる開発者。期待値を要件に照合し、要件に反する実装変更で対象テストが失敗するか試す行動を提案した。

一次資料を再確認し、本文では次の3本を採用した。

- https://arxiv.org/html/2607.05139v1 — 未査読。選別したPythonの誤実装で、同一会話の実装後生成と課題記述のみの新規会話を比較。一般の不具合率とは説明しない。
- https://arxiv.org/html/2607.22880v1 — ISSTA 2026採択／PACMSE。正しいコードからの生成・モデル間平均と、バグを含む入力や同一モデル内の条件を区別。
- https://arxiv.org/html/2501.12862v1 — FSE 2025 Industry。元のコードでpass、対象変異でfailするテストを選ぶ手順を紹介。実障害削減や全テストの受理率へ読み替えない。

ICSE 2026のSWE-bench correctness論文も確認したが、本文の論点を広げないため採用しなかった。研究はこのブログの提案するレビュー手順の比較実験でも、BarefootJSの優位性の証明でもない。静的な見積テストの成功・誤参照の失敗・単価誤りの成功は前節の実測に基づく。

build・typecheck・既存5テスト（27 assertions）が成功。今回もUIとRouterの実装は変更していない。ブラウザの目視再検証は未実施。

## 2026-10-07: 問い一文のタイトルと記事画像

日英タイトルを「そのテストは、何を確かめていますか？」／「What does your test check?」へ変更。本文の研究・条件は維持した。旧Library画像は使わず、背景#f7f7f2・文字#242820のSVGをローカルの既存SharpでPNGにレンダリングした。追加依存なし。

1200×630の日英PNG、および375px画面の本文幅に相当する335px幅の縮小PNGを実ピクセルで確認。欠けや文字化けはなく、指定の問い一文だけを2行で表示する。これは画像の確認であり、今回のブラウザ全画面の目視確認ではない。

記事H1内に画像を配置し、altが記事タイトルとなる。画像幅100%・高さauto・寸法属性で比率を保持。OG/Twitterは言語別の絶対PNG URLとaltを指定し、OG寸法は1200×630。Routerで日英を切り替えたときのタイトル・画像・alt・head metadata、Aboutへ移ったときの画像metadata除去とH1フォーカスをDOMテストで確認。build・typecheck・6 tests / 49 assertionsが成功。

## 2026-10-07: 風刺画の掲載

- 採用画像: 文字を除いた白黒の四角い車輪の風刺画（1536×1024）。日英共通の挿絵・OG画像として配置。
- タイトルはHTMLのh1へ戻し、画像には日英の説明altを設定。OG/Twitterにも説明と実寸を反映。
- build、typecheck、6テスト・51assertions成功。Routerで見出し・画像・言語別alt・共有メタデータの同期を確認。
- このMacのGoogle ChromeをPlaywrightで起動し、ローカル記事の1280px日本語・390px英語を撮影して目視確認。画像の読み込み成功、横方向のはみ出しなし。

## 2026-10-07: 見積例のUI／ソースタブ

- BarefootJSのEstimateExampleを追加。実装ファイルをビルド時に読み、UIと同じEstimate・TotalReadoutのソースを表示。
- 日英の冒頭をレビューで迷う場面から始め、valueがTotalReadoutに渡す金額のpropsであることを説明。
- build・typecheck・既存6テスト（51assertions）成功。
- Mac Chrome／Playwrightで1280px日本語・390px英語を目視確認。クリック切替、左右矢印・Home・End、フォーカス、500→600→800、切替後の800保持、ソース原本との一致、ページ横溢れなしを確認。
- Router経由の記事表示・日英切替後のタブと見積操作、JavaScript無効時のソース表示も成功。

## 2026-10-07: 値と式の説明・日本語セルフレビュー

- dot-core-message-writing／dot-japanese-editingを適用。値が一致するケースでは参照の取り違えを見逃し得ることと、今回の5・500なら値比較でも検出できることを日英に追記。
- 静的な接続検査から計算・表示の別途確認へ段落を接続。研究紹介の長文、抽象的な表現、行動の説明を推敲。研究の条件・数値・限界は維持。
- 全ページのフッターにkobaken.coへのリンクを追加。Mac Chromeで1280px・390pxの表示を目視確認し、リンク先・横溢れなしを確認。
- build、typecheck、6テスト（51assertions）成功。
