import './css/styles.css';
import 'simplelightbox/dist/simple-lightbox.min.css';
import SimpleLightbox from 'simplelightbox';
import API from './js/api';
import createGallery from './js/createGallery';
import { Notify } from 'notiflix';




const form = document.querySelector('#search-form');
const input = document .querySelector('.form-input');
const submitBtn = document.querySelector('.form-button');
const gallery = document.querySelector('.gallery');
const loader = document.querySelector('.loader');


const newApi = new API();
const newGallery = new createGallery();
const lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',  
  captionPosition: 'top',
  captionDelay: 300,
  overlayOpacity: 0.9,
});


let showedImages = 0;
let totalHits = 0;
let inputEmpty = true; 


input.addEventListener('input' , onInput)
form.addEventListener('submit' , onFormSubmit)
// loader.addEventListener('click', loadMoreImages)


function onInput(evt) {
  if (evt.target.value ) {
    inputEmpty = false;
    submitBtn.removeAttribute('disabled');
  } else {
    inputEmpty = true;
    submitBtn.setAttribute('disabled', 'disabled'); 
  }
}


function onFormSubmit(evt) {
  evt.preventDefault();
  if (inputEmpty) {
    return;
  }
    stopObserver(); 
    gallery.innerHTML = '';
    showedImages = 0;
    totalHits = 0; 
    const query = evt.target.elements.searchQuery.value;
  // console.log(`те що буде написано в інпуті '${query}'`)

  loadingPictures(query)
}

async function loadingPictures(query) {
  try {

    const array = await newApi.loadNewPages(query); 
    
    
    if (array.totalHits === 0) {
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    }
    
    totalHits = array.totalHits;
    Notify.success(`Hooray! We found ${totalHits} images.`);
    buildGallery(array);
    lightbox.refresh();
    showedImages = array.hits.length;

    if (showedImages < totalHits) {
      loader.removeAttribute('hidden')
      startObserver();
    }
  } catch (error) {
    console.error(error);
  }
}

async function loadMoreImages(query) {
  
  try { 
    const array = await newApi.LoadingMorePages(query); 
    
    if ( showedImages   === totalHits) {
      loader.setAttribute('hidden' , 'hidden')
      stopObserver();
      Notify.info("We're sorry, but you've reached the end of search results.");
    }
      appendGallery(array);
      lightbox.refresh();
      showedImages += array.hits.length;

  } catch (error) {
    console.error(error)
  }
}

function buildGallery(array) {
  gallery.innerHTML = newGallery.createManyCards(array.hits);
} 
function appendGallery(array) {
  const markup = newGallery.createManyCards(array.hits);
  gallery.insertAdjacentHTML('beforeend', markup);
}


const scrollObserver = new IntersectionObserver(
  function (entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        loadMoreImages();
      }
    });
  },

  {
    rootMargin: '0px 0px 300px 0px',
    threshold: 0.1,
  }
);

function startObserver() {
  setTimeout(function () {
    scrollObserver.observe(loader);
  }, 1000);
}
function stopObserver() {
  scrollObserver.unobserve(loader);
}