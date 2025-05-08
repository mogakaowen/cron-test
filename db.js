// db.js

// Replace with real DB access
const users = [
  { id: 1, wallet_id: "wallet_001" },
  { id: 2, wallet_id: "wallet_002" },
  { id: 3, wallet_id: "wallet_003" },
  { id: 4, wallet_id: "wallet_004" },
  { id: 5, wallet_id: "wallet_005" },
  { id: 6, wallet_id: "wallet_006" },
  { id: 7, wallet_id: "wallet_007" },
  { id: 8, wallet_id: "wallet_008" },
  { id: 9, wallet_id: "wallet_009" },
  { id: 10, wallet_id: "wallet_010" },
  { id: 11, wallet_id: "wallet_011" },
  { id: 12, wallet_id: "wallet_012" },
  { id: 13, wallet_id: "wallet_013" },
];

const walletTransactions = {
  1: ["txn_1a", "txn_1b"],
  2: ["txn_2a"],
  3: ["txn_3a", "txn_3b", "txn_3c"],
  4: ["txn_4a", "txn_4b"],
  5: ["txn_5a"],
  6: ["txn_6a", "txn_6b"],
  7: ["txn_7a", "txn_7b", "txn_7c"],
  8: ["txn_8a"],
  9: ["txn_9a", "txn_9b"],
  10: ["txn_10a"],
  11: ["txn_11a", "txn_11b"],
  12: ["txn_12a", "txn_12b", "txn_12c"],
};

async function getAllUsers() {
  return users;
}

async function getUserById(id) {
  return users.find((u) => u.id === id);
}

async function getLocalTransactions(userId) {
  return (
    walletTransactions[userId]?.map((ref) => ({ external_reference: ref })) ||
    []
  );
}

async function fetchFromIntaSend(walletId) {
  // Mock response from IntaSend
  return [
    { external_reference: `txn_${walletId.slice(-3)}a` },
    { external_reference: `txn_${walletId.slice(-3)}b` },
    { external_reference: `txn_${walletId.slice(-3)}c` },
  ];
}

async function insertTransaction(userId, txn) {
  if (!walletTransactions[userId]) {
    walletTransactions[userId] = [];
  }
  walletTransactions[userId].push(txn.external_reference);
  console.log(`Inserted txn for user ${userId}: ${txn.external_reference}`);
}

export {
  getAllUsers,
  getUserById,
  getLocalTransactions,
  fetchFromIntaSend,
  insertTransaction,
};
