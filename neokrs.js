console.log('Executing NeoKRS extension');

document.body.style.border = "5px solid red";

let currentLocation = window.location.toString();

function checkLocationChange() {
  const newLocation = window.location.toString();
  if (newLocation !== currentLocation) {
    console.info('Location has changed - trying to perform neoKRS logic');
    currentLocation = newLocation;
    neoKrs();
  } else {
    console.debug('Location has not changed');
  }
}

function neoKrs() {
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

if (isOnCaseDetailsPage()) {
  neoKrs();
}
window.setInterval(checkLocationChange, 500)
