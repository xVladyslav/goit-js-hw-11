import axios from 'axios';

const API_KEY = '32702622-3f5e4328e32694235b147f82c';
export const PER_PAGE = 40;

function makeSearchUrl(searchQuery, page, perPage) {
    return encodeURI(`https://pixabay.com/api/?key=${API_KEY}&q=${searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&per_page=${perPage}&page=${page}`);
};

export const fetchImages = async (searchQuery, page, perPage) => {
    const url = makeSearchUrl(searchQuery, page, perPage);
    const { data } = await axios.get(url);

    if (data.totalHits === 0) {
        throw ('Sorry, there are no images matching your search query. Please try again.');
    }
    return data;
}
