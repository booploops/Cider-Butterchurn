import AdmZip from 'adm-zip';
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

(async () => {

    const { identifier } = (await import('../src/plugin.config')).default;

    // check that identifier has valid naming scheme, only lowercase letters, digits, dots and dashes
    if (!/^[a-z0-9.-]+$/.test(identifier)) {
        throw new Error(`Invalid identifier: ${identifier}`);
    }

    // run npm run build
    execSync('npm run build');

    // The file that will be sent to the marketplace
    const publishDir = path.resolve(__dirname, '../publish');
    // create a release dir if not exists and remove all files
    if (!fs.existsSync(publishDir)) {
        fs.mkdirSync(publishDir);
    } else {
        fs.rmSync(publishDir, { recursive: true });
        fs.mkdirSync(publishDir);
    }

    const distDir = path.resolve(__dirname, '../dist');
    const buildContentDir = path.resolve(__dirname, '../dist');

    // make a publish dir
    if (!fs.existsSync(buildContentDir)) {
        fs.mkdirSync(buildContentDir);
    }

    // write content of in dist/ to the root of the zip
    const zip = new AdmZip();
    zip.addLocalFolder(distDir);
    zip.writeZip(path.resolve(publishDir, `${identifier}.zip`));

})()