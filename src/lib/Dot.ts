import Vector2 from "./Vector2";

export default class Dot {
  position: Vector2;
  prev_position: Vector2;
  acceleration: Vector2;

  constructor(_position: Vector2) {
    this.position = _position.clone();
    this.prev_position = _position.clone();
    this.acceleration = new Vector2(0, 0);
  }

  accelerate(a: Vector2) {
    this.acceleration.add(a);
  }

  updatePosition(dt: number) {
    const velocity = this.position.clone().sub(this.prev_position);

    this.prev_position.set(this.position.x, this.position.y);

    this.position.add(this.acceleration.multiplyScalar(dt * dt)).add(velocity);

    this.acceleration.set(0, 0);
  }
}
