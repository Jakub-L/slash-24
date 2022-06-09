// ELEMENTS
const maskInput = document.getElementById('mask');
const binaryMask = document.getElementById('binary-mask');
const hexMask = document.getElementById('hex-mask');
const decimalMask = document.getElementById('decimal-mask');

const ipInput = document.getElementById('ip');
const binaryIp = document.getElementById('binary-ip');
const hexIp = document.getElementById('hex-ip');
const decimalIp = document.getElementById('decimal-ip');

const binaryResult = document.getElementById('binary-result');
const hexResult = document.getElementById('hex-result');
const decimalResult = document.getElementById('decimal-result');

// EVENT LISTENERS
maskInput.addEventListener('change', ({ target }) => changeMaskHandler(target.value));
ipInput.addEventListener('change', ({ target }) => changeIPHandler(target.value));

// INITIALISE
maskInput.value = 0;
ipInput.value = '0.0.0.0';
changeMaskHandler(0);
changeIPHandler('0.0.0.0');

// HANDLERS
function changeMaskHandler(value) {
  const binaryValue = '1'
    .repeat(value)
    .padEnd(32, '0')
    .match(/.{1,8}/g);
  const hexValue = binaryValue.map(num =>
    parseInt(num, 2).toString(16).padStart(2, '0').toUpperCase()
  );
  const decimalValue = binaryValue.map(num => parseInt(num, 2).toString(10));

  binaryMask.innerHTML = binaryValue.join('.');
  hexMask.innerHTML = hexValue.join('.');
  decimalMask.innerHTML = decimalValue.join('.');
  calculateResult();
}

function changeIPHandler(value) {
  const decimalValue = value.split('.').map(num => parseInt(num, 10));
  const isValidIP = decimalValue.every(num => num >= 0 && num <= 255);

  if (isValidIP) {
    const binaryValue = decimalValue.map(num => num.toString(2).padStart(8, '0'));
    const hexValue = decimalValue.map(num => num.toString(16).padStart(2, '0').toUpperCase());

    binaryIp.innerHTML = binaryValue.join('.');
    hexIp.innerHTML = hexValue.join('.');
    decimalIp.innerHTML = decimalValue.join('.');
    calculateResult();
  }
}

function calculateResult() {
  const processString = string =>
    string
      .split('.')
      .map(num => num.padStart(8, '0'))
      .join('');
  const maskRaw = binaryMask.innerHTML;
  const ipRaw = binaryIp.innerHTML;
  if (maskRaw && ipRaw) {
    const mask = processString(maskRaw);
    const ip = processString(ipRaw);
    const binaryValue = ((parseInt(mask, 2) & parseInt(ip, 2)) >>> 0)
      .toString(2)
      .padStart(32, '0')
      .match(/.{1,8}/g);
    const hexValue = binaryValue.map(num =>
      parseInt(num, 2).toString(16).padStart(2, '0').toUpperCase()
    );
    const decimalValue = binaryValue.map(num => parseInt(num, 2).toString(10));

    binaryResult.innerHTML = binaryValue.join('.');
    hexResult.innerHTML = hexValue.join('.');
    decimalResult.innerHTML = decimalValue.join('.');
  }
}
