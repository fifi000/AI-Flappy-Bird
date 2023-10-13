class Pipe extends BaseObject {
    constructor(width, height, startX, startY) {
        super(width, height, startX, startY);

        this.gap = 1 / 4 * canvas.height;
        var min = 0.1;
        var max = 1 - min;

        this.upper = new BaseObject(
            this.width,
            (this.height - this.gap) * (Math.random() * (max - min) + min),
            this.startX,
            this.startY
        );

        this.lower = new BaseObject(
            this.width,
            this.height - this.upper.height - this.gap,
            this.startX,
            this.startY + this.upper.height + this.gap
        );

        this.lowerImage = new Image();
        this.lowerImage.src = "/assets/pipe-green-down.png";

        this.upperImage = new Image();
        this.upperImage.src = "/assets/pipe-green-up.png";

        this.pipeCounted = false;
    }

    update() {
        if (!this.pipeCounted && (this.startX + this.width/2) < Math.max(...players.map(p => p.startX))) {
            pipesCount += 1;
            this.pipeCounted = true;
        }

        this.startX -= floorSpeed;
        this.upper.startX = this.startX;
        this.lower.startX = this.startX;
    }

    draw() {
        // upper pipe
        var x = this.upper.startY + this.upper.height - this.height;
        ctx.drawImage(this.upperImage, this.upper.startX, x, this.upper.width, this.height);

        //  lower pipe
        ctx.drawImage(this.lowerImage, this.lower.startX, this.lower.startY, this.lower.width, this.height);
    }

    checkCollision(obj) {
        var isOverPipe = (
            obj.startY < this.upper.startY
            && obj.endX >= this.startX
            && obj.endX <= this.endX
        );
        
        return (
            this.upper.checkCollision(obj)
            || this.lower.checkCollision(obj)
            || isOverPipe
        );            
    }
}