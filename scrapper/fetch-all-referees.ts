import { CitiesService } from './src/CitiesService';
import { CourtsService } from './src/CourtsService';
import { City } from './src/model/city.model';
import { Court } from './src/model/court.model';
import { RefereesService } from './src/RefereesService';
import * as fs from 'fs';
import path from 'path';


const kodWebsiteUrl = 'https://ruchkod.pl/neokrs/'

async function scrapRefereesData() {

  const citiesService = new CitiesService();

  const cities = await citiesService.getCitiesList()
  console.log('CITIES::')
  console.log(cities);
  const courts = await getCourts(cities);
  console.log('COURTS::')
  console.log(courts);
  const referees = await getReferees(courts);
  console.log('REFEREES:');
  console.log(referees);

  console.log('Storing JSON file with referees data');
  fs.writeFileSync(path.join(__dirname, '..', '..', 'neo-krs-referees.json'), JSON.stringify(referees))
}

/**
 * Sequential by design - kod website does not like to be called in parallel from same IP
 */
async function getCourts(cities: City[]): Promise<Court[]> {
  /**
   *
   * @type {Court[]}
   */
  const courts = []

  for (const city of cities) {
    const courtsForCity = await new CourtsService().getCourtsForCity(city);
    courts.push(...courtsForCity)
  }

  return courts;
}

/**
 * Sequential by design
 */
async function getReferees(courts: Court[]) {
  /**
   *
   * @type {Referee[]}
   */
  const referees = [];
  for (const court of courts) {
    const refereesForCourt = await new RefereesService().getReferees(court);
    referees.push(...refereesForCourt)
  }
  return referees;
}

scrapRefereesData()
