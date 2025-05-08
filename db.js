// db.js

// Replace with real DB access
const users = [
  { id: 1, wallet_id: "wallet_001" },
  { id: 2, wallet_id: "wallet_002" },
];

const walletTransactions = {
  1: ["txn_1a", "txn_1b"],
  2: ["txn_2a"],
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
