export default function useGenericConvert<T extends NonNullable<unknown>>() {
  // Methods

  function c(model: unknown) {
    return model as T;
  }

  return {
    c,
  };
}
