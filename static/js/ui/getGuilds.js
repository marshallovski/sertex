sertex.ui.getGuilds = async () => {
    while ($('#sidebar_servers-list-list').firstChild)
        $('.sidebar_servers-list').firstChild.remove();

    fetch('https://discordapp.com/api/users/@me/guilds', {
        headers: {
            'Authorization': atob(sertex.user.token)
        }
    }).then(r => r.json()).then(r => {
        r.forEach(async guild => {
            let guildicon = document.createElement('img');
            guildicon.className = 'sidebar_logo';
            guildicon.title = guild.name;
            guildicon.style.border = 'none';
            guildicon.src = guild.icon ? `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}?size=${sertex.settings.saveData ? sertex.constants.saveData.minRes : sertex.constants.saveData.maxRes}` : '/assets/Discord-Logo-Color.svg';
            guildicon.alt = guild.name;
            guildicon.onclick = async () => {
                sertex.ui.hideTopbar();
                sertex.ui.hideMessageBox();

                $('.sidebar-dm_title').innerText = guild.name;
                if ($('.sidebar-dm_header-hasbanner')) {
                    $('.sidebar-dm_header-hasbanner').style.backgroundImage = 'none';
                    $('.sidebar-dm_header-hasbanner').className = 'sidebar-dm_header-nobanner';
                }

                if ($('.sidebar-dm_header-hasbanner')) $('.sidebar-dm_header-hasbanner').style.backgroundImage = 'none';

                sertex.ui.getChannels(guild.id);

                // for some reason, Discord don't give banner and other info. but here it does
                let gAdvanced = await sertex.getGuild(guild.id);

                if (gAdvanced.banner) {
                    $('.sidebar-dm_header-nobanner').className = 'sidebar-dm_header-hasbanner';
                    $('.sidebar-dm_header-hasbanner').style.backgroundImage = `url("https://cdn.discordapp.com/banners/${guild.id}/${gAdvanced.banner}")`;
                }
            }

            $('.sidebar_servers-list').appendChild(guildicon);
        });

        sertex.logger(`Discovered ${r.length} guilds`);

        // big arrays must be garbage collected
        r = null;
    });
}