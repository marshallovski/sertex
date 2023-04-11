sertex.ui.getDMs = async () => {
    while ($('#sidebar-dm_dmlist').firstChild)
        $('#sidebar-dm_dmlist').firstChild.remove();

    fetch('https://discordapp.com/api/users/@me/channels', {
        headers: {
            'Authorization': atob(sertex.user.token)
        }
    }).then(r => r.json()).then(r => {
        r.forEach(dm => {
            // @TODO: caching and properly sorting
            // creating main DM div
            let dmElem = document.createElement('div');
            dmElem.className = 'sidebar-dm_user';
            $('#sidebar-dm_dmlist').appendChild(dmElem);

            // creating user's avatar element
            let dmElemUserImg = document.createElement('img');
            dmElemUserImg.src = dm.recipients[0].avatar ? `https://cdn.discordapp.com/avatars/${dm.recipients[0].id}/${dm.recipients[0].avatar}?size=${sertex.settings.saveData ? sertex.constants.saveData.minRes : sertex.constants.saveData.maxRes}` : '/assets/Discord-Logo-Color.svg';
            dmElemUserImg.className = 'dm_user-avatar';
            dmElemUserImg.alt = dm.recipients[0].username;
            dmElemUserImg.onerror = () => this.src = '/assets/logo.png';
            // appending user's avatar to main DM div
            dmElem.appendChild(dmElemUserImg);

            // creating user's name element
            let dmElemUserName = document.createElement('h4');
            dmElemUserName.className = 'dm_user-username';
            dmElemUserName.innerText = dm.recipients[0].username;
            // appending user name element to main DM div
            dmElem.appendChild(dmElemUserName);

            dmElem.onclick = async () => {
                sertex.dmActive = true;
                sertex.ui.getMessages(dm.id);
                document.title = `@${dm.recipients[0].username} | Sertex`;
                $('.topbar_chname').innerText = `@${dm.recipients[0].username}`;
                $('#msginput_text').placeholder = `Send a message to ${dm.recipients[0].username}`;
            }
        });

        sertex.logger(`Discovered ${r.length} users in DM`);

        while ($('#messages').firstChild) $('#messages').firstChild.remove();

        sertex.ui.hideTopbar();
        sertex.ui.hideMessageBox();

        // big arrays must be garbage collected
        r = null;
    });
}