const LawsuitDetailsProcessor = {};

/**
 * Checks if current location is supported by this processor
 * @param {string} currentLocation
 */
LawsuitDetailsProcessor.supports = function (currentLocation) {
  const caseDetailsRegex = new RegExp('sprawy\\/\\S*\\/szczegoly');
  const regexMatches = caseDetailsRegex.test(currentLocation);
  console.log(`LawsuitDetailsProcessor::supports: ${regexMatches}`);
  return regexMatches;
}

LawsuitDetailsProcessor.process = async function () {
  const currentRefereeElement = LawsuitDetailsProcessor._getRefereeElement();
  if (!currentRefereeElement) {
    console.error('Cannot extract referee!')
    return;
  }
  const refereeName = currentRefereeElement.textContent;
  console.log(`Current referee: ${refereeName}`)
  CommonProcessor.markRefereeAsInProcessing(currentRefereeElement, refereeName);
  const matchingReferees = await RefereeMatcher.getMatchingNeoKrsReferee(refereeName);
  CommonProcessor.markRefereeAsProcessed(currentRefereeElement, matchingReferees, refereeName)
}

/**
 * Gets referee name from current page/case
 * @returns {HTMLElement}
 * @private
 */
LawsuitDetailsProcessor._getRefereeElement = function () {
  const lawsuitMainDataElements = document.querySelectorAll(
    '.row.lawsuit-main-data.submain');

  for (const lawsuitElement of lawsuitMainDataElements) {
    if (LawsuitDetailsProcessor._isARefereeRow(lawsuitElement)) {
      return LawsuitDetailsProcessor._getRefereeElementFromRow(lawsuitElement);
    }
  }
}

/**
 * Checks is passed elemement is a Referee row element
 * @param {HTMLElement} lawsuitElement
 * @returns {boolean}
 * @private
 */
LawsuitDetailsProcessor._isARefereeRow = function (lawsuitElement) {
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
 * @private
 */
LawsuitDetailsProcessor._getRefereeElementFromRow = function (lawsuitElement) {
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
