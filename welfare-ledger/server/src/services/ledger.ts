import { LedgerEntry } from '../models/LedgerEntry.ts';
import { sha256, canonical } from '../crypto/signatures.ts';

export const appendLedgerEntry = async (payload: any, actorId: string, actorSignature: string) => {
  const lastEntry = await LedgerEntry.findOne().sort({ index: -1 });
  const index = (lastEntry?.index || 0) + 1;
  const prevHash = lastEntry?.entryHash || 'GENESIS';
  const payloadHash = sha256(canonical(payload));
  const entryHash = sha256(prevHash + payloadHash);

  const ledgerEntry = new LedgerEntry({
    index,
    prevHash,
    payload,
    payloadHash,
    entryHash,
    actorId,
    actorSignature,
    createdAt: new Date()
  });

  await ledgerEntry.save();
  return { recordId: ledgerEntry._id, payloadHash, ledgerIndex: index, entryHash };
};

export const verifyChainIntegrity = async (): Promise<boolean> => {
  const entries = await LedgerEntry.find().sort({ index: 1 });
  let prevHash = 'GENESIS';

  for (const entry of entries) {
    const expectedHash = sha256(prevHash + entry.payloadHash);
    if (expectedHash !== entry.entryHash) return false;
    prevHash = entry.entryHash;
  }

  return true;
};

export const getHeadHash = async (): Promise<string> => {
  const lastEntry = await LedgerEntry.findOne().sort({ index: -1 });
  return lastEntry?.entryHash || 'GENESIS';
};
