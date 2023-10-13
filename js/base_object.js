class BaseObject {
    constructor(width, height, startX, startY) {
        this.width = width;
        this.height = height;
        this.startX = startX;
        this.startY = startY;
    }

    get endX() {
        return this.startX + this.width;
    }

    get endY() {
        return this.startY + this.height;
    }

    checkCollision(obj) {
        return (
            this.startX < obj.endX
            && this.endX > obj.startX
            && this.startY < obj.endY
            && this.endY > obj.startY
        );
    }
}