// ============================================================================
// Additional Notes
// ============================================================================

/*
This backend provides:

1. User Authentication & RBAC
   - Login/register with role-based access
   - JWT tokens for API authentication
   - Admin, citizen, enterprise roles supported

2. Labour Event Management
   - Start/end shift with nonce-based anti-replay
   - Cryptographic signature verification
   - Automatic wage-credit calculation (L1:$5.5, L2:$7.5, L3:$10.5/hr)
   - Ledger anchoring for tamper-evidence

3. Budget Planning (Admin)
   - Create and publish budgets by category
   - View labour analytics (hours, wages, workers)
   - Integrity verification tools

4. Enterprise Reporting
   - Accept signed production/revenue reports
   - Receipt generation for audit trails

5. Data Transparency
   - Public read-only endpoints for foreign consumers
   - Aggregated statistics visible to authorized roles

6. Hash-Chain Ledger
   - Immutable append-only log of all events
   - SHA-256 chaining prevents tampering
   - Verification tools confirm integrity

To run this backend:
1. npm install
2. Create .env with MONGODB_URI and JWT_SECRET
3. npm run dev (runs on port 3001)

To test endpoints, use curl or Postman with Bearer tokens.
*/