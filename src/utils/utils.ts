export const getGroupedEntities = (data: TSwEntity[]) => {
  const mappedKeys: string[] = data.map(value => value.type);
  const keysList  = Array.from(new Set(mappedKeys));

  return keysList.map((type, id) => {
    const entities = data.filter(value => {
      return value.type === type;
    });

    return {
      id: `id_${id}`,
      type,
      entities,
    } as TSwTypeSection;
  });
}

export const getRadians = (degrees: number) => {
  return (degrees * Math.PI) / 180;
}
