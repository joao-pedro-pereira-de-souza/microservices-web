
export default class Socket {
  /**
   * @type {SocketIOClient.Socket}
   */

  socket;
  #events = { templates: { progress: "progress" } };

  constructor() {}

  async open() {
    this.socket = await io("http://localhost:1258", {
      transports: ["websocket"],
      cors: { origin: "http://localhost:3001" },
    });
  }

  /**
   *
   * @param {Object} params
   * @param {string} params.job_id
   */
  emitJoinRoomProgress(params) {
    this.socket.emit(this.#events.templates.progress, params);
  }
  /**
   *
   * @param {Object} params
   * @param {Function} params.callback
   */
  onProgressTemplate(params) {

    this.socket.on(this.#events.templates.progress, (response) => {

      const { success, data } = response;
      if (success) {
        params.callback(data);
      }

    });
  }
}
