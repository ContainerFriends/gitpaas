import { Loader2 } from 'lucide-react';
import * as React from 'react';
import ReactSelect, { type Props as ReactSelectProps, type GroupBase, type StylesConfig } from 'react-select';

interface SelectOption {
    value: string;
    label: string;
}

interface Select2Props extends Omit<ReactSelectProps<SelectOption, false, GroupBase<SelectOption>>, 'isLoading' | 'isDisabled'> {
    loading?: boolean;
    disabled?: boolean;
    icon?: React.ReactNode;
}

const baseStyles: StylesConfig<SelectOption, false> = {
    control: (base, state) => ({
        ...base,
        minHeight: '2.5rem',
        borderRadius: 'calc(var(--radius) - 2px)',
        borderColor: state.isFocused ? 'hsl(var(--ring))' : 'hsl(var(--input))',
        backgroundColor: 'hsl(var(--background))',
        boxShadow: state.isFocused ? '0 0 0 2px hsl(var(--background)), 0 0 0 4px hsl(var(--ring))' : 'none',
        fontSize: '0.875rem',
        '&:hover': {
            borderColor: state.isFocused ? 'hsl(var(--ring))' : 'hsl(var(--input))',
        },
        cursor: state.isDisabled ? 'not-allowed' : 'default',
        opacity: state.isDisabled ? 0.5 : 1,
    }),
    menu: (base) => ({
        ...base,
        borderRadius: 'calc(var(--radius) - 2px)',
        border: '1px solid hsl(var(--input))',
        backgroundColor: 'hsl(var(--background))',
        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
        zIndex: 50,
    }),
    option: (base, state) => ({
        ...base,
        fontSize: '0.875rem',
        backgroundColor: state.isFocused ? 'hsl(var(--accent))' : 'transparent',
        color: 'hsl(var(--foreground))',
        cursor: 'pointer',
        '&:active': {
            backgroundColor: 'hsl(var(--accent))',
        },
    }),
    singleValue: (base) => ({
        ...base,
        color: 'hsl(var(--foreground))',
    }),
    placeholder: (base) => ({
        ...base,
        color: 'hsl(var(--muted-foreground))',
    }),
    input: (base) => ({
        ...base,
        color: 'hsl(var(--foreground))',
    }),
    indicatorSeparator: () => ({
        display: 'none',
    }),
    dropdownIndicator: (base) => ({
        ...base,
        color: 'hsl(var(--muted-foreground))',
        padding: '0 8px',
    }),
};

function LoadingIcon(): React.ReactNode {
    return <Loader2 className="h-4 w-4 text-muted-foreground animate-spin" />;
}

// eslint-disable-next-line object-curly-newline
function Select2({ loading, disabled, styles, components, ...props }: Select2Props): React.ReactNode {
    return (
        <ReactSelect<SelectOption>
            isLoading={loading}
            isDisabled={disabled ?? loading}
            styles={{ ...baseStyles, ...styles }}
            components={{
                LoadingIndicator: LoadingIcon,
                ...components,
            }}
            {...props}
        />
    );
}
Select2.displayName = 'Select2';

export { Select2, type SelectOption };
