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
// prettier-ignore
const networkPrefixResultOctets = document.querySelectorAll('[data-group=network-prefix-result]');

// prettier-ignore
const networkPrefixDecimalOctets = document.querySelectorAll('[data-group=network-prefix-decimal]');
// prettier-ignore
const networkPrefixBinaryOctets = document.querySelectorAll('[data-group=network-prefix-binary]');

// prettier-ignore
const complementExampleMask = document.querySelectorAll('[data-group=complement-example-mask]');
// prettier-ignore
const complementExampleComplement = document.querySelectorAll('[data-group=complement-example-complement]');

const hostIdentifierIpOctets = document.querySelectorAll('[data-group=host-identifier-ip]');
// prettier-ignore
const hostIdentifierComplementOctets = document.querySelectorAll('[data-group=host-identifier-complement]');
// prettier-ignore
const hostIdentifierResultOctets = document.querySelectorAll('[data-group=host-identifier-result]');

// prettier-ignore
const hostIdentifierDecimalOctets = document.querySelectorAll('[data-group=host-identifier-decimal]');
// prettier-ignore
const hostIdentifierBinaryOctets = document.querySelectorAll('[data-group=host-identifier-binary]');

// INITIALISATION
setIp(ipAddress);
setMask(mask);
setNetworkPrefix(ipAddress, mask);
setHostIdentifier(ipAddress, mask);

// EVENT LISTENERS
maskLengthInput.addEventListener('change', bitmaskLengthChange);
maskLengthSlider.addEventListener('change', bitmaskLengthChange);
ipAddressInput.addEventListener('change', ipAddressChange);

// EVENT HANDLERS
function bitmaskLengthChange({ target }) {
  const clampedValue = Math.max(0, Math.min(32, target.value));
  setMask(clampedValue);
  setNetworkPrefix(ipAddress, clampedValue);
  setHostIdentifier(ipAddress, mask);
}

function ipAddressChange({ target }) {
  const newIp = target.value;
  if (isValidIp(newIp)) {
    setIp(newIp);
    setNetworkPrefix(newIp, mask);
    setHostIdentifier(ipAddress, mask);
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

function invertBits(octet) {
  return octet
    .split('')
    .map(bit => (bit === '0' ? '1' : '0'))
    .join('');
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
    hostIdentifierIpOctets[i].innerHTML = toBinary(octet);
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
    complementExampleMask[i].innerHTML = octet;
    complementExampleComplement[i].innerHTML = invertBits(octet);
    hostIdentifierComplementOctets[i].innerHTML = invertBits(octet);
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

function setHostIdentifier(newIp, newMask) {
  const complement = maskToOctets(newMask)
    .join('')
    .split('')
    .map(bit => (bit === '0' ? 1 : 0));
  const ipBits = ipToOctets(newIp)
    .map(o => toBinary(o))
    .join('')
    .split('')
    .map(Number);
  const result = ipBits
    .map((iBit, i) => iBit & complement[i])
    .join('')
    .match(/.{8}/g);
  result.forEach((octet, i) => {
    hostIdentifierResultOctets[i].innerHTML = octet;
    hostIdentifierBinaryOctets[i].innerHTML = octet;
    hostIdentifierDecimalOctets[i].innerHTML = fromBinary(octet);
  });
}
