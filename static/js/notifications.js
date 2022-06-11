// VVVVVVVVV Creates notification container VVVVVVVVV
let notificationEl = document.createElement('div');
notificationEl.setAttribute('aria-live', 'polite');
notificationEl.setAttribute('aria-atomic', 'true');
notificationEl.style.minWidth = 'min-content';
notificationEl.style.minHeight = 'min-content';
notificationEl.style.position = 'fixed';
notificationEl.style.top = '56px';
notificationEl.style.right = '0px';
notificationEl.classList.add('text-light');

let innerNotificationEl = document.createElement('div');
innerNotificationEl.style.position = 'absolute';
innerNotificationEl.style.top = '0';
innerNotificationEl.style.right = '0';
innerNotificationEl.id = 'notifications';

notificationEl.appendChild(innerNotificationEl);

document.querySelector('main').appendChild(notificationEl);


let num = 0;

// Makes toast
function createNotificationEl(title, msg, color) {
    let toast = document.createElement('div');
    toast.classList.add('toast');
    toast.classList.add(`bg-${color}`);
    toast.classList.add('notification');
    toast.id = 'notification-' + num;
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'assertive');
    toast.setAttribute('aria-atomic', 'true');

    let header = document.createElement('div');
    header.classList.add('toast-header');
    header.classList.add('bg-dark');
    header.classList.add('d-flex');
    header.classList.add('justify-content-between');

    let strong = document.createElement('strong');
    strong.classList.add('mr-auto');
    strong.classList.add(`text-${color}`);
    strong.innerText = title ? title : 'sfzMusic';
    header.appendChild(strong);

    let small = document.createElement('small');
    small.classList.add('text-muted');
    small.innerText = (new Date(Date.now())).toDateString();
    header.appendChild(small);

    let button = document.createElement('button');
    button.setAttribute('type', 'button');
    button.classList.add('ml-2');
    button.classList.add('mb-1');
    button.classList.add('bg-dark');
    button.classList.add('border-0');
    button.classList.add('text-light');
    button.setAttribute('data-dismiss', 'toast');


    let span = document.createElement('span');
    span.setAttribute('aria-hidden', 'true');
    span.innerHTML = '&times;';
    button.appendChild(span);
    header.appendChild(button);
    toast.appendChild(header);

    let body = document.createElement('div');
    body.classList.add('toast-body');
    body.innerText = msg;
    toast.appendChild(body);

    return toast;
}

/**
 * 
 * @param {String} title title, defaults to 'sfzMusic'
 * @param {String} msg content of body
 * @param {String} color bs color
 * @param {Number} length in seconds 
 */
function createNotification(title, msg, color, length) {
    let notification = createNotificationEl(title, msg, color);

    let removed = false;
    const timeout = setTimeout(() => {
        removed = true;
        removeNotification(notification);
    }, length ? length * 1000 : 1000 * 5);

    notification.querySelector('button').addEventListener('click', () => {
        if (!removed) {
            removeNotification(notification);
            clearTimeout(timeout);
        }
    });

    document.querySelector('#notifications').appendChild(notification);

    // Shows toast using bs api
    $(`#notification-${num}`).toast({
        animation: true,
        autohide: true,
        delay: length ? length * 1000 : 1000 * 5
    });
    $(`#notification-${num}`).toast('show');
    $(`#${notification.id}`).on('hidden.bs.toast', () => {
        notification.remove();
    });
    num++;
}

function removeNotification(notification) {
    $(`#${notification.id}`).toast('hide');
}