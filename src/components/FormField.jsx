import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import ErrorMessage from '@/components/ErrorMessage';

const FormField = ({
    id,
    label,
    type = 'text',
    value,
    onChange,
    error,
    placeholder = '',
    icon = null,
    required = false,
    autoComplete = 'off',
}) => {
    return (
        <div className="space-y-2">
            <Label htmlFor={id} className="text-white/90 flex items-center gap-2">
                {icon && <span className="text-white/80">{icon}</span>}
                {label}
                {required && <span className="text-red-400">*</span>}
            </Label>

            <Input
                id={id}
                name={id}
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                autoComplete={autoComplete}
                className={`bg-black/20 border border-white/20 text-white placeholder:text-white/50 focus:ring-2 focus:ring-white/40 ${error ? 'border-red-500 focus:ring-red-400' : ''
                    }`}
            />

            <ErrorMessage message={error} />
        </div>
    );
};

export default FormField;