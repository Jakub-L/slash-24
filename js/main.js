// GLOBALS
const INITIAL_BITMASK_LENGTH = 24;
const INITIAL_IP_ADDRESS = '172.16.254.149';

// ELEMENTS
const maskLengthInput = document.getElementById('mask__input');
const maskLengthSlider = document.getElementById('mask__slider');
const ipAddressInput = document.getElementById('ip__input');
const ipAddressValidator = document.getElementById('ip__validator');

// INITIALISATION
maskLengthInput.value = INITIAL_BITMASK_LENGTH;
maskLengthSlider.value = INITIAL_BITMASK_LENGTH;
ipAddressInput.value = INITIAL_IP_ADDRESS;
let maskBitLength = INITIAL_BITMASK_LENGTH;
let ipOctets;
let ipBinOctets;
let maskBinOctets;
let maskComplementBinOctets;
setMask(INITIAL_BITMASK_LENGTH);
setIpOctets(parseIp(INITIAL_IP_ADDRESS));

// EVENT LISTENERS
maskLengthInput.addEventListener('change', bitmaskLengthChange);
maskLengthSlider.addEventListener('change', bitmaskLengthChange);
ipAddressInput.addEventListener('change', ipAddressChange);

// EVENT HANDLERS
function bitmaskLengthChange({ target }) {
  const clampedValue = Math.max(0, Math.min(32, target.value));
  maskLengthInput.value = clampedValue;
  maskLengthSlider.value = clampedValue;
  setMask(clampedValue);
}

function ipAddressChange({ target }) {
  const newOctets = parseIp(target.value);
  const isIpValid = newOctets.length === 4 && newOctets.every(octet => octet >= 0 && octet <= 255);
  if (isIpValid) {
    setIpOctets(newOctets);
    ipAddressValidator.classList.add('hidden');
  } else {
    ipAddressValidator.classList.remove('hidden');
  }
}

// GENERAL UTILS
function parseIp(str) {
  return str.split('.').map(Number);
}

// SETTERS
function setIpOctets(octets) {
  ipOctets = octets;
  ipBinOctets = octets.map(o => o.toString(2).padStart(8, 0));
}

function setMask(maskLength) {
  maskBitLength = maskLength;
  maskBinOctets = '1'.repeat(maskLength).padEnd(32, 0).match(/.{8}/g);
  maskComplementBinOctets = '0'.repeat(maskLength).padEnd(32, 1).match(/.{8}/g);
}
