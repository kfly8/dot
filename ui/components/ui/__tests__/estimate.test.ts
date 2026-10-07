import { expect, test } from 'bun:test'
import { readFileSync } from 'node:fs'
import { renderToTest } from '@barefootjs/test'
const path = 'ui/components/ui/estimate.tsx'
const result = renderToTest(readFileSync(path, 'utf8'), path)
test('estimate wires its controls and total to reactive state', () => {
  expect(result.errors).toEqual([])
  expect(result.signals).toEqual(['quantity', 'express'])
  expect(result.memos).toEqual(['total'])
  for (const button of result.findAll({ tag: 'button' })) {
    expect(button.onClick?.setters).toEqual(['setQuantity'])
  }
  expect(result.findAll({ tag: 'button' })).toHaveLength(2)
  expect(result.find({ tag: 'input' })?.onChange?.setters).toEqual(['setExpress'])
  expect(result.find({ componentName: 'TotalReadout' })?.props.value).toBe('total()')
})
test('child renders its value prop', () => {
  const path = 'ui/components/ui/total-readout.tsx'
  const child = renderToTest(readFileSync(path, 'utf8'), path)
  expect(child.errors).toEqual([])
  expect(child.findByText('props.value')?.reactive).toBe(true)
})
