class Logger {
  silentMode: boolean;

  constructor(silentMode: boolean) {
    this.silentMode = silentMode;
  }

  log(message: string) {
    if (!this.silentMode) {
      console.log(message);
    }
  }

  info(message: string) {
    if (!this.silentMode) {
      console.info(message);
    }
  }

  error(message: string) {
    if (!this.silentMode) {
      console.error(message);
    }
  }
}
