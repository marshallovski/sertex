/**
 * 
 * @param {string} channel channel ID
 */
sertex.getChannel = async (channel) => {
    const res = await fetch(`https://discord.com/api/${sertex.api.ver}/channels/${channel}`, {
        headers: {
            Authorization: atob(sertex.user.token)
        }
    });

    let ch = await res.json();
    let guild = await sertex.getGuild(ch.guild_id);

    //console.log('channel', ch);
    // console.log('guild', guild);

    switch (true) {
        case ch.code === 50001:
            sertex.ui.hideTopbar();
            sertex.ui.hideMessageBox();

            sertex.ui.displayError('You have no access to this channel');
            break;

        default:
            if (!sertex.ui.noMessageBox) {
                sertex.ui.showTopbar();
                sertex.ui.showMessageBox();

                if (sertex.dmActive) return;

                document.title = `#${ch.name} - ${guild.name} | Sertex`;
                $('.topbar_chname').innerText = `#${ch.name}`;
                $('#msginput_text').placeholder = `Send a message to ${ch.name}`;

                sertex.logger(`Teleporting to ${channel} (${ch.name}/${guild.name})`);
            }
            break;
    }

    // garbage collectioooon
    ch = null;
    guild = null;
}
