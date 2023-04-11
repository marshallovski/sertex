sertex.sendMessage = async () => {
    const channelUrl = `https://discordapp.com/api/${sertex.api.ver}/channels/${sertex.currentChannel}/messages`;

    fetch(channelUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': atob(sertex.user.token)
        },
        body: JSON.stringify({ content: $('#msginput_text').value, tts: false })
    }).then(res => res.json())
        .then(r => {
            if (r.code === 50013) {
                sertex.ui.displayError('You have no permissions to send messages to this channel');
                sertex.ui.noMessageBox = true;
                return sertex.ui.hideMessageBox();
            }
        });

    sertex.enableTyping(sertex.currentChannel);
}

window.onkeydown = async (e) => {
    if (!$('#msginput_text').value)
        return null;

    if (e.code === 'Enter') {
        sertex.sendMessage($('#msginput_text').value, sertex.currentChannel);
        $('#messages').scrollTo(0, 9999);
        sertex.ui.getMessages(sertex.currentChannel);
        return $('#msginput_text').value = '';
    }
}