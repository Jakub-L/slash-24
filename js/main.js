// GLOBALS
const INITIAL_BITMASK_LENGTH = 24;
const INITIAL_IP_ADDRESS = '172.16.254.1';

// ELEMENTS
const maskLengthInput = document.getElementById('mask-length-input');
const maskLengthSlider = document.getElementById('mask-length-slider');
const ipAddressInput = document.getElementById('ip-address-input');
const ipAddressValidator = document.getElementById('ip-address-validator');
const ipAddressTable = document.getElementById('ip-address-table');

// INITIALISATION
maskLengthInput.value = INITIAL_BITMASK_LENGTH;
maskLengthSlider.value = INITIAL_BITMASK_LENGTH;
ipAddressInput.value = INITIAL_IP_ADDRESS;
let octets;
let binOctets;
let maskBinOctets;
setMaskOctets(INITIAL_BITMASK_LENGTH);
setIpOctets(parseIp(INITIAL_IP_ADDRESS));
generateIpTable();

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
  generateIpTable();
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
}

// UTILS
function generateIpTable() {
  function generateRow(label, values) {
    let row = ipAddressTable.insertRow();
    let labelCell = row.insertCell(0);
    labelCell.innerHTML = label;
    values.forEach((value, i) => {
      const cell = row.insertCell(i + 1);
      cell.innerHTML = value;
    });
  }

  ipAddressTable.innerHTML = '';
  generateRow('IP address (decimal)', octets);
  generateRow('IP address (binary)', binOctets);
  generateRow('Network mask (binary)', maskBinOctets);
}

function parseIp(str) {
  return str.split('.').map(Number);
}

function setIpOctets(newOctets) {
  octets = newOctets;
  binOctets = newOctets.map(o => o.toString(2).padStart(8, 0));
}

function setMaskOctets(maskLength) {
  maskBinOctets = '1'.repeat(maskLength).padEnd(32, 0).match(/.{8}/g);
}
