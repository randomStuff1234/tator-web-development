document.querySelectorAll('.page').forEach(el => {
    // el.classList.add('collapse');
    el.style.display = 'none';
});

document.querySelectorAll('.toggle-elements').forEach(link => {

    link.classList.remove('active');

    link.addEventListener('click', () => {
        document.querySelectorAll('.toggle-elements').forEach(_l => {
            _l.classList.remove('active');
        });

        link.classList.add('active');

        document.querySelectorAll(link.dataset.toggleClass).forEach(el => {
            // el.classList.add('collapse');
            el.style.display = 'none';
        });

        document.querySelector(link.dataset.target).style.display = 'block';

        window.scrollTo(0, 0);

        // document.querySelector(link.dataset.target).classList.add('collapse');
    });
});


// shows page
if (!location.hash) location.hash = document.querySelectorAll('.toggle-elements')[0].dataset.target;
document.querySelector(location.hash).style.display = 'block';
document.querySelector(`.toggle-elements[data-target="${location.hash}"]`).classList.add('active');
window.scrollTo(0, 0);