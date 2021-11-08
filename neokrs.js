console.log('Executing NeoKRS extension');

document.body.style.border = "5px solid red";

let currentLocation = window.location.toString();

async function checkLocationChange() {
  const newLocation = window.location.toString();
  if (newLocation !== currentLocation) {
    console.info('Location has changed - trying to perform neoKRS logic');
    currentLocation = newLocation;
    await neoKrs();
  } else {
    console.debug('Location has not changed');
  }
}

async function neoKrs() {
  if (!isOnCaseDetailsPage()) {
    return;
  }
  const currentRefereeElement = getRefereeElementFromCurrentCase();
  if (!currentRefereeElement) {
    console.error('Cannot extract referee!')
    return;
  }
  const refereeName = currentRefereeElement.textContent;
  console.log(`Current referee: ${refereeName}`)
  markRefereeAsInProcessing(currentRefereeElement, refereeName);
  const matchingReferees = await getMatchingNeoKrsReferee(refereeName);
  markRefereeAsProcessed(currentRefereeElement, matchingReferees, refereeName)
}

/**
 * Checking if current location is on case details page
 * @returns {boolean}
 */
function isOnCaseDetailsPage() {
  const caseDetailsRegex = new RegExp('sprawy\\/\\S*\\/szczegoly');
  const regexMatches = caseDetailsRegex.test(currentLocation);
  console.log(`Is on case details page: ${regexMatches}`);
  return regexMatches;
}

/**
 * Gets referee name from current page/case
 * @returns {HTMLElement}
 */
function getRefereeElementFromCurrentCase() {
  const lawsuitMainDataElements = document.querySelectorAll(
    '.row.lawsuit-main-data.submain');

  for (const lawsuitElement of lawsuitMainDataElements) {
    if (isARefereeRow(lawsuitElement)) {
      return getRefereeElementFromRow(lawsuitElement);
    }
  }
}

/**
 * Checks is passed elemement is a Referee row element
 * @param {HTMLElement} lawsuitElement
 * @returns {boolean}
 */
function isARefereeRow(lawsuitElement) {
  const titleElement = lawsuitElement.querySelector('.col-md-3')
  if (!titleElement) {
    return false;
  }
  const title = titleElement.textContent;
  if (!title) {
    return false;
  }
  return title.toLowerCase().trim() === 'referent:';
}

/**
 * Gets referee name from current row
 * @param {HTMLElement} lawsuitElement
 * @returns {HTMLElement | null}
 */
function getRefereeElementFromRow(lawsuitElement) {
  const nameElement = lawsuitElement.querySelector('.col-md-9');
  if (!nameElement) {
    return null;
  }
  const name = nameElement.textContent;
  if (!name) {
    return null;
  }
  const trimmed = name.trim();
  if (!trimmed) {
    return null;
  }
  return nameElement;
}

/**
 * Marks referee HTML element as in processing
 * @param {HTMLElement} refereeElement - element containing referee name text
 * @param {string} refereeName - name of the referee
 */
function markRefereeAsInProcessing(refereeElement, refereeName) {
  refereeElement.textContent = `${refereeName} --- Sprawdzanie w bazie NeoKRS`
}

/**
 * Martks referee HTML element as processed
 * @param {HTMLElement} refereeElement
 * @param {Referee[]} matchedReferees
 * @param {string} refereeName
 */
function markRefereeAsProcessed(refereeElement, matchedReferees, refereeName) {
  if (!matchedReferees.length) {
    refereeElement.textContent = `${refereeName} --- Brak w bazie NeoKRS`
    return;
  }
  refereeElement.textContent = `${refereeName} --- Dopasowania: ${JSON.stringify(matchedReferees)}`;
  refereeElement.style.color = 'red';
}

/**
 *
 * @param {string} refereeName
 * @returns {Promise<Referee[]>}
 */
async function getMatchingNeoKrsReferee(refereeName) {
  const neoKrsReferees = await getRefereesData();

  const surname = getSurname(refereeName).toLowerCase();
  const name = getName(refereeName).toLowerCase()

  const refereesMatchingBySurname = neoKrsReferees
  .filter((referee) => referee.surname.toLowerCase() === surname)

  if (!refereesMatchingBySurname.length) {
    console.log('No matching referees by surname')
    return [];
  }

  const matchingByFirstname = refereesMatchingBySurname.filter((referee) => referee.name.toLowerCase().includes(name))
  console.log('Referees mathcing by firstname');
  console.log(matchingByFirstname)

  return Promise.resolve(matchingByFirstname);
}

function getSurname(refereeFullName) {
  const split = refereeFullName.split(' ');
  return split[split.length - 1];
}

function getName(refereeFullName) {
  const split = refereeFullName.split(' ');
  if (split.length === 2) {
    return split[0]
  }
  return split[1]
}

/**
 * @typedef {object} Referee
 * @property {string} name
 * @property {string} surname
 */

/**
 *
 * @returns {Promise<Referee[]>}
 */
async function getRefereesData() {
  const refereesDataUrl = browser.runtime.getURL("neo-krs-referees.json");
  console.log('Referees list url')
  console.log(refereesDataUrl)
  const refereesData = await fetch(refereesDataUrl);
  const jsonData = await refereesData.json();
  console.log('Referees json data')
  console.log(jsonData)
  return jsonData;
}

if (isOnCaseDetailsPage()) {
  neoKrs();
}
window.setInterval(checkLocationChange, 500)
