class Boid {
    constructor(position, velocity) {
        this.position = position;
        this.velocity = velocity;
        this.acceleration = new Point();

        this.maxSpeed = 5;
        this.radius = 100;
        this.maxForce = 2;
        this.cCoef = 0.5;
        this.sCoef = 0.5;
        this.aCoef = 0.3;
    }

    draw(ctx, x, y) {
        ctx.save();
        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'white';
        ctx.translate(x, y);
        ctx.rotate(Math.atan2(this.velocity.y, this.velocity.x));

        ctx.beginPath();
        ctx.moveTo(10, 0);
        ctx.lineTo(-10, 6);
        ctx.lineTo(-8, 0);
        ctx.lineTo(-10, -6);
        ctx.closePath();
        ctx.stroke();
        ctx.restore();
    }

    display(ctx, width, height) {
        this.draw(ctx, this.position.x, this.position.y);

        this.wrapEdges(ctx, width, height);
    }

    wrapEdges(ctx, width, height) {
        if (this.position.x < 50) {
            this.draw(ctx, this.position.x + width, this.position.y);
            this.position.x += width;
        }
        if (this.position.x > width - 50) {
            this.draw(ctx, this.position.x - width, this.position.y);
            this.position.x -= width;
        }
        if (this.position.y < 50) {
            this.draw(ctx, this.position.x, this.position.y + height);
            this.position.y += height;
        }
        if (this.position.y > height - 50) {
            this.draw(ctx, this.position.x, this.position.y - height);
            this.position.y -= height;
        }

    }

    update(boids) {
        this.alignment(boids);
        this.cohesion(boids);
        this.separate(boids);

        this.velocity.x += this.acceleration.x;
        this.velocity.y += this.acceleration.y;

        const speed = Math.hypot(this.velocity.x, this.velocity.y);
        if (speed > this.maxSpeed) {
            this.velocity.x *= this.maxSpeed / speed;
            this.velocity.y *= this.maxSpeed / speed;
        }

        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        this.acceleration.x = 0;
        this.acceleration.y = 0;
    }

    separate(boids) {
        const target = new Point();
        let total = 0;
        for (let boid of boids) {
            const distance = Point.distance(this.position, boid.position);

            if (boid != this && distance < this.radius) {
                const diference = new Point(this.position.x - boid.position.x, this.position.y - boid.position.y);
                diference.div(new Point(distance, distance));

                target.add(diference);
                total++;
            }
        };
        if (total == 0)
            return;

        target.div(new Point(total, total));

        const magnitude = Math.sqrt(target.x ** 2 + target.y ** 2);
        if (magnitude > 0) {
            target.x = (target.x / magnitude) * this.maxSpeed;
            target.y = (target.y / magnitude) * this.maxSpeed;
        }

        const force = new Point(target.x, target.y);
        force.limit(this.maxForce);

        force.mul(new Point(this.sCoef, this.sCoef));

        this.acceleration.add(force);
    }

    cohesion(boids) {
        const center = new Point();
        let total = 0;
        for (const boid of boids) {
            const distance = Math.sqrt((boid.position.x - this.position.x) ** 2 + (boid.position.y - this.position.y) ** 2);
            if (boid != this && distance < this.radius) {
                center.add(boid.position);
                total++;
            }
        };
        if (total == 0)
            return;
        center.div(new Point(total, total));
        const target = center.sub(this.position);
        target.limit(this.maxSpeed);

        const force = new Point(target.x, target.y);
        force.limit(this.maxForce);

        force.mul(new Point(this.cCoef, this.cCoef));

        this.acceleration.add(force);
    }

    alignment(boids) {
        const target = new Point();
        let total = 0;
        for (const boid of boids) {
            const distance = Point.distance(this.position, boid.position);
            if (boid != this && distance < this.radius) {
                target.add(boid.velocity);
                total++;
            }
        };
        if (total == 0)
            return;

        target.div(new Point(total, total));
        target.limit(this.maxSpeed);

        const force = new Point(target.x, target.y);
        force.limit(this.maxForce);

        force.mul(new Point(this.aCoef, this.aCoef));

        this.acceleration.add(force);
    }
}
