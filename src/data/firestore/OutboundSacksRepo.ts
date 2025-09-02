import { collection, addDoc, serverTimestamp, getFirestore, connectFirestoreEmulator } from 'firebase/firestore'
import { app } from '../../config/firebase'
import type { QueueSackResult } from '../../domain/Outbound.service'

const db = getFirestore(app)

// Optional: connect to emulator if env is set (prevents accidental prod writes)
if (import.meta.env.VITE_USE_EMULATOR === 'true') {
  connectFirestoreEmulator(db, '127.0.0.1', 8080)
}

/** Append-only repo for outbound sacks. */
export async function addOutboundSack(res: QueueSackResult) {
  if (!res.ok) throw new Error(`Invalid queueSack result: ${res.error}`)
  const doc = res.doc
  await addDoc(collection(db, 'outbound_sacks'), { ...doc, ts: serverTimestamp() })
}
