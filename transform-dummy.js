import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// __dirname Äquivalent für ES-Module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Pfad zur JSON-Datei
const filePath = path.join(__dirname, 'src', 'dummy_files_gemini.json');

// JSON-Datei einlesen
const rawData = fs.readFileSync(filePath, 'utf8');
const files = JSON.parse(rawData);

// Transformationsfunktion
function transformFiles(files) {
    return files.map(file => {
        // Topic von string zu string[] konvertieren
        const transformedFile = {
            ...file,
            topic: Array.isArray(file.topic) ? file.topic : [file.topic],
            tasks: file.tasks.map(task => {
                // Enum-Werte in Großbuchstaben umwandeln
                const transformedTask = {
                    ...task,
                    subject: task.subject.toUpperCase().replace(/ /g, '_'),
                    type: task.type.toUpperCase()
                };
                return transformedTask;
            })
        };
        return transformedFile;
    });
}

// Transformation durchführen
const transformedFiles = transformFiles(files);

// Zurück in JSON-Datei schreiben
fs.writeFileSync(filePath, JSON.stringify(transformedFiles, null, 2), 'utf8');

console.log('✅ Dummy-Datei erfolgreich aktualisiert!');
console.log('- Subjects und Types wurden zu Enums konvertiert');
console.log('- Topic wurde zu string[] konvertiert');
