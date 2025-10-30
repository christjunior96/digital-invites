-- Entfernt QuestionOption.value und fügt GuestAnswer.personIndex hinzu

-- Safe default für neue Spalte, bestehende Datensätze werden mit 1 belegt
ALTER TABLE "GuestAnswer"
ADD COLUMN "personIndex" INTEGER NOT NULL DEFAULT 1;

-- Entferne nicht mehr benötigte Spalte value
ALTER TABLE "QuestionOption"
DROP COLUMN "value";


