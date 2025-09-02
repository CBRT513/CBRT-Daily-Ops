import { describe, it, expect } from 'vitest'
import { queueSack, type ReleaseSnapshot, type InventoryBulk } from '../Outbound.service'

const baseRelease: ReleaseSnapshot = {
  releaseNo: 'R-1001',
  lines: [
    { itemCode: 'ITEM-A', sizeName: '50kg', standardWeight: 50, qtyRequested: 100 },
    { itemCode: 'ITEM-B', sizeName: '25kg', standardWeight: 25, qtyRequested: 50 }
  ]
}

const invA: InventoryBulk = {
  masterBarcode: 'MB-AAA',
  itemCode: 'ITEM-A',
  sizeName: '50kg',
  standardWeight: 50,
  qtyOnHand: 500,
  qtyReserved: 0
}

describe('queueSack (supersacks)', () => {
  it('accepts a valid scan and returns an append-only row', () => {
    const res = queueSack({ release: baseRelease, inventory: invA, masterBarcode: invA.masterBarcode, qty: 3 })
    expect(res.ok).toBe(true)
    if (res.ok) {
      expect(res.doc.releaseNo).toBe('R-1001')
      expect(res.doc.itemCode).toBe('ITEM-A')
      expect(res.doc.qty).toBe(3)
      expect(res.doc.outboundStatus).toBe('PENDING')
      expect(res.doc.idemKey).toBe('R-1001:MB-AAA')
    }
  })

  it('rejects when item/size is not on the release', () => {
    const badInv = { ...invA, itemCode: 'ITEM-Z' }
    const res = queueSack({ release: baseRelease, inventory: badInv, masterBarcode: 'X' })
    expect(res.ok).toBe(false)
    if (!res.ok) expect(res.error).toBe('NOT_ON_RELEASE')
  })

  it('rejects when qty exceeds available (onHand - reserved)', () => {
    const scarce = { ...invA, qtyOnHand: 5, qtyReserved: 3 }
    const res = queueSack({ release: baseRelease, inventory: scarce, masterBarcode: 'X', qty: 3 })
    expect(res.ok).toBe(false)
    if (!res.ok) {
      expect(res.error).toBe('INSUFFICIENT_QTY')
      expect(res.detail).toContain('available=2')
    }
  })

  it('rejects invalid qty values', () => {
    const res = queueSack({ release: baseRelease, inventory: invA, masterBarcode: 'X', qty: 0 })
    expect(res.ok).toBe(false)
    if (!res.ok) expect(res.error).toBe('INVALID_QTY')
  })
})
