// GLOBALS
const INITIAL_BITMASK_LENGTH = 24;
const INITIAL_IP_ADDRESS = '172.16.254.1';

// ELEMENTS
const maskLengthInput = document.getElementById('mask-length-input');
const maskLengthSlider = document.getElementById('mask-length-slider');
const ipAddressInput = document.getElementById('ip-address-input');
const ipAddressValidator = document.getElementById('ip-address-validator');

// INITIALISATION
maskLengthInput.value = INITIAL_BITMASK_LENGTH;
maskLengthSlider.value = INITIAL_BITMASK_LENGTH;
ipAddressInput.value = INITIAL_IP_ADDRESS;
let isIpValid = true;

// EVENT LISTENERS
maskLengthInput.addEventListener('change', bitmaskLengthChange);
maskLengthSlider.addEventListener('change', bitmaskLengthChange);
ipAddressInput.addEventListener('change', checkIpValidity);

// EVENT HANDLERS
function bitmaskLengthChange({ target }) {
  const clampedValue = Math.max(0, Math.min(32, target.value));
  maskLengthInput.value = clampedValue;
  maskLengthSlider.value = clampedValue;
}

function checkIpValidity({ target }) {
  const octets = getOctets(target.value);
  isIpValid = octets.length === 4 && octets.every(octet => octet >= 0 && octet <= 255);
  if (isIpValid) {
    ipAddressValidator.classList.add('hidden');
  } else {
    ipAddressValidator.classList.remove('hidden');
  }
}

// UTILS
function getOctets(str) {
  return str.split('.').map(Number);
}
