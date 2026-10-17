import cron from "node-cron";
import { catchAsyncError } from "../middlewares/errorHandler.js";
import * as bookingService from "../services/bookingService.js";

cron.schedule(
  "*/30 * * * *",
  catchAsyncError(async () => {
    const updatedTime = new Date();
    const check = await bookingService.checkStatus(updatedTime);
    console.log(check);
    if (check.length === 0) {
        return;
    };

    for (const trx of check) {
      await bookingService.updateDoneStatus(trx.id);
    }
    console.log(`[CRON] berhasil memproses ${check.length} notifikasi!`);
  }),
  {
    timezone: 'Asia/Jakarta',
    name: 'daily-status-update',
    noOverlap: true,
    maxRandomDelay: 30000
  },
);
