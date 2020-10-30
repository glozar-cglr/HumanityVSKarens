class Engine {
    constructor(fps, update, render) {
      this.timeAccum = 0; // Amount of time accumulated since last update
      this.animationRequest = undefined; // To be used to reference the Request Animation Frame
      this.time = undefined; // Most recent timestamp of loop execution
      this.fps = fps; // Frames per second
      this.updated = false; // Whether or not the update function has been called
      this.update = update; // Update function set when class is instanced
      this.render = render; // Render function set when class is instanced
    }
  
    start() {
      this.timeAccum = this.fps;
      this.time = window.performance.now();
      this.animationRequest = window.requestAnimationFrame(
        this.handleLoop
      );
    }
  
    stop() {
      window.cancelAnimationFrame(this.animationRequest);
    }
  
    loop(time_stamp) {
      this.timeAccum += time_stamp - this.time;
      this.time = time_stamp;
  
      while (this.timeAccum >= this.fps) {
        this.timeAccum -= this.fps;
        this.update(time_stamp);
        this.updated = true;
      }
  
      if (this.updated) {
        this.updated = false;
        this.render(time_stamp);
      }
  
      this.animationRequest = window.requestAnimationFrame(
        this.handleLoop
      );
    }
  
    handleLoop = fps => {
      this.loop(fps);
    };
  }