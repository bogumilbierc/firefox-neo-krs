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
  const currentReferee = getRefereeFromCurrentCase();
  console.log(`Current referee: ${currentReferee}`)
  if (!currentReferee) {
    console.error('Cannot extract referee!')
    return;
  }
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
 * @returns {string | null}
 */
function getRefereeFromCurrentCase() {
  const lawsuitMainDataElements = document.querySelectorAll(
      '.row.lawsuit-main-data.submain');

  for (const lawsuitElement of lawsuitMainDataElements) {
    if (isARefereeRow(lawsuitElement)) {
      return getRefereeFromRow(lawsuitElement);
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
 * @returns {string | null}
 */
function getRefereeFromRow(lawsuitElement) {
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
  return trimmed;
}

window.setInterval(checkLocationChange, 500)
