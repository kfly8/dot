'use client'
import { createSignal, createMemo } from '@barefootjs/client'
import { TotalReadout } from './total-readout'
export function Estimate(props: { en?: boolean }) {
  const [quantity, setQuantity] = createSignal(5)
  const [express, setExpress] = createSignal(false)
  const total = createMemo(() => quantity() * 100 + (express() ? 200 : 0))
  return <div className="estimate">
    <label for="quantity">{props.en ? 'Quantity · JPY 100 each' : '数量 · 1個 100円'}</label>
    <div className="stepper">
      <button type="button" aria-label={props.en ? 'Decrease quantity' : '数量を減らす'} disabled={quantity() <= 1} onClick={() => setQuantity(q => Math.max(1, q - 1))}>−</button>
      <output id="quantity">{quantity()}</output>
      <button type="button" aria-label={props.en ? 'Increase quantity' : '数量を増やす'} disabled={quantity() >= 99} onClick={() => setQuantity(q => Math.min(99, q + 1))}>＋</button>
    </div>
    <label className="option"><input type="checkbox" checked={express()} onChange={e => setExpress(e.target.checked)} />{props.en ? 'Express · add JPY 200' : 'お急ぎ便 · ＋200円'}</label>
    <TotalReadout value={total()} label={props.en ? 'Estimate' : '見積金額'} />
  </div>
}
