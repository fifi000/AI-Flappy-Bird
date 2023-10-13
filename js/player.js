class Player extends BaseObject {
    constructor(width, height, startX, startY, genome) {
        super(width, height, startX, startY);

        this.fallingSpeed = 0;
        this.gravity = 0.3;
        this.jumpHeight = 7.5;

        this.dead = false;

        this.images = [];
        this.animationCounter = 0;
        for (let i = 0; i < 3; i++) {
            let image = new Image();
            image.src = `assets/bird/${i + 1}.png`;
            this.images.push(image)
        }

        this.brain = genome;
        this.brain.score = 0;
    }

    get currentImage() {
        this.animationCounter += 1;
        return this.images[this.animationCounter % 3];
    }

    draw() {
        ctx.drawImage(this.currentImage, this.startX, this.startY, this.width, this.height);
    }

    jump() {
        this.fallingSpeed = -this.jumpHeight;
    }

    update() {
        if (this.dead) {
            this.startX -= floorSpeed;
            return;
        }

        this.brain.score += 0.1;
        this.startY += this.fallingSpeed;
        this.fallingSpeed += this.gravity;
    }
}