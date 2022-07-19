/* Prototipo de mini juego se puede interactuar con él mediante
 las teclas arriba, abajo, derecha e izquierda, se incorporaron margenes
 para que el personaje principal sólo pueda transitar por el camino, se simplificó
 diseño por mientras se deciden las mecánicas del juego, se añadió música y un tesoro para recolectar y una meta*/



void function () {

    let canvas;
    let ctx;
    let rhythm;
    let widthF = 50;
    let heightF = 50;
    let lawn = '#5EC275';
    let water = '#77E9EA';
    let way = '#E1CB85';
    let finish = '#534007';
    let myPrecious = '#0D2AFF';
    let scene = [
        [0, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [0, 1, 1, 0, 1, 2, 4, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 1, 1, 1, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0],
        [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3],
        [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3],
        [0, 2, 2, 0, 0, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1],
        [0, 2, 2, 0, 0, 2, 2, 1, 0, 0, 0, 1, 1, 1, 1],
        [0, 2, 2, 0, 0, 2, 2, 1, 0, 0, 0, 0, 0, 0, 0],
        [0, 2, 2, 2, 2, 2, 2, 1, 0, 0, 0, 0, 0, 0, 0],
        [0, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1],
        [0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1]
    ]

    const FPS = 50;

    onload = function () {
        canvas = document.getElementById('canvas');
        ctx = canvas.getContext('2d');
        setInterval(function () {
            main();
        }, 1000 / FPS);

        rhythm = new Howl({
            src: ['sound/fondo.mp3'],
            loop: true,
            volume:0.5
        }
        );
        rhythm.play();
    }

    let p1 = new Enemy(60, 150);
    let p2 = new Enemy(50, 100);
    let p3 = new Enemy(70, 270);
    let p4 = new Enemy(30, 10);
    let p5 = new Enemy(500, 310);
    let hero = new player();

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
        let color;
        for (y = 0; y < 11; y++) {
            for (x = 0; x < 15; x++) {
                if (scene[y][x] == 0) {
                    color = lawn;
                }
                if (scene[y][x] == 1) {
                    color = water;
                }
                if (scene[y][x] == 2) {
                    color = way;
                }
                if (scene[y][x] == 3) {
                    color = finish;
                }
                if (scene[y][x] == 4) {
                    color = myPrecious;
                }
                ctx.fillStyle = color;
                ctx.fillRect(x * widthF, y * heightF, widthF, heightF);
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
        this.x = 1;
        this.y = 9;
        this.color = '#A160EB';

        this.margin = function (x, y) {
            let collision = false;
            if (scene[y][x] == 1) { collision = true; }
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
            if (ver == 4) {
                this.myPrecious = true;
                scene[this.y][this.x] = 2;
                alert('¡Has conseguido el tesoro!');
            }
            if (ver == 3 && this.myPrecious !== true) {
                alert('Necesitas el tesoro para ganar');
                
            } 
            if (ver == 3 && this.myPrecious == true) {
                alert('¡Has ganado!');
                
            }
        }

        this.draw = function () {
            let img = new Image();
            img.src = 'img/gatito.png';
            ctx.drawImage(img, this.x * widthF - 50, this.y * heightF - 45);

            //ctx.fillStyle = this.color;
            //ctx.fillRect(this.x * widthF, this.y * heightF, widthF, heightF);
        }

    }

    function Enemy(x, y) {
        this.x = x;
        this.y = y;
        this.shift = true;

        this.draw = function () {
            ctx.fillStyle = '#858175';
            ctx.fillRect(this.x, this.y, 30, 30);
        }

        this.moveSide = function (speed) {
            if (this.shift == true) {
                if (this.x < 540) {
                    this.x += speed;
                } else {
                    this.shift = false;
                }
            } else {
                if (this.x > 20)
                    this.x -= speed;
                else {
                    this.shift = true;
                }
            }
        }

        this.moveDown = function (speed) {
            if (this.shift == true) {
                if (this.y < 100) {
                    this.y += speed;
                } else {
                    this.shift = false;
                }
            } else {
                if (this.y > 10)
                    this.y -= speed;
                else {
                    this.shift = true;
                }
            }
        }
    }

    function deleteCanvas() {
        canvas.width = 750;
        canvas.height = 550;
    }

}();