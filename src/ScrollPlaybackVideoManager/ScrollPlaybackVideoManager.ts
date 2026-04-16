import UAParser from 'ua-parser-js';
import videoDecoder from '../VideoDecoder/VideoDecoder';

interface ScrollVideoOptions {
  src: string;
  videoContainer: HTMLElement | string;
  frameData?: {
    batchId: string;
    frameCount: number;
    frameRate: number;
    frameFormat: string;
  };
  frameBaseUrl?: string;
}

export class ScrollPlaybackVideoManager {
  private container?: HTMLElement;
  private video?: HTMLVideoElement;
  private isSafari?: boolean;
  private currentTime = 0;
  private targetTime = 0;
  private canvas: HTMLCanvasElement | null = null;
  private context: CanvasRenderingContext2D | null = null;
  private frames: ImageBitmap[] = [];
  private frameRate = 0;
  private transitioning = false;
  private debug: boolean = false;
  private frameThreshold: number = 0.1;
  private transitionSpeed: number = 10;
  private useWebCodecs: boolean = true;
  private resizeObserver: ResizeObserver;
  private serverFrameData?: { batchId: string; frameCount: number; frameRate: number; frameFormat: string };
  private serverFrameBaseUrl?: string;
  private serverFrameImages: HTMLImageElement[] = [];
  private currentServerFrameIdx = 0;

  constructor(options: ScrollVideoOptions) {
    this.resizeObserver = new ResizeObserver(() => {
      this.resize();
    });
    const {
      src,
      videoContainer,
      frameData,
      frameBaseUrl
    } = options;
    if (typeof document !== 'object') {
      console.error('ScrollVideo must be initiated in a DOM context');
      return;
    }
    if (!videoContainer) {
      console.error('scrollVideoContainer must be a valid DOM object');
      return;
    }
    if (!src) {
      console.error('Must provide valid video src to ScrollVideo');
      return;
    }

    this.container = typeof videoContainer === 'string' ? document.getElementById(videoContainer)! : videoContainer;
    this.resizeObserver.observe(this.container);

    if (frameData && frameBaseUrl) {
      this.serverFrameData = frameData;
      this.serverFrameBaseUrl = frameBaseUrl;
      this.loadServerFrames();
      return;
    }

    this.video = document.createElement('video');
    this.video.src = src;
    this.video.preload = 'auto';
    this.video.tabIndex = 0;
    this.video.playsInline = true;
    this.video.muted = true;
    this.video.pause();
    this.video.load();
    this.container.appendChild(this.video);
    const ua = new UAParser();
    const browserEngine = ua.getEngine();
    this.isSafari = browserEngine.name === 'WebKit';
    if (this.debug && this.isSafari) console.info('Safari browser detected');
    this.video.addEventListener('loadedmetadata', () => this.setTargetTimePercent(0, true), { once: true });
    this.video.addEventListener('progress', this.resize);
    this.decodeVideo();
  }

  private async loadServerFrames(): Promise<void> {
    if (!this.serverFrameData || !this.serverFrameBaseUrl || !this.container) return;
    const { batchId, frameCount, frameRate } = this.serverFrameData;

    const loadBatch = async (start: number, end: number): Promise<void> => {
      const promises: Promise<void>[] = [];
      for (let i = start; i <= end; i++) {
        const idx = String(i).padStart(4, '0');
        const url = `${this.serverFrameBaseUrl}/${batchId}_${idx}.${this.serverFrameData!.frameFormat}`;
        const img = new Image();
        this.serverFrameImages[i - 1] = img;
        promises.push(new Promise<void>((resolve) => {
          img.onload = () => resolve();
          img.onerror = () => resolve();
          img.src = url;
        }));
      }
      await Promise.all(promises);
    };

    const initialBatch = Math.min(10, frameCount);
    await loadBatch(1, initialBatch);

    this.frameRate = frameRate;
    this.canvas = document.createElement('canvas');
    this.context = this.canvas.getContext('2d')!;
    this.container.appendChild(this.canvas);
    this.paintServerFrame(0);

    if (initialBatch < frameCount) {
      loadBatch(initialBatch + 1, frameCount);
    }
  }

  private paintServerFrame(frameIdx: number) {
    if (!this.canvas || !this.context || !this.container) return;
    const clampedIdx = Math.max(0, Math.min(frameIdx, this.serverFrameImages.length - 1));
    const img = this.serverFrameImages[clampedIdx];
    if (!img || !img.naturalWidth) return;
    this.currentServerFrameIdx = clampedIdx;
    this.canvas.width = img.naturalWidth;
    this.canvas.height = img.naturalHeight;
    const { width, height } = this.container.getBoundingClientRect();
    this.resetCanvasDimensions(width, height, img.naturalWidth, img.naturalHeight);
    this.context.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight);
  }

  private setCoverStyle(el: any) {
    if (el && this.container) {
      el.style.position = 'absolute';
      el.style.top = '50%';
      el.style.left = '50%';
      el.style.transform = 'translate(-50%, -50%)';
      const { width: containerWidth, height: containerHeight } = this.container.getBoundingClientRect();
      const width = el.videoWidth || el.width;
      const height = el.videoHeight || el.height;
      if (containerWidth / containerHeight > width / height) {
        el.style.width = '100%';
        el.style.height = 'auto';
      } else {
        el.style.height = '100%';
        el.style.width = 'auto';
      }
    }
  }

  private resize = () => {
    if (this.debug) console.info('ScrollVideo resizing...');
    if (this.serverFrameData && this.serverFrameImages.length > 0) {
      this.paintServerFrame(this.currentServerFrameIdx);
    } else if (this.canvas) {
      this.setCoverStyle(this.canvas);
      this.paintCanvasFrame(Math.floor(this.currentTime * this.frameRate));
    } else if (this.video) {
      this.setCoverStyle(this.video);
    }
  };

  private decodeVideo = () => {
    if (!this.video) return;
    if (this.useWebCodecs && this.video.src) {
      videoDecoder(this.video.src, (frame: ImageBitmap) => {
          this.frames.push(frame);
        },
        this.debug,
      ).then(() => {
        if (!this.video || !this.container) return
        if (this.frames.length === 0) {
          if (this.debug) console.error('No frames were received from webCodecs');
          return;
        }
        this.frameRate = this.frames.length / this.video.duration;
        if (this.debug) console.info('Received', this.frames.length, 'frames');
        this.canvas = document.createElement('canvas');
        this.context = this.canvas.getContext('2d')!;
        this.video.style.display = 'none';
        this.container.appendChild(this.canvas);
        this.paintCanvasFrame(Math.floor(this.currentTime * this.frameRate));
      }).catch(() => {
        if (this.debug) console.error('Error encountered while decoding video');
        this.frames = [];
        this.video!.load();
      });
    }
  }

  private paintCanvasFrame(frameNum: number) {
    if (this.canvas) {
      const frameIdx = Math.min(frameNum, this.frames.length - 1);
      const currFrame = this.frames[frameIdx];
      if (currFrame && this.container) {
        if (this.debug) console.info('Painting frame', frameIdx);
        this.canvas.width = currFrame.width;
        this.canvas.height = currFrame.height;
        const { width, height } = this.container.getBoundingClientRect();
        this.resetCanvasDimensions(width, height, currFrame.width, currFrame.height);
        this.context!.drawImage(currFrame, 0, 0, currFrame.width, currFrame.height);
      }
    }
  }

  private transitionToTargetTime(jump: boolean) {
    if (!this.video) return;
    if (this.debug) console.info('Transitioning targetTime:', this.targetTime, 'currentTime:', this.currentTime);
    if (isNaN(this.targetTime) || Math.abs(this.currentTime - this.targetTime) < this.frameThreshold) {
      this.video.pause();
      this.transitioning = false;
      return;
    }
    // Make sure we don't go out of time bounds
    if (this.targetTime > this.video.duration) {
      this.targetTime = this.video.duration;
    }
    if (this.targetTime < 0) {
      this.targetTime = 0;
    }
    // How far forward we need to transition
    const transitionForward = this.targetTime - this.currentTime;
    if (this.canvas) {
      // Update currentTime and paint the closest frame
      this.currentTime += transitionForward / (256 / this.transitionSpeed);
      // If jump, we go directly to the frame
      if (jump) { this.currentTime = this.targetTime }
      this.paintCanvasFrame(Math.floor(this.currentTime * this.frameRate));
    } else if (jump || this.isSafari || this.targetTime - this.currentTime < 0) {
      this.video.pause();
      this.currentTime += transitionForward / (64 / this.transitionSpeed);
      // If jump, we go directly to the frame
      if (jump) { this.currentTime = this.targetTime;}
      this.video.currentTime = this.currentTime;
    } else {
      // Otherwise, we play the video and adjust the playbackRate to get a smoother
      // animation effect.
      const playbackRate = Math.max(Math.min(transitionForward * 4, this.transitionSpeed, 16), 1);
      if (this.debug) console.info('ScrollVideo playbackRate:', playbackRate);
      if (!isNaN(playbackRate)) {
        this.video.playbackRate = playbackRate;
        this.video.play();
      }
      this.currentTime = this.video.currentTime;
    }
    if (typeof requestAnimationFrame === 'function') {
      requestAnimationFrame(() => this.transitionToTargetTime(jump));
    }
  }

  private resetCanvasDimensions(w: number, h: number, frameW: number, frameH: number) {
    if (!this.canvas) return;
    if (w / h > frameW / frameH) {
      this.canvas.style.width = '100%';
      this.canvas.style.height = 'auto';
    } else {
      this.canvas.style.height = '100%';
      this.canvas.style.width = 'auto';
    }
  }

  setTargetTimePercent(setPercentage: number, jump: boolean = true): void {
    if (this.serverFrameData && this.serverFrameImages.length > 0) {
      const frameIdx = Math.round(Math.max(0, Math.min(setPercentage, 1)) * (this.serverFrameImages.length - 1));
      this.paintServerFrame(frameIdx);
      return;
    }
    if (!this.video) return;
    this.targetTime = Math.max(Math.min(setPercentage, 1), 0)
      * (this.frames.length && this.frameRate ? this.frames.length / this.frameRate : this.video.duration);
    if (!jump && Math.abs(this.currentTime - this.targetTime) < this.frameThreshold) return;
    if (!jump && this.transitioning) return;
    if (!this.canvas && !this.video.paused) this.video.play();
    this.transitioning = true;
    this.transitionToTargetTime(jump);
  }

  destroy(): void {
    this.resizeObserver.unobserve(this.container!);
    this.video?.removeEventListener('progress', this.resize);
    if (this.debug) console.info('Destroying ScrollVideo');
    if (this.container) this.container.innerHTML = '';
  }
}
