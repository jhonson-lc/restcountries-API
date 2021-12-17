let datos = {};

document.addEventListener('click', e => {
  if (e.target.matches('#button__theme')) {
    cambiarTema();
  }

  if (e.target.matches('#select__continent')) {
    mostrarMenu();
  }

  if (e.target.matches('.list__select li')) {
    cambiarRegion(e);
    let regionElegida = e.target.dataset.continent;
    filtrarRegion(regionElegida);
  }

  if (e.target.matches('.card')) {
    const pais = e.target.querySelector('.card__des h4');
    mostrarModal(pais.textContent);
  }

  if (e.target.matches('.modal__btnback')) {
    const container__modal = document.getElementById('container__modal');

    container__modal.textContent = '';
  }

  e.stopPropagation();
});

document.addEventListener('DOMContentLoaded', () => {
  dataCountries();
});

document.addEventListener('keyup', e => {
  const showRegion = document.querySelector('#select__continent span');
  showRegion.textContent = 'Filter by Region';

  if (e.target.matches('#searchCountry')) {
    const paisB = e.target.value;
    if (paisB) {
      return buscarPais(paisB);
    }
    mostrarCards(datos);
  }
});

const cacheTema =
  localStorage.getItem('theme') ||
  (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
if (cacheTema) {
  document.documentElement.setAttribute('data-theme', cacheTema);
}

const cambiarTema = () => {
  const actualTema = document.documentElement.getAttribute('data-theme');
  let cambiarTema = '';

  if (actualTema === 'light') {
    cambiarTema = 'dark';
    mostrarBtnTheme(cambiarTema);
  } else {
    cambiarTema = 'light';
    mostrarBtnTheme(cambiarTema);
  }

  document.documentElement.setAttribute('data-theme', cambiarTema);
  localStorage.setItem('theme', cambiarTema);
};

const mostrarBtnTheme = id => {
  const template__theme = document.getElementById('template__theme');
  const button__theme = document.getElementById('button__theme');

  button__theme.textContent = '';

  const clone = template__theme.content.cloneNode(true);
  const btnclone = clone.getElementById(`${id}theme`);

  button__theme.appendChild(btnclone);
};

mostrarBtnTheme(cacheTema);

const mostrarMenu = () => {
  const showMenu = document.querySelector('#select__continent ul');
  showMenu.classList.toggle('display__none');
};

const cambiarRegion = e => {
  const showRegion = document.querySelector('#select__continent span');
  showRegion.textContent = e.target.textContent;
  mostrarMenu();
};

const dataCountries = async () => {
  try {
    const res = await fetch('https://restcountries.com/v3.1/all');
    const data = await res.json();
    datos = data;
    mostrarCards(data);
  } catch (e) {
    console.log(e);
  } finally {
    console.log('END');
  }
};

const mostrarCards = data => {
  const template__countries = document.getElementById('template__countries');
  const fragment = document.createDocumentFragment();
  const cards__countries = document.querySelector('.cards__countries');

  cards__countries.textContent = '';

  data.forEach(pais => {
    const clone = template__countries.content.cloneNode(true);
    clone.querySelector('.card img').setAttribute('src', pais.flags.png);
    clone.querySelector('.card__des h4').textContent = pais.name.common;
    clone.querySelector('.card__Pop').textContent = pais.population;
    clone.querySelector('.card__Reg').textContent = pais.region;
    clone.querySelector('.card__Cap').textContent = pais.capital;

    fragment.appendChild(clone);
  });

  cards__countries.appendChild(fragment);
};

const filtrarRegion = region => {
  data = datos.filter(pais => pais.region === region);
  mostrarCards(data);
};

const buscarPais = paisBuscado => {
  data = datos.filter(pais => {
    if (pais.name.common.toLowerCase().indexOf(paisBuscado) === -1) {
      return;
    } else {
      return pais;
    }
  });
  mostrarCards(data);
};

const mostrarModal = paisModal => {
  const template__modal = document.getElementById('template__modal');
  const container__modal = document.getElementById('container__modal');
  const fragment = document.createDocumentFragment();

  container__modal.textContent = '';

  data = datos.filter(pais => {
    const clone = template__modal.content.cloneNode(true);
    if (pais.name.common === paisModal) {
      clone.querySelector('.modal__pais img').setAttribute('src', pais.flags.png);
      clone.querySelector('.modal__des h4').textContent = pais.name.common;
      fragment.appendChild(clone);
      return clone;
    }
  });

  container__modal.appendChild(fragment);
  mostrarDescripcion(data[0]);
  mostrarBorders(data[0]);
};

const mostrarDescripcion = data => {
  const items = [
    'Native Name',
    'Population',
    'Region',
    'Sub Region',
    'Capital',
    'Top Level Domain',
    'Currencies',
    'Languages',
  ];
  const template__spanModal = document.getElementById('template__spanModal');
  const fragmentModal = document.createDocumentFragment();
  const modal__des_p1 = document.querySelector('.modal__des-p1');

  modal__des_p1.textContent = '';

  items.forEach(item => {
    const clone = template__spanModal.content.cloneNode(true);
    clone.querySelector('.modal_Character').textContent = `${item}: `;

    if (item === 'Population') {
      clone.querySelector('.modal__Pop').textContent = data.population;
    }
    if (item === 'Native Name') {
      let i = Object.values(data.name.nativeName);
      i.forEach(nN => {
        clone.querySelector('.modal__Pop').textContent = nN.common;
      });
    }
    if (item === 'Region') {
      clone.querySelector('.modal__Pop').textContent = data.region;
    }
    if (item === 'Sub Region') {
      clone.querySelector('.modal__Pop').textContent = data.subregion;
    }
    if (item === 'Capital') {
      clone.querySelector('.modal__Pop').textContent = data.capital;
    }
    if (item === 'Top Level Domain') {
      clone.querySelector('.modal__Pop').textContent = data.tld;
    }
    if (item === 'Currencies') {
      let crr = Object.values(data.currencies);
      let namesCurrencies = [];
      crr.forEach(ee => {
        namesCurrencies.push(ee.name);
      });
      clone.querySelector('.modal__Pop').textContent = namesCurrencies.join(',');
    }
    if (item === 'Languages') {
      let lang = Object.values(data.languages);
      let allLanguages = [];
      lang.forEach(ee => {
        allLanguages.push(ee);
      });
      clone.querySelector('.modal__Pop').textContent = allLanguages.join(',');
    }

    fragmentModal.appendChild(clone);
  });

  modal__des_p1.appendChild(fragmentModal);
};

const mostrarBorders = pais => {
  const template__bordersModal = document.getElementById('template__bordersModal');
  const fragment = document.createDocumentFragment();
  const container = document.querySelector('.modal__des-p2-l');

  container.textContent = '';
  if (pais.borders) {
    pais.borders.forEach(bor => {
      const clone = template__bordersModal.content.cloneNode(true);
      clone.querySelector('.modal_Bor').textContent = paisCca3(bor);
      fragment.appendChild(clone);
    });
  } else {
    const clone = template__bordersModal.content.cloneNode(true);
    clone.querySelector('.modal_Bor').textContent = 'No bordering countries';
    fragment.appendChild(clone);
  }
  container.appendChild(fragment);
};

const paisCca3 = cca3Pais => {
  let border = datos.filter(item => {
    if (item.cca3 === cca3Pais) {
      return item;
    } else {
      return;
    }
  });
  return border[0].name.common;
};
