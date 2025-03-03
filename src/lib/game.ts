import { DOT_RADIUS, HEIGHT, WIDTH, GRAVITY, SUB_STEPS } from "./constants";
import Dot from "./Dot";
import Vector2 from "./Vector2";

const game = (canvasEl: HTMLCanvasElement) => {
  const ctx = canvasEl.getContext("2d") as CanvasRenderingContext2D;
  let prevTime = performance.now();
  let interval = 0;

  const contraint_position = new Vector2(WIDTH / 2, HEIGHT / 2);
  const contraint_radius = HEIGHT / 2 - 50;

  const dots: Dot[] = [];

  const applyGravity = () => {
    for (let i = 0; i < dots.length; i++) {
      const dot = dots[i];
      dot.accelerate(GRAVITY);
    }
  };

  const updatePositions = (dt: number) => {
    for (let i = 0; i < dots.length; i++) {
      const dot = dots[i];
      dot.updatePosition(dt);
    }
  };

  const applyConstraint = () => {
    for (let i = 0; i < dots.length; i++) {
      const dot = dots[i];
      const to_obj = dot.position.clone().sub(contraint_position);
      const dist = to_obj.length();

      if (dist > contraint_radius - DOT_RADIUS) {
        const n = to_obj.divideScalar(dist);

        const newPosition = contraint_position
          .clone()
          .add(n.multiplyScalar(contraint_radius - DOT_RADIUS));
        dot.position.set(newPosition.x, newPosition.y);
      }
    }
  };

  const solveCollision = () => {
    for (let i = 0; i < dots.length; i++) {
      const dot_1 = dots[i];

      for (let k = i + 1; k < dots.length; k++) {
        const dot_2 = dots[k];

        const collision_axis = dot_1.position.clone().sub(dot_2.position);
        const dist = collision_axis.length();
        const min_dist = DOT_RADIUS * 2;

        if (dist < min_dist) {
          const n = collision_axis.divideScalar(dist);
          const delta = min_dist - dist;

          dot_1.position.add(n.clone().multiplyScalar(0.5 * delta));
          dot_2.position.sub(n.clone().multiplyScalar(0.5 * delta));
        }
      }
    }
  };

  const update = (dt: number) => {
    interval += dt;
    if (interval > 0.2) {
      interval = 0;
      dots.push(new Dot(new Vector2(WIDTH / 2 - 100, HEIGHT / 2)));
    }

    const substep_dt = dt / SUB_STEPS;
    for (let i = 0; i < SUB_STEPS; i++) {
      applyGravity();
      applyConstraint();
      solveCollision();
      updatePositions(substep_dt);
    }
  };

  const draw = (dt: number) => {
    ctx.clearRect(0, 0, WIDTH, HEIGHT);

    // DRAW BACKGROUND
    ctx.fillStyle = "black";
    ctx.rect(0, 0, WIDTH, HEIGHT);
    ctx.fill();
    ctx.fillStyle = "white";

    ctx.fillText(`FPS: ${Math.round(1 / dt)}`, 5, 15);
    ctx.fillText(`Objects: ${dots.length}`, 5, 30);

    // DRAW DOTS
    for (let i = 0; i < dots.length; i++) {
      const dot = dots[i];

      ctx.beginPath();
      ctx.arc(dot.position.x, dot.position.y, DOT_RADIUS, 0, 2 * Math.PI);
      ctx.fill();
    }
  };

  const tick = () => {
    const time = performance.now();

    const dt = (time - prevTime) / 1000;
    prevTime = time;

    update(dt);
    draw(dt);

    window.requestAnimationFrame(tick);
  };

  window.requestAnimationFrame(tick);
};

export default game;
