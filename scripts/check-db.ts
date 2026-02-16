import { db } from '../src/lib/db';

async function main() {
  try {
    console.log("Connecting to DB...");
    const workspaceCount = await db.workspace.count();
    console.log("Workspace count:", workspaceCount);
  } catch (err) {
    console.error("DB Error:", err);
  } finally {
    process.exit();
  }
}

main();
