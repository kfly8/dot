'use client'
export function TotalReadout(props: { value: number; label: string }) {
  return <p className="total" aria-live="polite"><span>{props.label}</span><strong>{props.value}</strong><span>JPY</span></p>
}
