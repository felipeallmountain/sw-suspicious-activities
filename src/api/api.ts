export const getEntitiesData = async () => {
  try {
    const response = await fetch('./data.json')
    if (response.ok) {
      return await response.json();
    }
  } catch(error) {
    console.error(error);
  }
};
