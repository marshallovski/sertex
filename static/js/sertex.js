if (!localStorage.getItem('sertex_user') || !localStorage.getItem('sertex_settings'))
    location.href = '/login';

const sertex = {
    currentChannel: null,
    dmActive: null,
    api: {
        ver: 'v9'
    },
    user: {
        name: JSON.parse(localStorage.getItem('sertex_user')).name,
        id: JSON.parse(localStorage.getItem('sertex_user')).id,
        discriminator: JSON.parse(localStorage.getItem('sertex_user')).discriminator,
        token: JSON.parse(localStorage.getItem('sertex_user')).token,
        avatar: JSON.parse(localStorage.getItem('sertex_user')).avatar
    },
    settings: {
        saveData: JSON.parse(localStorage.getItem('sertex_settings')).saveData,
        reducedMotion: JSON.parse(localStorage.getItem('sertex_settings')).reducedMotion
    },
    constants: {},
    ui: {
        noMessageBox: false
    },
    utils: {},
    dev: {
        async triggerError() {
            sertex.ui.displayError('Error triggered by sertex.dev.triggerError',);
        },
        async switchToDevServer() {
            $('.sidebar-dm_title').innerText = 'sertex test';
            sertex.ui.getChannels('889920210344247297');
        }
    }
}