export function makeGalleryElements(images) {
    return images.map(image => `
    <div class="photo-card">
        <a href="${image.largeImageURL}"><img src="${image.webformatURL}" alt="${image.tags}" loading="lazy" /></a>
        <div class="info">
            <p class="info-item">
                <b>Likes</b>
                <span>${image.likes}</span>
            </p>
            <p class="info-item">
                <b>Views</b>
                <span>${image.views}</span>
            </p>
            <p class="info-item">
                <b>Comments</b>
                <span>${image.comments}</span>
            </p>
            <p class="info-item">
                <b>Downloads</b>
                <span>${image.downloads}</span>
            </p>
        </div>
    </div>
  `).join('');
}

export function initializeScrollFetching(element, cb) {
    const observer = new IntersectionObserver(function (entries) {
        if (entries[0].isIntersecting === true) {
            cb();
        }
    }, { threshold: [1] });

    observer.observe(element);
}

export function setInnerHTMLForElement(element, html = '') {
    element.innerHTML = html;
}
