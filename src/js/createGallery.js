export default class markupGallery {
  createManyCards(cardsData) {
    return cardsData.map(this.createOneCard).join('');
  }

  createOneCard(cardData) {
    return `
      <li class="wrapper">
        <a href="${cardData.largeImageURL}">
          <div class="photo-card">
            <img class='img-info' src="${cardData.webformatURL}" alt="${cardData.tags}" loading="lazy" width='250' heigth='250' />
              <div class="info">
                <p class="info-item">
                  <b>Likes ${cardData.likes}</b>
                </p>
                <p class="info-item">
                  <b>Views ${cardData.views}</b>
                </p>
                <p class="info-item">
                  <b>Comments ${cardData.comments}</b>
                </p>
                <p class="info-item">
                  <b>Downloads ${cardData.downloads}</b>
                </p>
              </div>
          </div>
        </a>
      </li>
`;
  }
};