window.addEventListener('load', () => {
    // get elements
    const slideshow = document.querySelector('.slider');
    const container = slideshow.firstElementChild;
    const total = container.children.length;
    const left_control = document.querySelector('.control_left');
    const right_control = document.querySelector('.control_right');
    const speed = 300;
    let current = 0;

    // clone nodes
    for(let i = 0; i < total - 1; i++) {
        container.appendChild(container.children[i].cloneNode(true));
    }

    // lazy-load images
    [...container.querySelectorAll('img')].forEach(el => {
        el.src = el.src.replace('0', el.parentElement.dataset.id);
    });

    [...container.children].forEach(el => el.addEventListener('click',
        () => location.href= `movie.php?movie=${el.dataset.id}`));

    // animate function
    function keyframe(start, end) {
        container.animate([
            {transform: `translateX(-${start}%)`},
            {transform: `translateX(-${end}%`}
        ], {
            duration: speed,
            easing: 'ease-out',
            fill: 'forwards'
        });
    }

    function goNext(e) {
        if (e.target.disabled) return;
        current %= total;
        e.target.disabled = true;
        setTimeout(() => e.target.disabled = false, speed);
        keyframe(current * 20, ++current * 20);
    }

    function goBack(e) {
        if (e.target.disabled) return;
        current = current % total || total;
        e.target.disabled = true;
        setTimeout(() => e.target.disabled = false, speed);
        keyframe(current * 20, --current * 20);
    }

    left_control.addEventListener('click', goBack);
    right_control.addEventListener('click', goNext);


});
