export default function useGenericConvert<T = unknown>() {
  // Methods

  function c(model: unknown) {
    return model as T;
  }

  return {
    c,
  };
}
