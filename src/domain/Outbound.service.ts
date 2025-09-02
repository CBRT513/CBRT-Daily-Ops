export type OutboundStatus = 'PENDING' | 'LOADED' | 'SHIPPED'

export type ReleaseLine = {
  itemCode: string
  sizeName: string
  standardWeight: number
  qtyRequested: number
}

export type ReleaseSnapshot = {
  releaseNo: string
  lines: ReleaseLine[]
}

export type InventoryBulk = {
  masterBarcode: string
  itemCode: string
  sizeName: string
  standardWeight: number
  qtyOnHand: number
  qtyReserved: number
}

export type QueueSackInput = {
  release: ReleaseSnapshot
  inventory: InventoryBulk
  masterBarcode: string
  qty?: number
}

export type QueueSackResult = {
  ok: true
  doc: {
    releaseNo: string
    masterBarcode: string
    itemCode: string
    sizeName: string
    standardWeight: number
    qty: number
    outboundStatus: OutboundStatus
    // idempotency key prevents dupes per release+barcode within a short window
    idemKey: string
  }
} | {
  ok: false
  error: 'NOT_ON_RELEASE' | 'INSUFFICIENT_QTY' | 'MISMATCH_ATTRS' | 'INVALID_QTY'
  detail?: string
}

/**
 * Validate a supersack scan (master barcode) against a selected release.
 * Returns an append-only row to be written by the data adapter.
 * Pure function: no I/O, no SDKs.
 */
export function queueSack(input: QueueSackInput): QueueSackResult {
  const qty = input.qty ?? 1
  if (!Number.isFinite(qty) || qty <= 0) {
    return { ok: false, error: 'INVALID_QTY', detail: 'qty must be a positive number' }
  }

  const line = input.release.lines.find(l =>
    l.itemCode === input.inventory.itemCode &&
    l.sizeName === input.inventory.sizeName &&
    l.standardWeight === input.inventory.standardWeight
  )
  if (!line) {
    return { ok: false, error: 'NOT_ON_RELEASE' }
  }

  // basic attribute consistency check (guard against mis-labeled inventory)
  if (line.itemCode !== input.inventory.itemCode || line.sizeName !== input.inventory.sizeName) {
    return { ok: false, error: 'MISMATCH_ATTRS' }
  }

  const available = input.inventory.qtyOnHand - input.inventory.qtyReserved
  if (qty > available) {
    return { ok: false, error: 'INSUFFICIENT_QTY', detail: `available=${available}` }
  }

  const idemKey = `${input.release.releaseNo}:${input.masterBarcode}`
  return {
    ok: true,
    doc: {
      releaseNo: input.release.releaseNo,
      masterBarcode: input.masterBarcode,
      itemCode: input.inventory.itemCode,
      sizeName: input.inventory.sizeName,
      standardWeight: input.inventory.standardWeight,
      qty,
      outboundStatus: 'PENDING',
      idemKey
    }
  }
}
