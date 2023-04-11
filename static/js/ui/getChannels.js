sertex.ui.getChannels = async (guildid) => {
    const res = await fetch(`https://discord.com/api/${sertex.api.ver}/guilds/${guildid}/channels`, {
        headers: {
            Authorization: atob(sertex.user.token)
        }
    });

    let channels = await res.json();
    while ($('#sidebar-dm_dmlist').firstChild) $('#sidebar-dm_dmlist').firstChild.remove();
    while ($('#messages').firstChild) $('#messages').firstChild.remove();
    channels.forEach(channel => {
        // probably sorting works
        channel.position - channel.position;

        // creating main channel div
        // yes, channels container is the same as DMs container
        let chElem = document.createElement('div');
        chElem.className = 'sidebar-dm_user';
        $('#sidebar-dm_dmlist').appendChild(chElem);

        // creating channel icon
        let chElemIcon = document.createElement('img');

        // see sertex.js -> sertex.constants
        // @TODO: add CATEGORY and other channel types support 
        //console.log(channel);
        switch (channel.type) {
            case sertex.constants.channelType.TEXT: chElemIcon.src = '/assets/icons/tag_white.svg'; break;
            case sertex.constants.channelType.VOICE: chElemIcon.src = '/assets/icons/voice_channel_white.svg'; break;
            case sertex.constants.channelType.CATEGORY:
                chElem.className = 'channelslist_category';
                chElemIcon.src = '/assets/icons/category_white.svg';
                break;
            default: chElemIcon.src = '/assets/icons/unknown_outline_white.svg'; break;
        }

        chElemIcon.className = 'dm_user-avatar';
        // appending channel's icon to main ch div
        chElem.appendChild(chElemIcon);

        // creating channel's name element
        let chElemChannelName = document.createElement('h4');
        chElemChannelName.className = 'dm_user-username';
        chElemChannelName.innerText = channel.name;
        // appending channel's name element to main ch div
        chElem.appendChild(chElemChannelName);

        // when clicking on channel: open topbar (channel name), message input and print all channel's messages
        chElem.onclick = async () => {
            if (channel.type === sertex.constants.channelType.CATEGORY)
                return;

            sertex.ui.noMessageBox = false;
            sertex.ui.showTopbar();
            sertex.ui.showMessageBox();
            sertex.ui.getMessages(channel.id);
        }
    });

    sertex.logger(`Discovered ${channels.length} channels in ${guildid}`);

    // big arrays must be garbage collected
    channels = null;
}