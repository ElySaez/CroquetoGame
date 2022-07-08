/* Prototipo de mini juego se puede interactuar con él mediante
 las teclas w,s,a,d  por el momento sólo hay desplazamiento 
 faltan colisiones y llegada de meta*/

void function () {

    let canvas;
    let ctx;

    const FPS = 100;
    const WIDTH = 600;
    const HEIGHT = 540;
    const MOVE_SPEED = 10;

    onload = function () {
        canvas = document.getElementById('canvas');
        ctx = canvas.getContext('2d');
        setInterval(function () {
            principal();
        }, 1000 / FPS);
    }

    function Enemigo(x, y) {
        this.x = x;
        this.y = y;
        this.mov = true;

        this.dibuja = function () {
            ctx.fillStyle = 'cyan';
            ctx.fillRect(this.x, this.y, 30, 30);
        }

        this.mueveLado = function (velocidad) {
            if (this.mov == true) {
                if (this.x < 540) {
                    this.x += velocidad;
                } else {
                    this.mov = false;
                }
            } else {
                if (this.x > 20)
                    this.x -= velocidad;
                else {
                    this.mov = true;
                }
            }
        }

        this.mueveAbajo = function (velocidad) {
            if (this.mov == true) {
                if (this.y < 100) {
                    this.y += velocidad;
                } else {
                    this.mov = false;
                }
            } else {
                if (this.y > 10)
                    this.y -= velocidad;
                else {
                    this.mov = true;
                }
            }
        }
    }

    function Jugador(x, y, r) {
        this.x = x || 0;
        this.y = y || 0;
        this.r = r || 0;
        this.up = false;
        this.down = false;
        this.left = false;
        this.right = false;

        this.movimiento = function () {
            if (this.up) { this.y -= MOVE_SPEED; }
            if (this.down) { this.y += MOVE_SPEED; }
            if (this.left) { this.x -= MOVE_SPEED; }
            if (this.right) { this.x += MOVE_SPEED; }            
            
            if (this.x - this.r < 0.0) {
                this.x = this.r;
            }
            if (this.x + this.r > WIDTH) {
                this.x = WIDTH - this.r;
            }
            if (this.y - this.r < 0.0) {
                this.y = this.r;
            }
            if (this.y + this.r > HEIGHT) {
                this.y = HEIGHT - this.r;
            }
        };

        this.dibuja = function () {
            let img = new Image();
            img.src = 'img/gatito.png';
            ctx.drawImage(img, this.x - 50, this.y - 45);
        };
    }

    let per1 = new Enemigo(60, 150);
    let per2 = new Enemigo(50, 200);
    let per3 = new Enemigo(70, 270);
    let per4 = new Enemigo(30, 10);
    let per5 = new Enemigo(500, 310);
    let prota = new Jugador(75, 460, 45);

    onkeydown = function (e) {
        switch (e.key.toLowerCase()) {
            case "w": prota.up = true; break;
            case "s": prota.down = true; break;
            case "a": prota.left = true; break;
            case "d": prota.right = true; break;
        }
    }

    onkeyup = function (e) {
        switch (e.key.toLowerCase()) {
            case "w": prota.up = false; break;
            case "s": prota.down = false; break;
            case "a": prota.left = false; break;
            case "d": prota.right = false; break;
        }
    }

    function principal() {
        canvas.width = WIDTH;
        canvas.height = HEIGHT;
        
        per1.dibuja();
        per2.dibuja();
        per3.dibuja();
        per4.dibuja();
        per5.dibuja();
        prota.movimiento();
        prota.dibuja();

        per1.mueveLado(1);
        per2.mueveLado(2);
        per3.mueveLado(3);
        per4.mueveAbajo(1);
        per5.mueveLado(3);
    }

}();


