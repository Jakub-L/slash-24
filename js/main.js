// GLOBALS
const INITIAL_BITMASK_LENGTH = 24;
const INITIAL_IP_ADDRESS = '172.16.254.149';

// ELEMENTS
const ipAddressInput = document.getElementById('ip_input__field');
const ipAddressValidator = document.getElementById('ip_input__validator');
const ipDecimalOctets = document.querySelectorAll('[data-conversion=ip-decimal]');
const ipBinaryOctets = document.querySelectorAll('[data-conversion=ip-binary]');

const maskLengthInput = document.getElementById('mask_input__field');
const maskLengthSlider = document.getElementById('mask_input__slider');
const maskDecimalOctets = document.querySelectorAll('[data-conversion=mask-decimal]');
const maskBinaryOctets = document.querySelectorAll('[data-conversion=mask-binary]');

// INITIALISATION
setIp(INITIAL_IP_ADDRESS);
setMask(INITIAL_BITMASK_LENGTH);
setMaskOctets(maskToOctets(INITIAL_BITMASK_LENGTH));
setIpOctets(ipToOctets(INITIAL_IP_ADDRESS));

// EVENT LISTENERS
maskLengthInput.addEventListener('change', bitmaskLengthChange);
maskLengthSlider.addEventListener('change', bitmaskLengthChange);
ipAddressInput.addEventListener('change', ipAddressChange);

// EVENT HANDLERS
function bitmaskLengthChange({ target }) {
  const clampedValue = Math.max(0, Math.min(32, target.value));
  setMask(clampedValue);
  setMaskOctets(maskToOctets(clampedValue));
}

function ipAddressChange({ target }) {
  const newIp = target.value;
  const newOctets = ipToOctets(newIp);
  if (isValidIp(newOctets)) {
    setIp(newIp);
    setIpOctets(newOctets);
    ipAddressValidator.classList.add('hidden');
  } else {
    ipAddressValidator.classList.remove('hidden');
  }
}

// GENERAL UTILS
function ipToOctets(ip) {
  return ip.split('.').map(Number);
}

function maskToOctets(length) {
  return '1'.repeat(length).padStart(32, '0').match(/.{8}/g);
}

function isValidIp(octets) {
  return octets.length === 4 && octets.every(octet => octet >= 0 && octet <= 255);
}

function toFixedBinary(decimal, length) {
  return decimal.toString(2).padStart(length, '0');
}

function fromBinary(octet) {
  return parseInt(octet, 2);
}

// SETTERS
function setIp(ip) {
  ipAddressInput.value = ip;
}

function setIpOctets(decimalOctets) {
  decimalOctets.forEach((octet, i) => {
    ipDecimalOctets[i].innerHTML = octet;
    ipBinaryOctets[i].innerHTML = toFixedBinary(octet, 8);
  });
}

function setMask(mask) {
  maskLengthInput.value = mask;
  maskLengthSlider.value = mask;
}

function setMaskOctets(binaryOctets) {
  binaryOctets.forEach((octet, i) => {
    maskDecimalOctets[i].innerHTML = fromBinary(octet);
    maskBinaryOctets[i].innerHTML = octet;
  });
}
