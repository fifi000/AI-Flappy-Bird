class Floor extends BaseObject {
    constructor(width, height, startX) {
        super(width * 2, height, startX, canvas.height - height);
        this.image = new Image();
        this.image.src = "/assets/base.png";

        this.visibleWidth = width;
    }

    update() {
        this.startX -= floorSpeed;
        if (this.startX + this.visibleWidth <= 0) {
            this.startX = 0;
        }
    }

    draw() {
        ctx.drawImage(this.image, this.startX, this.startY, this.visibleWidth, this.height);
        ctx.drawImage(this.image, this.startX + this.visibleWidth, this.startY, this.visibleWidth, this.height);
    }
}