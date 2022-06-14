// GLOBALS
const INITIAL_BITMASK_LENGTH = 24;

// ELEMENTS
const maskLengthInput = document.getElementById('mask-length-input');
const maskLengthSlider = document.getElementById('mask-length-slider');

// INITIALISATION
maskLengthInput.value = INITIAL_BITMASK_LENGTH;
maskLengthSlider.value = INITIAL_BITMASK_LENGTH;

// EVENT LISTENERS
maskLengthInput.addEventListener('change', bitmaskLengthChange);
maskLengthSlider.addEventListener('change', bitmaskLengthChange);

// EVENT HANDLERS
function bitmaskLengthChange({ target }) {
  const clampedValue = Math.max(0, Math.min(32, target.value));
  maskLengthInput.value = clampedValue;
  maskLengthSlider.value = clampedValue;
}
