const LawsuitListProcessor = {};

/**
 * Checks if current location is supported by this processor
 * @param {string} currentLocation
 */
LawsuitListProcessor.supports = function (currentLocation) {
  const caseDetailsRegex = new RegExp('(sprawy$)|(sprawy\\?)\\S*');
  const regexMatches = caseDetailsRegex.test(currentLocation);
  console.log(`LawsuitListProcessor::supports: ${regexMatches}`);
  return regexMatches;
}

LawsuitListProcessor.process = async function () {
  LawsuitListProcessor._attachEventListeners();
  const lawsuitCasesElements = document.querySelectorAll('.row.lawsuit-row:not(.neo-krs-processed)')
  console.log('Lawsuit case element')
  console.log(lawsuitCasesElements)
  if (!lawsuitCasesElements || !lawsuitCasesElements.length) {
    console.log('No cases to process. Will try again in 2 seconds');
    await Utils.sleep(2000);
    await LawsuitListProcessor.process();
  }
  for (const lawsuitCaseElement of lawsuitCasesElements) {
    await LawsuitListProcessor._processCase(lawsuitCaseElement);
  }
}

/**
 * Processes single lawsuit case
 * @param {HTMLElement} caseHtmlElement
 * @returns {Promise<void>}
 * @private
 */
LawsuitListProcessor._processCase = async function (caseHtmlElement) {
  const currentRefereeElement = LawsuitListProcessor._getRefereeElement(caseHtmlElement);
  LawsuitListProcessor._markCaseAsProcessed(caseHtmlElement);
  if (!currentRefereeElement) {
    console.error('Cannot extract referee!')
    return;
  }
  const refereeName = LawsuitListProcessor._getRefereeName(currentRefereeElement);
  if (refereeName.includes('Sprawdzanie w bazie') || refereeName.includes('Brak w bazie')) {
    return;
  }
  console.log(`Current referee: ${refereeName}`)
  CommonProcessor.markRefereeAsInProcessing(currentRefereeElement, refereeName);
  const matchingReferees = await RefereeMatcher.getMatchingNeoKrsReferee(refereeName);
  CommonProcessor.markRefereeAsProcessed(currentRefereeElement, matchingReferees, refereeName)
}

/**
 * Gets Referee HTML element from lawsuit case element
 * @param {HTMLElement} lawsuitCaseHtmlElement
 * @returns {HTMLElement}
 * @private
 */
LawsuitListProcessor._getRefereeElement = function (lawsuitCaseHtmlElement) {
  return lawsuitCaseHtmlElement.querySelector('div.col-md-9 > span:first-of-type')
}

/**
 * Gets referee name from referee HTML element
 * @param {HTMLElement} refereeElement
 * @returns {string}
 * @private
 */
LawsuitListProcessor._getRefereeName = function (refereeElement) {
  const nameWithCrap = refereeElement.textContent;
  const nameWithoutTitle = nameWithCrap.replace('Referent:', '');
  return nameWithoutTitle.trim();
}

/**
 * Marks case as processed, so it wont be processed again
 * @param {HTMLElement} caseHtmlElement
 * @private
 */
LawsuitListProcessor._markCaseAsProcessed = function (caseHtmlElement) {
  caseHtmlElement.classList.add('neo-krs-processed')
}

/**
 * Attaches event listeners to elements, that are chaning page content yet they dont emit it outside
 * @private
 */
LawsuitListProcessor._attachEventListeners = function () {
  document.querySelectorAll('button.remove-filter').forEach((button) => {
    button.addEventListener('click', LawsuitListProcessor.process)
  });
  document.querySelectorAll('button.filter-button').forEach((button) => {
    button.addEventListener('click', LawsuitListProcessor.process)
  });
  document.querySelectorAll('button.sort-position').forEach((button) => {
    button.addEventListener('click', LawsuitListProcessor.process)
  });
}
