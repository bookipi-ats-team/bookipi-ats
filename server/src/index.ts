import type { Server } from "http";
import app from "./app.js";
import env from "./config/env.js";
import {
  connectToDatabase,
  disconnectFromDatabase,
} from "./config/database.js";
import { startResumeParsingWorker } from "./services/resumeProcessing.js";

let server: Server | null = null;
let isShuttingDown = false;

const startServer = async (): Promise<void> => {
  try {
    await connectToDatabase();
    await startResumeParsingWorker();

    server = app.listen(env.port, () => {
      console.log(`API listening on port ${env.port} (${env.nodeEnv})`);
    });
  } catch (error) {
    console.error("Failed to start server", error);

    try {
      const disconnected = await disconnectFromDatabase();

      if (disconnected) {
        console.log("MongoDB connection closed");
      }
    } catch (disconnectError) {
      console.error(
        "Error closing MongoDB connection after startup failure",
        disconnectError,
      );
    }

    process.exit(1);
  }
};

void startServer();

const shutdown = async (exitCode: number, reason: string): Promise<void> => {
  if (isShuttingDown) {
    return;
  }

  isShuttingDown = true;
  console.log(`Shutting down (${reason})`);

  try {
    if (server) {
      await new Promise<void>((resolve, reject) => {
        server?.close((error) => {
          if (error) {
            reject(error);
          } else {
            resolve();
          }
        });
      });

      server = null;
      console.log("HTTP server closed");
    }

    const disconnected = await disconnectFromDatabase();

    if (disconnected) {
      console.log("MongoDB connection closed");
    }
  } catch (error) {
    console.error("Error during shutdown", error);
    exitCode = exitCode === 0 ? 1 : exitCode;
  } finally {
    process.exit(exitCode);
  }
};

const signals: NodeJS.Signals[] = ["SIGINT", "SIGTERM"];

signals.forEach((signal) => {
  process.on(signal, () => {
    void shutdown(0, signal);
  });
});

process.on("uncaughtException", (error) => {
  console.error("Uncaught exception detected", error);
  void shutdown(1, "uncaughtException");
});

process.on("unhandledRejection", (reason) => {
  console.error("Unhandled promise rejection detected", reason);
  void shutdown(1, "unhandledRejection");
});
