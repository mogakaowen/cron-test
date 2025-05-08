// syncWallet.js
import {
  getUserById,
  getLocalTransactions,
  fetchFromIntaSend,
  insertTransaction,
} from "./db.js";

export const syncUserWalletTransactions = async (userId) => {
  console.log("Sync wallet started: userId =>", userId);
  const user = await getUserById(userId);
  if (!user) {
    console.error(`User with ID ${userId} not found.`);
    return;
  }

  // Fetch local and IntaSend transactions
  const localTxns = await getLocalTransactions(user.id);
  const intasendTxns = await fetchFromIntaSend(user.wallet_id);

  // Create a set of local transaction references
  const localRefs = new Set(localTxns.map((t) => t.external_reference));

  // Identify missing transactions (present in IntaSend, but not in the local store)
  const missing = intasendTxns.filter(
    (t) => !localRefs.has(t.external_reference)
  );

  if (missing.length > 0) {
    console.log(
      `Found ${missing.length} missing transactions for user ${userId}.`
    );

    // Insert missing transactions into the local store
    for (const txn of missing) {
      await insertTransaction(user.id, txn);
    }

    console.log(
      `Inserted ${missing.length} missing transactions for user ${userId}.`
    );
  } else {
    console.log(`No missing transactions for user ${userId}.`);
  }
};
