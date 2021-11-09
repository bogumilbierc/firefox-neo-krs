const RefereeStore = {};

/**
 * @typedef {object} Referee
 * @property {string} name
 * @property {string} surname
 */

/**
 *
 * @returns {Promise<Referee[]>}
 */
RefereeStore.getRefereesData = async function () {
  const refereesDataUrl = browser.runtime.getURL("neo-krs-referees.json");
  console.log('Referees list url')
  console.log(refereesDataUrl)
  const refereesData = await fetch(refereesDataUrl);
  const jsonData = await refereesData.json();
  console.log('Referees json data')
  console.log(jsonData)
  return jsonData;
}
