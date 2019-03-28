// Enum
const types = {
  CHAT: "chat",
  SOURIS: "souris"
};

// globals variables INIT
var period = 8000;
var display = "";
var isFinish=false;
var rainbowColors = [
  "Violet",
  "Indigo",
  "Blue",
  "Green",
  "Yellow",
  "Orange",
  "Red"
];
var powerRatio = 10;
var power = 20;
var backgroundColor = ["green", "white", "grey"];
var colors = ["red", "blue"];
var itemNumber = 60;
var items = ["chat", "souris", "souris", "autreSouris"];
var index = 0;
var maxRange = 400;
var color = colors[0];
var minpos = { x: 0, y: 0 };
var maxpos = { x: maxRange, y: maxRange };
var middlepos = {
  x: (maxpos.x - minpos.x) / 2,
  y: (maxpos.y - minpos.y) / 2
};
var vitesse = 200;
var taille = 50;
var ref = 0;
var count = 0;
var animals = new Array();
var animations = new Array();
var floor = "floor";
var score = "score";

// init des fonctions globales

function createAnimal(type) {
  var animal = {};
  if (!type) type = types.SOURIS;
  switch (type) {
    case types.CHAT:
      animal = new Person(
        types.CHAT,
        initpos(0),
        colors[0],
        2,
        power / 4,
        power * powerRatio,
        taille
      );
      break;
    case types.SOURIS:
      animal = new Person(
        types.SOURIS,
        initpos(1),
        colors[1],
        1,
        power / 5,
        power,
        taille
      );
      break;
    default:
    case types.SOURIS:
      animal = new Person(
        types.SOURIS,
        initpos(1),
        colors[1],
        1,
        power / 5,
        power,
        taille
      );
      break;
  }
  return animal;
}

function initpos(add) {
  var posx = parseInt(Math.random() * maxpos.x);
  var posy = parseInt(add * middlepos.y + Math.random() * middlepos.y);
  return { x: posx, y: posy };
}

// main class for all moving object

class Person {
  constructor(type, position, color, vitesse, force, vie, taille) {
    ref += 1; // unique Id
    var nom = type + ref;
    createSquare(floor, nom, taille, color, type);
    var element = document.getElementById(nom);
    // mouse contoller actions
    element.onclick = function() {
      var animal = createAnimal(type);
      animals.push(animal);
    };
    var objet = this;
    element.onmouseover = function() {
      objet.soigne(force);
    
    };

    var emoji = "🐈";
    if (type == types.SOURIS) emoji = "🐁";
    var pos = verif2D(position);

    this.emoji = emoji;
    this.nom = nom;
    this.type = type;
    this.elm = element;
    this.pos = pos;
    this.v = vitesse;
    this.color = color;
    this.force = force;
    this.vie = vie;
    this.elm.style.top = pos.y + "px";
    this.elm.style.left = pos.x + "px";
  
  }
  changePos(position) {
    var pos = verif2D(position);
    this.pos = pos;
    this.elm.style.top = this.pos.y + "px";
    this.elm.style.left = this.pos.x + "px";
    if (this.vie > 0) this.elm.textContent = this.emoji + this.vie;
  }
  degat(force) {
    this.vie = this.vie - force;
    this.elm.style.background = changeColor();
    if (this.vie > 0) this.elm.textContent = this.emoji + this.vie;
  }
  isDead() {
    if (this.vie <= 0) {
      this.elm.style.background = backgroundColor[0];
      this.elm.textContent = this.emoji + "🔥";
      return true;
    } else {
      return false;
    }
  }
  soigne(force) {
    this.degat(-force);
  }
}

// fonctions utilisées dans la class
function verif2D(pos) {
  var x = pos.x;
  var y = pos.y;
  if (x + taille > maxpos.x) {
    x = maxpos.x - taille;
  }
  if (y + taille > maxpos.y) {
    y = maxpos.y - taille;
  }
  if (x < minpos.x) {
    x = minpos.x;
  }
  if (y < minpos.y) {
    y = minpos.y;
  }
  return { x: x, y: y };
}
function createSquare(parent, enfant, taille, color, img) {
  var p = document.getElementById(parent);
  if (Boolean(p) == false) {
    p = document.createElement("div");
    p.id = parent;
    document.body.appendChild(p);
  }
  var e = document.createElement("div");
  e.id = enfant;
  e.style.width = taille + "px";
  e.style.height = taille + "px";
  e.style.background = color;
  e.style.position = "absolute";

  var img=new Image(taille,taille);

  img.src='./img/"+img+".png';

  img.addEventListener('load', function() {

    e.appendChild(img);
});

  p.appendChild(e);

}

function createFloor(nom, taille, color, img) {
  var e = document.createElement("div");
  e.id = nom;
  e.style.width = taille + "px";
  e.style.height = taille + "px";
  e.style.background = color;
  e.style.position = "relative";
  e.onclick = function() {
    move();
  };

  document.body.appendChild(e);
}

function changeColor() {
  index += 1;
  index = index % rainbowColors.length;
  return rainbowColors[index];
}

// fonction de deplacement automatique lorque que l'on click sur le floor
function move() {
  if (animals.length > 1) {
  isFinish=false; 
      animals.forEach(function(element) {
      var mov = { x: 0, y: 0 };
      // comportements
      if (element.type == "souris") mov = randomMove(element.pos); //  comportement aléatoire
      if (element.type == "chat") mov = huntMove(element.pos); // comportement de chasseur
      mov = { x: element.v * mov.x, y: element.v * mov.y }; // deplacement avec la vitesse
      var pos = { x: mov.x + element.pos.x, y: mov.y + element.pos.y };

      pos = verif2D(pos); // verifie que nous sommes pas hors cadre
      display =
        "nom:" +
        element.nom +
        "vie:" +
        element.vie +
        "pos x:" +
        element.pos.x +
        " y:" +
        element.pos.y;
      console.log(display);
      element.changePos(pos); // change la position de l'objet
      animals = isSamePosition(element); //verifie et elimine les items mort
    });
  } else window.alert("FINI !");
}
// fonctions utilisées dans move

function randomSens() {
  let dir = parseInt(Math.random() * 2) - 1; // valeur comprise entre -1 et 1
  return dir;
}

function randomMove() {
  var pos = { x: 0, y: 0 };
  pos.x = randomSens();
  pos.y = randomSens();
  return pos;
}

function huntMove(pos) {
  var mov = { x: 0, y: 0 };
  var targetpos = mov;
  if (pos == null) pos = { x: 0, y: 0 };
  if (nearPos(pos) != null) targetpos = nearPos(pos);
  if (targetpos.x - pos.x > 0) mov.x = 1;
  if (targetpos.x - pos.x < 0) mov.x = -1;
  if (targetpos.y - pos.y > 0) mov.y = 1;
  if (targetpos.y - pos.y < 0) mov.y = -1;

  return { x: mov.x, y: mov.y };
}

function isSamePosition(animal) {
  var updatedAnimals = new Array();
  animals.forEach(function(element, index) {
    if (element.type != animal.type && element.nom != animal.nom) {
      var pos = element.pos;
      if (distance2(pos, animal.pos) < 4 && !element.isDead()) {
        element.degat(animal.force);
        console.log(" Take That ! " + element.nom);
        if (element.isDead()) {
          console.log(element.nom + " is Dead !");
        }
      }
    }
    if (!element.isDead()) updatedAnimals.push(element);
  });
  return updatedAnimals;
}

function nearPos(pos) {
  var nearPos = null;
  animals.forEach(function(element) {
    if (element.type == types.SOURIS) {
      if (nearPos == null) {
        nearPos = element.pos;
      } else {
        if (distance2(pos, element.pos) < distance2(pos, nearPos))
          nearPos = element.pos;
      }
    }
  });
  if (nearPos == null) nearpos = pos; //cas position identique ou plus de souris

  return nearPos;
}

function distance2(pos, pos2) {
  return (pos.x - pos2.x) ** 2 + (pos.y - pos2.y) ** 2;
}

// ready ?
window.onload = function() { 
  createFloor(floor, maxRange, backgroundColor[0], null);
  createFloor(score, maxRange, backgroundColor[1], null);

  let ratio=parseInt(Math.random() *10);

  powerRatio=powerRatio+ratio;

  for (let index = 0; index <= itemNumber - items.length; index++) {
    let item = types.SOURIS;
    if (index % powerRatio*2 == 0) item = types.CHAT;
    items.push(item);
  }

  items.forEach(function(item) {
    var animal = createAnimal(item);
    animals.push(animal);
  });

  window.requestAnimationFrame =
    window.requestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.msRequestAnimationFrame;

  var start = null;

  var d = document.getElementById(floor);

  function step(timestamp) {
    var progress;
    if (start === null) start = timestamp;
    progress = timestamp - start;
    d.style.left = Math.min(progress / 10, 200) + "px";
    if (progress < period ) {
      requestAnimationFrame(step);
      requestAnimationFrame(move);
    }
  }

  requestAnimationFrame(step);
  requestAnimationFrame(move);
};
