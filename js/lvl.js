 /*  Mini juego de gatito que intenta salir de la alcantarilla, los controles son las flechas 
 arriba, abajo, izquierda y derecha y para cambiar de imagen se debe hacer click encima de la imagen,
  El localStorage se almacena sólo si no se ganado la partida */
 
 void function () {

    let canvas;
    let ctx;
    let anchoF = 50;
    let altoF = 50;
    let hero;
    let enemigo = [];
    let imagenAntorcha;
    let imagenAntorcha2;
    let tileMap;
    let points = 0;
    let escenario = [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
        [0, 0, 5, 0, 0, 0, 2, 2, 2, 2, 0, 2, 2, 2, 0],
        [0, 0, 2, 2, 2, 2, 2, 0, 0, 2, 0, 2, 2, 0, 0],
        [0, 0, 2, 0, 0, 0, 2, 2, 0, 2, 0, 4, 2, 0, 0],
        [0, 0, 2, 3, 0, 0, 0, 2, 0, 2, 2, 2, 0, 0, 0],
        [0, 0, 2, 0, 0, 0, 0, 2, 0, 0, 0, 2, 0, 5, 0],
        [0, 0, 2, 0, 0, 0, 2, 2, 2, 0, 0, 2, 0, 2, 0],
        [0, 0, 2, 0, 0, 0, 2, 0, 2, 2, 2, 2, 2, 2, 0],
        [0, 0, 5, 0, 0, 0, 5, 0, 0, 0, 0, 2, 2, 2, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],

    ];    
    const FPS = 50;
    const API_URL = 'https://api.chucknorris.io/jokes/random';
    let fondo;

    fetch(API_URL)
        .then((resp) => resp.json())
        .then((data) => {
            console.log(data.value)
            let promVal = document.getElementById("api");
            promVal.textContent = data.value;
        });


    onload = function () {
        verStorage();
        loadPlayerName();
        loadgame();
    }

    function verStorage() {
        let st = localStorage.getItem("player");

        if (st == null) {
            let saludo = prompt("¿Cuál es tu nombre?");
            arr = {
                name: saludo,
                score: points
            };
            localStorage.setItem("player", JSON.stringify(arr));
            console.log(...arr.name);
            verLife();
        }

    }

    function loadPlayerName() {
        let st = localStorage.getItem("player");
        let obj = JSON.parse(st);

        let promVal = document.getElementById("hi");

        if (obj.name == '') {
            promVal.textContent = "invitado";

        } else {
            promVal.textContent = obj.name;
            score(points)
        }
    }

    function score(score) {
        let st = localStorage.getItem("player");
        let obj = JSON.parse(st);

        let scoreP = document.getElementById("points");

        obj.score = score;
        localStorage.setItem("player", JSON.stringify(obj));
        scoreP.textContent = obj.score;

    }

    function loadgame() {
        canvas = document.getElementById('canvas');
        ctx = canvas.getContext('2d');

        tileMap = new Image();
        tileMap.src = 'img/tilemap3.png';

        hero = new player();

        imagenAntorcha = new torch(0, 0);
        imagenAntorcha2 = new torch(14, 0);

        enemigo.push(new enemy(2, 1));
        enemigo.push(new enemy(8, 1));
        enemigo.push(new enemy(6, 6));
        enemigo.push(new enemy(11, 8));
        enemigo.push(new enemy(5, 2));
        enemigo.push(new enemy(3, 7)); 

        onkeydown = function (key) {

            if (key.keyCode == 38) {
                hero.up();
            }
    
            if (key.keyCode == 40) {
                hero.down();
            }
    
            if (key.keyCode == 37) {
                hero.left();
            }
    
            if (key.keyCode == 39) {
                hero.right();
            }
        }

        setInterval(function () {
            loadMap();
        }, 1000 / FPS);

        fondo = new Howl({
            src: ['sound/fondo.mp3'],
            loop: true,
            volume: 0.3
        }
        );
        fondo.play();
    }

    function loadMap() {
        deleteCanvas();
        drawAssets();
        imagenAntorcha.dibuja();
        imagenAntorcha2.dibuja();
        hero.dibuja();
        // secure.dibuja();

        for (c = 0; c < enemigo.length; c++) {
            enemigo[c].mueve();
            enemigo[c].dibuja();
        }

    }

    function deleteCanvas() {
        canvas.width = 750;
        canvas.height = 500;
    }

    function drawAssets() {
        for (y = 0; y < 10; y++) {
            for (x = 0; x < 15; x++) {
                let tile = escenario[y][x];
                ctx.drawImage(tileMap, tile * 32, 0, 32, 32, anchoF * x, altoF * y, anchoF, altoF);
            }
        }

    }

    function verLife() {
        let { nombre, vida } = arr;
        console.log(`Hola ${nombre} tú puedes lograrlo!`);
    }

    function torch(x, y) {
        this.x = x;
        this.y = y;

        this.retraso = 15;
        this.contador = 0;
        this.fotograma = 0;

        this.cambiaFotograma = function () {
            if (this.fotograma < 3) {
                this.fotograma++;
            }
            else {
                this.fotograma = 0;
            }

        }

        this.dibuja = function () {
            if (this.contador < this.retraso) {
                this.contador++;
            }
            else {
                this.contador = 0;
                this.cambiaFotograma();
            }
            ctx.drawImage(tileMap, this.fotograma * 32, 64, 32, 32, anchoF * x, altoF * y, anchoF, altoF);
        }

    }

    function enemy(x, y) {
        this.x = x;
        this.y = y;

        this.direccion = Math.floor(Math.random() * 4);

        this.retraso = 20;
        this.contador = 0;


        this.dibuja = function () {
            ctx.drawImage(tileMap, 0, 32, 32, 32, this.x * anchoF, this.y * altoF, anchoF, altoF);
        }

        this.compruebaColision = function (x, y) {
            // console.log(x,y)
            let colisiona = false;

            if (escenario[y][x] == 0 || escenario[y][x] == 4) {
                colisiona = true;
            }
            return colisiona;
        }

        this.mueve = function () {

            hero.colisionEnemigo(this.x, this.y);

            if (this.contador < this.retraso) {
                this.contador++;
            } else {
                this.contador = 0;

                //ARRIBA
                if (this.direccion == 0) {

                    if (this.compruebaColision(this.x, this.y - 1) == false) {
                        this.y--;
                    }
                    else {
                        this.direccion = Math.floor(Math.random() * 4);
                    }
                }


                //ABAJO
                if (this.direccion == 1) {
                    if (this.compruebaColision(this.x, this.y + 1) == false) {
                        this.y++;
                    }
                    else {
                        this.direccion = Math.floor(Math.random() * 4);
                    }
                }

                //IZQUIERDA
                if (this.direccion == 2) {
                    if (this.compruebaColision(this.x - 1, this.y) == false) {
                        this.x--;
                    }
                    else {
                        this.direccion = Math.floor(Math.random() * 4);
                    }
                }

                //IZQUIERDA
                if (this.direccion == 3) {
                    if (this.compruebaColision(this.x + 1, this.y) == false) {
                        this.x++;
                    }
                    else {
                        this.direccion = Math.floor(Math.random() * 4);
                    }
                }
            }

        }

    }

    function player() {
        this.x = 13;
        this.y = 1;
        this.llave = false;

        this.dibuja = function () {
            ctx.drawImage(tileMap, 32, 32, 32, 32, this.x * anchoF, this.y * altoF, anchoF, altoF);
        }

        this.colisionEnemigo = function (x, y) {
            if (this.x == x && this.y == y) {
                this.muerte();
            }
        }

        this.margenes = function (x, y) {
            let colision = false;
            if (escenario[y][x] == 0) {
                colision = true;
            }
            return (colision);
        }

        this.up = function () {
            if (this.margenes(this.x, this.y - 1) == false) {
                this.y--;
                this.logicaObjetos();
            }
        }


        this.down = function () {
            if (this.margenes(this.x, this.y + 1) == false) {
                this.y++;
                this.logicaObjetos();
            }
        }

        this.left = function () {
            if (this.margenes(this.x - 1, this.y) == false) {
                this.x--;
                this.logicaObjetos();
            }
        }

        this.right = function () {
            if (this.margenes(this.x + 1, this.y) == false) {
                this.x++;
                this.logicaObjetos();
            }
        }

        this.victoria = function () {
            fondo.stop();
            console.log('Puedes seguir tu camino viajero!');

            this.x = 13;
            this.y = 1;

            this.llave = false;
            escenario[4][3] = 3;

            document.getElementById("fase-3").style.display = "none";
            document.getElementById("fase-4").style.display = "inherit";

            localStorage.clear();

            let victory = new Howl({
                src: ['sound/victory.mp3'],
                loop: false,
                volume: 0.3
            }
            );
            victory.play();
        }

        this.muerte = function () {
            console.log('Vuelve a intentar!');

            this.x = 13;
            this.y = 1;

            let meow = new Howl({
                src: ['sound/meow.wav'],
                loop: false,
                volume: 0.3
            }
            );
            meow.play();

            this.llave = false;
            escenario[4][3] = 3;

            //coins reset
            escenario[5][13] = 5;
            escenario[8][6] = 5;
            escenario[1][2] = 5;
            escenario[8][2] = 5;

            //reset score
            score(0);
        }

        this.logicaObjetos = function () {
            let objeto = escenario[this.y][this.x];

            //OBTIENE llave
            if (objeto == 3) {
                this.llave = true;
                escenario[this.y][this.x] = 2;
                console.log('Has obtenido la llave!!');
                
                let keyS = new Howl({
                    src: ['sound/key.mp3'],
                    loop: false,
                    volume: 0.3
                }
                );
                keyS.play();
            }

            //ABRIMOS LA PUERTA
            if (objeto == 1) {
                if (this.llave == true && points >=40)
                    this.victoria();
                else {
                    console.log('No tienes la llave, no puedes pasar!');
                }
            }

            if (objeto == 5) {
                points += 10;
                escenario[this.y][this.x] = 2;
                console.log('points ', points);
                score(points);
                let coin  = new Howl({
                    src: ['sound/coin.mp3'],
                    loop: false,
                    volume: 0.3
                }
                );
                coin.play();
            }


        }
    }

}();