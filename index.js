// mini Jeux 100% JS 
// Jeux Chat vs Souris 

// Enum
const types = {
  CHAT: "chat",
  SOURIS: "souris"
};

// globals variables INIT
var period = 20000; // Temps maximum d'execution 
var display = ""; // variable d 'affichage
var isFinish=false; // permet l'arret
var rainbowColors = [
  "Violet",
  "Indigo",
  "Blue",
  "Green",
  "Yellow",
  "Orange",
  "Red"
];
var powerRatio = 10; // difference de puissance entre le chasseur et les proies
var power = 20; // valeur de base de force
var backgroundColor = ["green", "white", "grey"];
var colors = ["red", "blue"];
var itemNumber = 60;// Nombres d'elements maximum sur le jeux
var items = ["chat", "souris", "souris", "autreSouris"];
var index = 0;
var maxRange = 400; // Nombre de pixels de la zone de jeux
var color = colors[0];
var minpos = { x: 0, y: 0 }; // pos0 de la fenetre
var maxpos = { x: maxRange, y: maxRange }; // pos maxi de la fenetre
var middlepos = {
  x: (maxpos.x - minpos.x) / 2,
  y: (maxpos.y - minpos.y) / 2
}; // position mediane 
var vitesse = 200; // vitesse de base 
var taille = 50; // Taile des items en px
var ref = 0;
var count = 0;
var animals = new Array(); // init des arrays
var animations = new Array();
var floor = "floor";
var score = "score";

// init des fonctions principales


// Creation des animaux en fonction de type

function createAnimal(type) {
  var animal = {};
  if (!type) type = types.SOURIS;
  switch (type) {
    case types.CHAT:
      animal = new Person(
        types.CHAT,
        initpos(0),
        targetpos(),
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
        targetpos(),
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
        targetpos(),
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

// position de departs aléatoires des items dans 2 zones pré-definie
/**
 * 
 * @param {*} add  =0 :1er partie horizontal =1 deuxième partie horizontal 
 *                      
 */
function initpos(add) {
  var posx = parseInt(Math.random() * maxpos.x);
  var posy = parseInt(add * middlepos.y + Math.random() * middlepos.y);
  return { x: posx, y: posy };
}

// choix aléatire parmis 4 positions finales predefinies  
/**
 * return final position
 */
function targetpos(){
  let corner=parseInt(Math.random()*4);
  let posx=0;
  let posy=0;
  if (!corner) corner=0;
  switch(corner) {
case 1: posx=maxRange;break;
case 2: posy=maxRange; posx=maxRange;break;
case 3: posy=maxRange;break; 
default: break; }
  
  return { x: posx, y: posy };

}


// main class for all moving object


/**
 * créer le personnage 
*type: types.chat ou souris (enum types)
*position: position de depart
*targetPos: position d'arrivé
*color: couleur 
 *vitesse: vitesse 
 * force: ferce de frappe
 *  vie: puissancve de vie 
 * taille: taille de l'obget graphique en pixel
 */

 class Person {
  constructor(type, position,targetPos, color, vitesse, force, vie, taille) {
    ref += 1; // unique Id
    var nom = type + ref;
    createSquare(floor, nom, taille, color, type); // création graphique de l objet
    var element = document.getElementById(nom);
    // mouse contoller actions
    element.onclick = function() {  // duplique l'objet
      var animal = createAnimal(type);
      animals.push(animal);
    };
    var objet = this;
    element.onmouseover = function() { // augmente sa vie
      objet.soigne(force);
        };

    var emoji = "🐈";
    if (type == types.SOURIS) emoji = "🐁";
    var pos = verif2D(position); // verification d'être dans la zone affichage

    // init du nouvelle objet    

    this.targetPos=targetPos;
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
  changePos(position) {   // déplace l'objet
    var pos = verif2D(position);
    this.pos = pos;
    this.elm.style.top = this.pos.y + "px";
    this.elm.style.left = this.pos.x + "px";
    if (this.vie > 0) this.elm.textContent = this.emoji + this.vie;
  }
  degat(force) {  // suite à une attaque
    this.vie = this.vie - force;
    this.elm.style.background = changeColor();
    if (this.vie > 0) this.elm.textContent = this.emoji + this.vie;
  }
  isDead() { // mort ?
    if (this.vie <= 0) {
      this.elm.style.background = backgroundColor[0];
      this.elm.textContent = this.emoji + "🔥";
      return true;
    } else {
      return false;
    }
  }
  soigne(force) { // soigne 
    this.degat(-force);
  }
}

// fonctions utilisées dans la class

// verifie que l'on se trouve dans la zone autorisé et limite la position à la zone possible d'afichage
/**
 * 
 * @param {*} pos = position de l'objet 
 */
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

// créer l'element à affiché
/**
 * creer un element box html
 * @param {*} parent html parent
 * @param {*} enfant html enfant
 * @param {*} taille taille de la boite
 * @param {*} color couleur de la boite
 * @param {*} image image de fond
 */
function createSquare(parent, enfant, taille, color, image) {
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

  img.src='./img/"+image+".png';

  img.addEventListener('load', function() {

    e.appendChild(img);
});

p.appendChild(img);

  p.appendChild(e);

}
/**Creer le fond graphique
 * 
 * @param {*} nom nom de la fenetre
 * @param {*} taille taille en pixel
 * @param {*} color couleur
 * @param {*} image image de fond
 */
function createFloor(nom, taille, color, image) {
  var e = document.createElement("div");
  e.id = nom;
  e.style.width = taille + "px";
  e.style.height = taille + "px";
  e.style.background = color;
  e.style.position = "relative";
  e.onclick = function() {
    move();
  };

  var img=new Image(taille,taille);

  img.src='./img/"+image+".png';

  img.addEventListener('load', function() {

    e.appendChild(img);
});

e.appendChild(img);

  document.body.appendChild(e);
}
/**
 * roue de couleurs de l arc en ciel
 */
function changeColor() {
  index += 1;
  index = index % rainbowColors.length;
  return rainbowColors[index];
}


/**
 *  fonction de deplacement automatique 
 * routine appelé regulierement 
 */
function move() {
  display=""; // remet l affichage à zero
  if (animals.length > 1) { // cdt minimum
  isFinish=true; // fin de vie du programme
  let isContinueA=false; 
  let isContinueB=false;
         animals.forEach(function(element) {
      let mov = { x: 0, y: 0 };
      // comportements
    switch (element.type) {

    case types.SOURIS:         
     mov = targetMove(element.pos,element.targetPos); //  comportement de fuite
     isFinishA=true; // au moins un item est present 
      break;
    
    case types.CHAT:
    mov= huntMove(element.pos,element.type); // comportement de chasseur
    isFinishB=true; // au moins un item est present
    break;

    default: 
    mov = randomMove(element.pos); //  comportement aleatoire
     isFinishA=true; // au moins un item est present 
      break;
    }

      mov = { x: element.v * mov.x, y: element.v * mov.y }; // deplacement avec la vitesse
      var pos = { x: mov.x + element.pos.x, y: mov.y + element.pos.y };

      pos = verif2D(pos); // verifie que nous sommes pas hors cadre
      
      display =display+"<P>"+
        " nom: " +
        element.nom +
        " vie: " +
        element.vie +
        " pos x: " +
        element.pos.x +
        " y: " +
        element.pos.y
        +"</P>";
   
      element.changePos(pos); // change la position de l'objet
      animals = isSamePosition(element); //verifie et elimine les items mort
    });
    isFinish=!(isContinueA^isContinueB); // au moins un item est present mais pas les deux 
    console.log(display);
  } else window.alert("FINI !");
}
// fonctions utilisées dans move
/**
 * Avance ou recule de 1 pas maxi
 */
function randomSens() {
  let dir = (Math.random() * 2) - 1; // valeur comprise entre -1 et 1
  return dir;
}
/**
 * deplacement aleatoire de 1 pas en 2D
 */
function randomMove() {
  let pos = { x: 0, y: 0 };
  pos.x = randomSens();
  pos.y = randomSens();
  return pos;
}
/**
 * Deplacement de chasseur
 * @param {*} pos position de depart
 * @param {*} type type d'items
 */
function huntMove(pos,type) {
  let targetpos = { x: 0, y: 0 };
  if (pos == null) pos = { x: 0, y: 0 };
  if (nearPos(pos,type) != null) targetpos = nearPos(pos,type);
  return moveToTarget(pos,targetpos);
}
/**
 * 
 * @param {*} pos position actuelle 
 * @param {*} targetpos position finale
 */
function targetMove(pos,targetpos) {
   if (pos == null) pos = { x: 0, y: 0 };
  return moveToTarget(pos,targetpos);
}
/**
 * @returns next position 
 *  @param {*} pos position actuelle 
 * @param {*} targetpos position finale
 */
function moveToTarget(pos,targetpos) { 
  let mov = { x: 0, y: 0 }; 
  if (targetpos.x - pos.x > 0) mov.x = 1;
  if (targetpos.x - pos.x < 0) mov.x = -1;
  if (targetpos.y - pos.y > 0) mov.y = 1;
  if (targetpos.y - pos.y < 0) mov.y = -1;
  return { x: mov.x, y: mov.y };
}

/**
 * 
 * @param {*} animal verifie si cette objet touche un autre objet
 * @returns animals les objets modifies et eliminées suite à la collision 
 */
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
/**
 * retourne la distance de l'objet different le plus proche
 * @param {*} pos position de l'objet 
 * @param {*} type  type d objet
 */
function nearPos(pos,type) {
  let nearPos = null;
  animals.forEach(function(element) {
    if (element.type != type) {
      if (nearPos == null) {
        nearPos = element.pos;
      } else {
        if (distance2(pos, element.pos) < distance2(pos, nearPos))
          nearPos = element.pos; 
      }
    }
  });
  if (nearPos == null) nearpos = pos; //cas position identique ou plus d'items voulus

  return nearPos;
}
/**
 * calcul la distance au carrée entre les deux positions 
 * @param {*} pos 
 * @param {*} pos2 
 */
function distance2(pos, pos2) {
  return (pos.x - pos2.x) ** 2 + (pos.y - pos2.y) ** 2;
}

// ready ?
/**
 * Programme principal
 */
window.onload = function() { 
  createFloor(floor, maxRange, backgroundColor[0], floor); // creer le background floor
  createFloor(score, maxRange, backgroundColor[1], score); // creer le background score

  let ratio=parseInt(Math.random() *10); 

  powerRatio=powerRatio+ratio; // ratio chasseur vs Proies
// creér les items en respectant le ratio
  for (let index = 0; index <= itemNumber - items.length; index++) {
    let item = types.SOURIS;
    if (index % powerRatio*2 == 0) item = types.CHAT;
    items.push(item);
  }
// créer les objets 
  items.forEach(function(item) {
    var animal = createAnimal(item);
    animals.push(animal);
  });
// Raffraichissement, fonctioon recurrente 
  window.requestAnimationFrame =
    window.requestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.msRequestAnimationFrame;

  var start = null;

  var d = document.getElementById(floor); // fenêtre liée au mouvement 

  function step(timestamp) {
    var progress;
    if (start === null) start = timestamp;
    progress = timestamp - start;
    d.style.left = Math.min(progress / 10, 200) + "px";
    if (progress < period || !isFinish ) {  // arret si temps > period ou si le jeux est fini
      requestAnimationFrame(step);
      requestAnimationFrame(move);
    }
  }
// init du 1 er tour
  requestAnimationFrame(step);
  requestAnimationFrame(move);
};
