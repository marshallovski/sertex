// adding icons to cache
sertex.utils.preloadIcons = async () => {
    const container = $('#iconPreloadContainer');

    if (!container) return sertex.logger('No div#iconPreloadContainer present for icons caching', 'warn');

    // @TODO: fetch list from misc.json
    const toCache = [
        'error_white.svg',
        'stage_white.svg',
        'tag_white.svg',
        'unknown_outline_white.svg',
        'voice_channel_white.svg',
        'category_white.svg',
        'info_white.svg',
        'tips_white.svg'
    ];

    // preloading
    toCache.forEach(icon => {
        const iconElement = document.createElement('img');
        
        iconElement.src = `/assets/icons/${icon}`;
        container.appendChild(iconElement);
    });
}