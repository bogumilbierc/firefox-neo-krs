const CommonProcessor = {};

/**
 * Marks referee HTML element as in processing
 * @param {HTMLElement} refereeElement - element containing referee name text
 * @param {string} refereeName - name of the referee
 */
CommonProcessor.markRefereeAsInProcessing = function (refereeElement, refereeName) {
  console.debug(`Marking referee as in processing: ${refereeElement}`)
  refereeElement.textContent = `${refereeName} --- Sprawdzanie w bazie NeoKRS`
}

/**
 * Martks referee HTML element as processed
 * @param {HTMLElement} refereeElement
 * @param {Referee[]} matchedReferees
 * @param {string} refereeName
 */
CommonProcessor.markRefereeAsProcessed = function (refereeElement, matchedReferees, refereeName) {
  if (!matchedReferees.length) {
    console.debug(`Marking referee as not matching: ${refereeName}`)
    refereeElement.textContent = `${refereeName} --- Brak w bazie NeoKRS`
    return;
  }
  console.debug(`Marking referee as matching: ${refereeName}`)
  refereeElement.textContent = `${refereeName} --- Dopasowania: ${JSON.stringify(matchedReferees)}`;
  refereeElement.style.color = 'red';
}
