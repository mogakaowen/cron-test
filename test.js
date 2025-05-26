import dotenv from "dotenv";

dotenv.config();

const BASE_URL = "http://localhost:8000/search";
const secrets = {
    APP_NAME: process.env.APP_NAME,
    DEPLOY_REGION: process.env.DEPLOY_REGION,
    DEV_API_KEY: process.env.DEV_API_KEY
}

console.log("Secrets", secrets)


// async function simulate() {
//     const userIds = ["userA", "userB", "userC", "userD", "userE"];
//     // "userF", "userG", "userH", "userI", "userJ", "userK"];

//     const requests = userIds.map(async (userId) => {
//         try {
//             const res = await fetch(`${BASE_URL}?userId=${userId}`);
//             const json = await res.json();
//             console.log(`✅ User ${userId} request success:`, json);
//         } catch (err) {
//             console.error(`❌ User ${userId} request failed:`, err.message);
//         }
//     });

//     await Promise.all(requests);
// }

// simulate();
