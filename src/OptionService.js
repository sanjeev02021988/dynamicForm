const ServiceCache = {};

// Dummy Service to mock a service to fetch options.
async function OptionService(url, parentId, form) {
  let optionURL = url;
  if (parentId) {
    optionURL = `${url}?value=${form[parentId]}`;
  }
  if (ServiceCache[optionURL]) {
    return ServiceCache[optionURL];
  }
  console.log(`Fetching options from ${optionURL}`);
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const response = [
        {
          value: `Fetched ${form[parentId] || ""}`,
          label: `Fetched ${form[parentId] || ""}`
        }
      ];
      ServiceCache[optionURL] = response;
      resolve(response);
    }, 100);
  });
}

export default OptionService;
