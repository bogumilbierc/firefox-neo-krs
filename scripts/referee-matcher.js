const RefereeMatcher = {};

/**
 *
 * @param {string} refereeName
 * @returns {Promise<Referee[]>}
 */
RefereeMatcher.getMatchingNeoKrsReferee = async function (refereeName) {
  const neoKrsReferees = await RefereeStore.getRefereesData();

  const surname = RefereeMatcher._getSurname(refereeName).toLowerCase();
  const name = RefereeMatcher._getName(refereeName).toLowerCase()

  const refereesMatchingBySurname = neoKrsReferees
  .filter((referee) => referee.surname.toLowerCase() === surname)

  if (!refereesMatchingBySurname.length) {
    console.log('No matching referees by surname')
    return [];
  }

  const matchingByFirstname = refereesMatchingBySurname.filter((referee) => referee.name.toLowerCase().includes(name))
  console.log('Referees matching by firstname');
  console.log(matchingByFirstname)

  return Promise.resolve(matchingByFirstname);
}

/**
 * Gets surname from referee full name
 * @param {string} refereeFullName
 * @returns {string}
 * @private
 */
RefereeMatcher._getSurname = function (refereeFullName) {
  const split = refereeFullName.split(' ');
  return split[split.length - 1];
}

/**
 * Gets name from referee full name
 * @param {string} refereeFullName
 * @returns {string}
 * @private
 */
RefereeMatcher._getName = function (refereeFullName) {
  const split = refereeFullName.split(' ');
  if (split.length === 2) {
    return split[0]
  }
  return split[1]
}
