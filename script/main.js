
// Переменные
//const SERVER = 'https://api.themoviedb.org/3'
const IMG_URL = 'https://image.tmdb.org/t/p/w185_and_h278_bestv2';
//const API_KEY = '6d9b26a15078caee9db4dc82a86d921a';

const leftMenu = document.querySelector ('.left-menu');
const humburger = document.querySelector ('.hamburger');
const tvSwowsList = document.querySelector ('.tv-shows__list');
const modal = document.querySelector ('.modal');
const tvShows = document.querySelector ('.tv-shows');
const tvCardImg = document.querySelector ('.tv-card__img');
const modalTitle = document.querySelector ('.modal__title');
const genresList = document.querySelector ('.genres-list');
const rating = document.querySelector ('.rating');
const description = document.querySelector ('.description');
const modalLink = document.querySelector ('.modal__link');
const searchForm = document.querySelector ('.search__form');
const searchFormInput = document.querySelector ('.search__form-input');


const loading = document.createElement('div');
loading.className = 'loading';



//классы
const DBServise = class {

    constructor () {
        this.SERVER = 'https://api.themoviedb.org/3';
        this.API_KEY = '6d9b26a15078caee9db4dc82a86d921a';
    }
    getData = async (url) => {
        const res = await fetch(url);
        if(res.ok) {
            return res.json();
        } else {
           throw new Error(`не удалось получить данные по адресу ${url}`) 
        }
    }

/*     getTestData = () => {
        return this.getData('test.json')
    }
    getTestCard = () => {
        return this.getData('card.json')
    } */

    getSearchResult = query => {
        return this.getData(`${this.SERVER}/search/tv?api_key=${this.API_KEY}&query=${query}&language=ru-RU`);
    }
    getTVShow = id => {
        return this.getData(this.SERVER + '/tv/' + id + '?api_key=' + this.API_KEY + '&language=ru-RU');
    }
}
// Проверка функции getSearchResult
//console.log (new DBServise().getSearchResult('Няня'));

const renderCard = response => {
    console.log (response);
    tvSwowsList.textContent = '';

    response.results.forEach(element => {

        const { backdrop_path: backdrop,
            name: title,
            poster_path: poster,
            vote_average: vote,
            id
            } = element;

        const posterIMG = poster ? IMG_URL + poster : 'img/no-poster.jpg';
        const backdropIMG = backdrop ? IMG_URL + backdrop : '';
        const voteElem = vote ? `<span class="tv-card__vote">${vote}</span>` : '';


       const card = document.createElement('li');
       card.classList.add('tv-shows__item');
       card.innerHTML = `
       <a href="#" id="${id}" class="tv-card">
       ${voteElem}
       <img class="tv-card__img"
            src="${posterIMG}"
            data-backdrop="${backdropIMG}"
            alt="${title}">
        <h4 class="tv-card__head">${title}</h4>
        </a>
       `;

       loading.remove();
       tvSwowsList.append(card);


    });
};

    searchForm.addEventListener('submit', event => {
        event.preventDefault();
        const value = searchFormInput.value.trim();
        if (value) {
            tvShows.append(loading);
            new DBServise().getSearchResult(value).then(renderCard);
        }
        searchFormInput.value = '';
        
        console.log(value);
    })


// открытие, закрытие меню.

humburger.addEventListener('click', () => {
    
    /* ClassList является геттером. Возвращаемый им объект имеет несколько методов: */

    /* toggle ( String [, Boolean])
    Если класс у элемента отсутствует - добавляет, иначе - убирает. Когда вторым параметром передано false - удаляет указанный класс, а если true - добавляет. */
    
    leftMenu.classList.toggle('openMenu');
    humburger.classList.toggle('open')
});

//закрытие меню кликом по документу

document.addEventListener('click', (event) => {
    
    /* Метод Element.closest() возвращает ближайший родительский элемент (или сам элемент), который соответствует заданному CSS-селектору или null, если таковых элементов вообще нет. */
    
    if (!event.target.closest('.left-menu')) {
    /*  remove( String [,String] )
        Удаляет у элемента указанные классы */
        leftMenu.classList.remove('openMenu');
        humburger.classList.remove('open')
    }
});

leftMenu.addEventListener('click', (event) => {
    event.preventDefault();
    
/*     если клик по элементу который имеет dropdown 
    (используется метот closest) то в таком случае меняет класс 
    через тугл на активный класс */

    const target = event.target;
    const dropdown = target.closest('.dropdown')
    if (dropdown) {
        dropdown.classList.toggle('active');
        
        //открывает меню при нажатии на иконки меню
        leftMenu.classList.add('openMenu');
        humburger.classList.add('open');
    }

});

// открытие модального окна

tvSwowsList.addEventListener('click', event => {
    event.preventDefault
    
    const target = event.target;
    const card = target.closest('.tv-card');

    if (card) {

        new DBServise().getTVShow(card.id)
        .then(data => {
            console.log(data);
        tvCardImg.src = IMG_URL + data.poster_path;
        modalTitle.textContent = data.name;
        
        //способ через reduce

        //genresList.innerHTML = data.genres.reduce((acc, item) =>  `${acc}<li>${item.name}</li>`, '') 
        
        //Способ через for of
      
          genresList.innerHTML = ''; //очищает строку
       /*  for (const item of data.genres) {
            genresList.innerHTML += `<li>${item.name}</li>`;
        } */


        // способ через forEach

        data.genres.forEach(item => {
         genresList.innerHTML += `<li>${item.name}</li>`;   
        });

        rating.textContent = data.vote_average;
        description.textContent = data.overview;
        modalLink.href = data.homepage;
 
        })
        .then(() => {
            document.body.style.overflow = 'hidden'
            modal.classList.remove('hide')
        })
        




    }
});

//закрытие модального окна

modal.addEventListener('click', event => {
    //закрытие на крестик
    if (event.target.closest('.cross') || 
    event.target.classList.contains('modal')) {
        document.body.style.overflow = ''
        modal.classList.add('hide')
    }
});

// смена карточки

const changeImage = event => {
const card = event.target.closest('.tv-shows__item');

if (card) {
    const img = card.querySelector('.tv-card__img');
    const changeImg = img.dataset.backdrop;
    if (changeImg) {
    img.dataset.backdrop = img.src;
    img.src = changeImg;
    }
}

};

tvSwowsList.addEventListener('mouseover', changeImage);
tvSwowsList.addEventListener('mouseout', changeImage);




