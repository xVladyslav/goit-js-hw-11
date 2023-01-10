import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from "simplelightbox";
import { fetchImages, PER_PAGE } from "./js/galleryAPI";
import { makeGalleryElements, setInnerHTMLForElement, initializeScrollFetching } from './js/helpers';
import "simplelightbox/dist/simple-lightbox.min.css";

const form = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');
const loadMore = document.querySelector('.load-more');

let cardHeight = null;
let searchQuery = '';
let page = 1;
let hits = 0;
let possibleHits = 0;
let canFetchByScroll = false;

const galleryLB = new SimpleLightbox('.gallery a');

form.addEventListener('submit', fetchOnSubmit);

initializeScrollFetching(loadMore, () => {
    if (canFetchByScroll) {
        setTimeout(fetchOnScroll, 500);
    }
});

function fetchOnSubmit(e) {
    e.preventDefault();

    searchQuery = form.elements.searchQuery.value.trim();
    page = 1;
    hits = 0;
    canFetchByScroll = false;

    setInnerHTMLForElement(gallery);

    if (!searchQuery) {
        return;
    }

    fetchImages(searchQuery, page, PER_PAGE)
        .then(data => {
            hits += data.hits.length;
            possibleHits = data.totalHits;

            setInnerHTMLForElement(gallery, makeGalleryElements(data.hits));

            galleryLB.refresh();
            Notify.success(`Hooray! We found ${possibleHits} images.`);

            if (!cardHeight) {
                cardHeight = document.querySelector(".gallery").firstElementChild.getBoundingClientRect().height;
            }

            if (possibleHits > PER_PAGE) {
                canFetchByScroll = true;
            }
        })
        .catch(error => {
            Notify.failure(error);
        })
}

function fetchOnScroll() {
    page++;

    // Possible total hits is limited to 500 by API
    // With PER_PAGE = 40 we can possibly fetch 13 pages of 40 images which makes hits equal to 520
    // So for the last call we calculate how many items left to fetch to have no more than 500 images
    const perPage = possibleHits - hits < PER_PAGE ? possibleHits - hits : PER_PAGE;

    fetchImages(searchQuery, page, perPage)
        .then(data => {
            hits += data.hits.length;

            setInnerHTMLForElement(gallery, gallery.innerHTML + makeGalleryElements(data.hits));

            galleryLB.refresh();

            window.scrollBy({
                top: cardHeight * 2,
                behavior: "smooth",
            });

            if (hits >= possibleHits) {
                canFetchByScroll = false;
                Notify.info("We're sorry, but you've reached the end of search results.")
            }
        })
}
