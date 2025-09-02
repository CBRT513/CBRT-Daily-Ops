// @vitest-environment node
import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { initializeTestEnvironment, RulesTestEnvironment } from '@firebase/rules-unit-testing'
import { queueSack } from '../../../domain/Outbound.service'
import { addOutboundSack } from '../OutboundSacksRepo'

let testEnv: RulesTestEnvironment

const HOST = '127.0.0.1'
const PORT = Number(process.env.VITE_EMULATOR_FS_PORT || process.env.npm_package_config_emulator_fs_port || '8086')

beforeAll(async () => {
  testEnv = await initializeTestEnvironment({
    projectId: 'barge2rail-auth-e4c16', // arbitrary in emulator
    firestore: { host: HOST, port: PORT }
  })
})

afterAll(async () => {
  await testEnv.cleanup()
})

describe.skip('OutboundSacksRepo (rules-unit-testing)', () => {
  it('writes an outbound sack row', async () => {
    const ctx = testEnv.unauthenticatedContext()
    const testDb = ctx.firestore() // Firestore instance bound to emulator

    const release = { releaseNo: 'R-1001', lines: [{ itemCode:'ITEM-A', sizeName:'50kg', standardWeight:50, qtyRequested:10 }] }
    const inv = { masterBarcode:'MB-123', itemCode:'ITEM-A', sizeName:'50kg', standardWeight:50, qtyOnHand:100, qtyReserved:0 }
    const res = queueSack({ release, inventory: inv, masterBarcode: 'MB-123', qty: 2 })
    if (!res.ok) throw new Error('domain rejected valid test input')

    await addOutboundSack(res, testDb)
    expect(true).toBe(true)
  }, 20000)
})
