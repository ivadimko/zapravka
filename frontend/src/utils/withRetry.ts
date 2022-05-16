export const withRetry = async <T>(
  action: () => Promise<T>,
  step = 1,
): Promise<T> => {
  try {
    return await action();
  } catch (error) {
    const next = step + 1;

    if (next > 3) {
      console.warn(`Failed to fetch after ${step} attempts, throw error`);

      throw error;
    }

    console.warn(`Couldn't fetch, retry ${next}`);

    return withRetry(action, next);
  }
};
