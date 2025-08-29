export const applyFieldValues = (
  key: string,
  value: any,
  _obj: Record<string, any>
) => {
  const fieldValue = value as {
    methodName: string;
    elements?: any[];
    operand?: number;
  };

  // Handle arrayUnion
  if (fieldValue.methodName === 'arrayUnion') {
    if (!Array.isArray(_obj[key])) _obj[key] = [];
    const elements = fieldValue.elements || [];
    elements.forEach((element) => {
      if (!_obj[key].includes(element)) {
        _obj[key].push(element);
      }
    });
  }
  // Handle arrayRemove
  else if (fieldValue.methodName === 'arrayRemove') {
    if (!Array.isArray(_obj[key])) _obj[key] = [];
    const elements = fieldValue.elements || [];
    _obj[key] = _obj[key].filter(
      (item: any) =>
        !elements.some(
          (element) => JSON.stringify(element) === JSON.stringify(item)
        )
    );
  }
  // Handle increment
  else if (fieldValue.methodName === 'increment') {
    const incrementBy = fieldValue.operand || 0;
    _obj[key] = (typeof _obj[key] === 'number' ? _obj[key] : 0) + incrementBy;
  }
};
