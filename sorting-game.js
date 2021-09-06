BUCKET_ROW_HEIGHT = 4;

const SORT_GAMES = {
  animalsEat: {
    title: 'Animal diets',
    description: 'Classify animals based on eating behaviour',
    buckets: [
      {
        name: 'Herbivores',
        items: [
          'Rhinoceros',
          'Elephant',
          'Parrot',
          'Cow'
        ]
      },
      {
        name: 'Carnivores',
        items: [
          'Lion',
          'Shark',
          'Penguin',
          'Spider'
        ]
      },
      {
        name: 'Omnivores',
        items: [
          'Human',
          'Pig',
          'Monkey',
          'Hedgehog'
        ]
      }
    ]
  },
  sums: {
    title: 'Sums',
    description: 'Drag the numbers to make up the sums',
    quantity: true,
    buckets: [
      {
        name: 2,
        items: [
          1,
          1
        ]
      },
      {
        name: 3,
        items: [
          2,
          1
        ]
      },
      {
        name: 4,
        items: [
          2,
          2
        ]
      },
      {
        name: 5,
        items: [
          3,
          2
        ]
      },
      {
        name: 6,
        items: [
          4,
          2
        ]
      },
      {
        name: 7,
        items: [
          5,
          2
        ]
      },
      {
        name: 8,
        items: [
          4,
          4
        ]
      },
      {
        name: 12,
        items: [
          7,
          5
        ]
      },
      {
        name: 19,
        items: [
          10,
          9
        ]
      },
      {
        name: 10,
        items: [
          6,
          4
        ]
      }
    ]
  },
  songs: {
    title: 'Song sorter',
    description: 'Drag all of the songs to the right bands',
    buckets: [
      {
        name: "Queen",
        items: [
          'Bohemian Rhapsody',
          'Let Me Live',
          'Another One Bites The Dust'
        ]
      },
      {
        name: "Muse",
        items: [
          'Resistance',
          'Uprising',
          'Exogenesis'
        ]
      }
    ]
  },
  chords: {
    title: 'Chords',
    description: 'Find the notes that make up the music chord',
    buckets: [
      {
        name: "C major",
        items: [
          'C',
          'E',
          'G'
        ]
      },
      {
        name: "D minor",
        items: [
          'D',
          'F',
          'A'
        ]
      },
      {
        name: "E minor",
        items: [
          'E',
          'G',
          'B'
        ]
      },
      {
        name: "F major",
        items: [
          'F',
          'A',
          'C'
        ]
      },
      {
        name: "G major",
        items: [
          'G',
          'B',
          'D'
        ]
      },
      {
        name: "A minor",
        items: [
          'A',
          'C',
          'E'
        ]
      }
    ]
  }
};

COLORS = [
  'red',
  'yellow',
  'green',
  'blue',
  'purple',
  'orange',
  'tomato',
  'aqua',
  'coral',
  'crimson'
];

const HTML_ELEMENTS = {
  message: {
    container: document.getElementById('messageContainer'),
    text: document.getElementById('message')
  },
  menu: {
    menuContainer: document.getElementById('menuContainer'),
    itemTemplate: document.getElementById('menuItemTemplate')
  },
  title: document.getElementById('title'),
  description: document.getElementById('description'),
  buckets: {
    container: document.getElementById('bucketContainer'),
    template: document.getElementById('bucketTemplate')
  },
  items: {
    container: document.getElementById('itemsContainer'),
    template: document.getElementById('itemTemplate')
  }
};
const state = {
  selectedGame: null,
  remainingBuckets: [],
  bucketOne: null,
  bucketTwo: null,
  itemsCount: 0,
  itemsAttempts: 0,
  itemsDone: 0,
  dragging: {
    target: null
  }
};


addGamesToMenu();
prepareGame(Object.keys(SORT_GAMES)[0]);

function addGamesToMenu() {
  Object.keys(SORT_GAMES).forEach((key) => {
    const title = SORT_GAMES[key].title;
    const menuItemElement = HTML_ELEMENTS.menu.itemTemplate.cloneNode(true);
    menuItemElement.id = `sortgame-${key}`;
    menuItemElement.addEventListener('click', () => prepareGame(key));
    menuItemElement.getElementsByTagName('button')[0].innerText = title;
    HTML_ELEMENTS.menu.menuContainer.appendChild(menuItemElement);
  })
}

function prepareGame(key) {
  HTML_ELEMENTS.title.innerText = SORT_GAMES[key].title
  HTML_ELEMENTS.description.innerText = SORT_GAMES[key].description
  if (state.selectedGame === key) {
    selectNextBuckets();
  } else {
    state.selectedGame = key;
    [...state.remainingBuckets] = SORT_GAMES[key].buckets;
    selectNextBuckets();
  }
}

function selectNextBuckets() {
  if (state.remainingBuckets.length < 2) {
    [...state.remainingBuckets] = SORT_GAMES[state.selectedGame].buckets;
  }
  HTML_ELEMENTS.buckets.container.innerHTML = '';
  HTML_ELEMENTS.items.container.innerHTML = '';
  state.items = [];
  ['bucketOne', 'bucketTwo'].forEach((bucket, i) => {
    state[bucket] = takeBucket();
    state[bucket].items = state[bucket].items.map((item) => item.toString());
    state[bucket].items.forEach((item) => state.items.push(item));
    [...state[bucket].itemsLeft] = state[bucket].items;
    const bucketElement = HTML_ELEMENTS.buckets.template.cloneNode(true);
    bucketElement.id = `${state[bucket].name}-container`
    bucketElement.getElementsByTagName('span')[0].innerText = state[bucket].name;
    const bucketDropTarget = bucketElement.getElementsByTagName('div')[0];
    bucketDropTarget.id = bucket;
    if (SORT_GAMES[state.selectedGame].quantity) {
      bucketDropTarget.style.height = `${state[bucket].name}rem`;
    } else {
      bucketDropTarget.style.height = `${state[bucket].items.length * BUCKET_ROW_HEIGHT}rem`;
    }
    HTML_ELEMENTS.buckets.container.appendChild(bucketElement);
  });
  state.itemsCount = state.items.length;
  state.itemsAttempts = 0;
  state.itemsDone = 0;
  shuffleItems(state.items);
  [...itemCOLORS] = COLORS;
  state.items.forEach((item, i) => {
    const itemElement = HTML_ELEMENTS.items.template.cloneNode(true);
    itemElement.id = `item_${item}-${i}`;
    itemElement.dataset.item = item;
    itemElement.getElementsByTagName('span')[0].innerText = item;
    const color = itemCOLORS.splice(randomInteger(itemCOLORS.length), 1)[0];
    itemElement.style.backgroundColor = color;
    if (SORT_GAMES[state.selectedGame].quantity) {
      itemElement.style.height = `${Number(item)}rem`;
    }
    HTML_ELEMENTS.items.container.appendChild(itemElement);
  })
}

function takeBucket() {
  const count = state.remainingBuckets.length;
  const nextIndex = randomInteger(count);
  const nextBucket = state.remainingBuckets.splice(nextIndex, 1)[0];
  return nextBucket;
}

function shuffleItems(items) {
  for (let i = 0, j, swap; i < items.length; i++) {
    j = randomInteger(items.length);
    swap = items[j];
    items[j] = items[i];
    items[i] = swap;
  }
}

function randomInteger(max) {
  return Math.floor(Math.random() * max);
}

function mouseDropAllow(ev) {
  ev.preventDefault();
}

function mouseDragStart(ev) {
  state.dragging.source = ev.target;
}

function touchStart(ev) {
  const sourceElement = ev.target.dataset.item ? ev.target : ev.path[1];
  state.dragging.source = sourceElement;
  sourceElement.style.position = 'absolute';
}

function touchMove(ev) {
  ev.preventDefault();
  const x = ev.changedTouches[0].clientX;
  const y = ev.changedTouches[0].clientY;
  const sourceElement = state.dragging.source;
  sourceElement.style.left = `${x}px`;
  sourceElement.style.top = `${y}px`;
  state.dragging.target = document.elementFromPoint(x, y);
}

function touchDrop(ev) {
  ev.preventDefault();
  const sourceElement = state.dragging.source;
  sourceElement.style.position = 'initial';
  drop(sourceElement);
}

function mouseDrop(ev) {
  ev.preventDefault();
  state.dragging.target = ev.target;
  drop(state.dragging.source);
}

function drop() {
  state.itemsAttempts += 1;
  const bucket = state.dragging.target.id;
  if (bucket !== 'bucketOne' && bucket !== 'bucketTwo') return;
  const itemName = state.dragging.source.dataset.item;
  if (state[bucket].itemsLeft.includes(itemName)) {
    state.dragging.target.appendChild(state.dragging.source);
    state[bucket].itemsLeft.splice(state[bucket].itemsLeft.indexOf(itemName), 1);
    state.itemsDone += 1;
    setTimeout(function () {
      if (state.itemsDone === state.itemsCount) {
        if (state.itemsAttempts > state.itemsDone) {
          showMessage('Well done! Keep up the good work. Maybe try and get fewer wrong next time.');
        } else {
          showMessage('Great job!');
        }
        selectNextBuckets();
      }
    }, 500);
  } else {
    showMessage('OOPS! WRONG!');
  }
}

function showMessage(message) {
  HTML_ELEMENTS.message.text.innerText = message;
  HTML_ELEMENTS.message.container.style.display = 'flex';
}

function hideMessage() {
  HTML_ELEMENTS.message.container.style.display = 'none';
}
