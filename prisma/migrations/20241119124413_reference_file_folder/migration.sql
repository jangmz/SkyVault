-- AlterTable
ALTER TABLE "File" ADD COLUMN     "folderID" INTEGER;

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_folderID_fkey" FOREIGN KEY ("folderID") REFERENCES "Folder"("id") ON DELETE SET NULL ON UPDATE CASCADE;
