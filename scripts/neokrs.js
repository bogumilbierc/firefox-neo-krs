console.log('Executing NeoKRS extension');

let currentLocation = null;

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
  if (LawsuitDetailsProcessor.supports(currentLocation)) {
    return await LawsuitDetailsProcessor.process();
  }
  if (LawsuitListProcessor.supports(currentLocation)) {
    return await LawsuitListProcessor.process();
  }
  console.log('No processor that supports current location')

}

neoKrs();

window.setInterval(checkLocationChange, 500)

if (document.readyState === "loading") {
  document.addEventListener('DOMContentLoaded', neoKrs);
} else {
  neoKrs();
}

if (document.readyState === 'complete') {
  neoKrs();
} else {
  window.addEventListener('load', neoKrs);
}

document.addEventListener()

