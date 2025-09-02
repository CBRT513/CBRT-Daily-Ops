export type OutboundRow = {
  releaseNo: string
  masterBarcode: string
  itemCode: string
  sizeName: string
  standardWeight: number
  qty: number
  outboundStatus: 'PENDING' | 'LOADED' | 'SHIPPED'
}

export type BolDetailDraft = {
  itemCode: string
  sizeName: string
  standardWeight: number
  qty: number
  lineWeight: number
}

export type BolHeaderDraft = {
  releaseNo: string
  totalQty: number
  totalWeight: number
}

export function assembleSupersacksBol(releaseNo: string, rows: OutboundRow[]) {
  // ignore already-shipped rows; assemble only PENDING/LOADED
  const usable = rows.filter(r => r.releaseNo === releaseNo && r.outboundStatus !== 'SHIPPED')

  const map = new Map<string, BolDetailDraft>()
  for (const r of usable) {
    const key = `${r.itemCode}|${r.sizeName}|${r.standardWeight}`
    const prev = map.get(key)
    if (prev) {
      prev.qty += r.qty
      prev.lineWeight = prev.qty * prev.standardWeight
    } else {
      map.set(key, {
        itemCode: r.itemCode,
        sizeName: r.sizeName,
        standardWeight: r.standardWeight,
        qty: r.qty,
        lineWeight: r.qty * r.standardWeight
      })
    }
  }

  const details = Array.from(map.values())
  const totalQty = details.reduce((a, d) => a + d.qty, 0)
  const totalWeight = details.reduce((a, d) => a + d.lineWeight, 0)

  const header: BolHeaderDraft = { releaseNo, totalQty, totalWeight }
  return { header, details }
}
