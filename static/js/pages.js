function navigateTo(url, pushState, reload) {
    if (pushState) history.pushState(null, null, url);
    if (reload) location.pathname = url;
}

window.addEventListener('popstate', (e) => {
    e.preventDefault();
    // Removes active from all links
    document.querySelectorAll('.toggle-elements').forEach(_l => {
        _l.classList.remove('active');
    });

    // Adds active for this link
    document.querySelector(`a.nav-link[href="${location.pathname}"]`).classList.add('active');

    // Hides all pages
    document.querySelectorAll('page').forEach(el => {
        el.style.display = 'none';
    });

    // Shows correct page
    document.querySelector('#' + location.pathname.toLowerCase().replace(new RegExp('/', 'g'), '').replace(new RegExp(' ', 'g'), '-')).style.display = 'block';

    window.scrollTo(0, 0);
});

document.querySelectorAll('.page').forEach(el => {
    el.style.display = 'none';
});

// Adds listeners for page links
document.querySelectorAll('.toggle-elements').forEach(link => {

    link.classList.remove('active');

    link.addEventListener('click', (e) => {
        e.preventDefault();
        // Removes active from all links
        document.querySelectorAll('.toggle-elements').forEach(_l => {
            _l.classList.remove('active');
        });

        // Adds active for this link
        link.classList.add('active');

        // Hides all pages
        document.querySelectorAll(link.dataset.toggleClass).forEach(el => {
            el.style.display = 'none';
        });

        // Shows correct page
        document.querySelector(link.dataset.target).style.display = 'block';

        window.scrollTo(0, 0);
        navigateTo(e.target.closest('a').href, true);
    });
});


// shows page
if (location.pathname == '/') navigateTo(document.querySelectorAll('.toggle-elements[data-toggle-class=".page"]')[0].href, true);
document.querySelector(location.pathname.replace('/', '#').replace(new RegExp('/', 'g'), '--')).style.display = 'block';
// Sets link to active
document.querySelector(`.toggle-elements[href="${location.pathname}"]`).classList.add('active');

navigateTo(location.pathname);

window.scrollTo(0, 0);

try { // if no loading screen, don't do this
    const loadingScreen = document.querySelector('#loading-screen');
    loadingScreen.classList.add('animate__animated');
    loadingScreen.classList.add('animate__fadeOut');
    loadingScreen.addEventListener('animationend', () => {
        loadingScreen.remove();
    });
} catch (err) {}