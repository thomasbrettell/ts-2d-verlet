<script lang="ts">
  import { onMount } from "svelte";
  import { HEIGHT, WIDTH } from "./lib/constants";
  import game from "./lib/game";

  let canvasRef: HTMLCanvasElement;

  onMount(() => {
    game(canvasRef);
  });
</script>

<div class="app">
  <canvas bind:this={canvasRef} width={WIDTH} height={HEIGHT}></canvas>
</div>

<style>
  .app {
    width: 100%;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>
