const canvas = document.createElement('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const ctx = canvas.getContext('2d');
document.body.append(canvas);

function getRandomNumber(min, max) {
    return Math.random() * (max - min) + min;
}

const numberBoids = 200;
const boids = Array.from({ length: numberBoids }, () => {
    const position = new Point(getRandomNumber(0, canvas.width), getRandomNumber(0, canvas.height));
    const velocity = new Point(getRandomNumber(-6, 6), getRandomNumber(-6, 6));
    return new Boid(position, velocity);
});

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

function animate() {
    resizeCanvas();
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    boids.forEach(boid => {
        boid.update(boids);
        boid.display(ctx, canvas.width, canvas.height);
    });

    requestAnimationFrame(animate);
}

resizeCanvas();
animate();