import { SocketController } from "../socket";

export class Canvas {

    element: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    controller: SocketController;
    height: number;
    width: number;

    constructor() {
        this.element = document.createElement('canvas');
        this.ctx = this.element.getContext('2d');
        this.controller = new SocketController();
        this.controller.subscribe(this.drawCursors.bind(this));

        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.element.width = this.width;
        this.element.height = this.height;

        this.element.addEventListener('mousemove', this.onCursorMove.bind(this));
    }



    private async onCursorMove(e: MouseEvent) {
        this.controller.updatePosition(e.clientX, e.clientY);
    }

    private clearScreen() {
        requestAnimationFrame(() => {
            this.ctx.fillStyle = 'white';
            this.ctx.fillRect(0, 0, this.width, this.height);
        });
    }

    private drawCursor(x: number, y: number, color: string) {
        requestAnimationFrame(() => {
            this.ctx.fillStyle = color;
            this.ctx.fillRect(x - 10, y - 10, 20, 20);
        });
    }

    private drawCursors(cursors: any[]) {
        this.clearScreen();
        cursors
            .forEach(o => {
                this.drawCursor(o.x, o.y, o.color);
            });
    }
}