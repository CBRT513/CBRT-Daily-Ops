import { describe, it, expect } from 'vitest'
import { assembleSupersacksBol, type OutboundRow } from '../BolAssemble.service'

const rows: OutboundRow[] = [
  { releaseNo: 'R-1001', masterBarcode: 'MB-1', itemCode: 'ITEM-A', sizeName: '50kg', standardWeight: 50, qty: 3, outboundStatus: 'PENDING' },
  { releaseNo: 'R-1001', masterBarcode: 'MB-1', itemCode: 'ITEM-A', sizeName: '50kg', standardWeight: 50, qty: 2, outboundStatus: 'LOADED' },
  { releaseNo: 'R-1001', masterBarcode: 'MB-9', itemCode: 'ITEM-B', sizeName: '25kg', standardWeight: 25, qty: 4, outboundStatus: 'PENDING' },
  { releaseNo: 'R-1001', masterBarcode: 'MB-9', itemCode: 'ITEM-B', sizeName: '25kg', standardWeight: 25, qty: 1, outboundStatus: 'SHIPPED' }, // ignored
  { releaseNo: 'R-9999', masterBarcode: 'MB-X', itemCode: 'ITEM-A', sizeName: '50kg', standardWeight: 50, qty: 10, outboundStatus: 'PENDING' } // other release
]

describe('assembleSupersacksBol', () => {
  it('groups by item/size/weight and computes totals', () => {
    const { header, details } = assembleSupersacksBol('R-1001', rows)
    // Details
    expect(details.length).toBe(2)
    const a = details.find(d => d.itemCode==='ITEM-A')!
    const b = details.find(d => d.itemCode==='ITEM-B')!
    expect(a.qty).toBe(5)                   // 3 + 2
    expect(a.lineWeight).toBe(5 * 50)       // 250
    expect(b.qty).toBe(4)                   // shipped row ignored
    expect(b.lineWeight).toBe(4 * 25)       // 100
    // Header totals
    expect(header.totalQty).toBe(9)
    expect(header.totalWeight).toBe(350)
  })
})
