sertex.enableTyping = async (channel = sertex.currentChannel) => {
    if (!channel)
        return sertex.logger('sertex->channelTyping: Enter valid channel ID', 'err');

    await fetch(`https://discord.com/api/${sertex.api.ver}/channels/${sertex.currentChannel}/typing`, {
        method: 'POST',
        headers: {
            Authorization: atob(sertex.user.token)
        }
    });
}