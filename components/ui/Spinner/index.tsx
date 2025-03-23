export const Spinner = () => {
  return (
    <div className="flex items-center justify-center">
      <div
        data-testid="loading-spinner"
        className="h-6 w-6 animate-spin rounded-full border-4 border-t-transparent border-gray-500"
      />
    </div>
  );
};
