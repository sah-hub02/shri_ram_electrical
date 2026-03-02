const accessoriesGrid = document.getElementById('accessoriesGrid');
const loadMoreBtn = document.getElementById('loadMoreBtn');
const loadLessBtn = document.getElementById('loadLessBtn');

// More images to show
const moreImages = [
    './img/j.jpeg',
    './img/k.jpeg',
    './img/l.jpeg',
    './img/m.jpeg',
    './img/n.jpeg',
    './img/o.jpeg',
    './img/p.jpeg',
    './img/q.jpeg',
];

let expanded = false;

loadMoreBtn.addEventListener('click', () => {
    if (!expanded) {
        moreImages.forEach(src => {
            const div = document.createElement('div');
            div.className = 'overflow-hidden rounded-xl shadow-lg extra-img';
            div.setAttribute('data-aos', 'fade-up');
            div.innerHTML = `<img src="${src}" class="w-full h-56 object-cover hover:scale-110 transition duration-500" />`;
            accessoriesGrid.appendChild(div);
        });
        expanded = true;
        loadMoreBtn.style.display = 'none';
        loadLessBtn.classList.remove('hidden');
    }
});

loadLessBtn.addEventListener('click', () => {
    const extraImgs = document.querySelectorAll('.extra-img');
    extraImgs.forEach(img => img.remove());
    expanded = false;
    loadLessBtn.classList.add('hidden');
    loadMoreBtn.style.display = 'inline-block';
});