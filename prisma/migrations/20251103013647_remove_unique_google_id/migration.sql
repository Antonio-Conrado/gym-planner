-- DropIndex
DROP INDEX "public"."Payment_id_userId_idx";

-- DropIndex
DROP INDEX "public"."User_email_slug_id_idx";

-- DropIndex
DROP INDEX "public"."User_googleId_key";

-- CreateIndex
CREATE INDEX "ClientTrainerPlan_trainerId_clientId_idx" ON "ClientTrainerPlan"("trainerId", "clientId");

-- CreateIndex
CREATE INDEX "Notification_userId_type_idx" ON "Notification"("userId", "type");

-- CreateIndex
CREATE INDEX "Payment_userId_startDate_endDate_status_idx" ON "Payment"("userId", "startDate", "endDate", "status");

-- CreateIndex
CREATE INDEX "Payment_paidAt_idx" ON "Payment"("paidAt");

-- CreateIndex
CREATE INDEX "ProgressPhoto_userProgressId_idx" ON "ProgressPhoto"("userProgressId");

-- CreateIndex
CREATE INDEX "ReservationHistory_reservationId_idx" ON "ReservationHistory"("reservationId");

-- CreateIndex
CREATE INDEX "Routine_trainerId_userProgressId_idx" ON "Routine"("trainerId", "userProgressId");

-- CreateIndex
CREATE INDEX "RoutineExercise_routineId_idx" ON "RoutineExercise"("routineId");

-- CreateIndex
CREATE INDEX "RoutineLog_routineId_idx" ON "RoutineLog"("routineId");

-- CreateIndex
CREATE INDEX "Schedule_trainerId_idx" ON "Schedule"("trainerId");

-- CreateIndex
CREATE INDEX "Trainer_userId_idx" ON "Trainer"("userId");

-- CreateIndex
CREATE INDEX "TrainerReview_trainerId_clientId_idx" ON "TrainerReview"("trainerId", "clientId");

-- CreateIndex
CREATE INDEX "UserProgress_userId_idx" ON "UserProgress"("userId");

-- CreateIndex
CREATE INDEX "UserProgressHistory_userProgressId_idx" ON "UserProgressHistory"("userProgressId");
