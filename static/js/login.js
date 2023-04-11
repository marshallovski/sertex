function $(elem) {
    return document.querySelector(elem);
}

let authurl;

fetch('/assets/misc.json')
    .then(res => res.json())
    .then(res => authurl = `https://discord.com/api/${res.api.ver}/users/@me`)

$('#loginbtn').onclick = function () {
    if (!$('#lg_token').value) return;

    fetch(authurl, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': $('#lg_token').value
        }
    })
        .then(res => res.json())
        .then(res => {
            // `res.message.includes` because Discord don't give `code` key in response
            if (res.message && res.message.includes('401')) 
                return alert('Wrong or invalid token');
            
            if (res.message && res.message.includes('403')) 
                return alert('Your account was banned by Discord');
            
            localStorage.setItem('sertex_user',
                JSON.stringify({
                    id: btoa(res.id),
                    name: res.username, // no btoa(), because it encode only latin chars.
                    discriminator: btoa(res.discriminator),
                    avatar: res.avatar,
                    token: btoa($('#lg_token').value)
                }));

// @TODO: settings with "saveData" (save internet, disable loading of big avatars, etc.) option and "reducedMotion" option
                localStorage.setItem('sertex_settings',
                JSON.stringify({
                    saveData: false,
                    reducedMotion: false
                }));

            alert(`Welcome to Sertex, ${res.username}!`);
            return location.href = '/';
        });
}