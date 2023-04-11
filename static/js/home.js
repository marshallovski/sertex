// @TODO: show friends page when first opened Sertex

sertex.logger(`Using Discord API ${sertex.api.ver}`);

sertex.ui.getDMs();
sertex.ui.getGuilds();
sertex.ui.showGuildsPanel();
sertex.ui.showDMsPanel();
sertex.utils.preloadIcons();

// @TODO: make caching of DMs elements
$('#getDMs_btn').onclick = async () => {
    $('.sidebar-dm_title').innerText = 'Direct Messages';
    sertex.ui.hideTopbar();
    sertex.ui.hideMessageBox();
    while ($('#sidebar-dm_dmlist').firstChild) $('#sidebar-dm_dmlist').firstChild.remove();
    sertex.ui.getDMs();
}