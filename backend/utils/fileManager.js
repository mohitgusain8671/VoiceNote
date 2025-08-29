import fs from 'fs';
import path from 'path';

class FileManager {
    constructor() {
        this.uploadsDir = 'uploads/audio';
    }
    deleteAudioFile(filePath) {
        try {
            if (filePath && fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error deleting file:', error);
            return false;
        }
    }
    getFileInfo(filePath) {
        try {
            if (filePath && fs.existsSync(filePath)) {
                const stats = fs.statSync(filePath);
                return {
                    exists: true,
                    size: stats.size,
                    created: stats.birthtime,
                    modified: stats.mtime
                };
            }
            return { exists: false };
        } catch (error) {
            console.error('Error getting file info:', error);
            return { exists: false };
        }
    }
    // Generate file URL for serving
    getFileUrl(filePath, serverUrl) {
        if (!filePath) return null;
        const relativePath = filePath.replace(/\\/g, '/');
        return `${serverUrl}/${relativePath}`;
    }
    validateFile(filePath) {
        return filePath && fs.existsSync(filePath);
    }
    // Clean up orphaned files (files not referenced in database)
    async cleanupOrphanedFiles(Note) {
        try {
            const files = fs.readdirSync(this.uploadsDir);
            const notes = await Note.find({ filePath: { $ne: null } }, 'filePath');
            const dbFilePaths = notes.map(note => note.filePath);
            
            let deletedCount = 0;
            
            for (const file of files) {
                const fullPath = path.join(this.uploadsDir, file);
                const isReferenced = dbFilePaths.some(dbPath => 
                    dbPath && dbPath.includes(file)
                );
                if (!isReferenced) {
                    this.deleteAudioFile(fullPath);
                    deletedCount++;
                }
            }
            return { deletedCount };
        } catch (error) {
            console.error('Error cleaning up orphaned files:', error);
            return { deletedCount: 0, error: error.message };
        }
    }
}

export default new FileManager();