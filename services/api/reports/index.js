export default class Reports {
  base_url = String;

  constructor(base_url) {
    this.base_url = base_url;
  }

  /**
   * @param { Object} params
   * @param {File} params.file
   * @param {Object} params.data
   *
   * @param {Number} [params.data.id_template]
   * @param {Object} [params.data.data]
   *
   *
   * @returns {Promise<{status: number, message: string, data: any}>}
   */

  async create(params) {

     try {

        console.log({params})
      const url = this.base_url + "/reports";

      const formData = new FormData();

      formData.append('file', params.file);
      formData.append('data', JSON.stringify(params.data));


      const options = {
        method: "POST",
        file: params.file,
        body: formData
      };

      const response = await fetch(url, options);

      const data = await response.json();

      return data;
   } catch (error) {
        console.log({ error })

        const response = {status: 503, message: 'Ocorreu um erro no processo, tente novamente mais tarde', data: null}
        return response;
   }


  }
}
