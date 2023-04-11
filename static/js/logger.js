sertex.logger = async (text, level = 'log') => {
    switch (level) {
        case 'log': console.log(`sertex: ${text}`); break;
        case 'warn': console.warn(`sertex: warn: ${text}`); break;
        case 'err': console.error(`sertex: error: ${text}`); break;

        default:
            console.log(`sertex: ${text}`);
            break;
    }
} 