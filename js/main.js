// GLOBALS
let mask = 24;
let ipAddress = '172.16.254.149';

// ELEMENTS
const ipAddressInput = document.getElementById('ip_input__field');
const ipAddressValidator = document.getElementById('ip_input__validator');
const ipDecimalOctets = document.querySelectorAll('[data-group=ip-decimal]');
const ipBinaryOctets = document.querySelectorAll('[data-group=ip-binary]');

const maskLengthInput = document.getElementById('mask_input__field');
const maskLengthSlider = document.getElementById('mask_input__slider');
const maskDecimalOctets = document.querySelectorAll('[data-group=mask-decimal]');
const maskBinaryOctets = document.querySelectorAll('[data-group=mask-binary]');

const networkPrefixIpOctets = document.querySelectorAll('[data-group=network-prefix-ip]');
const networkPrefixMaskOctets = document.querySelectorAll('[data-group=network-prefix-mask]');
const networkPrefixResultOctets = document.querySelectorAll(
  '[data-group=network-prefix-result]'
);

const networkPrefixDecimalOctets = document.querySelectorAll(
  '[data-group=network-prefix-decimal]'
);
const networkPrefixBinaryOctets = document.querySelectorAll(
  '[data-group=network-prefix-binary]'
);

// INITIALISATION
setIp(ipAddress);
setMask(mask);
setNetworkPrefix(ipAddress, mask);

// EVENT LISTENERS
maskLengthInput.addEventListener('change', bitmaskLengthChange);
maskLengthSlider.addEventListener('change', bitmaskLengthChange);
ipAddressInput.addEventListener('change', ipAddressChange);

// EVENT HANDLERS
function bitmaskLengthChange({ target }) {
  const clampedValue = Math.max(0, Math.min(32, target.value));
  setMask(clampedValue);
  setNetworkPrefix(ipAddress, clampedValue);
}

function ipAddressChange({ target }) {
  const newIp = target.value;
  if (isValidIp(newIp)) {
    setIp(newIp);
    setNetworkPrefix(newIp, mask);
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
  return '1'.repeat(length).padEnd(32, '0').match(/.{8}/g);
}

function isValidIp(ip) {
  const octets = ipToOctets(ip);
  return octets.length === 4 && octets.every(octet => octet >= 0 && octet <= 255);
}

function toBinary(decimal, length = 8) {
  return decimal.toString(2).padStart(length, '0');
}

function fromBinary(octet) {
  return parseInt(octet, 2);
}

// SETTERS
function setIp(newIp) {
  ipAddress = newIp;
  ipAddressInput.value = newIp;
  ipToOctets(newIp).forEach((octet, i) => {
    ipDecimalOctets[i].innerHTML = octet;
    ipBinaryOctets[i].innerHTML = toBinary(octet);
    networkPrefixIpOctets[i].innerHTML = toBinary(octet);
  });
}

function setMask(newMask) {
  mask = newMask;
  maskLengthInput.value = newMask;
  maskLengthSlider.value = newMask;
  maskToOctets(newMask).forEach((octet, i) => {
    maskDecimalOctets[i].innerHTML = fromBinary(octet);
    maskBinaryOctets[i].innerHTML = octet;
    networkPrefixMaskOctets[i].innerHTML = octet;
  });
}

function setNetworkPrefix(newIp, newMask) {
  const maskBits = maskToOctets(newMask).join('').split('').map(Number);
  const ipBits = ipToOctets(newIp)
    .map(o => toBinary(o))
    .join('')
    .split('')
    .map(Number);
  const result = ipBits
    .map((iBit, i) => iBit & maskBits[i])
    .join('')
    .match(/.{8}/g);
  result.forEach((octet, i) => {
    networkPrefixResultOctets[i].innerHTML = octet;
    networkPrefixBinaryOctets[i].innerHTML = octet;
    networkPrefixDecimalOctets[i].innerHTML = fromBinary(octet);
  });
}
