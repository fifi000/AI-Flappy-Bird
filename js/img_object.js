class ImgObject extends BaseObject {
    constructor(width, height, startX, startY) {
        super(width, height, startX, startY);

        this.image = new Image();
        this.image.src = "/assets/background.png";
    }

    draw() {
        ctx.drawImage(this.image, this.startX, this.startY, this.width, this.height);
    }

}