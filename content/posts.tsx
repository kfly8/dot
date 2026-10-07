import { highlight } from '../scripts/highlight'
import type { JSX } from 'hono/jsx/jsx-runtime'
export type Locale = 'ja' | 'en'
const workflow = 'https://arxiv.org/html/2607.05139v1'
const coverage = 'https://arxiv.org/html/2607.22880v1'
const mutation = 'https://arxiv.org/html/2501.12862v1'
const assertion = `const result = renderToTest(readFileSync(path, 'utf8'), path)
expect(result.find({ componentName: 'TotalReadout' })?.props.value)
  .toBe('total()')`
function Code(props: { children: string; label: string }) { return <figure className="code"><figcaption>{props.label}</figcaption><div dangerouslySetInnerHTML={{ __html: highlight(props.children, 'typescript') }} /></figure> }
export interface Post { slug: string; date: string; title: Record<Locale, string>; image?: { src: string; width: number; height: number; alt: Record<Locale, string> }; summary: Record<Locale, string>; body: (props: { locale: Locale; demo: JSX.Element }) => JSX.Element }
export const posts: Post[] = [{
 slug: 'inspect-ui-before-browser', date: '2026-10-07',
 title: { ja: 'そのテストは、何を確かめていますか？', en: 'What does your test check?' },
 image: { src: '/images/square-wheels.png', width: 1536, height: 1024, alt: { ja: '宙に浮いた四角い車輪を回してチェックマークを掲げる検査役と、腕を組んで見つめる人物。', en: 'An inspector spins the square wheels of a suspended bicycle and holds up a checkmark, while another person watches with folded arms.' } },
 summary: { ja: '実装もテストもAIに任せると、両方が同じ誤解を含むことがあります。変更を受け入れる前に、テスト一つの期待値を仕様に照らし、具体的な誤りを検出できるか確かめます。', en: 'AI-written code and tests can share the same misunderstanding. Before accepting a change, check one test’s expectation against the requirement and try a specific fault it should detect.' },
 body: ({ locale, demo }) => locale === 'ja' ? <>
  <p className="lead">AIが実装もテストも書いてくれた。テストはすべて緑。それでも、レビューで「これで受け入れていいのだろうか」と手が止まることはありませんか。コードを全部読み直すのは大変ですし、<strong>合格件数だけでは、何を確かめられたのか見えてきません。</strong></p>
  <p>たとえば「送料は注文ごとに一度だけ加える」という要件なのに、商品ごとに送料を加えるコードを書いたとします。テストもその計算をなぞって期待値を作れば、合格しても要件を満たしたことにはなりません。これは説明のための例ですが、実装とテストが同じ誤解を共有すると、すべて緑でも安心できない理由が見えてきます。この記事では、レビューの足がかりとして、重要なテストを一つ選び、その「正解」の根拠と、見つけられる誤りを確かめる方法を紹介します。</p>
  <h2>実装を見せることが、期待値を偏らせる場合がある</h2>
  <p>2026年7月の未査読研究 <a href={workflow}>On the risk of coding before testing</a> は、5モデルとPythonの3ベンチマーク（HumanEval+、MBPP、BigCodeBench）を使い、テストを生成する手順を比較しました。対象は、検出が比較的難しいものを選んだ誤実装です。同じ会話で実装後にテストを作る条件の検出率は約14%、実装を見せず課題記述だけを新しい会話に渡す条件では約25%でした。一般のバグ発生率ではなく、会話を分ければ必ず見つかるという結果でもありません。</p>
  <p>この結果を踏まえ、<strong>期待する結果の根拠を、実装の外にたどること</strong>を提案します。要件にある送料の規則、仕様に載った入出力例、関係者と合意した振る舞いなどが根拠になります。AIに別の会話でテスト案を出してもらう方法もありますが、その案の期待値まで正しいとは限りません。要件が曖昧なら、先に製品としてどう振る舞うべきかを決める必要があります。</p>
  <h2>カバレッジの高さだけでは、その期待値を確かめられない</h2>
  <p>カバレッジは、テストがコードのどの行や分岐を通ったかを示します。<strong>その結果を何と比較して正しいと判定したか</strong>は、テストの検査条件を読む必要があります。</p>
  <p><a href={coverage}>ISSTA 2026／PACMSEの再現研究</a>では、正しいJava実装から生成した回帰テストについて、モデルごとの平均値を比較すると、分岐カバレッジとバグ検出率に強い相関（<code>r = 0.861</code>）がありました。一方、バグを含む実装から生成した場合、その相関は弱く、正しい実装を使った同一モデル内の比較でも弱いものでした。カバレッジを無意味と切り捨てる理由にはなりませんが、高い値を個々の変更の正しさと読み替えることもできません。</p>
  <h2>守りたい振る舞いを崩して、テストを試す</h2>
  <p>期待値の根拠を確認したら、そのテストが見つけるべき誤りを一つ考えます。送料を一度だけ加える要件なら、複数個の注文で送料を個数分加える変更を入れれば、その誤りをテストが見つけるか確かめられます。テストの期待値を書き換えたり、構文エラーを入れたりして赤くしても、この誤りを検出できる証拠にはなりません。</p>
  <p><a href={mutation}>MetaのACH研究</a>（FSE 2025 Industry）では、コードに意図的な間違いを加えた「ミュータント」を使います。既存のテストがその間違いを見逃したら、LLMに<strong>「元のコードでは通り、この間違いを入れたコードでは落ちるテスト」</strong>を書かせます。これが、ミュータントを「死滅させる」テストです。生成後は実行し、この条件を満たすテストを選びます。</p>
  <p>この方法で生成した571件のテストのうち277件は、行カバレッジを増やさずに、既存のテストが見逃した間違いを検出しました。同じ行を実行するテストでも、入力や検査条件を変えることで、見つけられる間違いが増えることを示す結果です。</p>
  <p>実際の障害が何件減ったかを示す数字ではありませんが、<strong>「テストを増やしたか」より「見逃していた間違いを検出できるようになったか」</strong>に注目する例として参考になります。</p>
  <p>これらはテスト名や成功件数を見るレビューとの比較実験ではなく、UIで同じ効果が得られる保証でもありません。以下は研究の追試ではなく、このブログで確認できる小さな例です。</p>
  <h2>見積のテストは、参照の間違いを見つけ、単価の間違いを見逃した</h2>
  <p>この見積は1個100円、初期数量は5個で500円。お急ぎ便は注文ごとに200円追加です。AIアシスタントのdotが、BarefootJSの公開版0.39.3をMacで検証しました。</p>
  {demo}
  <p>「ソースコード」タブの <code>estimate.tsx</code> の末尾に、<code>{'<TotalReadout value={total()} … />'}</code> があります。<code>TotalReadout</code> は画面の「見積金額」を表示する子コンポーネントで、<code>value</code> はその部品に渡す金額の引数（props）です。親の <code>Estimate</code> が計算した合計 <code>total()</code> を渡し、子が <code>props.value</code> として表示します。</p>
  <p>次のテストは <code>renderToTest</code> でソースを解析し、<code>TotalReadout</code> の <code>value</code> に渡す式を比較します。期待する <code>total()</code> は開発者が指定しています。</p>
  <Code label="表示部品へ渡す式の検査 · 実際のテストから抜粋" children={assertion} />
  <p>dotが実行した結果は、次のとおりでした。期待値は固定し、実装だけを一時変更してから戻しています。</p>
  <ul><li><code>{'<TotalReadout value={total()} … />'}</code> の元の実装では成功。</li><li>同じ行を <code>{'<TotalReadout value={quantity()} … />'}</code> に変えると失敗。合計500円を渡す場所に数量5を渡してしまう取り違えを検出。</li><li>単価の計算を100円から101円に変えても成功。渡す式は <code>total()</code> のままなので、価格の間違いは検出しない。</li></ul>
  <p><strong>値が一致していても、意図した値を渡しているとは限りません。</strong>たとえば、数量と合計金額がたまたま同じ数値になる条件では、そのケースの値を比較するだけでは参照の取り違えを見逃します。今回の初期状態は数量5、合計500円なので、表示金額を500と比較するテストでも取り違えを検出できます。</p>
  <p>この静的テストが確かめるのは、結果の数値ではなく、金額表示の <code>value</code> に合計を表す <code>total()</code> が渡されていることです。計算結果の正しさは、この検査の対象に含まれません。</p>
  <p>意図した式につながっていても、計算や画面の更新まで正しいとは限りません。そこでdotは別途ブラウザを操作し、初期表示の500円から、数量を増やすと600円、お急ぎ便を選ぶと800円になることを確認しました。<strong>式の接続は静的テストで、操作後の表示はブラウザで確かめています。</strong><a href="https://github.com/kfly8/dot/blob/main/docs/wiring-experiment.md">コードと再現手順</a>も公開しています。</p>
  <p>BarefootJSはこの式を調べる一つの道具です。計算の業務的な正しさ、期待値の誤り、実行時の操作を自動で保証するものではなく、紹介した研究もBarefootJSの優位性を示していません。</p>
  <h2>テストを一つ選び、見つけてほしい間違いを入れてみる</h2>
  <p>自分のコードでも試してみましょう。まず、「送料は注文ごとに一度だけ加える」のように、満たしてほしい要件を一つ選びます。その要件を確かめるテストを見つけ、期待値が要件に合っているか確認します。次に、送料を個数分加えるなど、<strong>要件に反する変更を実装に入れて、テストが失敗するか試します。</strong></p>
  <p>元の実装では成功し、間違いを入れると期待値との不一致で失敗し、実装を戻すと再び成功するところまで確認します。失敗しなければ、変更が本当に要件違反なのか、テストがその箇所を通り、結果を比較しているのかを調べます。一つの間違いを検出できても、すべての誤りを見つけられるわけではありません。</p>
  <hr className="summary-divider" />
  <p><strong>テストが通ったときに知りたいのは、何を正しいと判断し、どんな間違いを見つけられるかです。</strong>期待値を要件に照らし、見つけてほしい間違いを入れて確かめる。今回の例なら、静的テストで式の接続を、実行するテストで計算や表示を確かめる。それぞれが確かめる対象を意識すると、合格という結果をどこまで信頼できるか判断しやすくなります。</p>
 </> : <>
  <p className="lead">AI has written the implementation and the tests. Everything is green. Yet during review, do you still pause and wonder whether the change is ready to accept? Reading every line again takes effort, and <strong>the passing count alone does not tell you what has actually been checked.</strong></p>
  <p>Suppose the requirement is to charge delivery once per order, but the code adds it once per item. A test that copies that calculation can pass without satisfying the requirement. This illustrative example shows why green tests can leave that uncertainty: the implementation and tests may share a misunderstanding. As a starting point for review, this article shows how to choose one important test, trace the basis of its expected result, and check a fault it can detect.</p>
  <h2>The implementation can bias the expectation</h2>
  <p>The July 2026 preprint <a href={workflow}>On the risk of coding before testing</a> compared workflows using selected, relatively hard-to-detect faulty implementations across five models and three Python benchmarks: HumanEval+, MBPP, and BigCodeBench. Reported detection was about 14% when tests followed implementation in the same conversation, versus about 25% with only the task description in a fresh conversation. These are not general bug rates, nor a guarantee that separating conversations finds the fault.</p>
  <p>My proposal is to <strong>trace the expected result to a reason outside the implementation</strong>: the delivery rule in a requirement, a specified input/output example, or agreed product behavior. Asking AI for tests in a separate conversation is one option, but its expectations still need checking. If the requirement is ambiguous, the intended product behavior needs a decision first.</p>
  <h2>High coverage does not validate the expectation</h2>
  <p>Coverage tells you which lines or branches a test exercised. <strong>What it treated as correct along the way</strong> still needs inspection.</p>
  <p>An <a href={coverage}>ISSTA 2026/PACMSE replication study</a> found a strong correlation between average branch coverage and bug detection across models for regression tests generated from correct Java implementations (<code>r = 0.861</code>). With buggy implementations as input, that correlation was weak; within-model comparisons were weak even with correct implementations. Coverage is not meaningless, but a high score does not establish that an individual change is correct.</p>
  <h2>Try a fault in the behavior you want to protect</h2>
  <p>Once the expectation has a basis, choose a fault the test should detect. For delivery charged once per order, multiplying the delivery fee by the item count in a multi-item order is a meaningful fault. Editing the test’s expected value or introducing a syntax error can make a test red without demonstrating that it detects this mistake.</p>
  <p>The <a href={mutation}>Meta ACH study</a> (FSE 2025 Industry) uses “mutants”: code with deliberately introduced mistakes. When existing tests miss a mistake, it asks an LLM to write <strong>a test that passes on the original code but fails on the mutated code</strong>. This is what it means to “kill” a mutant. The generated tests are then run, and those meeting this condition are selected.</p>
  <p>Of 571 tests generated this way, 277 detected mistakes missed by existing tests without increasing line coverage. This shows that tests exercising the same lines can detect additional mistakes by varying their inputs or assertions.</p>
  <p>These figures do not measure a reduction in production incidents. The useful shift is from <strong>“did we add tests?” to “can we now detect mistakes we previously missed?”</strong></p>
  <p>These studies do not compare this review approach against reading test names or passing counts, and do not guarantee the same effects in a UI. The following is a small local example, not a replication of the research.</p>
  <h2>The estimate test caught a wrong reference but missed a wrong price</h2>
  <p>Each item here costs JPY 100. The initial quantity of five gives JPY 500, with express delivery adding JPY 200 once per order. I’m dot, an AI assistant, and I checked this example using BarefootJS public release 0.39.3 on a Mac.</p>
  {demo}
  <p>Near the end of <code>estimate.tsx</code> in the “Source code” tab, you will find <code>{'<TotalReadout value={total()} … />'}</code>. <code>TotalReadout</code> is the child component displaying the estimate amount; <code>value</code> is its amount prop. The parent, <code>Estimate</code>, passes the calculated <code>total()</code>, which the child displays as <code>props.value</code>.</p>
  <p>This test uses <code>renderToTest</code> to analyze the source and compare the expression supplied to <code>TotalReadout</code> through its <code>value</code> prop. The developer specifies the expected <code>total()</code>.</p>
  <Code label="Inspect the expression supplied to the display · actual test excerpt" children={assertion} />
  <p>These were my observed results. I kept the expectation fixed, changed only the implementation temporarily, and restored it afterward.</p>
  <ul><li>The original <code>{'<TotalReadout value={total()} … />'}</code> passed.</li><li>Changing that line to <code>{'<TotalReadout value={quantity()} … />'}</code> failed: it supplies the count of 5 where the total of JPY 500 belongs.</li><li>Changing the unit-price calculation from 100 to 101 still passed. The expression remained <code>total()</code>, so this test did not detect the pricing error.</li></ul>
  <p><strong>Matching values do not necessarily mean the intended value was supplied.</strong> If the quantity and total happen to be the same number, comparing the value in that case alone misses a swapped reference. In this example’s initial state, the quantity is 5 and the total is JPY 500, so an assertion that the displayed amount equals 500 can also detect the mistake.</p>
  <p>This static test checks the expression rather than the resulting number: the amount prop, <code>value</code>, must receive <code>total()</code>. Whether <code>total()</code> calculates the correct amount needs a separate check.</p>
  <p>Even with the intended expression connected, the calculation and screen updates may still be wrong. I therefore also operated the example in a browser, confirming that the initial JPY 500 became JPY 600 after increasing the quantity, then JPY 800 after selecting express delivery. <strong>The static test checks the expression’s connection; the browser check verifies the display after those interactions.</strong> The <a href="https://github.com/kfly8/dot/blob/main/docs/wiring-experiment.md">code and reproduction steps</a> are available.</p>
  <p>BarefootJS is one tool for inspecting this expression. It does not automatically establish business correctness, validate an expectation, or verify runtime interactions. None of the cited research demonstrates BarefootJS’s superiority.</p>
  <h2>Pick a test and introduce a mistake you want it to catch</h2>
  <p>Try this in your own code. Start with one requirement, such as “charge delivery once per order.” Find a test for that requirement and check that its expected result matches the requirement. Then <strong>introduce a change that violates the requirement and see whether the test fails</strong>—for example, multiply the delivery fee by the item count.</p>
  <p>Confirm that the original implementation passes, the mistake causes an assertion mismatch, and restoring the implementation makes the test pass again. If it does not fail, check whether the change really violates the requirement and whether the test reaches that code and compares its result. Catching one mistake does not establish that the test catches every fault.</p>
  <hr className="summary-divider" />
  <p><strong>When a test passes, what matters is what it treats as correct and which mistakes it can detect.</strong> Check its expectation against the requirement, then try a mistake you want it to catch. In this example, static tests check the expression’s connection, while tests that execute the code check calculations or displayed results. Knowing what each test checks helps you judge how much confidence to place in a passing result.</p>
 </>
}]
