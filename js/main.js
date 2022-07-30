// GLOBALS
const INITIAL_BITMASK_LENGTH = 24;
const INITIAL_IP_ADDRESS = '172.16.254.1';

// ELEMENTS
const maskLengthInput = document.getElementById('mask-length-input');
const maskLengthSlider = document.getElementById('mask-length-slider');
const maskTable = document.getElementById('mask-table');
const ipAddressInput = document.getElementById('ip-address-input');
const ipAddressValidator = document.getElementById('ip-address-validator');
const ipAddressTable = document.getElementById('ip-address-table');
const networkPrefixTable = document.getElementById('network-prefix-table');
const hostPartTable = document.getElementById('host-part-table');

// INITIALISATION
maskLengthInput.value = INITIAL_BITMASK_LENGTH;
maskLengthSlider.value = INITIAL_BITMASK_LENGTH;
ipAddressInput.value = INITIAL_IP_ADDRESS;
let ipOctets;
let ipBinOctets;
let maskBinOctets;
let maskComplementBinOctets;
setMaskOctets(INITIAL_BITMASK_LENGTH);
setIpOctets(parseIp(INITIAL_IP_ADDRESS));
generateMaskTable();
generateIpTable();
generateNetworkPrefixTable();
generateHostPartTable();

// EVENT LISTENERS
maskLengthInput.addEventListener('change', bitmaskLengthChange);
maskLengthSlider.addEventListener('change', bitmaskLengthChange);
ipAddressInput.addEventListener('change', ipAddressChange);

// EVENT HANDLERS
function bitmaskLengthChange({ target }) {
  const clampedValue = Math.max(0, Math.min(32, target.value));
  maskLengthInput.value = clampedValue;
  maskLengthSlider.value = clampedValue;
  setMaskOctets(clampedValue);
  generateMaskTable();
  generateNetworkPrefixTable();
  generateHostPartTable();
}

function ipAddressChange({ target }) {
  const newOctets = parseIp(target.value);
  const isIpValid =
    newOctets.length === 4 && newOctets.every(octet => octet >= 0 && octet <= 255);
  if (isIpValid) {
    setIpOctets(newOctets);
    ipAddressValidator.classList.add('hidden');
  } else {
    ipAddressValidator.classList.remove('hidden');
  }
  generateIpTable();
  generateNetworkPrefixTable();
  generateHostPartTable();
}

// TABLE UTIL FUNCTIONS
function generateRow(table, label, values) {
  const row = table.insertRow();
  [label, ...values].forEach((value, i) => {
    const cell = row.insertCell(i);
    cell.innerHTML = value;
  });
}

function generateIpTable() {
  ipAddressTable.innerHTML = '';
  generateRow(ipAddressTable, 'IP address (decimal)', ipOctets);
  generateRow(ipAddressTable, 'IP address (binary)', ipBinOctets);
}

function generateMaskTable() {
  maskTable.innerHTML = '';
  generateRow(maskTable, 'Network mask (binary)', maskBinOctets);
}

function generateNetworkPrefixTable() {
  networkPrefixTable.innerHTML = '';
  const ipArray = intersperse(ipBinOctets, '.').join('').split('');
  const maskArray = intersperse(maskBinOctets, '.').join('').split('');
  const prefixBinaryArray = ipArray.map((bit, i) =>
    bit === '.' ? '.' : Number(bit) & Number(maskArray[i])
  );
  generateRow(networkPrefixTable, 'IP Address', ipArray);
  generateRow(networkPrefixTable, 'Mask', maskArray);
  generateRow(networkPrefixTable, 'Network prefix', prefixBinaryArray);
}

function generateHostPartTable() {
  hostPartTable.innerHTML = '';
  const ipArray = intersperse(ipBinOctets, '.').join('').split('');
  const maskComplement = intersperse(maskComplementBinOctets, '.').join('').split('');
  const hostPartBinArray = ipArray.map((bit, i) =>
    bit === '.' ? '.' : Number(bit) & Number(maskComplement[i])
  );
  generateRow(hostPartTable, 'IP Address', ipArray);
  generateRow(hostPartTable, 'Mask complement', maskComplement);
  generateRow(hostPartTable, 'Host part', hostPartBinArray);
}

// GENERAL UTILS
function parseIp(str) {
  return str.split('.').map(Number);
}

function intersperse(arr, delimiter) {
  return arr
    .map(val => [delimiter, val])
    .flat()
    .slice(1);
}

// SETTERS
function setIpOctets(octets) {
  ipOctets = octets;
  ipBinOctets = octets.map(o => o.toString(2).padStart(8, 0));
}

function setMaskOctets(maskLength) {
  maskBinOctets = '1'.repeat(maskLength).padEnd(32, 0).match(/.{8}/g);
  maskComplementBinOctets = '0'.repeat(maskLength).padEnd(32, 1).match(/.{8}/g);
}

function findHost() {
  return;
}
