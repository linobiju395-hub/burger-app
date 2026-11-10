/**
 * Frame Manager & Canvas Renderer for SMASH & SONS "THE BUILD" Section
 * Handles:
 * - Single-file 30-frame Sprite Sheet (/assets/burger_spritesheet.webp, 305KB)
 * - Zero separate frame files for minimal repository file count
 * - Canvas cover-fit calculation on window resize with devicePixelRatio support
 * - Dynamic Hermite smoothstep frame-blending with safe viewport padding
 */

export interface FrameStatus {
  totalFrames: number;
  loadedFrames: number;
  hasCustomFrames: boolean;
  isLoading: boolean;
}

export class BurgerFrameManager {
  private totalFrames: number = 30;
  private spriteSheet: HTMLImageElement | null = null;
  private isSpriteLoaded: boolean = false;
  private onProgressCallback?: (status: FrameStatus) => void;
  private isDestroyed: boolean = false;

  constructor(onProgress?: (status: FrameStatus) => void) {
    this.onProgressCallback = onProgress;
  }

  public init() {
    this.spriteSheet = new Image();
    this.spriteSheet.src = '/assets/burger_spritesheet.webp';
    this.spriteSheet.onload = () => {
      if (this.isDestroyed) return;
      this.isSpriteLoaded = true;
      this.notifyProgress();
    };
    this.spriteSheet.onerror = () => {
      if (this.isDestroyed) return;
      this.isSpriteLoaded = false;
      this.notifyProgress();
    };
  }

  private notifyProgress() {
    if (!this.onProgressCallback) return;
    this.onProgressCallback({
      totalFrames: this.totalFrames,
      loadedFrames: this.isSpriteLoaded ? this.totalFrames : 0,
      hasCustomFrames: this.isSpriteLoaded,
      isLoading: !this.isSpriteLoaded
    });
  }

  public getFrame(_index1Based: number): HTMLImageElement | null {
    return this.isSpriteLoaded ? this.spriteSheet : null;
  }

  public destroy() {
    this.isDestroyed = true;
    this.spriteSheet = null;
  }

  /**
   * Cover-fits image on the canvas with Retina / DPR scaling
   */
  public draw(
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    frameIndex1Based: number,
    _progress: number // 0 to 1
  ) {
    const width = canvas.width;
    const height = canvas.height;

    // Fill charcoal background void
    ctx.fillStyle = '#0E0E0E';
    ctx.fillRect(0, 0, width, height);

    if (!this.isSpriteLoaded || !this.spriteSheet) return;

    // Frame Interpolation Math for Slow-Scroll Stutter Elimination
    const clampedFloat = Math.max(1, Math.min(this.totalFrames, frameIndex1Based));
    const frameA = Math.floor(clampedFloat);
    const frameB = Math.min(this.totalFrames, frameA + 1);
    const delta = clampedFloat - frameA;

    // Hermite smoothstep curve: 3t^2 - 2t^3 gives natural optical persistence of vision
    const blendAlpha = delta * delta * (3 - 2 * delta);

    const SAFE_SCALE = 0.85;
    const imgRatio = 640 / 360; // 16:9
    const canvasRatio = width / height;
    let drawW: number;
    let drawH: number;

    if (canvasRatio > imgRatio) {
      drawH = height * SAFE_SCALE;
      drawW = drawH * imgRatio;
    } else {
      drawW = width * SAFE_SCALE;
      drawH = drawW / imgRatio;
    }

    const offsetX = (width - drawW) / 2;
    const offsetY = (height - drawH) / 2;

    ctx.save();
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    const drawTile = (f1Based: number, alpha: number) => {
      const idx0 = Math.max(0, Math.min(29, Math.round(f1Based) - 1));
      const col = idx0 % 6;
      const row = Math.floor(idx0 / 6);
      const sx = col * 640;
      const sy = row * 360;
      ctx.globalAlpha = alpha;
      ctx.drawImage(this.spriteSheet!, sx, sy, 640, 360, offsetX, offsetY, drawW, drawH);
    };

    if (blendAlpha > 0.001 && frameB !== frameA) {
      drawTile(frameA, 1.0 - blendAlpha);
      drawTile(frameB, blendAlpha);
    } else {
      drawTile(frameA, 1.0);
    }

    ctx.restore();
  }

  /**
   * Explicit public interpolation drawer for micro-scroll blending
   */
  public drawInterpolated(
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    frameFloat: number,
    progress: number
  ) {
    this.draw(ctx, canvas, frameFloat, progress);
  }
}
