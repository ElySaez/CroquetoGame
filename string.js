/* Prototipo de mini juego se puede interactuar con él mediante
 las teclas arriba, abajo, derecha e izquierda, se incorporaron baldozas con
 diseños, se agrega diseño de enemigos (aún no se incorporan las colisiones con los enemigos)
 se agrega además el nombre del usuario y se alamacena*/



void function () {

    let canvas;
    let ctx;
    let rhythm;
    let widthF = 50;
    let heightF = 50;
    let lawn;
    let water;
    let way;
    let finish;
    let myPrecious;
    let tileMap;
    let scene = [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 2, 3, 0, 0, 0, 0, 2, 2, 2, 0],
        [0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 2, 2, 2, 1],
        [0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0],
        [0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0],
        [0, 2, 2, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 2, 2, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 2, 2, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 2, 2, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 2, 2, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    ]

    const FPS = 50;
    
    const API_URL= 'https://api.chucknorris.io/jokes/random';

    fetch(API_URL)
    .then((resp) => resp.json())
    .then((data) => {
        console.log(data.value)
        let promVal = document.getElementById("api");
        promVal.textContent = data.value;
    })



    onload = function () {
        verStorage();
        loadPlayerName();
        canvas = document.getElementById('canvas');
        ctx = canvas.getContext('2d');

        tileMap = new Image();
        tileMap.src = 'img/tilemap.png';
        setInterval(function () {
            main();
        }, 1000 / FPS);

        rhythm = new Howl({
            src: ['sound/fondo.mp3'],
            loop: true,
            volume: 0.5
        }
        );
        rhythm.play();

        let titulo = document.getElementById('title');
        console.log(titulo.innerText);
        titulo.innerText = 'Croqueto Game';
        console.log(titulo.innerText);
    }

    let p1 = new Enemy(60, 150);
    let p2 = new Enemy(50, 100);
    let p3 = new Enemy(70, 270);
    let p4 = new Enemy(600, 10);
    let p5 = new Enemy(450, 310);
    let hero = new player();

    function verStorage() {
        let st = localStorage.getItem("jugador");

        if (st == null) {
            let saludo = prompt("¿Cuál es tu nombre?");
            arr = {
                nombre: saludo,
                vida: 100
            };
            localStorage.setItem("jugador", JSON.stringify(arr)); 
            console.log(...arr.nombre);           
            verLife();
        }
        

    }

    function verLife(){
        let { nombre, vida } = arr;
            console.log(`Hola ${nombre} tienes ${vida} de vida`);
    }

    function loadPlayerName() {
        let st = localStorage.getItem("jugador");
        let obj = JSON.parse(st);
        let promVal = document.getElementById("hi");

        if (obj.nombre == '') {
            promVal.textContent = "invitado";
            
        } else {
            promVal.textContent = obj.nombre;
        }

    }

    function main() {
        deleteCanvas();
        paintScene();
        hero.draw();
        p1.draw();
        p2.draw();
        p3.draw();
        p4.draw();
        p5.draw();
        p1.moveSide(1);
        p2.moveSide(2);
        p3.moveSide(3);
        p4.moveDown(1);
        p5.moveSide(3);
    }

    function paintScene() {

        for (y = 0; y < 11; y++) {
            for (x = 0; x < 15; x++) {
                let tile = scene[y][x];

                ctx.drawImage(tileMap, tile * 32, 0, 32, 32, widthF * x, heightF * y, widthF, heightF);
            }
        }
    }

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

    function player() {
        this.x = 2;
        this.y = 9;
        this.color = '#A160EB';

        this.margin = function (x, y) {
            let collision = false;
            if (scene[y][x] == 0) { collision = true; }
            return (collision);
        }

        this.up = function () {
            if (this.margin(this.x, this.y - 1) == false)
                this.y--;
            this.logic();
        }

        this.down = function () {
            if (this.margin(this.x, this.y + 1) == false)
                this.y++;
            this.logic();
        }

        this.left = function () {
            if (this.margin(this.x - 1, this.y) == false)
                this.x--;
            this.logic();
        }

        this.right = function () {
            if (this.margin(this.x + 1, this.y) == false)
                this.x++;
            this.logic();
        }

        this.logic = function () {
            let ver = scene[this.y][this.x];
            if (ver == 3) {
                this.myPrecious = true;
                scene[this.y][this.x] = 2;
                alert('¡Has conseguido la llave!');
            }
            if (ver == 1 && this.myPrecious !== true) {
                alert('Necesitas la llave para entrar');

            }
            if (ver == 1 && this.myPrecious == true) {
                alert('¡Has entrado!');

            }
        }

        this.draw = function () {
            let img = new Image();
            img.src = 'img/gatito.png';
            ctx.drawImage(img, this.x * widthF - 20, this.y * heightF - 50);
        }

    }

    function Enemy(x, y) {
        this.x = x;
        this.y = y;
        this.shift = true;

        this.draw = function () {

            let img2 = new Image();
            img2.src = 'img/ghost.png';
            ctx.drawImage(img2, this.x, this.y);

        }

        this.moveSide = function (speed) {
            if (this.shift == true) {
                this.x < 540 ? this.x += speed : this.shift = false;
            } else {
                this.x > 20 ? this.x -= speed : this.shift = true;
            }
        }

        this.moveDown = function (speed) {
            if (this.shift == true) {
                this.y < 100 ? this.y += speed : this.shift = false;
            } else {
                this.y > 10 ? this.y -= speed : this.shift = true;
            }
        }


    }

    function deleteCanvas() {
        canvas.width = 750;
        canvas.height = 550;
    }

}();