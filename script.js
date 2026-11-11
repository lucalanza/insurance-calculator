const coverageConfig = {
  'third-party': 0.018,
  'third-party-fire-theft': 0.026,
  comprehensive: 0.035,
};

const form = {
  age: document.getElementById('age'),
  power: document.getElementById('power'),
  experience: document.getElementById('experience'),
  carPrice: document.getElementById('car-price'),
  coverage: document.getElementById('coverage'),
};

const resultValue = document.getElementById('result-value');
const resultStatus = document.getElementById('result-status');

const validateField = (field) => {
  const input = field;
  const hasValue = input.value.trim() !== '' && !Number.isNaN(Number(input.value));
  input.classList.toggle('invalid', !hasValue);
  return hasValue;
};

const isComplete = () => {
  const requiredFields = [form.age, form.power, form.experience, form.carPrice, form.coverage];
  return requiredFields.every((field) => field.value.trim() !== '');
};

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IE', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(amount);
};

const calculatePremium = () => {
  const age = Number(form.age.value);
  const power = Number(form.power.value);
  const experience = Number(form.experience.value);
  const carPrice = Number(form.carPrice.value);
  const coverage = form.coverage.value;

  if (!Number.isFinite(age) || !Number.isFinite(power) || !Number.isFinite(experience) || !Number.isFinite(carPrice) || !coverage) {
    return null;
  }

  const ageFactor = age < 25 ? 1.7 : age < 35 ? 1.38 : age < 55 ? 1.12 : 1.04;
  const experienceFactor = experience < 2 ? 1.66 : experience < 5 ? 1.34 : experience < 10 ? 1.18 : 1.04;
  const powerFactor = power < 80 ? 0.94 : power < 120 ? 1.06 : power < 180 ? 1.2 : 1.38;
  const priceFactor = carPrice < 20000 ? 0.84 : carPrice < 40000 ? 1 : carPrice < 60000 ? 1.18 : 1.36;
  const coverageFactor = coverageConfig[coverage] ?? 0.02;

  const premium = carPrice * coverageFactor * ageFactor * experienceFactor * powerFactor * priceFactor;
  return Math.round(premium);
};

const updateResult = () => {
  const validFields = [form.age, form.power, form.experience, form.carPrice, form.coverage].every((field) => {
    if (field === form.coverage) {
      const hasValue = field.value.trim() !== '';
      field.classList.toggle('invalid', !hasValue);
      return hasValue;
    }
    return validateField(field);
  });

  if (!validFields) {
    resultValue.textContent = '€0';
    resultStatus.textContent = 'Missing data';
    resultStatus.classList.add('error');
    return;
  }

  const premium = calculatePremium();

  if (premium === null) {
    resultValue.textContent = '€0';
    resultStatus.textContent = 'Missing data';
    resultStatus.classList.add('error');
    return;
  }

  resultValue.textContent = formatCurrency(premium);
  resultStatus.textContent = 'Quote updated immediately';
  resultStatus.classList.remove('error');
};

Object.values(form).forEach((field) => {
  field.addEventListener('input', updateResult);
  field.addEventListener('change', updateResult);
});

updateResult();
