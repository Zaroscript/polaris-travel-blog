import { connectDB } from "../lib/db.js";
import { exec } from "child_process";
import { promisify } from "util";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

dotenv.config();

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const execPromise = promisify(exec);

const runSeed = async (seedFile) => {
  try {
    console.log(`Running ${seedFile}...`);
    const { stdout, stderr } = await execPromise(`node ${path.join(__dirname, seedFile)}`);
    if (stderr) {
      console.error(`Error in ${seedFile}:`, stderr);
    } else {
      console.log(`${seedFile} completed:`, stdout);
    }
    return stdout;
  } catch (error) {
    console.error(`Failed to run ${seedFile}:`, error);
    throw error;
  }
};

const seedAll = async () => {
  try {
    // Make sure we're connected to the database
    await connectDB();
    console.log("Connected to MongoDB");

    // Run seed files in order (users first, then destinations, then posts)
    // await runSeed("user.seed.js");
    await runSeed("destinations.seed.js");
    await runSeed("posts.seed.js");

    console.log("✅ All seed files executed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
};

seedAll();
