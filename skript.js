
// Proměnné
let Aplikace = PIXI.Application,
    Kontejner = PIXI.Container,
    nacti = PIXI.loader,
    nactiZeZdroje = PIXI.loader.resources,
    Textura = PIXI.utils.TextureCache,
    Sprite = PIXI.Sprite,
    GrafickyObjekt = PIXI.Graphics,
    Text = PIXI.Text,
    StylTextu = PIXI.TextStyle;

// Vytvoř novou PIXI Aplikaci (canvas)
let lovecPokladu = new Aplikace({
    width: 512,
    height: 512,
    antialiasing: true,
    transparent: false,
    resolution: 1
});

// Přidej vytvořený canvas 'lovecPokladu' do HTML
document.body.appendChild(lovecPokladu.view);

// Načti soubor JSON a proveď funkci 'setup', až bude načtený
nacti
    .add("images/lovecPokladu.json")
    .load(setup);

// Definuj proměnné, které mohou být použity víckrát
let herniScena,
    id,
    doupe,
    dvere,
    pruzkumnik,
    truhla,
    blob,
    healthBar,
    herniScenaNaKonci,
    zprava,
    stavHry;

function setup() {

    // Vytvoříme skupinu 'herniScena' a rovnou ji přidáme na stage (níže do ní začneme hned přidávat sprity)
    herniScena = new Kontejner();
    lovecPokladu.stage.addChild(herniScena);

    // Do proměnné 'id' si uložíme cestu k atlasu textur 
    let id = nactiZeZdroje["images/lovecPokladu.json"].textures;

    // Doupě
    doupe = new Sprite(id["doupe.png"]);
    herniScena.addChild(doupe);

    // Dveře
    dvere = new Sprite(id["dvere.png"]);
    dvere.position.set(32, 0);
    herniScena.addChild(dvere);

    // Průzkumník
    pruzkumnik = new Sprite(id["pruzkumnik.png"]);
    pruzkumnik.x = 68;
    pruzkumnik.y = herniScena.height / 2 - pruzkumnik.height / 2; // Počáteční pozice na ose y je uprostřed stage
    pruzkumnik.vx = 0;
    pruzkumnik.vy = 0;
    herniScena.addChild(pruzkumnik);

    // Truhla s pokladem
    truhla = new Sprite(id["truhla.png"]);
    truhla.x = herniScena.width - truhla.width - 48; // kousek od pravého okraje
    truhla.y = herniScena.height / 2 - truhla.height / 2; // uprostřed stage
    herniScena.addChild(truhla);

    // 6 blobů
    let pocetBlobu = 6,
        misto = 48,
        odsazeniOsyX = 150,
        rychlost = 2,
        smer = 1;

    // Všechny bloby, které vytvoříme, budem dávat do jednoho pole 'bloby' 
    bloby = [];

    // Vytvoř tolik blobů, kolik je v proměnné 'pocetBlobu' (cyklus)
    for (let i = 0; i < pocetBlobu; i++) {

        // Vytvoř bloba
        let blob = new Sprite(id["blob.png"]);

        // Hodnota 'odsazeníOsyX' znamená odsazení prvního bloba od levého okraje stage
        // Každý další blob bude v ose x umístěn o hodnotu 'misto' od toho předchozího
        let x = misto * i + odsazeniOsyX;

        // V ose y bude každý blob umístěn náhodně tak, aby vytvořený blob nepřesahoval přes okraj stage
        // Jeho pozice na ose y tedy bude náhodně v rozmezí 0 - 512px
        // Pomocná funkce 'randomInt()' viz níže
        let y = randomInt(0, lovecPokladu.stage.height - blob.height);

        // Hodnoty x a y, které jsme nastavili výše, přiřadíme spritu 'blob'
        blob.x = x;
        blob.y = y;

        // Nastavíme rychlost a směr každého blobu. Díky proměnné 'smer' jednoduše nastavíme, aby se každý nově
        // vytvořený blob pohyboval opačným směrem než ten předchozí
        blob.vy = rychlost * smer;
        smer *= -1; // tím, že v každé iteraci (cyklu) násobíme proměnnou 'smer' hodnotou -1, každý nový blob se bude pohybovat v opačném směru než ten předchozí

        // Každého bloba vložíme do připraveného pole 'bloby'
        bloby.push(blob);

        herniScena.addChild(blob);
    };

    // Vytvoříme health bar, jako kontejner - potřebuju totiž jeden objekt, který bude znázorňovat prázdný bar
    // a druhý jako plný. Health bar jsou vlastně dva překrývající se obdélníky :)
    healthBar = new Kontejner();
    healthBar.position.set(lovecPokladu.stage.width - 170, 4);
    herniScena.addChild(healthBar);

    // Vytvoříme grafický objekt - prázdný bar (černý)
    prazdnyBar = new GrafickyObjekt();
    prazdnyBar.beginFill(0x000000);
    prazdnyBar.drawRect(0, 0, 128, 8);
    prazdnyBar.endFill();
    healthBar.addChild(prazdnyBar);

    // Vytvoříme plný bar (červený)
    plnyBar = new GrafickyObjekt();
    plnyBar.beginFill(0xFF3300);
    plnyBar.drawRect(0, 0, 128, 8);
    plnyBar.endFill();
    healthBar.addChild(plnyBar);

    // Vytvoříme také skupinu 'herniScenaNaKonci' a také ji přidáme na stage, ale při startu hry nechceme, aby tato
    // skupina byla vidět (to chceme až prohrajeme/vyhrajeme), takže nastavíme visible na false
    herniScenaNaKonci = new Kontejner();
    lovecPokladu.stage.addChild(herniScenaNaKonci);
    herniScenaNaKonci.visible = false;

    // Vytvoříme text, který se zobrazí při výhře/prohře a přidáme jej do skupiny 'herniScenaNaKonci'
    style = new StylTextu({
        fontFamily: "Arial",
        fontSize: 30,
        fill: "white"
    });
    zprava = new Text("Konec!", style);
    herniScenaNaKonci.addChild(zprava);

    // Ovládání průzkumníka šipkami na klávesnici
    // Pomocná funkce 'keyboard()' viz níže
    let vlevo = keyboard(37),
        nahoru = keyboard(38),
        vpravo = keyboard(39),
        dolu = keyboard(40);

    // Metoda při stisknutí šipky vlevo
    vlevo.press = function () {

        // Pokud je klávesa stisknutá, sprite 'pruzkumnik' se dá do pohybu směrem doleva
        pruzkumnik.vx = -5;
        pruzkumnik.vy = 0;
    };

    // Metoda při puštění šipky vlevo
    vlevo.release = function () {

        //Pokud je klávesa šipky doleva puštěná, klávesa šipky vlevo není stisknutá a zároveň se sprite 'pruzkumnik' nehýbe 
        // po ose y: Zastav průzkumníka!
        if (!vpravo.isDown && pruzkumnik.vy === 0) {
            pruzkumnik.vx = 0;
        }
    };

    // Nahoru
    nahoru.press = function () {
        pruzkumnik.vy = -5;
        pruzkumnik.vx = 0;
    };
    nahoru.release = function () {
        if (!dolu.isDown && pruzkumnik.vx === 0) {
            pruzkumnik.vy = 0;
        }
    };

    // Vpravo
    vpravo.press = function () {
        pruzkumnik.vx = 5;
        pruzkumnik.vy = 0;
    };
    vpravo.release = function () {
        if (!vlevo.isDown && pruzkumnik.vy === 0) {
            pruzkumnik.vx = 0;
        }
    };

    // Dolů
    dolu.press = function () {
        pruzkumnik.vy = 5;
        pruzkumnik.vx = 0;
    };
    dolu.release = function () {
        if (!nahoru.isDown && pruzkumnik.vx === 0) {
            pruzkumnik.vy = 0;
        }
    };

    // Nastav 'stavHry' na 'hraj'
    stavHry = hraj;

    // Spusť herní smyčku 'gameLoop'
    lovecPokladu.ticker.add(delta => gameLoop(delta));
};

function gameLoop(delta) {

    // V herní smyčce aktualizuj stav hry (herní smyčka se opakuje 60x za vteřinu)
    stavHry(delta);
};

function hraj(delta) {

    // Použij rychost spritu 'pruzkumnik' (dle stisknutých šipek) pro uvedení do pohybu (změnu aktuální pozice x a y)
    pruzkumnik.x += pruzkumnik.vx;
    pruzkumnik.y += pruzkumnik.vy;

    // Udrž průzkumníka uvnitř doupěte pomocí funkce 'contain()'. Funguje jako hranice, ve které chceme udržet sprite 
    // při pohybu. V naší hře Lovec Pokladů jde o to, že nechceme, aby se průzkumník (a níže i bloby) pohybovali dál než 
    // jsou vnitřní hrany zdí doupěte.
    // Pomocná funkce 'contain()' viz níže
    contain(pruzkumnik, { x: 28, y: 10, width: 488, height: 480 });

    // Nejprve nastavíme proměnnou 'pruzkumnikZasazen' na false - při detekcích kolice s bloby budeme tuto hodnotu měnit
    let pruzkumnikZasazen = false;

    // Metoda 'forEach' projde celé pole blobů (které jsme vytvořili ve funkci 'setup()') a u každého blobu bude provádět 
    // smyčku následujících úkonů (iterace probíhá každý snímek!): pohyb bloba, detekce kolize bloba se stěnou doupěte, 
    // změna směru bloba při kolizi, detekce kolice bloba s průzkumníkem a při této kolizi nastavení proměnné 
    // 'pruzkumnikZasazen' na true
    bloby.forEach(function (blob) {

        // Uvedení blobů do pohybu 
        blob.y += blob.vy;

        // Detekce, zda blob narazil do zdi doupěte
        let narazBlobaDoZdi = contain(blob, { x: 28, y: 10, width: 488, height: 480 });

        // Pokud blob narazí do horního nebo spodního okraje doupěte, změní směr na opačný
        if (narazBlobaDoZdi === "top" || narazBlobaDoZdi === "bottom") {
            blob.vy *= -1;
        }

        // Detekce kolice průzkumníka a bloba. Pokud jakýkoli blob narazí do průzkumníka, změní se hodnota proměnné
        // 'pruzkumnikZasazen' na true.
        // Pomocná funkce 'hitTestRectangle()' viz níže
        if (hitTestRectangle(pruzkumnik, blob)) {
            pruzkumnikZasazen = true;
        }
    });

    // A pokud je průzkumník zasažen...
    if (pruzkumnikZasazen) {

        // Zprůhledni postavičku průzkumníka
        pruzkumnik.alpha = 0.5;

        // Zmenši health bar 'plnyBar' o 1 pixel
        plnyBar.width -= 1;

    } else {

        // Pokud už průzkumník není zasažen, opět ho zneprůhledni
        pruzkumnik.alpha = 1;
    };

    // Pokud průzkumník přijde k truhle s pokladem, truhla se přilepí k průzkumníkovi s mírným posunem, jakoby ji nesl
    if (hitTestRectangle(pruzkumnik, truhla)) {
        truhla.x = pruzkumnik.x + 8;
        truhla.y = pruzkumnik.y + 8;
    }

    // Pokud se truhla s pokladem dotkne dveří, vyhráváš a hra končí
    if (hitTestRectangle(truhla, dvere)) {
        stavHry = konec;
        zprava.text = "Vyhráváš, kundo!";
        zprava.x = lovecPokladu.stage.width / 2 - zprava.width / 2;
        zprava.y = lovecPokladu.stage.height / 2 - zprava.height / 2;
    }

    // Pokud vyčerpáš health bar, prohráváš a hra končí
    if (plnyBar.width < 0) {
        stavHry = konec;
        zprava.text = "Prohrál jsi, hňupe!";
        zprava.x = lovecPokladu.stage.width / 2 - zprava.width / 2;
        zprava.y = lovecPokladu.stage.height / 2 - zprava.height / 2;
    }
};

function konec() {
    herniScenaNaKonci.visible = true;
    herniScena.visible = false;
}

// Pomocné funkce

// Pomocná funkce 'contain()' bere dva argumenty. První je sprite, který chceme udržet v určité oblasti a tím druhým 
// je právě ta oblast. Oblast definujeme ve složených závorkách následovně:
// {x: počáteční pozice oblasti v ose x, y: počáteční pozice oblasti v ose y, šířka oblasti, výška oblasti}
// Pozor! Tato funkce pouze vrací informaci, u které strany oblasti došlo ke kolizi s daným spritem.
function contain(sprite, container) {

    let collision = undefined;

    // Kolize vlevo
    if (sprite.x < container.x) {
        sprite.x = container.x;
        collision = "left";
    }

    // Kolize nahoře
    if (sprite.y < container.y) {
        sprite.y = container.y;
        collision = "top";
    }

    // Kolize vpravo
    if (sprite.x + sprite.width > container.width) {
        sprite.x = container.width - sprite.width;
        collision = "right";
    }

    // Kolize dole
    if (sprite.y + sprite.height > container.height) {
        sprite.y = container.height - sprite.height;
        collision = "bottom";
    }

    // Vrať hodnotu kolize 'collision'
    return collision;
};

// Funkce pro detekci kolize mezi dvěma objekty
function hitTestRectangle(r1, r2) {

    // Definice proměnných, které budeme potřebovat vypočítat
    let hit, combinedHalfWidths, combinedHalfHeights, vx, vy;

    // Proměnná 'hit' určuje, zda došlo ke kolizi
    hit = false;

    // Vypočítej středový bod obou objektů
    r1.centerX = r1.x + r1.width / 2;
    r1.centerY = r1.y + r1.height / 2;
    r2.centerX = r2.x + r2.width / 2;
    r2.centerY = r2.y + r2.height / 2;

    // Vypočítej polovinu výšky a šířky obou objektů
    r1.halfWidth = r1.width / 2;
    r1.halfHeight = r1.height / 2;
    r2.halfWidth = r2.width / 2;
    r2.halfHeight = r2.height / 2;

    // Vypočítej vzdálenost mezi objekty
    vx = r1.centerX - r2.centerX;
    vy = r1.centerY - r2.centerY;

    // Sečti poloviny výšek a šířek obou objektů 
    combinedHalfWidths = r1.halfWidth + r2.halfWidth;
    combinedHalfHeights = r1.halfHeight + r2.halfHeight;

    // Zkontroluj kolizi v ose x
    if (Math.abs(vx) < combinedHalfWidths) {

        // A zároveň zkontroluj kolizi v ose y
        if (Math.abs(vy) < combinedHalfHeights) {

            // Při splnění obou podmínek dochází ke kolizi
            hit = true;
        } else {

            // Tady nedochází ke kolizi v ose y
            hit = false;
        }
    } else {

        // A tady nedochází ke kolizi v ose x
        hit = false;
    }

    // Vrať hodnotu proměnné 'hit'
    return hit;
};

// Funkce pro výběr náhodného čísla
function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Pomocná funkce 'keyboard()'
function keyboard(keyCode) {
    var key = {};
    key.code = keyCode;
    key.isDown = false;
    key.isUp = true;
    key.press = undefined;
    key.release = undefined;

    // Událost při stisknutí klávesy
    key.downHandler = event => {
        if (event.keyCode === key.code) {
            if (key.isUp && key.press) key.press();
            key.isDown = true;
            key.isUp = false;
        }
        event.preventDefault();
    };

    // Událost při puštění klávesy
    key.upHandler = event => {
        if (event.keyCode === key.code) {
            if (key.isDown && key.release) key.release();
            key.isDown = false;
            key.isUp = true;
        }
        event.preventDefault();
    };

    window.addEventListener(
        "keydown", key.downHandler.bind(key), false
    );
    window.addEventListener(
        "keyup", key.upHandler.bind(key), false
    );
    return key;
};