const fecthAPI = async () => {
  const apiURL = 'https://restcountries.com/v3.1/all';
  try {
    const res = await fetch(apiURL);
    const data = await res.json();

    return data;
  } catch (e) {
    console.log(e);
  } finally {
    console.log('END');
  }
};

export default fecthAPI;
