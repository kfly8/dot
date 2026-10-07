'use client'
import { createSignal } from '@barefootjs/client'
import { Estimate } from './estimate'

export function EstimateExample(props: { en: boolean; estimateSource: string; readoutSource: string }) {
  const [source, setSource] = createSignal(false)
  function moveTab(event: KeyboardEvent) {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return
    event.preventDefault()
    const next = event.key === 'Home' ? false : event.key === 'End' ? true : !source()
    setSource(next)
    document.getElementById(next ? 'estimate-source-tab' : 'estimate-preview-tab')?.focus()
  }
  return <div className="estimate-example">
    <div role="tablist" aria-label={props.en ? 'Estimate example' : '見積もりの例'} className="example-tabs">
      <button id="estimate-preview-tab" type="button" role="tab" aria-controls="estimate-preview" aria-selected={!source()} tabindex={source() ? -1 : 0} onClick={() => setSource(false)} onKeyDown={moveTab}>{props.en ? 'UI' : '動く例'}</button>
      <button id="estimate-source-tab" type="button" role="tab" aria-controls="estimate-source" aria-selected={source()} tabindex={source() ? 0 : -1} onClick={() => setSource(true)} onKeyDown={moveTab}>{props.en ? 'Source code' : 'ソースコード'}</button>
    </div>
    <div id="estimate-preview" role="tabpanel" aria-labelledby="estimate-preview-tab" hidden={source()} tabindex={0}>
      <Estimate en={props.en} />
    </div>
    <div id="estimate-source" role="tabpanel" aria-labelledby="estimate-source-tab" hidden={!source()} tabindex={0}>
      <figure className="code"><figcaption>estimate.tsx</figcaption><pre tabindex={0}><code>{props.estimateSource}</code></pre></figure>
      <figure className="code"><figcaption>total-readout.tsx</figcaption><pre tabindex={0}><code>{props.readoutSource}</code></pre></figure>
    </div>
  </div>
}
