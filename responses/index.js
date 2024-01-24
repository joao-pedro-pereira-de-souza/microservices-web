
/**
 * @param {Object} params
 * @param {Number} params.status
 * @param {String} params.message
 * @param {any} params.data
 */
export default function (params) {
   const { status, message } = params

   const statusSuccess = [200, 201]
   if (!statusSuccess.includes(status)) {
      alert(message)

      throw new Error(message)
   }
}
