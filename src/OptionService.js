const ServiceCache = {};

async function OptionService(url, parentId, form) {
  const optionURL = `${url}?value=${form[parentId]}`;
  if (ServiceCache[optionURL]) {
    return ServiceCache[optionURL];
  }
  console.log(`Fetching options from ${optionURL}`);
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const response = [
        {
          value: `Fetched ${form[parentId]}`,
          label: `Fetched ${form[parentId]}`
        }
      ];
      ServiceCache[optionURL] = response;
      resolve(response);
    }, 100);
  });
}

export default OptionService;
