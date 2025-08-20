import { AlertCircle } from 'lucide-react';

const ErrorMessage = ({ message }) => {
  if (!message) return null;

  return (
    <p className="text-red-400 text-sm flex items-center gap-1 mt-1">
      <AlertCircle className="w-4 h-4" />
      {message}
    </p>
  );
};

export default ErrorMessage;