/**
 * npm run retention
 * Runs the deletion job once (the same code the daily Inngest cron runs): order data and recordings at 30 days,
 * photos at 7, consent records at 4 years, delivery log at 13 months. Prints what it removed.
 */
import { createEngine } from "@lumen/calls";

createEngine()
  .retention.run()
  .then((report) => console.log(JSON.stringify(report, null, 2)))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
