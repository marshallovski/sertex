/**
 * @param {text} Text text to display in error container
 * @param hideWholeUI ui elements to hide/show
 * @description just clearing contents of #messages and pasting an error container
 */

sertex.ui.displayError = async (text = 'Oops... Some error was happened.', hideWholeUI) => {
    if (hideWholeUI) {
        sertex.ui.hideTopbar();
        sertex.ui.hideMessageBox();
        sertex.ui.hideDMsPanel();
        sertex.ui.hideGuildsPanel();
    }
    
    const messagesContainer = $('#messages');

    // creating error container
    if (messagesContainer) {
        // removing all content from messages container
        while (messagesContainer.firstChild) messagesContainer.firstChild.remove();

        // creating err div
        const errorContainer = document.createElement('div');
        errorContainer.className = 'error-container';
        messagesContainer.appendChild(errorContainer);

        // creating err div body with err icon and text
        const errorContainerBody = document.createElement('div');
        errorContainerBody.className = 'error-container_body';
        errorContainer.appendChild(errorContainerBody);

        // creating err icon
        const errorContainerBodyIcon = document.createElement('img');
        errorContainerBodyIcon.className = 'error-container_body-icon';
        errorContainerBodyIcon.src = '/assets/icons/error_white.svg';
        errorContainerBody.appendChild(errorContainerBodyIcon);

        // creating err text
        const errorContainerBodyText = document.createElement('p');
        errorContainerBodyText.className = 'error-container_body-text';
        errorContainerBodyText.innerText = text;
        errorContainerBody.appendChild(errorContainerBodyText);
    } else sertex.logger('Messages container (div#messages) is missing, can\'t create error container', 'err');
}