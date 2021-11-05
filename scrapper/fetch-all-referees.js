const CitiesService = require('./CitiesService');
const CourtsService = require('./CourtsService');

const kodWebsiteUrl = 'https://ruchkod.pl/neokrs/'

async function scrapRefereesData() {

  const citiesService = new CitiesService();

  const cities = await citiesService.getCitiesList(kodWebsiteUrl)
  console.log('CITIES::')
  console.log(cities);
  const courts = await getCourts(cities);
  console.log('COURTS::')
  console.log(courts);
}

/**
 * Sequential by design - kod website does not like to be called in parallel from same IP
 * @param {City[]} cities
 * @returns {Promise<*[]>}
 */
async function getCourts(cities) {
  const courts = []

  for (const city of cities) {
    const courtsForCity = await new CourtsService().getCourtsForCity(city);
    courts.push(...courtsForCity)
  }

  return courts;
}

scrapRefereesData()
