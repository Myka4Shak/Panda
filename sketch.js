var font, bg, mic;
var texts = []
// זה אני לא מצליחה להסגר על פלטה
//var particle_colors = [("#FFFFFF"), ("#900C3F"), ("#D20039"), ("#FF0733"), ("#FEC10F")];
//var particle_colors = [("#FFBE0B"), ("#FB5607"), ("#FF006E"), ("#8338EC"), ("#3A86FF")];
var particle_colors = [("#03EEF2"), ("#006BA6"), ("#FFBC42"), ("#0496FF"), ("#F00104")];

function preload() {
    font = loadFont("f.otf");
}

function setup() {
    createCanvas(windowWidth, windowHeight);

    // רקע
    bg = new particleBackground(particle_colors);

    // מיקרופון
    mic = new p5.AudioIn();
    mic.start();

    // טקסט
    texts.push(
        new glitchText("הבוטל", width / 2 - 350, height / 2, 150, false),
        new glitchText("שבתשמ", width / 2, height / 2, 150),
        new glitchText("לכה", width / 2 + 300, height / 2, 150, false))
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight)

    // מיקום הטקסט
    var positions = [
        [width / 2 - 350, height / 2],
        [width / 2, height / 2],
        [width / 2 + 300, height / 2]
    ]

    // עדכון המיקום אחרי שינוי גודל החלון
    for (var i = 0; i < positions.length; i++) {
        texts[i].x = positions[i][0]
        texts[i].y = positions[i][1]
    }
}

function draw() {
    // רקע
    bg.draw()
        // טקסט
    for (var t of texts) {
        t.draw();
    }
}

class particleBackground {
    constructor(colorPalette) {
        this.blobs = [];
        this.colors;
        this.variation = 0;

        this.xScale = width / 20;
        this.yScale = height / 20 * (width / height);

        this.centerX = width / 2;
        this.centerY = height / 2;

        this.colors = colorPalette.map(x => color(x));

        //שינוי אוטומטי
        this.changeDuration = 3000;
        this.lastChange = 0;
    }

    draw() {
        push()
        textAlign(CENTER, CENTER);

        /*
        //בדיקה
        textSize(20);
        noStroke();
        fill(255);
        ellipse(this.centerX, this.centerY, 60, 60);
        fill(0);
        text(this.variation, this.centerX, this.centerY-10);
        text(length, this.centerX, this.centerY+10);
        */
        

        // הוספת החלקיקים בטריגר של לחיצה או קול
        //if (mouseIsPressed) {
        if (mic.getLevel() > 0.15) {
            for (let i = 0; i < 20; i++) {
                var radius = width / 8;

                let x = width / 2 + cos(frameCount / 10) * radius +   random(-100, 100);
                let y = height / 2 + sin(frameCount / 10) * radius + random(-100, 100);

                var blob = {
                    x: this.getXPos(x),
                    y: this.getYPos(y),
                    size: random(1, 5),
                    lastX: x,
                    lastY: y,
                    color: this.colors[floor(random(this.colors.length))],
                    direction: random(0.1, 1) * (random() > 0.5 ? 1 : -1),
                    age: 0
                };
                this.blobs.push(blob);
            }
        }

        var length = this.blobs.length;
        
        // שיהיה כתוב לצעוק?
        /*
        if (length == 0 && false) {
            background("#1a0633");
            noStroke();
            fill(255);
            textSize(40);
            text("Scream", this.centerX, this.centerY);
            return;
        }
        */

        noStroke();
        fill(26, 6, 51, 10);
        rect(0, 0, width, height);

        //שינוי אוטומטי
        let time = millis();
        if (time - this.lastChange > this.changeDuration) {
            this.lastChange = time;
            this.variation++;
            if (this.variation > 11) this.variation = 0;
        }

        var stepsize = deltaTime * 0.002;
        for (var i = length - 1; i >= 0; i--) {
            let blob = this.blobs[i];
            blob.age += 1;

            var x = this.getSlopeX(blob.x, blob.y);
            var y = this.getSlopeY(blob.x, blob.y);
            blob.x += blob.direction * x * stepsize;
            blob.y += blob.direction * y * stepsize;

            x = this.getXPrint(blob.x);
            y = this.getYPrint(blob.y);

            var opacity = (255 - 2 * blob.age)
            if (opacity < 0) {
                this.blobs.splice(i, 1);
                i--;
            }
            stroke(blob.color.levels[0], blob.color.levels[1], blob.color.levels[2], opacity);
            strokeWeight(blob.size);
            line(x, y, blob.lastX, blob.lastY);
            blob.lastX = x;
            blob.lastY = y;

            const border = 200;
            if (x < -border || y < -border || x > width + border || y > height + border) {
                this.blobs.splice(i, 1);
            }
        }

        pop();
    }

    getSlopeY(x, y) {
        switch (this.variation) {
            case 0:
                return Math.sin(x);
            case 1:
                return Math.sin(x * 5) * y * 0.3;
            case 2:
                return Math.cos(x * y);
            case 3:
                return Math.sin(x) * Math.cos(y);
            case 4:
                return Math.cos(x) * y * y;
            case 5:
                return Math.log(Math.abs(x)) * Math.log(Math.abs(y));
            case 6:
                return Math.tan(x) * Math.cos(y);
            case 7:
                return -Math.sin(x * 0.1) * 3; //orbit
            case 8:
                return (x - x * x * x) * 0.01; //two orbits
            case 9:
                return -Math.sin(x);
            case 10:
                return -y - Math.sin(1.5 * x) + 0.7;
            case 11:
                return Math.sin(x) * Math.cos(y);
        }
    }

    getSlopeX(x, y) {
        switch (this.variation) {
            case 0:
                return Math.cos(y);
            case 1:
                return Math.cos(y * 5) * x * 0.3;
            case 2:
            case 3:
            case 4:
            case 5:
            case 6:
                return 1;
            case 7:
                return Math.sin(y * 0.1) * 3; //orbit
            case 8:
                return y / 3; //two orbits
            case 9:
                return -y;
            case 10:
                return -1.5 * y;
            case 11:
                return Math.sin(y) * Math.cos(x);
        }
    }

    getXPos(x) {
        return (x - this.centerX) / this.xScale;
    }
    getYPos(y) {
        return (y - this.centerY) / this.yScale;
    }

    getXPrint(x) {
        return this.xScale * x + this.centerX;
    }
    getYPrint(y) {
        return this.yScale * y + this.centerY;
    }
}

class glitchText {
    constructor(text, x, y, size, enabled = true) {
        this.text = text;
        this.x = x
        this.y = y
        this.s = size
        this.enab = enabled
    }

    draw() {
        push();

        //הכנה
        translate(this.x, this.y)
        textSize(this.s)

        textFont(font)
        textAlign(CENTER, CENTER)

        // גליצ' של המילה משתבש עם סטייה
        var n = (mic.getLevel() + noise(frameCount / 10) / 2) * 20
        if (this.enab) {
            fill(0, 255, 255, 92)
            text(this.text, n, n)
            fill(255, 0, 0, 92)
            text(this.text, -n, -n)
        }

        // טקסט לבן
        noStroke()
        fill("white")
        text(this.text, 0, 0)
        pop()
    }
}