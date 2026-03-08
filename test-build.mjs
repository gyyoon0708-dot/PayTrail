import { build } from 'vite';
import fs from 'fs';

async function run() {
    try {
        await build();
        console.log('Build success');
    } catch (e) {
        fs.writeFileSync('error_dump.txt', String(e.stack || e));
        console.error('Build caught error:', e);
    }
}
run();
