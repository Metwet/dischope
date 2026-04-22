ALTER TABLE "tasks"
ADD COLUMN "sortOrder" INTEGER NOT NULL DEFAULT 0;

WITH ranked_tasks AS (
  SELECT
    "id",
    ROW_NUMBER() OVER (
      PARTITION BY
        "userId",
        DATE(COALESCE("plannedAt", "createdAt"))
      ORDER BY
        COALESCE("plannedAt", "createdAt") ASC,
        "createdAt" ASC,
        "id" ASC
    ) - 1 AS row_index
  FROM "tasks"
)
UPDATE "tasks"
SET "sortOrder" = ranked_tasks.row_index
FROM ranked_tasks
WHERE "tasks"."id" = ranked_tasks."id";

CREATE INDEX "tasks_userId_plannedAt_sortOrder_idx"
ON "tasks"("userId", "plannedAt", "sortOrder");
